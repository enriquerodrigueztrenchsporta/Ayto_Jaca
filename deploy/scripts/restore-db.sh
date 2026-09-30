#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Restaura una copia de la base de datos (y opcionalmente los archivos subidos).
#
#   ./deploy/scripts/restore-db.sh /var/backups/ayto-jaca/db-20261001-033000.dump [uploads-20261001-033000.tar.gz]
#
# ATENCIÓN: reemplaza el contenido actual de la base de datos.
# ─────────────────────────────────────────────────────────────
set -euo pipefail

DUMP="${1:?Indique el archivo .dump a restaurar}"
UPLOADS="${2:-}"
COMPOSE_DIR="${COMPOSE_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$COMPOSE_DIR"
set -a; [ -f .env ] && . ./.env; set +a
DB_USER="${POSTGRES_USER:-ayto}"
DB_NAME="${POSTGRES_DB:-ayto_jaca}"

[ -s "$DUMP" ] || { echo "No existe o está vacío: $DUMP" >&2; exit 1; }
read -r -p "Se va a SOBRESCRIBIR la base de datos '${DB_NAME}'. Escriba RESTAURAR para continuar: " ok
[ "$ok" = "RESTAURAR" ] || { echo "Cancelado."; exit 1; }

echo "Deteniendo la web…"
docker compose stop app
echo "Restaurando base de datos…"
docker compose exec -T db pg_restore -U "$DB_USER" -d "$DB_NAME" --clean --if-exists --no-owner --no-privileges < "$DUMP"

if [ -n "$UPLOADS" ]; then
  echo "Restaurando archivos subidos…"
  # El tar contiene la carpeta "uploads"; se copia dentro de /app/storage (funciona con el contenedor parado).
  gunzip -c "$UPLOADS" | docker compose cp - app:/app/storage
fi

echo "Aplicando migraciones pendientes y arrancando…"
docker compose run --rm migrate npx prisma migrate deploy
docker compose up -d app
sleep 5
curl -fsS "http://127.0.0.1:${APP_PORT:-3000}/api/health" && echo && echo "Restauración completada."
