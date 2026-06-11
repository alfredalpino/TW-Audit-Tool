# Torpedo Website Intelligence Auditor

Production-grade website intelligence SaaS for **audit.torpedoweb.org**.

- **Blueprint:** [`PROJECT_BLUEPRINT.md`](./PROJECT_BLUEPRINT.md)
- **Product spec:** [`AudittoolPlan.md`](./AudittoolPlan.md)
- **Brand tokens:** [`DESIGN-GUIDE.md`](./DESIGN-GUIDE.md)

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), enter a URL, and view the audit dashboard.

### Database (local PostgreSQL only)

Development uses **plain PostgreSQL** — no Supabase or other BaaS. Drizzle ORM talks to Postgres via the `postgres` driver and `DATABASE_URL`.

**Canonical dev setup** (`docker-compose.yml` provides Postgres 16):

```bash
cp .env.example .env.local   # DATABASE_URL matches compose defaults
npm run db:up                # docker compose up -d
npm run db:push              # apply schema (audits, leads, email_logs, etc.)
npm run dev                  # polls process audits when AUDIT_USE_FETCH=true
```

Or point `DATABASE_URL` at your own local Postgres (same URL shape: `postgresql://user:pass@localhost:5432/tw_audit`). Create the database once if it does not exist: `CREATE DATABASE tw_audit;`

Optional: `npm run db:studio` opens Drizzle Studio; `npm run db:down` stops containers.

Without `DATABASE_URL`, audits use in-memory mock data. With Postgres, `POST /api/audits` inserts `status=queued` and returns a poll URL — `GET /api/audits/[runId]` claims and runs the fetch/Cheerio pipeline (set `AUDIT_USE_FETCH=true` locally; automatic on Vercel).

Optional: `npm run worker` in a second terminal for Playwright + Lighthouse + axe (not needed for production).

## Deployment (Vercel + Supabase)

| Service | Role |
|---------|------|
| **Vercel** | Next.js app — API, UI, and audit processing (fetch/Cheerio on poll) |
| **Supabase** | Postgres database only (`DATABASE_URL` pooler port 6543 on Vercel) |

No separate worker deployment is required. Clients poll `GET /api/audits/[runId]`; the first poll claims the run and processes it serverlessly (50s budget, 60s `maxDuration`).

Optional: deploy [`worker/`](./worker/README.md) on Render for Playwright/Lighthouse — do not run alongside Vercel processing on the same database.

## Phase 2 capabilities

| Area | Status |
|------|--------|
| SEO / technical / UX / CRO / security / AI readiness heuristics | Playwright DOM |
| Speed | Lighthouse (mobile/desktop from audit config) |
| Accessibility | axe-core via Playwright |
| Vercel inline processing | `GET /api/audits/[runId]` (fetch/Cheerio) |
| Optional DB worker | `npm run worker` (Playwright/Lighthouse) |
| Dashboard polling + stage progress | `GET /api/audits/[runId]` |
| Executive summary + priority matrix | Audit results page |
| Lead capture + gated findings | `POST /api/leads` |
| Rate limiting | IP + per-domain (in-memory) |
| Screenshots | Desktop capture to `SCREENSHOT_STORAGE_PATH` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm run db:up` | Start Postgres (`docker compose up -d`) |
| `npm run db:down` | Stop Docker services |
| `npm run db:push` | Push Drizzle schema to local Postgres |
| `npm run db:studio` | Drizzle Studio (inspect tables) |
| `npm run worker` | Optional audit worker (Playwright/Lighthouse) |
| `npm run worker:stub` | Same optional worker entry (alias) |

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind 4 · PostgreSQL · Drizzle ORM · Playwright · Lighthouse · axe-core

## Phase 3 capabilities

| Area | Status |
|------|--------|
| Business impact ranges | Central formatters; UI, API, PDF, email |
| PDF export | `GET /api/audits/[runId]/report` (after email unlock) |
| Email delivery | Resend + PDF attachment on `POST /api/leads` |
| `email_logs` table | Drizzle schema (push/migrate) |

### Email (Resend) — shared across Torpedo apps

See **[docs/EMAIL_SETUP.md](./docs/EMAIL_SETUP.md)** for domain verification, env vars, and enabling email on the main site, offer page, and this audit tool with one Resend account.

| App | From address (example) | Template purpose |
|-----|------------------------|------------------|
| Main site | `BOOKING_FROM_EMAIL` e.g. `hello@invite.torpedoweb.org` | Contact, booking, OTP |
| Offer page | `BOOKING_FROM_EMAIL` e.g. `hello@torpedoweb.org` | Audit request form |
| Audit tool | `RESEND_FROM_EMAIL` e.g. `reports@audit.torpedoweb.org` | PDF report after unlock |

## Deferred (Phase 4+)

- S3 screenshot storage + mobile/tablet captures
- Upstash/Turnstile hardening, admin dashboard
- Compliance/mobile dedicated engines, vision UX
- Observability (Sentry, structured metrics)
