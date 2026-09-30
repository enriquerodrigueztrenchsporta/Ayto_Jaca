# Plan de recuperación ante desastres

Objetivo: poder recuperar la web completa (contenido, archivos subidos y configuración) en **menos de 2 horas** a partir de una copia de seguridad.

## Qué hay que proteger

| Elemento | Dónde está | Cómo se protege |
|---|---|---|
| Base de datos (contenidos, usuarios, historial) | Volumen Docker `pgdata` | `deploy/scripts/backup-db.sh` → `db-AAAAMMDD-HHMMSS.dump` (formato *custom* de `pg_dump`) |
| Archivos subidos (imágenes, PDF) | Volumen Docker `uploads` | Mismo script → `uploads-AAAAMMDD-HHMMSS.tar.gz` |
| Configuración y secretos | `/opt/ayto-jaca/.env` | **Copia manual** en el gestor de contraseñas del Ayuntamiento (nunca en Git) |
| Código | GitHub | Repositorio `enriquerodrigueztrenchsporta/Ayto_Jaca` |
| Certificados HTTPS | `/etc/letsencrypt` | Se regeneran con Certbot en minutos; no es imprescindible copiarlos |

Copias automáticas: cada noche (cron) con **retención de 14 días** en `/var/backups/ayto-jaca`. **Recomendación:** sincronizar esa carpeta a un almacenamiento externo (por ejemplo `rclone` o `rsync` a un servidor del Ayuntamiento) y conservar además una copia mensual durante 12 meses.

Copia manual en cualquier momento:

```bash
cd /opt/ayto-jaca && ./deploy/scripts/backup-db.sh
ls -lh /var/backups/ayto-jaca
```

## 1. Restaurar la base de datos (mismo servidor)

```bash
cd /opt/ayto-jaca
./deploy/scripts/restore-db.sh /var/backups/ayto-jaca/db-20261001-033000.dump /var/backups/ayto-jaca/uploads-20261001-033000.tar.gz
```

El script pide confirmación escribiendo `RESTAURAR`, detiene la web, restaura la base de datos (y los archivos si se indican), aplica migraciones pendientes, arranca y comprueba `/api/health`.

Restauración manual equivalente:

```bash
docker compose stop app
docker compose exec -T db pg_restore -U ayto -d ayto_jaca --clean --if-exists --no-owner < db-XXXX.dump
gunzip -c uploads-XXXX.tar.gz | docker compose cp - app:/app/storage
docker compose up -d
```

## 2. Desplegar una nueva instancia (servidor nuevo)

1. Prepare el servidor siguiendo [deployment-server.md](deployment-server.md), pasos 1 a 5 (usuario, firewall, Docker, clonar el repositorio).
2. **Recupere las variables de entorno** (paso 3 de este documento) y créelas en `/opt/ayto-jaca/.env`.
3. Copie las copias de seguridad al nuevo servidor:
   ```bash
   scp db-XXXX.dump uploads-XXXX.tar.gz deploy@NUEVA_IP:/var/backups/ayto-jaca/
   ```
4. Arranque la base de datos y las migraciones, y restaure:
   ```bash
   docker compose up -d db
   docker compose run --rm migrate npx prisma migrate deploy
   docker compose up -d app
   ./deploy/scripts/restore-db.sh /var/backups/ayto-jaca/db-XXXX.dump /var/backups/ayto-jaca/uploads-XXXX.tar.gz
   ```
5. Configure Nginx y HTTPS (pasos 11 y 13) y actualice el registro DNS a la nueva IP (paso 12).
6. Reinstale las tareas programadas (`deploy/cron/ayto-jaca.cron`).
7. Si se usa despliegue automático, actualice los secrets `SSH_HOST` y `SSH_KNOWN_HOSTS` en GitHub.

## 3. Recuperar las variables de entorno

- Fuente principal: la copia del `.env` guardada en el gestor de contraseñas corporativo.
- Si se ha perdido:
  - `POSTGRES_*`: si la base de datos se restaura desde un `.dump`, puede crear credenciales nuevas (el dump no depende de ellas: se restaura con `--no-owner`).
  - `AUTH_SECRET`: genere uno nuevo (`openssl rand -base64 32`). Efecto: las sesiones abiertas se cierran; los usuarios vuelven a iniciar sesión con su contraseña.
  - `CRON_SECRET`: genere uno nuevo.
  - `AUTH_URL`, `SITE_URL`: el dominio público.
  - Contraseña de un administrador olvidada: `docker compose run --rm migrate npm run admin:create -- --email persona@aytojaca.es` (la sobrescribe).

## 4. Comprobar la aplicación

Tras cualquier recuperación:

```bash
curl -fsS https://SU_DOMINIO/api/health                 # "status":"ok", "database":"ok"
docker compose ps                                       # app y db "healthy"
docker compose logs --tail=50 app
```

Comprobación funcional (5 minutos):

- [ ] La portada carga y muestra avisos, noticias y agenda.
- [ ] El buscador encuentra «empadronarme».
- [ ] Una ficha de trámite enlaza a la Sede Electrónica.
- [ ] Una imagen y un PDF subidos desde el panel se abren.
- [ ] Se puede iniciar sesión en `/admin` y el **Historial de cambios** muestra la actividad previa.
- [ ] `sudo certbot renew --dry-run` funciona.
- [ ] Existe una copia de seguridad nueva tras la recuperación (`./deploy/scripts/backup-db.sh`).

## Pruebas periódicas

Al menos **una vez por trimestre**, restaure la última copia en un entorno de staging y ejecute la comprobación funcional. Una copia que nunca se ha probado no es una copia fiable.
