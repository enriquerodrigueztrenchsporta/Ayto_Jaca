# Despliegue en servidor propio (VPS Linux)

Guía paso a paso, pensada para una persona no experta. Arquitectura final:

```
Internet ──▶ Nginx (80/443, certificados Let's Encrypt) ──▶ 127.0.0.1:3000 contenedor «app» (Next.js)
                                                                   └──▶ contenedor «db» (PostgreSQL, sin puertos públicos)
Volúmenes persistentes: pgdata (base de datos) · uploads (archivos subidos)
```

La web **no depende de Vercel ni de GitHub Pages**: GitHub se usa solo como repositorio de código (y opcionalmente para lanzar el despliegue automático por SSH).

> En los ejemplos se usa el dominio `demo.aytojaca.es`, el usuario `deploy` y la carpeta `/opt/ayto-jaca`. Sustitúyelos por los reales. No se ha contratado ni reservado ningún dominio.

---

## 1. Contratar o preparar un VPS

- Sistema: **Ubuntu Server 24.04 LTS** (o la LTS vigente).
- Recursos mínimos recomendados: **2 vCPU, 4 GB de RAM, 40 GB de disco SSD** (la compilación de la imagen es lo más exigente; con 2 GB añada swap).
- Anote la **IP pública** del servidor.
- Si el proveedor ofrece firewall propio, abra solo los puertos **22, 80 y 443**.

## 2. Conectarse por SSH

Desde su ordenador (Windows PowerShell, macOS o Linux):

```bash
ssh root@IP_DEL_SERVIDOR
```

### Crear un usuario sin privilegios de root y usar clave SSH

En su ordenador, si aún no tiene clave:

```bash
ssh-keygen -t ed25519 -C "admin-ayto-jaca"
```

En el servidor (como root):

```bash
adduser deploy
usermod -aG sudo deploy
mkdir -p /home/deploy/.ssh && chmod 700 /home/deploy/.ssh
nano /home/deploy/.ssh/authorized_keys      # pegue aquí su clave pública (~/.ssh/id_ed25519.pub)
chmod 600 /home/deploy/.ssh/authorized_keys && chown -R deploy:deploy /home/deploy/.ssh
```

Compruebe en **otra terminal** que puede entrar: `ssh deploy@IP_DEL_SERVIDOR`. Después, desactive el acceso con contraseña y el acceso directo de root:

```bash
sudo nano /etc/ssh/sshd_config.d/99-hardening.conf
```
```
PasswordAuthentication no
PermitRootLogin no
PubkeyAuthentication yes
```
```bash
sudo systemctl restart ssh
```

### Firewall, actualizaciones y Fail2ban

```bash
sudo apt update && sudo apt -y upgrade
sudo apt -y install ufw fail2ban unattended-upgrades git curl
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo dpkg-reconfigure -plow unattended-upgrades     # actualizaciones de seguridad automáticas
sudo systemctl enable --now fail2ban               # bloquea IPs con intentos de acceso SSH repetidos
```

> **PostgreSQL nunca se expone a Internet**: en `docker-compose.yml` el servicio `db` no publica puertos y la web solo escucha en `127.0.0.1`.
> Nota: Docker puede saltarse UFW para puertos publicados en `0.0.0.0`; por eso este proyecto solo publica en `127.0.0.1`.

## 3. Instalar Docker

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker deploy
```

Cierre la sesión SSH y vuelva a entrar para que el grupo `docker` tenga efecto.

## 4. Instalar Docker Compose

Ya se instala con el paso anterior (`docker-compose-plugin`). Compruebe:

```bash
docker --version
docker compose version
```

## 5. Clonar el repositorio

```bash
sudo mkdir -p /opt/ayto-jaca && sudo chown deploy:deploy /opt/ayto-jaca
git clone https://github.com/enriquerodrigueztrenchsporta/Ayto_Jaca.git /opt/ayto-jaca
cd /opt/ayto-jaca
chmod +x deploy/scripts/*.sh
```

## 6. Crear el archivo `.env`

```bash
cp .env.example .env
chmod 600 .env
nano .env
```

Valores mínimos (genere secretos aleatorios con los comandos indicados):

```bash
openssl rand -hex 24      # → POSTGRES_PASSWORD (solo letras y números: evita problemas en la URL)
openssl rand -base64 32   # → AUTH_SECRET
openssl rand -hex 24      # → CRON_SECRET
```

```dotenv
POSTGRES_USER="ayto"
POSTGRES_PASSWORD="<valor aleatorio>"
POSTGRES_DB="ayto_jaca"
AUTH_SECRET="<valor aleatorio>"
AUTH_URL="https://demo.aytojaca.es"
NEXTAUTH_URL="https://demo.aytojaca.es"
AUTH_TRUST_HOST="true"
SITE_URL="https://demo.aytojaca.es"
NEXT_PUBLIC_DEMO_MODE="true"
CRON_SECRET="<valor aleatorio>"
ADMIN_EMAIL="persona@aytojaca.es"
ADMIN_NAME="Nombre Apellido"
ADMIN_PASSWORD=""          # déjelo vacío y use el paso 9
```

`DATABASE_URL` no hace falta en el servidor: Docker Compose la construye con `POSTGRES_*` apuntando al contenedor `db`.

**Guarde una copia del `.env` fuera del servidor** (gestor de contraseñas corporativo): la necesitará para recuperar el servicio.

## 7. Levantar PostgreSQL

```bash
docker compose up -d db
docker compose ps          # db debe aparecer como "healthy"
```

## 8. Ejecutar las migraciones (y el contenido inicial)

```bash
docker compose run --rm migrate
```

Esto aplica las migraciones de Prisma y carga el contenido inicial verificado (solo la primera vez, si la base de datos está vacía). La primera ejecución compila la imagen y tarda unos minutos.

## 9. Crear el usuario administrador

```bash
docker compose run --rm migrate npm run admin:create
```

Pide correo, nombre y contraseña (mínimo 12 caracteres). La contraseña no queda guardada en ningún archivo. Más usuarios: desde el propio panel (**Configuración → Añadir usuario**).

## 10. Levantar la aplicación

```bash
docker compose up -d
docker compose ps
curl http://127.0.0.1:3000/api/health
# {"status":"ok","app":"ok","database":"ok","timestamp":"…"}
```

Los contenedores se reinician solos si el servidor se reinicia (`restart: unless-stopped`). Logs:

```bash
docker compose logs -f app       # web (rotación: 5 archivos de 10 MB)
docker compose logs -f db
```

## 11. Configurar Nginx

```bash
sudo apt -y install nginx
sudo mkdir -p /var/www/certbot /var/log/ayto-jaca
sudo cp deploy/nginx/ayto-jaca.conf /etc/nginx/sites-available/ayto-jaca.conf
sudo sed -i 's/demo.aytojaca.es/SU_DOMINIO/g' /etc/nginx/sites-available/ayto-jaca.conf
```

Como todavía no hay certificado, para el primer arranque comente temporalmente el bloque `server { listen 443 … }` (o use el truco del paso 13) y active el sitio:

```bash
sudo ln -s /etc/nginx/sites-available/ayto-jaca.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

El archivo incluye: redirección HTTP→HTTPS, proxy a la aplicación, cabeceras de seguridad, compresión gzip, límite de subida de 20 MB, caché de estáticos y límites de peticiones para el acceso al panel.

## 12. Configurar el dominio

En el proveedor del dominio (o en el DNS del Ayuntamiento) cree un registro:

| Tipo | Nombre | Valor |
|---|---|---|
| A | `demo` (para `demo.aytojaca.es`) | IP pública del servidor |
| AAAA (opcional) | `demo` | IPv6 del servidor |

Compruebe la propagación: `dig +short demo.aytojaca.es` debe devolver la IP.

## 13. Instalar HTTPS (Let's Encrypt + Certbot)

```bash
sudo apt -y install certbot python3-certbot-nginx
sudo certbot --nginx -d demo.aytojaca.es --redirect --agree-tos -m correo-tecnico@aytojaca.es
```

Certbot obtiene el certificado, completa la configuración de Nginx y programa la **renovación automática** (temporizador `certbot.timer`). Comprobaciones:

```bash
systemctl list-timers | grep certbot     # renovación programada (2 veces al día)
sudo certbot renew --dry-run             # simulación de renovación
```

Si comentó el bloque 443 en el paso 11, descoméntelo ahora y ejecute `sudo nginx -t && sudo systemctl reload nginx`.

## 14. Comprobar `/api/health`

```bash
curl -fsS https://demo.aytojaca.es/api/health
```

Debe responder `"status":"ok"`. Abra en el navegador `https://demo.aytojaca.es` y `https://demo.aytojaca.es/admin`.

### Tareas programadas (publicación programada y copias)

```bash
sudo cp deploy/cron/ayto-jaca.cron /etc/cron.d/ayto-jaca
sudo nano /etc/cron.d/ayto-jaca          # solo si su usuario no es "deploy" o la ruta no es /opt/ayto-jaca
sudo mkdir -p /var/backups/ayto-jaca && sudo chown deploy:deploy /var/backups/ayto-jaca /var/log/ayto-jaca
```

- Cada 10 minutos: `/api/cron/lifecycle` publica lo programado y archiva lo caducado (la web ya oculta lo caducado aunque el cron falle).
- Cada noche 3:30: `deploy/scripts/backup-db.sh` copia la base de datos y los archivos subidos, con **rotación de 14 días** (`RETENTION_DAYS`).
- Copie periódicamente `/var/backups/ayto-jaca` **fuera del servidor** (otro servidor, almacenamiento del Ayuntamiento…). Ver [disaster-recovery.md](disaster-recovery.md).

## 15. Actualizar la web en el futuro

Manual:

```bash
cd /opt/ayto-jaca
./deploy/scripts/deploy.sh main
```

El script: descarga la última versión, hace una copia de seguridad, reconstruye las imágenes, aplica migraciones, reinicia y comprueba `/api/health`.

### Despliegue automático desde GitHub (CI/CD)

1. En el servidor, cree una clave para GitHub: `ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N ""` y añada `~/.ssh/github_deploy.pub` a `/home/deploy/.ssh/authorized_keys`.
2. En GitHub → *Settings → Environments* cree el entorno **production** (y **staging** si se usa) con estos **secrets**:

| Secret | Valor |
|---|---|
| `SSH_HOST` | IP o dominio del servidor |
| `SSH_USER` | `deploy` |
| `SSH_PORT` | `22` (opcional) |
| `SSH_PRIVATE_KEY` | contenido de `~/.ssh/github_deploy` (clave privada) |
| `SSH_KNOWN_HOSTS` | salida de `ssh-keyscan -t ed25519 IP_DEL_SERVIDOR` |
| `DEPLOY_PATH` | `/opt/ayto-jaca` (opcional) |

3. En *Settings → Variables* del repositorio: `DEPLOY_ENABLED = true` y, opcionalmente, `PUBLIC_URL = https://demo.aytojaca.es`.
4. Flujo: **push a `main`** → la CI ejecuta lint, tipos, tests, build, E2E y construcción de la imagen → si todo pasa, `deploy.yml` se conecta por SSH y ejecuta `deploy.sh main` → comprueba el healthcheck.

Nunca se suben claves ni `.env` al repositorio.

### Entorno de staging (opcional, sin duplicar infraestructura)

En el mismo servidor, en otra carpeta y con otro puerto y proyecto de Compose:

```bash
git clone https://github.com/enriquerodrigueztrenchsporta/Ayto_Jaca.git /opt/ayto-jaca-staging
cd /opt/ayto-jaca-staging && git checkout staging
cp .env.example .env    # COMPOSE_PROJECT_NAME=ayto-jaca-staging, APP_PORT=3001, SITE_URL=https://staging.…
docker compose up -d
```

Añada un segundo `server {}` en Nginx para el subdominio de staging apuntando a `127.0.0.1:3001` y configure el entorno **staging** en GitHub con `DEPLOY_PATH=/opt/ayto-jaca-staging`. Los push a la rama `staging` se desplegarán ahí.

## Permisos de archivos

```bash
chmod 600 /opt/ayto-jaca/.env
chmod 700 /var/backups/ayto-jaca
ls -l /opt/ayto-jaca/.env        # -rw------- deploy deploy
```

El contenedor de la web se ejecuta con el usuario sin privilegios `node`.

## Resolución de problemas

| Síntoma | Comprobación |
|---|---|
| 502 Bad Gateway | `docker compose ps` y `docker compose logs --tail=100 app` |
| `/api/health` → `database: "error"` | `docker compose logs db`; espacio en disco (`df -h`) |
| No se puede iniciar sesión | `AUTH_URL`/`AUTH_TRUST_HOST` en `.env`; reinicie `docker compose up -d app` |
| El certificado caduca | `sudo certbot renew` y `systemctl status certbot.timer` |
| La compilación se queda sin memoria | Añada swap: `sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile` |
| Quitar el aviso «demo» | `NEXT_PUBLIC_DEMO_MODE="false"` en `.env` y `docker compose up -d app` |
