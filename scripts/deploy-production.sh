#!/bin/sh

set -eu

PROD_HOST="${PROD_HOST:-root@167.88.32.1}"
PROD_DIR="${PROD_DIR:-/var/www/atelier21/current}"
PROD_SHARED_DIR="${PROD_SHARED_DIR:-/var/www/atelier21/shared}"
PROD_DB_PATH="${PROD_DB_PATH:-${PROD_SHARED_DIR}/atelier21.db}"
PROD_BACKUP_DIR="${PROD_BACKUP_DIR:-${PROD_SHARED_DIR}/backups}"
REMOTE_TMP_ARCHIVE="/tmp/atelier21-release.tgz"
LOCAL_ARCHIVE="$(mktemp /tmp/atelier21-release.XXXXXX.tgz)"

cleanup() {
  rm -f "$LOCAL_ARCHIVE"
}

trap cleanup EXIT INT TERM

echo "Building frontend locally..."
npm run build

echo "Packing release..."
tar -czf "$LOCAL_ARCHIVE" \
  dist \
  src \
  scripts \
  package.json \
  package-lock.json \
  ecosystem.config.cjs \
  .env.example

echo "Preparing remote directories..."
ssh "$PROD_HOST" "set -eu; mkdir -p '$PROD_DIR' '$PROD_SHARED_DIR' '$PROD_BACKUP_DIR'"

echo "Uploading release archive..."
scp "$LOCAL_ARCHIVE" "$PROD_HOST:$REMOTE_TMP_ARCHIVE"

echo "Applying release on production..."
ssh "$PROD_HOST" "
  set -eu
  TS=\$(date +%Y%m%d-%H%M%S)
  BACKUP_FILE='$PROD_SHARED_DIR'/atelier21.db.pre-hardening-\$TS
  cd '$PROD_DIR'
  node --input-type=module -e \"import Database from 'better-sqlite3'; const db = new Database(process.argv[1], { fileMustExist: true, timeout: 5000 }); await db.backup(process.argv[2]); db.close();\" '$PROD_DB_PATH' \"\$BACKUP_FILE\"
  tar -xzf '$REMOTE_TMP_ARCHIVE' -C '$PROD_DIR'
  chmod 700 '$PROD_SHARED_DIR' '$PROD_BACKUP_DIR'
  chmod 600 '$PROD_DB_PATH' \"\$BACKUP_FILE\" || true
  if command -v crontab >/dev/null 2>&1; then
    (crontab -l 2>/dev/null | grep -v 'atelier21-db-backup'; printf '%s\n' \"0 * * * * cd '$PROD_DIR' && DB_PATH='$PROD_DB_PATH' BACKUP_DIR='$PROD_BACKUP_DIR' node scripts/backup-db.mjs >> '$PROD_SHARED_DIR/db-backup.log' 2>&1 # atelier21-db-backup\") | crontab -
  fi
  pm2 restart atelier21-api --update-env
  sleep 2
  curl -fsS http://127.0.0.1:3010/api/health
"

echo "Production deploy finished."
