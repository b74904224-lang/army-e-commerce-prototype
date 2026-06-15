# ARMYTAK

Premium army/outdoor equipment storefront — caremats, sleeping bags, field
seats and folding mattresses. Trilingual (UA / RU / EN) Next.js frontend backed
by a standalone Express API designed to run on OVHcloud.

## Architecture

```
.
├── app/                # Next.js 16 App Router (storefront UI, SEO routes)
├── components/         # Storefront + checkout components
├── lib/                # Client store, API client, SEO route helpers
├── nginx/              # Nginx TLS reverse-proxy config for the web app
├── Dockerfile          # Multi-stage build -> Next.js standalone server
├── docker-compose.yml  # Full stack: web + api
└── server/             # Express + TypeScript API (products, orders, auth)
    ├── src/
    ├── nginx/          # Nginx config for the API subdomain
    └── Dockerfile
```

The storefront is a single-route client app: product browsing always works from
bundled catalog data, while **orders and authentication require the API**. When
`NEXT_PUBLIC_API_URL` is unset the checkout shows a clear "server unavailable"
message rather than faking a successful order.

## Local development

Frontend:

```bash
pnpm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL + NEXT_PUBLIC_SITE_URL
pnpm dev                     # http://localhost:3000
```

Backend (separate terminal):

```bash
cd server
npm install
cp .env.example .env         # set JWT_SECRET, SMTP_*, CORS_ORIGINS
npm run dev                  # http://localhost:4000
```

## Environment variables

Frontend (`.env.local`):

| Variable               | Purpose                                              |
| ---------------------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`  | Base URL of the API (e.g. `https://api.armytak.com`) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin for SEO (`https://armytak.com`)|

Backend (`server/.env`) — see `server/.env.example` for the full list
(`JWT_SECRET`, `SMTP_*`, `ORDER_NOTIFICATION_*`, `CORS_ORIGINS`, …).

## Quality gates

```bash
pnpm lint     # ESLint flat config (eslint-config-next)
pnpm build    # Type-checked production build (no ignoreBuildErrors)
```

## OVH VPS production deployment step-by-step

Target topology:

| URL                       | Serves                       | Internal port |
| ------------------------- | ---------------------------- | ------------- |
| `https://armytak.com`     | Next.js storefront           | `127.0.0.1:3000` |
| `https://www.armytak.com` | 301 redirect → `armytak.com` | (Nginx)       |
| `https://api.armytak.com` | Express API                  | `127.0.0.1:4000` |

Orders are accepted at `POST https://api.armytak.com/api/orders`; health check at
`GET https://api.armytak.com/health`. Both containers bind only to localhost —
Nginx terminates TLS and reverse-proxies to them.

### 0. DNS — create these A-records first

Point all hostnames at your VPS public IPv4 (and IPv6 if available). Do this
**before** running certbot so Let's Encrypt can validate the domains.

| Type   | Host / Name      | Value               | TTL  |
| ------ | ---------------- | ------------------- | ---- |
| `A`    | `@`  (armytak.com) | `YOUR_VPS_IPV4`     | 3600 |
| `A`    | `www`            | `YOUR_VPS_IPV4`     | 3600 |
| `A`    | `api`            | `YOUR_VPS_IPV4`     | 3600 |
| `AAAA` | `@` / `www` / `api` | `YOUR_VPS_IPV6`  | 3600 |

Verify propagation: `dig +short armytak.com` and `dig +short api.armytak.com`
should both return your VPS IP.

### 1. Prepare a clean Ubuntu 22.04/24.04 VPS

```bash
# Update the system
sudo apt update && sudo apt upgrade -y

# Base tooling
sudo apt install -y ca-certificates curl git ufw

# --- Install Docker Engine + Docker Compose plugin (official repo) ---
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Run docker without sudo (re-login afterwards)
sudo usermod -aG docker $USER

# --- Install Nginx + Certbot ---
sudo apt install -y nginx certbot python3-certbot-nginx

# --- Firewall: allow SSH + HTTP + HTTPS only ---
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

### 2. Clone the project and set environment variables

```bash
git clone https://github.com/<your-org>/armytak.git
cd armytak

# Frontend env (root .env)
cp .env.example .env
nano .env

# Backend env (server/.env)
cp server/.env.example server/.env
nano server/.env
```

Root `.env` (frontend — baked into the client bundle at build time):

```env
NEXT_PUBLIC_API_URL=https://api.armytak.com
NEXT_PUBLIC_SITE_URL=https://armytak.com
```

`server/.env` (backend — fill the blanks on the server, never commit it).
Generate the secret with `openssl rand -base64 48`:

```env
PORT=4000
NODE_ENV=production
CORS_ORIGINS=https://armytak.com,https://www.armytak.com
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
ORDER_NOTIFICATION_FROM="ARMYTAK <orders@armytak.com>"
ORDER_NOTIFICATION_TO=
JWT_SECRET=
```

> Never paste real SMTP passwords, JWT secrets, or SSH keys into the repository.
> They live only in `server/.env` on the VPS (git-ignored).

### 3. Build and start the stack

```bash
docker compose up -d --build
docker compose ps          # both armytak-web and armytak-api should be "running"
```

### 4. Install the Nginx site configs

```bash
sudo cp nginx/armytak-web.conf      /etc/nginx/sites-available/
sudo cp server/nginx/army-api.conf  /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/armytak-web.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/army-api.conf    /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### 5. Issue SSL certificates with Certbot

```bash
sudo certbot --nginx -d armytak.com -d www.armytak.com
sudo certbot --nginx -d api.armytak.com
sudo systemctl reload nginx

# Confirm the auto-renew timer is active
sudo systemctl status certbot.timer
```

### 6. Post-deployment checklist

```bash
# 1. Containers are up
docker compose ps              # armytak-web + armytak-api = running/healthy

# 2. Frontend responds
curl -I https://armytak.com    # HTTP/2 200

# 3. API health check
curl https://api.armytak.com/health        # {"status":"ok", ...}
```

4. **Place a test order** on `https://armytak.com` (checkout + buy-now).
5. **Check the admin email** arrived at `ORDER_NOTIFICATION_TO`.
6. **Confirm the durable backup** was written:
   ```bash
   docker compose exec backend tail -n 5 data/orders.jsonl
   ```
7. **Check backend logs** for errors: `docker compose logs --tail=100 backend`
8. **Verify SSL** is valid (padlock in browser) or:
   ```bash
   curl -Iv https://api.armytak.com/health 2>&1 | grep -i "SSL certificate verify ok"
   ```
9. **Verify auto-restart after reboot** (`restart: unless-stopped` is set):
   ```bash
   sudo reboot
   # after reconnecting:
   docker compose ps             # containers should be running again
   ```

### 7. Viewing logs

The `docker-compose.yml` service names are `frontend` and `backend`:

```bash
docker compose logs -f frontend
docker compose logs -f backend
```

### 8. Updating the site from GitHub

```bash
cd ~/armytak
git pull
docker compose up -d --build
```

Order notifications are emailed to `ORDER_NOTIFICATION_TO` and also appended to
`server/data/orders.jsonl` (git-ignored) as a durable backup. Totals are always
recalculated server-side from `server/src/data/products.ts`, so client-submitted
prices are never trusted.
