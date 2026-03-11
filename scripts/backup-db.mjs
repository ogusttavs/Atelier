import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.DB_PATH?.trim();
if (!dbPath) {
  throw new Error('DB_PATH precisa estar configurado para gerar backup.');
}

const absoluteDbPath = path.resolve(dbPath);
const backupDir = path.resolve(process.env.BACKUP_DIR || path.join(path.dirname(absoluteDbPath), 'backups'));
const retentionDays = Number(process.env.BACKUP_RETENTION_DAYS || '30');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = path.join(backupDir, `atelier21-${timestamp}.db`);

fs.mkdirSync(backupDir, { recursive: true, mode: 0o700 });

const source = new Database(absoluteDbPath, { fileMustExist: true, timeout: 5000 });
let integrity = '';
let userCount = 0;

try {
  source.pragma('busy_timeout = 5000');
  await source.backup(backupPath);
} finally {
  source.close();
}

const restored = new Database(backupPath, { fileMustExist: true, readonly: true });
try {
  integrity = restored.prepare('PRAGMA integrity_check').pluck().get();
  userCount = restored.prepare('SELECT COUNT(*) FROM users').pluck().get();
} finally {
  restored.close();
}

if (integrity !== 'ok') {
  throw new Error(`Backup gerado, mas integrity_check falhou: ${integrity}`);
}

if (Number.isFinite(retentionDays) && retentionDays > 0) {
  const cutoffMs = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
  for (const fileName of fs.readdirSync(backupDir)) {
    if (!fileName.endsWith('.db')) continue;
    const filePath = path.join(backupDir, fileName);
    const stats = fs.statSync(filePath);
    if (stats.mtimeMs < cutoffMs) {
      fs.rmSync(filePath);
    }
  }
}

console.log(`Backup criado em ${backupPath}`);
console.log(`integrity_check=${integrity}`);
console.log(`users=${userCount}`);
