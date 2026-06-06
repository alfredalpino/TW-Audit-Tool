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
npm run dev                  # terminal 1
npm run worker               # terminal 2 — Playwright + Lighthouse + axe
```

Or point `DATABASE_URL` at your own local Postgres (same URL shape: `postgresql://user:pass@localhost:5432/tw_audit`). Create the database once if it does not exist: `CREATE DATABASE tw_audit;`

Optional: `npm run db:studio` opens Drizzle Studio; `npm run db:down` stops containers.

Without `DATABASE_URL`, audits use in-memory mock data. With Postgres, the API inserts `audit_runs` with `status=queued` and returns a poll URL — the worker processes the queue.

## Deployment (Vercel + Railway)

| Service | Role |
|---------|------|
| **Vercel** | Next.js API — creates queued `audit_runs`, serves polling + UI |
| **Railway** | Long-running worker — `npm run worker`, same `DATABASE_URL` (direct Postgres, port 5432) |

The API never runs Playwright/Lighthouse on Vercel. Clients poll `GET /api/audits/[runId]` until the Railway worker marks the run complete.

## Phase 2 capabilities

| Area | Status |
|------|--------|
| SEO / technical / UX / CRO / security / AI readiness heuristics | Playwright DOM |
| Speed | Lighthouse (mobile/desktop from audit config) |
| Accessibility | axe-core via Playwright |
| DB-backed worker | `npm run worker` (polls `audit_runs`) |
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
| `npm run worker` | Audit worker (real engines, DB queue) |
| `npm run worker:stub` | Same worker entry (alias) |

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
