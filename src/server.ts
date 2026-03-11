/**
 * Atelier 21 — Backend
 * Express + SQLite + sessão em cookie + webhook Kiwify
 *
 * Rodar:  npx tsx src/server.ts
 * Porta:  3001 (configurável via PORT no .env)
 */

import express, { type RequestHandler } from 'express';
import Database from 'better-sqlite3';
import crypto from 'crypto';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendRecoveryEmail, sendWelcomeEmail } from './services/email';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const PASSWORD_SETUP_TTL_MS = 24 * 60 * 60 * 1000;
const MIN_PASSWORD_LENGTH = 10;
const AUTH_COOKIE_NAME = 'atelier21_session';
const DEFAULT_DEV_SECRET = 'atelier21-dev-secret-mude-em-producao';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const APP_LOGIN_URL = (process.env.APP_LOGIN_URL || `${FRONTEND_URL.replace(/\/+$/, '')}/login`).replace(/\/+$/, '');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && isProduction) {
  throw new Error('JWT_SECRET é obrigatório em produção.');
}
if (!JWT_SECRET) {
  console.warn('JWT_SECRET não definido no .env — usando valor padrão inseguro. Não use em produção.');
}

const SESSION_SECRET = JWT_SECRET || DEFAULT_DEV_SECRET;
const LEGACY_PASSWORD_SECRET = process.env.LEGACY_PASSWORD_SECRET || SESSION_SECRET;
const KIWIFY_WEBHOOK_TOKEN = process.env.KIWIFY_WEBHOOK_TOKEN;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '64kb' }));

const allowedOrigins = new Set(
  [FRONTEND_URL, APP_LOGIN_URL.replace(/\/login$/, '')]
    .concat(isProduction ? [] : ['http://localhost:3000', 'http://127.0.0.1:3000'])
    .filter(Boolean),
);

app.use((req, res, next) => {
  const origin = typeof req.headers.origin === 'string' ? req.headers.origin : undefined;

  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https://api.resend.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  );

  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  }

  if (req.method === 'OPTIONS') {
    if (origin && !allowedOrigins.has(origin)) {
      return res.status(403).json({ error: 'Origem não permitida.' });
    }

    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Secret, X-Kiwify-Token');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    return res.sendStatus(204);
  }

  next();
});

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function sanitizeName(name?: string): string {
  const fallback = 'Aluna Atelier 21';
  if (!name) return fallback;
  const normalized = name.trim().replace(/\s+/g, ' ').slice(0, 120);
  return normalized || fallback;
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function resolveDbPath(): string {
  const configured = process.env.DB_PATH?.trim();

  if (isProduction) {
    if (!configured) throw new Error('DB_PATH é obrigatório em produção.');
    if (!path.isAbsolute(configured)) throw new Error('DB_PATH deve ser absoluto em produção.');
  }

  const fallback = path.join(__dirname, '..', 'atelier21.db');
  return path.resolve(configured || fallback);
}

const DB_PATH = resolveDbPath();
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true, mode: 0o700 });

const db = new Database(DB_PATH, { timeout: 5000 });
db.pragma('journal_mode = WAL');
db.pragma('synchronous = FULL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 5000');
db.pragma('wal_autocheckpoint = 1000');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id                        INTEGER PRIMARY KEY AUTOINCREMENT,
    email                     TEXT    UNIQUE NOT NULL,
    password_hash             TEXT    NOT NULL,
    name                      TEXT    NOT NULL DEFAULT 'Aluna Atelier 21',
    kiwify_order_id           TEXT,
    access_status             TEXT    NOT NULL DEFAULT 'active',
    password_setup_token_hash TEXT,
    password_setup_expires_at DATETIME,
    last_login_at             DATETIME,
    created_at                DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

function ensureColumn(tableName: string, columnName: string, definition: string) {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;

  if (!columns.some((column) => column.name === columnName)) {
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

ensureColumn('users', 'access_status', "TEXT NOT NULL DEFAULT 'active'");
ensureColumn('users', 'password_setup_token_hash', 'TEXT');
ensureColumn('users', 'password_setup_expires_at', 'DATETIME');
ensureColumn('users', 'last_login_at', 'DATETIME');

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_access_status ON users(access_status);
`);

interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  kiwify_order_id: string | null;
  access_status: 'active' | 'inactive';
  password_setup_token_hash: string | null;
  password_setup_expires_at: string | null;
  last_login_at: string | null;
  created_at: string;
}

interface SessionPayload {
  email: string;
  exp: number;
  iat: number;
  id: number;
  name: string;
}

interface PasswordVerificationResult {
  isValid: boolean;
  needsUpgrade: boolean;
}

function createSignedToken(payload: Omit<SessionPayload, 'exp' | 'iat'>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: Date.now(),
      exp: Date.now() + SESSION_TTL_MS,
    }),
  ).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifySignedToken(token: string): SessionPayload {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Token malformado');

  const [header, body, signature] = parts;
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(`${header}.${body}`).digest('base64url');

  if (!safeEqual(signature, expected)) {
    throw new Error('Assinatura inválida');
  }

  const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as SessionPayload;
  if (payload.exp && Date.now() > payload.exp) {
    throw new Error('Token expirado');
  }

  return payload;
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const derivedKey = crypto.scryptSync(password, salt, 64, {
    N: 16384,
    p: 1,
    r: 8,
    maxmem: 64 * 1024 * 1024,
  });

  return `scrypt$16384$8$1$${salt.toString('base64url')}$${derivedKey.toString('base64url')}`;
}

function hashLegacyPassword(password: string): string {
  return crypto.createHmac('sha256', LEGACY_PASSWORD_SECRET).update(password).digest('hex');
}

function verifyPassword(password: string, storedHash: string): PasswordVerificationResult {
  if (!storedHash || storedHash.startsWith('pending$')) {
    return { isValid: false, needsUpgrade: false };
  }

  if (storedHash.startsWith('scrypt$')) {
    const [, cost, blockSize, parallelization, saltValue, hashValue] = storedHash.split('$');
    const salt = Buffer.from(saltValue, 'base64url');
    const originalHash = Buffer.from(hashValue, 'base64url');
    const derivedKey = crypto.scryptSync(password, salt, originalHash.length, {
      N: Number(cost),
      p: Number(parallelization),
      r: Number(blockSize),
      maxmem: 64 * 1024 * 1024,
    });

    return {
      isValid: crypto.timingSafeEqual(derivedKey, originalHash),
      needsUpgrade: false,
    };
  }

  return {
    isValid: safeEqual(hashLegacyPassword(password), storedHash),
    needsUpgrade: true,
  };
}

function generatePendingPasswordHash(): string {
  return `pending$${crypto.randomBytes(24).toString('hex')}`;
}

function generateOneTimeToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

function buildPasswordSetupUrl(email: string, token: string): string {
  const url = new URL(APP_LOGIN_URL);
  url.searchParams.set('email', email);
  url.searchParams.set('setup', token);
  return url.toString();
}

function parseCookies(header?: string): Record<string, string> {
  if (!header) return {};

  return header.split(';').reduce<Record<string, string>>((acc, part) => {
    const [name, ...valueParts] = part.trim().split('=');
    if (!name) return acc;
    acc[name] = decodeURIComponent(valueParts.join('='));
    return acc;
  }, {});
}

function serializeCookie(name: string, value: string, maxAgeMs: number): string {
  const expiresAt = maxAgeMs > 0 ? new Date(Date.now() + maxAgeMs) : new Date(0);
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    `Max-Age=${Math.max(0, Math.floor(maxAgeMs / 1000))}`,
    `Expires=${expiresAt.toUTCString()}`,
    'HttpOnly',
    'SameSite=Lax',
  ];

  if (isProduction) {
    parts.push('Secure');
  }

  return parts.join('; ');
}

function setSessionCookie(res: express.Response, token: string) {
  res.setHeader('Set-Cookie', serializeCookie(AUTH_COOKIE_NAME, token, SESSION_TTL_MS));
}

function clearSessionCookie(res: express.Response) {
  res.setHeader('Set-Cookie', serializeCookie(AUTH_COOKIE_NAME, '', 0));
}

function getSessionTokenFromRequest(req: express.Request, bodyToken?: string): string | undefined {
  const cookies = parseCookies(req.headers.cookie);
  return cookies[AUTH_COOKIE_NAME] || bodyToken;
}

function getRequestIp(req: express.Request): string {
  const candidate = req.ip || req.socket.remoteAddress || 'unknown';
  return candidate.startsWith('::ffff:') ? candidate.slice(7) : candidate;
}

function getAdminAllowedIps(): Set<string> {
  const configured = (process.env.ADMIN_ALLOWED_IPS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => (value.startsWith('::ffff:') ? value.slice(7) : value));

  if (configured.length > 0) return new Set(configured);
  return isProduction ? new Set(['127.0.0.1', '::1']) : new Set();
}

function isAdminIpAllowed(req: express.Request): boolean {
  const allowed = getAdminAllowedIps();
  if (allowed.size === 0) return true;
  return allowed.has(getRequestIp(req));
}

function createRateLimiter(name: string, maxRequests: number, windowMs: number): RequestHandler {
  const bucket = new Map<string, { count: number; resetAt: number }>();

  return (req, res, next) => {
    const now = Date.now();
    const key = `${name}:${getRequestIp(req)}`;
    const current = bucket.get(key);

    if (!current || current.resetAt <= now) {
      bucket.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    current.count += 1;

    if (current.count > maxRequests) {
      res.setHeader('Retry-After', String(Math.ceil((current.resetAt - now) / 1000)));
      return res.status(429).json({ error: 'Muitas tentativas. Aguarde e tente novamente.' });
    }

    if (bucket.size > 1000) {
      for (const [entryKey, entryValue] of bucket.entries()) {
        if (entryValue.resetAt <= now) {
          bucket.delete(entryKey);
        }
      }
    }

    next();
  };
}

const loginLimiter = createRateLimiter('login', 10, 15 * 60 * 1000);
const verifyLimiter = createRateLimiter('verify', 60, 15 * 60 * 1000);
const setupLimiter = createRateLimiter('setup', 8, 60 * 60 * 1000);
const requestAccessLimiter = createRateLimiter('request-access', 6, 15 * 60 * 1000);
const webhookLimiter = createRateLimiter('webhook', 120, 15 * 60 * 1000);
const adminLimiter = createRateLimiter('admin', 30, 15 * 60 * 1000);

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!ADMIN_SECRET) {
    return res.status(503).json({ error: 'Rotas administrativas desabilitadas.' });
  }

  if (!isAdminIpAllowed(req)) {
    return res.status(403).json({ error: 'Origem administrativa não permitida.' });
  }

  const bodySecret = typeof req.body?.secret === 'string' ? req.body.secret : undefined;
  const headerSecret = typeof req.headers['x-admin-secret'] === 'string' ? req.headers['x-admin-secret'] : undefined;
  const receivedSecret = bodySecret || headerSecret;

  if (!receivedSecret || !safeEqual(receivedSecret, ADMIN_SECRET)) {
    return res.status(403).json({ error: 'Acesso negado.' });
  }

  next();
}

function ensureActiveUser(user: UserRow | undefined, res: express.Response): user is UserRow {
  if (!user) {
    res.status(401).json({ error: 'Email ou senha incorretos.' });
    return false;
  }

  if (user.access_status !== 'active') {
    res.status(403).json({ error: 'Acesso inativo.' });
    return false;
  }

  return true;
}

function issuePasswordSetupToken(userId: number, email: string): { setupToken: string; setupUrl: string } {
  const setupToken = generateOneTimeToken();
  const hashedToken = hashToken(setupToken);
  const expiresAt = new Date(Date.now() + PASSWORD_SETUP_TTL_MS).toISOString();

  db.prepare(
    'UPDATE users SET password_setup_token_hash = ?, password_setup_expires_at = ? WHERE id = ?',
  ).run(hashedToken, expiresAt, userId);

  return {
    setupToken,
    setupUrl: buildPasswordSetupUrl(email, setupToken),
  };
}

function updateLastLogin(userId: number) {
  db.prepare('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?').run(userId);
}

function createSessionForUser(res: express.Response, user: Pick<UserRow, 'id' | 'email' | 'name'>) {
  const token = createSignedToken({ id: user.id, email: user.email, name: user.name });
  setSessionCookie(res, token);
}

app.post('/api/auth/login', loginLimiter, (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  const normalizedEmail = normalizeEmail(email);
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail) as UserRow | undefined;

  if (!ensureActiveUser(user, res)) {
    return;
  }

  const passwordStatus = verifyPassword(password, user.password_hash);
  if (!passwordStatus.isValid) {
    return res.status(401).json({ error: 'Email ou senha incorretos.' });
  }

  if (passwordStatus.needsUpgrade) {
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(password), user.id);
  }

  updateLastLogin(user.id);
  createSessionForUser(res, user);
  return res.json({ user: { email: user.email, name: user.name } });
});

app.post('/api/auth/verify', verifyLimiter, (req, res) => {
  const token = getSessionTokenFromRequest(req, typeof req.body?.token === 'string' ? req.body.token : undefined);

  if (!token) {
    clearSessionCookie(res);
    return res.status(401).json({ valid: false, error: 'Sessão não encontrada.' });
  }

  try {
    const payload = verifySignedToken(token);
    const user = db
      .prepare('SELECT id, email, name, access_status FROM users WHERE email = ?')
      .get(normalizeEmail(payload.email)) as Pick<UserRow, 'id' | 'email' | 'name' | 'access_status'> | undefined;

    if (!user || user.access_status !== 'active') {
      clearSessionCookie(res);
      return res.status(401).json({ valid: false, error: 'Acesso não encontrado ou inativo.' });
    }

    return res.json({ valid: true, user: { email: user.email, name: user.name } });
  } catch (error: unknown) {
    clearSessionCookie(res);
    const message = error instanceof Error ? error.message : 'Token inválido';
    return res.status(401).json({ valid: false, error: message });
  }
});

app.post('/api/auth/logout', (_req, res) => {
  clearSessionCookie(res);
  return res.json({ ok: true });
});

app.post('/api/auth/setup-password', setupLimiter, (req, res) => {
  const { email, token, password } = req.body as {
    email?: string;
    password?: string;
    token?: string;
  };

  if (!email || !token || !password) {
    return res.status(400).json({ error: 'Email, token e nova senha são obrigatórios.' });
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({ error: `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.` });
  }

  const normalizedEmail = normalizeEmail(email);
  const user = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(normalizedEmail) as UserRow | undefined;

  if (!user || !user.password_setup_token_hash || !user.password_setup_expires_at) {
    return res.status(400).json({ error: 'Link de ativação inválido ou expirado.' });
  }

  const expiresAt = Date.parse(user.password_setup_expires_at);
  if (Number.isNaN(expiresAt) || Date.now() > expiresAt) {
    return res.status(400).json({ error: 'Link de ativação expirado.' });
  }

  if (!safeEqual(hashToken(token), user.password_setup_token_hash)) {
    return res.status(400).json({ error: 'Link de ativação inválido.' });
  }

  const passwordHash = hashPassword(password);
  db.prepare(
    `UPDATE users
      SET password_hash = ?,
          password_setup_token_hash = NULL,
          password_setup_expires_at = NULL,
          last_login_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
  ).run(passwordHash, user.id);

  createSessionForUser(res, user);
  return res.json({ ok: true, user: { email: user.email, name: user.name } });
});

app.post('/api/auth/request-access', requestAccessLimiter, async (req, res) => {
  const { email } = req.body as { email?: string };

  if (!email) {
    return res.status(400).json({ error: 'Email e obrigatorio.' });
  }

  const normalizedEmail = normalizeEmail(email);
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail) as UserRow | undefined;

  if (!user || user.access_status !== 'active') {
    return res.json({
      ok: true,
      message: 'Se encontramos uma compra ativa neste email, enviamos um novo link de acesso.',
    });
  }

  const { setupUrl } = issuePasswordSetupToken(user.id, user.email);

  try {
    const emailStatus = await sendRecoveryEmail({ to: user.email, name: user.name, setupUrl });

    if (!emailStatus.sent) {
      console.warn(`Nao foi possivel reenviar acesso para ${user.email}: ${emailStatus.error}`);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido ao reenviar acesso.';
    console.error(`Erro ao reenviar acesso para ${user.email}: ${message}`);
  }

  return res.json({
    ok: true,
    message: 'Se encontramos uma compra ativa neste email, enviamos um novo link de acesso.',
  });
});

app.post('/api/webhook/kiwify', webhookLimiter, async (req, res) => {
  const payload = req.body as {
    Customer?: { email?: string; full_name?: string };
    order_id?: string;
    order_status?: string;
  };

  if (KIWIFY_WEBHOOK_TOKEN) {
    const queryToken = typeof req.query.token === 'string' ? req.query.token : undefined;
    const headerToken = typeof req.headers['x-kiwify-token'] === 'string' ? req.headers['x-kiwify-token'] : undefined;
    const receivedToken = headerToken || queryToken;

    if (!receivedToken || !safeEqual(receivedToken, KIWIFY_WEBHOOK_TOKEN)) {
      console.warn('Webhook rejeitado por token inválido.');
      return res.status(403).json({ error: 'Token de webhook inválido.' });
    }
  }

  if (payload.order_status !== 'paid') {
    return res.json({ ok: true, message: `Evento '${payload.order_status}' ignorado.` });
  }

  const email = payload.Customer?.email ? normalizeEmail(payload.Customer.email) : '';
  const name = sanitizeName(payload.Customer?.full_name);
  const orderId = payload.order_id?.trim() || null;

  if (!email) {
    console.error('Webhook sem email.');
    return res.status(400).json({ error: 'Email não encontrado no payload.' });
  }

  const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined;

  if (existingUser) {
    db.prepare(
      'UPDATE users SET name = ?, kiwify_order_id = ?, access_status = ? WHERE id = ?',
    ).run(name, orderId, 'active', existingUser.id);

    console.log(`Usuária reativada/atualizada: ${email}`);
    return res.json({ ok: true, message: 'Usuária atualizada com acesso ativo.' });
  }

  const insert = db.prepare(
    `INSERT INTO users (
      email,
      name,
      password_hash,
      kiwify_order_id,
      access_status
    ) VALUES (?, ?, ?, ?, ?)`,
  ).run(email, name, generatePendingPasswordHash(), orderId, 'active');

  const userId = Number(insert.lastInsertRowid);
  const { setupUrl } = issuePasswordSetupToken(userId, email);

  console.log(`Nova aluna criada: ${email}`);

  let emailStatus: { sent: boolean; error?: string } = { sent: false, error: 'Envio não executado.' };
  try {
    emailStatus = await sendWelcomeEmail({ to: email, name, setupUrl });
    if (!emailStatus.sent) {
      console.warn(`Usuária criada, mas o email não foi enviado: ${email} | Motivo: ${emailStatus.error}`);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido ao enviar email.';
    emailStatus = { sent: false, error: message };
    console.error(`Usuária criada, mas o email falhou: ${email} | Motivo: ${message}`);
  }

  return res.json({
    ok: true,
    email_sent: emailStatus.sent,
    message: 'Usuária criada com sucesso.',
  });
});

app.post('/api/admin/create-user', adminLimiter, requireAdmin, async (req, res) => {
  const { email, name, password } = req.body as {
    email?: string;
    name?: string;
    password?: string;
  };

  if (!email) {
    return res.status(400).json({ error: 'Email é obrigatório.' });
  }

  const normalizedEmail = normalizeEmail(email);
  const finalName = sanitizeName(name);
  const manualPassword = typeof password === 'string' && password.length > 0 ? password : undefined;

  try {
    const insert = db.prepare(
      'INSERT INTO users (email, name, password_hash, access_status) VALUES (?, ?, ?, ?)',
    ).run(normalizedEmail, finalName, manualPassword ? hashPassword(manualPassword) : generatePendingPasswordHash(), 'active');

    const userId = Number(insert.lastInsertRowid);

    if (manualPassword) {
      console.log(`Usuário criado manualmente: ${normalizedEmail}`);
      return res.json({ ok: true, email: normalizedEmail, name: finalName });
    }

    const { setupUrl } = issuePasswordSetupToken(userId, normalizedEmail);
    const emailStatus = await sendWelcomeEmail({ to: normalizedEmail, name: finalName, setupUrl });

    return res.json({
      ok: true,
      email: normalizedEmail,
      email_sent: emailStatus.sent,
      name: finalName,
      setup_url: emailStatus.sent ? undefined : setupUrl,
    });
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).message?.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Email já cadastrado.' });
    }

    const message = error instanceof Error ? error.message : 'Erro ao criar usuário.';
    return res.status(500).json({ error: message });
  }
});

app.get('/api/admin/users', adminLimiter, requireAdmin, (_req, res) => {
  const users = db.prepare(
    `SELECT id, email, name, access_status, created_at, last_login_at, kiwify_order_id
      FROM users
      ORDER BY created_at DESC`,
  ).all();

  return res.json({ users, total: (users as unknown[]).length });
});

app.get('/api/health', (_req, res) => {
  db.prepare('SELECT 1').get();
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : 'Erro interno do servidor.';
  console.error('Erro não tratado na API:', message);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

const PORT = Number(process.env.PORT) || 3001;
const server = app.listen(PORT, () => {
  console.log(`\nAtelier 21 Backend rodando em http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`DB: ${DB_PATH}\n`);
});

function shutdown(signal: string) {
  console.log(`Recebido ${signal}. Encerrando API com segurança...`);
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
