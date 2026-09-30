#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Actualiza la web en el servidor con la última versión de la rama indicada.
# Lo usa GitHub Actions (vía SSH) y también puede lanzarse a mano:
#
#   cd /opt/ayto-jaca && ./deploy/scripts/deploy.sh main
# ─────────────────────────────────────────────────────────────
set -euo pipefail

BRANCH="${1:-main}"
COMPOSE_DIR="${COMPOSE_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$COMPOSE_DIR"
set -a; [ -f .env ] && . ./.env; set +a
PORT="${APP_PORT:-3000}"

echo "▶ Actualizando código (${BRANCH})…"
git fetch --prune origin
git checkout "$BRANCH"
git reset --hard "origin/${BRANCH}"

echo "▶ Copia de seguridad previa…"
./deploy/scripts/backup-db.sh || echo "Aviso: no se pudo hacer la copia previa"

echo "▶ Construyendo imágenes…"
docker compose build --pull

echo "▶ Migraciones y arranque…"
docker compose up -d --remove-orphans

echo "▶ Comprobando /api/health…"
for i in $(seq 1 30); do
  if curl -fsS "http://127.0.0.1:${PORT}/api/health" > /dev/null; then
    echo "✔ Despliegue correcto: $(curl -fsS "http://127.0.0.1:${PORT}/api/health")"
    docker image prune -f > /dev/null
    exit 0
  fi
  sleep 3
done
echo "✖ La web no responde tras el despliegue. Revise: docker compose logs --tail=200 app" >&2
exit 1
