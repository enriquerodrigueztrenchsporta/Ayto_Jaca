#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Copia de seguridad de PostgreSQL y de los archivos subidos.
#
# Uso manual:   ./deploy/scripts/backup-db.sh
# Cron diario:  30 3 * * * /opt/ayto-jaca/deploy/scripts/backup-db.sh >> /var/log/ayto-jaca-backup.log 2>&1
#
# Variables opcionales:
#   BACKUP_DIR       carpeta de destino       (por defecto /var/backups/ayto-jaca)
#   RETENTION_DAYS   días que se conservan    (por defecto 14)
#   COMPOSE_DIR      carpeta del proyecto     (por defecto la raíz del repositorio)
# ─────────────────────────────────────────────────────────────
set -euo pipefail

COMPOSE_DIR="${COMPOSE_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/ayto-jaca}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
STAMP="$(date +%Y%m%d-%H%M%S)"

cd "$COMPOSE_DIR"
# shellcheck disable=SC1091
set -a; [ -f .env ] && . ./.env; set +a
DB_USER="${POSTGRES_USER:-ayto}"
DB_NAME="${POSTGRES_DB:-ayto_jaca}"

umask 077
mkdir -p "$BACKUP_DIR"

echo "[$(date -Is)] Copia de la base de datos ${DB_NAME}…"
docker compose exec -T db pg_dump -U "$DB_USER" -d "$DB_NAME" --format=custom --no-owner --no-privileges \
  > "$BACKUP_DIR/db-${STAMP}.dump"

echo "[$(date -Is)] Copia de archivos subidos…"
docker compose cp app:/app/storage/uploads - | gzip > "$BACKUP_DIR/uploads-${STAMP}.tar.gz" \
  || echo "Aviso: no se pudo copiar uploads (¿contenedor parado?)"

# Comprobación básica de integridad
if [ ! -s "$BACKUP_DIR/db-${STAMP}.dump" ]; then
  echo "ERROR: la copia de la base de datos está vacía" >&2
  exit 1
fi

echo "[$(date -Is)] Rotación: se eliminan copias de más de ${RETENTION_DAYS} días"
find "$BACKUP_DIR" -type f \( -name 'db-*.dump' -o -name 'uploads-*.tar.gz' \) -mtime +"$RETENTION_DAYS" -print -delete

echo "[$(date -Is)] Copia completada: $BACKUP_DIR/db-${STAMP}.dump ($(du -h "$BACKUP_DIR/db-${STAMP}.dump" | cut -f1))"
