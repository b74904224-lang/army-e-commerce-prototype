# ARMYTAK API (OVHcloud backend)

External REST API that powers the ARMYTAK storefront: product catalog, order
intake (full checkout + quick "buy now"), and JWT authentication. Built with
Express + TypeScript, validated with Zod, secured with Helmet / CORS allow-list
/ rate limiting, and sends order notifications via Nodemailer.

## Endpoints

| Method | Path                 | Description                                  | Auth |
| ------ | -------------------- | -------------------------------------------- | ---- |
| GET    | `/health`            | Health check                                 | No   |
| GET    | `/api/products`      | Full product catalog (`Product[]`)           | No   |
| GET    | `/api/products/:id`  | Single product                               | No   |
| POST   | `/api/orders`        | Create an order (checkout or quick order)    | No   |
| POST   | `/api/auth/register` | Create account, returns `{ token, user }`    | No   |
| POST   | `/api/auth/login`    | Authenticate, returns `{ token, user }`      | No   |

Request/response shapes intentionally mirror the frontend contracts in
`lib/api.ts`. No card data is ever accepted — payment methods are limited to
`cod`, `bank_transfer`, and `manager_confirmation`.

## Local development

```bash
cd server
cp .env.example .env          # fill in JWT_SECRET (and SMTP if you want emails)
npm install
npm run dev                   # http://localhost:4000
```

With SMTP unset, order notifications are printed to the console instead of
being emailed.

## Build & run (production)

```bash
npm install
npm run build
npm start
```

## Docker

```bash
cd server
cp .env.example .env          # set production values
docker compose up -d --build
```

The container binds to `127.0.0.1:4000`; put Nginx in front for TLS.

## Nginx + TLS on OVHcloud

1. Copy `nginx/army-api.conf` to `/etc/nginx/sites-available/` and symlink it
   into `sites-enabled/` (adjust `server_name`).
2. `sudo certbot --nginx -d api.armytak.com` to provision Let's Encrypt TLS.
3. `sudo nginx -t && sudo systemctl reload nginx`.

## Environment variables

See `.env.example`. Key ones:

- `JWT_SECRET` — **required in production** (>= 32 chars). Generate with
  `openssl rand -base64 48`.
- `CORS_ORIGINS` — comma-separated list of allowed frontend origins
  (your Vercel URLs).
- `SMTP_*` / `ORDER_NOTIFICATION_*` — order email delivery.

## Connecting the frontend

On the Vercel project, set:

```
NEXT_PUBLIC_API_URL=https://api.armytak.com
```

The storefront then sends auth, orders, and product requests to this server.

## Production notes / next steps

The user and order stores are in-memory reference implementations
(`src/store/*.ts`). For real persistence, replace their function bodies with a
database (e.g. PostgreSQL on OVHcloud) — the route handlers do not need to
change.
