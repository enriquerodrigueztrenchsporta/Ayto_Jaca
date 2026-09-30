# syntax=docker/dockerfile:1.7
# ─────────────────────────────────────────────────────────────
# Web Ayuntamiento de Jaca — imagen de producción (Next.js standalone)
#   target "tools"  → imagen con todas las dependencias (migraciones, seed, crear admin)
#   target "runner" → imagen mínima que ejecuta la web
# ─────────────────────────────────────────────────────────────
ARG NODE_VERSION=24-bookworm-slim

FROM node:${NODE_VERSION} AS base
ENV NEXT_TELEMETRY_DISABLED=1
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Dependencias (se cachean mientras no cambie package-lock.json)
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci --no-audit --no-fund

# Build de Next.js
FROM deps AS builder
COPY . .
RUN npx prisma generate && npm run build

# Herramientas: migraciones, seed y creación de usuarios (docker compose run --rm migrate …)
FROM builder AS tools
ENV NODE_ENV=production
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx prisma/seed.ts"]

# Imagen final de ejecución
FROM node:${NODE_VERSION} AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    UPLOAD_DIR=/app/storage/uploads
WORKDIR /app
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
RUN mkdir -p /app/storage/uploads && chown -R node:node /app/storage
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
