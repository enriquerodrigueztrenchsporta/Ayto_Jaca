# Ayuntamiento de Jaca — propuesta de nueva web municipal

> **Propuesta de rediseño — demo no oficial.** La web oficial del Ayuntamiento es [jaca.es](https://www.jaca.es/).

Propuesta completa de nueva web para el **Ayuntamiento de Jaca (Huesca, Aragón)**: portal ciudadano moderno y accesible, contenido real procedente de fuentes oficiales y un **panel de administración pensado para que una sola persona actualice la web una vez por semana** desde un único formulario. Preparada para desplegarse en un **servidor propio** (Docker + PostgreSQL + Nginx), sin depender de servicios propietarios.

| | |
|---|---|
| Web pública | Home orientada a tareas, buscador en lenguaje natural, 38 trámites con enlace directo a la Sede Electrónica, agenda filtrable, avisos con caducidad, plenos, subvenciones, empleo público, Ayuntamiento, transparencia, ciudad, cultura, deportes y turismo |
| Panel `/admin` | Actualización semanal en 10 pasos, CRUD de 11 tipos de contenido, publicación programada, archivado automático, previsualización, historial, medios, checklist semanal y avisos de datos sin verificar |
| Calidad | WCAG 2.2 AA como objetivo (pruebas axe automáticas), SEO técnico, cabeceras de seguridad, 71 tests unitarios/integración y 47 E2E |

## Índice

1. [Arquitectura](#arquitectura) · 2. [Stack](#stack) · 3. [Instalación](#instalación) · 4. [Variables de entorno](#variables-de-entorno) · 5. [Base de datos, migraciones y seed](#base-de-datos-migraciones-y-seed) · 6. [Desarrollo](#desarrollo) · 7. [Tests](#tests) · 8. [Usuario administrador](#crear-el-usuario-administrador) · 9. [Actualización de contenidos](#actualización-de-contenidos) · 10. [Despliegue](#despliegue) · 11. [Estructura](#estructura-del-proyecto) · 12. [Documentación](#documentación)

---

## Arquitectura

```
Navegador ──HTTPS──▶ Nginx (host) ──▶ Next.js 16 (Node.js, contenedor "app") ──▶ PostgreSQL 17 (contenedor "db")
                                           │  ├─ Server Components (web pública, renderizado bajo demanda)
                                           │  ├─ Server Actions (panel: guardar, publicar, archivar)
                                           │  ├─ Route Handlers (/api/health, /api/search, /api/admin/upload, /api/cron/lifecycle)
                                           │  └─ Volumen "uploads" (imágenes y PDF subidos)
                                           └──▶ Enlaces a sistemas oficiales: Sede Electrónica (sedipualba), Portal de Transparencia,
                                                Plataforma de Contratación, YouTube WebTV, visitjaca.es, deportesjaca.es
```

Decisiones principales:

- **La web no replica sistemas administrativos**: cada trámite enlaza a su ficha oficial en la Sede Electrónica (`jaca.sedipualba.es`), la transparencia al portal oficial y la contratación a la Plataforma del Estado.
- **CMS propio y mínimo** (sin CMS externo): un modelo de datos con estados `DRAFT → SCHEDULED → PUBLISHED → ARCHIVED`, `publishAt`/`expiresAt`, fuente (`sourceUrl`, `sourceName`) y fecha de verificación (`lastVerifiedAt`).
- **Visibilidad calculada en cada consulta** (`lib/content/visibility.ts`): la web es correcta aunque la tarea programada no se haya ejecutado; el cron solo "ordena" estados y archiva lo caducado (nunca borra).
- **Formulario semanal que crea contenido real en borrador**: se puede guardar, previsualizar y publicar todo junto, con confirmación («Estás a punto de actualizar X noticias, Y eventos y Z avisos»).
- **Buscador con interfaz intercambiable** (`lib/search/types.ts`): implementación PostgreSQL con texto normalizado y sinónimos en lenguaje natural; preparado para Meilisearch, Typesense, Algolia o búsqueda semántica.
- **Configuración declarativa del panel** (`lib/admin/resources.ts`): un único `EditorForm` (React Hook Form + Zod) para todos los tipos de contenido; la misma validación Zod se aplica en el servidor.

Preparado para el futuro sin sobrearquitectura: multidioma (textos centralizados y rutas por sección), newsletter (interfaz ya diseñada, SMTP en `.env.example`), API pública/Open Data (capa `lib/queries`), PWA, chatbot basado en el contenido (búsqueda desacoplada), varias personas usuarias con roles.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | **Next.js 16.3** (App Router, Turbopack, `output: "standalone"`), React 19, TypeScript |
| Estilos | Tailwind CSS 4 + tipografías autoalojadas con `next/font` (Public Sans, Newsreader) |
| Datos | **PostgreSQL 17** + **Prisma 7** (adaptador `pg`) |
| Autenticación | **Auth.js v5** (NextAuth) con credenciales, contraseñas `bcrypt`, sesión JWT de 8 h, roles ADMIN/EDITOR |
| Validación y formularios | **Zod 4**, **React Hook Form** |
| Iconos e imágenes | **Lucide**, `next/image` (AVIF/WebP) |
| Tests | **Vitest** (unit + integración con BD real), **Playwright** + **axe-core** (E2E y accesibilidad) |
| Infraestructura | Docker, Docker Compose, Nginx, Let's Encrypt, GitHub Actions |

## Instalación

Requisitos: **Node.js ≥ 20.9** (recomendado 24), npm 10+, y PostgreSQL (local con Docker **o** el PostgreSQL integrado sin Docker que incluye el proyecto).

### Windows (PowerShell)

```powershell
git clone https://github.com/enriquerodrigueztrenchsporta/Ayto_Jaca.git
cd Ayto_Jaca
npm install
Copy-Item .env.example .env        # y edite .env (ver abajo)

# Terminal 1: PostgreSQL local sin Docker (déjela abierta)
npm run db:local

# Terminal 2:
npx prisma migrate deploy
npm run db:seed
npm run admin:create               # pide correo y contraseña
npm run dev                        # http://localhost:3000
```

### Linux / macOS

```bash
git clone https://github.com/enriquerodrigueztrenchsporta/Ayto_Jaca.git && cd Ayto_Jaca
npm install && cp .env.example .env
npm run db:local &                 # o un PostgreSQL propio / Docker
npx prisma migrate deploy && npm run db:seed && npm run admin:create
npm run dev
```

### Solo con Docker

```bash
cp .env.example .env   # defina POSTGRES_PASSWORD, AUTH_SECRET, CRON_SECRET, ADMIN_*
docker compose up      # web en http://127.0.0.1:3000
```

## Variables de entorno

Todas documentadas en [`.env.example`](.env.example). **Nunca se sube `.env` a Git.**

| Variable | Obligatoria | Descripción |
|---|---|---|
| `DATABASE_URL` | Sí | Conexión PostgreSQL. Con `npm run db:local`: `postgresql://ayto:ayto_local_only@localhost:5433/ayto_jaca` |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Docker | Credenciales con las que Compose crea la BD (use una contraseña alfanumérica larga: `openssl rand -hex 24`) |
| `AUTH_SECRET` | Sí | Secreto de sesión (`npx auth secret` o `openssl rand -base64 32`) |
| `AUTH_URL` / `NEXTAUTH_URL` | Sí en producción | URL pública (`https://demo.aytojaca.es`) |
| `AUTH_TRUST_HOST` | Detrás de Nginx | `true` |
| `SITE_URL` | Sí | URL canónica para sitemap, Open Graph y canonical |
| `NEXT_PUBLIC_DEMO_MODE` | No (por defecto `true`) | Muestra «Propuesta de rediseño — demo no oficial» y bloquea la indexación. `false` para la web oficial. Se lee en tiempo de ejecución: basta reiniciar el contenedor |
| `ADMIN_EMAIL` / `ADMIN_NAME` / `ADMIN_PASSWORD` | No | Administrador inicial que crea el seed (la contraseña puede dejarse vacía y usar `npm run admin:create`) |
| `UPLOAD_DIR`, `UPLOAD_MAX_IMAGE_MB`, `UPLOAD_MAX_DOCUMENT_MB` | No | Almacenamiento y límites de subida |
| `CRON_SECRET` | Producción | Token de la tarea `/api/cron/lifecycle` |
| `SMTP_*` | No | Preparado para newsletter/notificaciones (no usado en el MVP) |
| `APP_PORT`, `COMPOSE_PROJECT_NAME` | No | Puerto local y nombre del proyecto Compose (útil para staging) |

## Base de datos, migraciones y seed

- Esquema: [`prisma/schema.prisma`](prisma/schema.prisma) — `User`, `Page`, `News`, `Event`, `Alert`, `Grant`, `PublicJob`, `MunicipalSession`, `Procedure`, `Document`, `Category`, `Media`, `FeaturedContent`, `WeeklyUpdate`, `AuditLog`, `Area`, `Setting`.
- Migraciones: `npx prisma migrate deploy` (producción) · `npm run db:migrate` (crear nuevas en desarrollo).
- Seed: `npm run db:seed` carga el contenido real verificado **solo si la BD está vacía**; `npm run db:seed -- --force` lo recarga (no borra usuarios).

El seed contiene contenido **real** de fuentes oficiales consultadas el 30/09/2026 (con `sourceUrl` y `lastVerifiedAt`): 38 trámites (32 de la Sede Electrónica), 14 noticias, 10 plenos, 5 subvenciones, 5 procesos selectivos, 6 eventos, 26 páginas, 18 áreas con contactos verificados, 130+ documentos oficiales y la corporación municipal. Único contenido ficticio: **un aviso de corte de tráfico etiquetado «DEMO»** para enseñar el formato de movilidad.

## Desarrollo

```powershell
npm run db:local     # PostgreSQL sin Docker (puerto 5433), en otra terminal
npm run dev          # http://localhost:3000  ·  panel: http://localhost:3000/admin
```

| Script | Qué hace |
|---|---|
| `npm run dev` / `build` / `start` | Desarrollo, compilación y servidor de producción |
| `npm run lint` · `npm run typecheck` | ESLint · Prisma generate + TypeScript |
| `npm run test` | Unitarios + integración (BD aislada `ayto_jaca_test`) |
| `npm run test:e2e` | Playwright + axe (requiere `npm run build`) |
| `npm run db:local` | PostgreSQL embebido (`-- --test` para la BD de tests en el puerto 5434) |
| `npm run db:seed` · `npm run admin:create` | Contenido inicial · crear/actualizar usuario |

## Tests

```powershell
npm run db:local            # PostgreSQL disponible (otra terminal)
npm run test                # 71 tests: reglas de publicación, fechas (Europe/Madrid), búsqueda,
                            # validación, seguridad de subidas, XSS, contraste de color,
                            # y en BD real: crear/editar/publicar/programar/caducar, agenda,
                            # avisos, formulario semanal completo y buscador sobre el seed
npm run build
npm run test:e2e            # 47 tests (escritorio + móvil): home, navegación, buscar un trámite,
                            # noticia, evento, casos A-F, 404, SEO, login, crear → borrador →
                            # previsualizar → publicar → visible, formulario semanal y axe en 12 páginas
```

Los tests de integración usan siempre una BD cuyo nombre termina en `_test` (protección contra ejecutar sobre datos reales). Si no hay PostgreSQL disponible, se omiten con aviso.

## Crear el usuario administrador

```powershell
npm run admin:create
# o sin preguntas:
npm run admin:create -- --email persona@aytojaca.es --name "Nombre Apellido" --role ADMIN
```

En Docker: `docker compose run --rm migrate npm run admin:create`. Desde **Configuración** del panel, una persona administradora puede crear más usuarios (ADMIN o EDITOR), desactivarlos y cambiar su contraseña. Las contraseñas nunca se guardan en el repositorio; se almacenan con bcrypt.

## Actualización de contenidos

Manual para la persona responsable (no técnica): **[docs/manual-actualizacion.md](docs/manual-actualizacion.md)**. Resumen: *Panel → Actualización semanal → rellenar los pasos que procedan → Guardar borrador → Previsualizar → Publicar cambios*, siguiendo la checklist semanal integrada.

Automatismos: publicación programada (`publishAt`), retirada automática (`expiresAt`, fin de avisos, eventos pasados → archivados), historial de cambios y aviso «Este dato no se verifica desde hace 90 días».

## Despliegue

Guía paso a paso para servidor propio (Ubuntu + Docker + Nginx + Let's Encrypt): **[docs/deployment-server.md](docs/deployment-server.md)**.

```bash
docker compose up -d                              # PostgreSQL + migraciones/seed + web (127.0.0.1:3000)
curl http://127.0.0.1:3000/api/health             # {"status":"ok","app":"ok","database":"ok",…}
./deploy/scripts/deploy.sh main                   # actualizar a la última versión
./deploy/scripts/backup-db.sh                     # copia de seguridad con rotación
```

CI/CD: `.github/workflows/ci.yml` (lint, tipos, tests, build, E2E y build de la imagen en cada PR y push) y `.github/workflows/deploy.yml` (despliegue por SSH al servidor tras una CI correcta en `main` → producción o `staging` → staging; se activa con la variable `DEPLOY_ENABLED=true` y los secrets documentados). Recuperación ante desastres: [docs/disaster-recovery.md](docs/disaster-recovery.md).

## Estructura del proyecto

```text
Ayto_Jaca/
├─ app/
│  ├─ (public)/            Web pública: home, trámites, actualidad, agenda, avisos, plenos, convocatorias,
│  │                       empleo, ayuntamiento, transparencia, ciudad, cultura, deportes, turismo, legal…
│  ├─ admin/               Panel: login, (panel)/ resumen, actualización semanal, [resource] CRUD, medios,
│  │                       historial, configuración · actions.ts (Server Actions)
│  ├─ preview/             Previsualización privada (noindex)
│  ├─ api/                 health, search, admin/upload, cron/lifecycle, auth
│  ├─ uploads/             Servidor de archivos subidos
│  └─ sitemap.ts · robots.ts · rss.xml · not-found.tsx
├─ components/  ui/ (base) · public/ (web) · admin/ (panel, formulario semanal)
├─ lib/         db, auth, content (visibilidad, ciclo de vida, eventos), search, queries, admin, weekly,
│               dates (Europe/Madrid), markdown (saneado), uploads (validación), seo, site (datos verificados)
├─ prisma/      schema.prisma · migrations/ · seed.ts
├─ data/        seed/ (contenido real curado) · source/ (datos brutos del análisis) · corporacion.ts · legal.ts
├─ public/      images/ (fotografías con licencia libre) · favicon
├─ tests/       unit/ · integration/ · e2e/ · setup/
├─ deploy/      nginx/ayto-jaca.conf · scripts/ (deploy, backup, restore) · cron/
├─ docs/        discovery · design-system · manual-actualizacion · deployment-server · disaster-recovery ·
│               content-migration · assets-sources
├─ scripts/     local-db.mjs · create-admin.ts · fetch-images.mjs · utilidades de QA
├─ Dockerfile · docker-compose.yml · .dockerignore · .env.example · .github/workflows/
```

## Documentación

| Documento | Contenido |
|---|---|
| [docs/discovery.md](docs/discovery.md) | Inventario de jaca.es, problemas UX, arquitectura propuesta y fuentes |
| [docs/design-system.md](docs/design-system.md) | Sistema visual «Piedra y Pino»: color, tipografía, componentes, motion, do/don't |
| [docs/manual-actualizacion.md](docs/manual-actualizacion.md) | Manual no técnico y checklist semanal |
| [docs/deployment-server.md](docs/deployment-server.md) | Despliegue en VPS paso a paso, HTTPS, seguridad del servidor, CI/CD |
| [docs/disaster-recovery.md](docs/disaster-recovery.md) | Copias, restauración y nueva instancia |
| [docs/content-migration.md](docs/content-migration.md) | Qué se ha migrado, qué no, qué revisar y riesgos |
| [docs/assets-sources.md](docs/assets-sources.md) | Procedencia y licencias de imágenes y datos |

---

Propuesta elaborada con información pública oficial. No sustituye a la web oficial del Ayuntamiento de Jaca ni presenta como propios datos no validados por el Ayuntamiento: lo pendiente se marca como **[PENDIENTE DE VALIDACIÓN POR EL AYUNTAMIENTO]**.
