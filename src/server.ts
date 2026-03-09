/**
 * Atelier 21 — Backend
 * Express + SQLite + JWT-like auth + Kiwify Webhook
 *
 * Rodar:  npx tsx src/server.ts
 * Porta:  3001 (configurável via PORT no .env)
 */

import express from 'express';
import Database from 'better-sqlite3';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendWelcomeEmail } from './services/email';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

// ─── CORS (dev) ───────────────────────────────────────────────────────────────
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// ─── BANCO DE DADOS ───────────────────────────────────────────────────────────
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'atelier21.db');
const db = new Database(DB_PATH);

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        email           TEXT    UNIQUE NOT NULL,
        password_hash   TEXT    NOT NULL,
        name            TEXT    NOT NULL DEFAULT 'Aluna Atelier 21',
        kiwify_order_id TEXT,
        created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

function ensureColumn(tableName: string, columnName: string, definition: string) {
    const columns = db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;

    if (!columns.some((column) => column.name === columnName)) {
        db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
    }
}

ensureColumn('users', 'access_status', "TEXT NOT NULL DEFAULT 'active'");

// ─── JWT SIMPLES (sem dependência externa) ────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.warn('⚠️  JWT_SECRET não definido no .env — usando valor padrão INSEGURO. Não use em produção!');
}
const SECRET = JWT_SECRET || 'atelier21-dev-secret-mude-em-producao';

function createToken(payload: Record<string, unknown>): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64url');
    const sig = crypto.createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url');
    return `${header}.${body}.${sig}`;
}

function verifyToken(token: string): Record<string, unknown> {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Token malformado');
    const [header, body, sig] = parts;
    const expected = crypto.createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url');
    if (sig !== expected) throw new Error('Assinatura inválida');
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (payload.exp && Date.now() > payload.exp) throw new Error('Token expirado');
    return payload;
}

// ─── SENHA ────────────────────────────────────────────────────────────────────
function hashPassword(password: string): string {
    return crypto.createHmac('sha256', SECRET).update(password).digest('hex');
}

function generatePassword(): string {
    // 8 caracteres: 4 letras + 4 números — fácil de digitar no celular
    const letters = 'abcdefghjkmnpqrstuvwxyz';
    const numbers = '23456789';
    let pass = '';
    for (let i = 0; i < 4; i++) pass += letters[Math.floor(Math.random() * letters.length)];
    for (let i = 0; i < 4; i++) pass += numbers[Math.floor(Math.random() * numbers.length)];
    return pass.split('').sort(() => Math.random() - 0.5).join('');
}

// ─── TIPAGEM ──────────────────────────────────────────────────────────────────
interface UserRow {
    id: number;
    email: string;
    password_hash: string;
    name: string;
    kiwify_order_id: string | null;
    access_status: 'active' | 'inactive';
    created_at: string;
}

// ─── ROTAS DE AUTENTICAÇÃO ────────────────────────────────────────────────────

/** POST /api/auth/login */
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim()) as UserRow | undefined;

    if (!user || user.password_hash !== hashPassword(password)) {
        return res.status(401).json({ error: 'Email ou senha incorretos.' });
    }

    if (user.access_status !== 'active') {
        return res.status(403).json({ error: 'Acesso inativo.' });
    }

    const token = createToken({ id: user.id, email: user.email, name: user.name });
    return res.json({ token, user: { email: user.email, name: user.name } });
});

/** POST /api/auth/verify — valida token e retorna dados do usuário */
app.post('/api/auth/verify', (req, res) => {
    const { token } = req.body as { token?: string };

    if (!token) {
        return res.status(400).json({ valid: false, error: 'Token não fornecido.' });
    }

    try {
        const payload = verifyToken(token) as { email: string; name: string };
        const user = db
            .prepare('SELECT email, name, access_status FROM users WHERE email = ?')
            .get(payload.email.toLowerCase().trim()) as Pick<UserRow, 'email' | 'name' | 'access_status'> | undefined;

        if (!user || user.access_status !== 'active') {
            return res.status(401).json({ valid: false, error: 'Acesso não encontrado ou inativo.' });
        }

        return res.json({ valid: true, user: { email: user.email, name: user.name } });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Token inválido';
        return res.status(401).json({ valid: false, error: message });
    }
});

// ─── WEBHOOK KIWIFY ───────────────────────────────────────────────────────────
/**
 * POST /api/webhook/kiwify
 *
 * Quando uma compra é aprovada na Kiwify, ela chama este endpoint.
 * Configure a URL do webhook no painel da Kiwify:
 *   → Produto → Configurações → Webhooks → Adicionar URL
 *
 * Payload esperado (simplificado):
 * {
 *   order_status: "paid",
 *   order_id: "abc123",
 *   Customer: { email: "...", full_name: "..." }
 * }
 */
app.post('/api/webhook/kiwify', async (req, res) => {
    const payload = req.body;

    // Validação básica do token de segurança (configure KIWIFY_WEBHOOK_TOKEN no .env
    // e no painel da Kiwify em "Token de autenticação do webhook")
    const webhookToken = process.env.KIWIFY_WEBHOOK_TOKEN;
    if (webhookToken) {
        const queryToken = typeof req.query.token === 'string' ? req.query.token : undefined;
        const headerToken = typeof req.headers['x-kiwify-token'] === 'string' ? req.headers['x-kiwify-token'] : undefined;
        const received = queryToken || headerToken;
        if (received !== webhookToken) {
            console.warn('⚠️  Webhook recebido com token inválido:', received);
            return res.status(403).json({ error: 'Token de webhook inválido.' });
        }
    }

    // Só processar compras aprovadas
    if (payload.order_status !== 'paid') {
        return res.json({ ok: true, message: `Evento '${payload.order_status}' ignorado.` });
    }

    const email = (payload.Customer?.email as string | undefined)?.toLowerCase().trim();
    const name = (payload.Customer?.full_name as string | undefined) || 'Aluna Atelier 21';
    const orderId = payload.order_id as string | undefined;

    if (!email) {
        console.error('Webhook sem email:', payload);
        return res.status(400).json({ error: 'Email não encontrado no payload.' });
    }

    // Se usuário já existe (ex: recompra), apenas ignora
    const existing = db
        .prepare('SELECT id, access_status FROM users WHERE email = ?')
        .get(email) as Pick<UserRow, 'id' | 'access_status'> | undefined;

    if (existing) {
        db.prepare('UPDATE users SET name = ?, kiwify_order_id = ?, access_status = ? WHERE email = ?')
            .run(name, orderId || null, 'active', email);

        console.log(`Usuário reativado/atualizado: ${email}`);
        return res.json({ ok: true, message: 'Usuário atualizado com acesso ativo.' });
    }

    // Cria usuário com senha gerada automaticamente
    const password = generatePassword();
    const passwordHash = hashPassword(password);

    db.prepare('INSERT INTO users (email, name, password_hash, kiwify_order_id, access_status) VALUES (?, ?, ?, ?, ?)')
        .run(email, name, passwordHash, orderId || null, 'active');

    console.log(`✅ Nova aluna: ${email} | Senha gerada: ${password}`);

    let emailStatus: { sent: boolean; error?: string } = { sent: false, error: 'Envio não executado.' };
    try {
        emailStatus = await sendWelcomeEmail({ to: email, name, password });
        if (!emailStatus.sent) {
            console.warn(`⚠️  Usuária criada, mas o email não foi enviado: ${email} | Motivo: ${emailStatus.error}`);
        }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido ao enviar email.';
        emailStatus = { sent: false, error: message };
        console.error(`⚠️  Usuária criada, mas o email falhou: ${email} | Motivo: ${message}`);
    }

    return res.json({
        ok: true,
        email_sent: emailStatus.sent,
        message: 'Usuário criado com sucesso.',
    });
});

// ─── ADMIN (desenvolvimento) ──────────────────────────────────────────────────
/** POST /api/admin/create-user — criar usuário manualmente (protegido por ADMIN_SECRET) */
app.post('/api/admin/create-user', (req, res) => {
    const adminSecret = process.env.ADMIN_SECRET;
    const { secret, email, name, password } = req.body as {
        secret?: string;
        email?: string;
        name?: string;
        password?: string;
    };

    if (!adminSecret || secret !== adminSecret) {
        return res.status(403).json({ error: 'Acesso negado.' });
    }

    if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório.' });
    }

    const finalPassword = password || generatePassword();
    const finalName = name || 'Aluna Atelier 21';

    try {
        db.prepare('INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)')
            .run(email.toLowerCase().trim(), finalName, hashPassword(finalPassword));

        console.log(`✅ Usuário criado manualmente: ${email} | Senha: ${finalPassword}`);
        return res.json({ ok: true, email, password: finalPassword, name: finalName });
    } catch (err: unknown) {
        if ((err as NodeJS.ErrnoException).message?.includes('UNIQUE')) {
            return res.status(409).json({ error: 'Email já cadastrado.' });
        }
        throw err;
    }
});

/** GET /api/admin/users — listar usuários (protegido) */
app.get('/api/admin/users', (req, res) => {
    const adminSecret = process.env.ADMIN_SECRET;
    const secret = typeof req.headers['x-admin-secret'] === 'string' ? req.headers['x-admin-secret'] : undefined;

    if (!adminSecret || secret !== adminSecret) {
        return res.status(403).json({ error: 'Acesso negado.' });
    }

    const users = db.prepare('SELECT id, email, name, created_at, kiwify_order_id FROM users ORDER BY created_at DESC').all();
    return res.json({ users, total: (users as unknown[]).length });
});

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    const userCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
    res.json({ status: 'ok', users: userCount, timestamp: new Date().toISOString() });
});

// ─── START ────────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
    console.log(`\n🚀 Atelier 21 Backend rodando em http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   DB: ${DB_PATH}\n`);
});
