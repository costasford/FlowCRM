# Self-hosting the FlowCRM backend on a $5/mo VPS

The frontend stays exactly where it is (GitHub Pages, free). Only the API +
Postgres move off Railway onto a VPS you control, via Docker Compose + Caddy
(Caddy handles HTTPS certificates automatically).

## 1. Get a VPS

Any provider works; Hetzner CX22 (~€4/mo) or a DigitalOcean/Linode $6/mo
droplet are both fine. Pick Ubuntu 22.04 or later, smallest size available.

## 2. Point a domain at it (or skip DNS entirely)

- **You own a domain**: add an A record, e.g. `api.yourdomain.com` -> the
  VPS's IP address.
- **You don't**: use `<VPS_IP>.sslip.io` as the domain instead (e.g.
  `203.0.113.5.sslip.io`). It resolves to the embedded IP automatically -
  no DNS setup, and Caddy can still get it a real Let's Encrypt certificate.

## 3. Install Docker on the VPS

```bash
curl -fsSL https://get.docker.com | sh
```

## 4. Copy the repo over and configure secrets

```bash
git clone https://github.com/costasford/FlowCRM.git
cd FlowCRM
cp .env.example .env
nano .env   # fill in POSTGRES_PASSWORD, JWT_SECRET, API_DOMAIN, ACME_EMAIL
```

Generate strong random values instead of typing your own:

```bash
openssl rand -base64 32   # use for POSTGRES_PASSWORD
openssl rand -base64 32   # use for JWT_SECRET
```

## 5. Start everything

```bash
docker compose up -d --build
```

This builds the backend image, starts Postgres, runs migrations on
container start (`npm start` runs `migrate` first), and Caddy requests a
TLS cert for `API_DOMAIN` on first request.

Seed sample data (contacts/companies/deals + the demo login accounts)
once, after the stack is up:

```bash
docker compose exec backend npm run seed
```

## 6. Verify

```bash
curl https://api.yourdomain.com/health
```

Should return `{"status":"OK", ...}`.

## 7. Point the frontend at the new API and redeploy to GitHub Pages

Edit `frontend/package.json` - the `build:production` script currently
targets the old Railway URL:

```json
"build:production": "set \"VITE_API_URL=https://api.yourdomain.com/api\" && vite build",
```

Then, from `frontend/`:

```bash
npm run build:production
npm run deploy
```

## Day-2 operations

- **Logs**: `docker compose logs -f backend`
- **Update after a code change**: `git pull && docker compose up -d --build`
- **Backups**: the Postgres data lives in the `db_data` Docker volume. Cheapest
  safety net is a cron job piping `docker compose exec -T db pg_dump -U flowcrm flowcrm`
  to a file, copied off the box periodically (e.g. rclone to cloud storage).
- **OS updates**: `apt update && apt upgrade` periodically - this is the
  tradeoff of self-hosting versus a managed platform.
