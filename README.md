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

## Production deployment (OVHcloud)

1. Point DNS: `armytak.com`/`www.armytak.com` and `api.armytak.com` at the server.
2. Set environment values:
   - root `.env`: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`
   - `server/.env`: `NODE_ENV=production`, a strong `JWT_SECRET`, SMTP creds,
     and `CORS_ORIGINS=https://armytak.com`.
3. Build and start both services:
   ```bash
   docker compose up -d --build
   ```
4. Install the Nginx site configs and provision TLS:
   ```bash
   sudo cp nginx/armytak-web.conf /etc/nginx/sites-available/
   sudo cp server/nginx/army-api.conf /etc/nginx/sites-available/
   sudo ln -s /etc/nginx/sites-available/armytak-web.conf /etc/nginx/sites-enabled/
   sudo ln -s /etc/nginx/sites-available/army-api.conf  /etc/nginx/sites-enabled/
   sudo certbot --nginx -d armytak.com -d www.armytak.com
   sudo certbot --nginx -d api.armytak.com
   sudo nginx -t && sudo systemctl reload nginx
   ```

Order notifications are emailed to `ORDER_NOTIFICATION_TO` and also appended to
`server/data/orders.jsonl` (git-ignored) as a durable backup. Totals are always
recalculated server-side from the catalog, so client-submitted prices are never
trusted.

## Final launch checklist

Run through these steps in order when going live on the OVH VPS:

1. **Fill in the root `.env`** — set `NEXT_PUBLIC_API_URL=https://api.armytak.com`
   and `NEXT_PUBLIC_SITE_URL=https://armytak.com`.
2. **Fill in `server/.env`** — set `NODE_ENV=production`, a strong `JWT_SECRET`
   (`openssl rand -base64 32`), the `SMTP_*` credentials,
   `ORDER_NOTIFICATION_TO`, and `CORS_ORIGINS=https://armytak.com`.
3. **Configure DNS A-records** — point `armytak.com` (and `www`) and
   `api.armytak.com` at the VPS public IP; wait for propagation.
4. **Build and start the stack** — from the project root run
   `docker compose up -d --build` and confirm both containers are healthy.
5. **Configure Nginx** — copy `nginx/armytak-web.conf` and
   `server/nginx/army-api.conf` into `/etc/nginx/sites-available/`, enable them
   with symlinks, then `sudo nginx -t && sudo systemctl reload nginx`.
6. **Issue SSL with certbot** — `sudo certbot --nginx -d armytak.com -d www.armytak.com`
   and `sudo certbot --nginx -d api.armytak.com`.
7. **Verify the API health endpoint** — open `https://api.armytak.com/health`
   and confirm it returns an OK response.
8. **Place a test order** — complete a real checkout (and a buy-now order) on
   `https://armytak.com`.
9. **Confirm the notification email** — verify the order email arrived at
   `ORDER_NOTIFICATION_TO`.
10. **Confirm the durable backup** — check that the order was written to
    `server/data/orders.jsonl` (e.g. `docker compose exec api tail -n 5 data/orders.jsonl`).
