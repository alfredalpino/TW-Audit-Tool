# TW Audit Worker (optional)

> **Not required for production.** The live app on Vercel processes audits inline on poll (`GET /api/audits/[runId]`) using the fetch/Cheerio pipeline. Supabase is database-only.

This folder is for an **optional** background worker that polls Supabase Postgres for `audit_runs` with `status = 'queued'`, then runs the full **Playwright**, **Lighthouse**, and **axe-core** pipeline when you need browser-grade audits outside Vercel's serverless limits.

## Default architecture (Vercel-only)

```
User → Vercel (Next.js)
         POST /api/audits → audit_runs (queued)
         GET /api/audits/:id → claim + fetch/Cheerio pipeline → completed
              ↓
         Supabase Postgres (database only)
```

No Render worker, no `AUDIT_DELEGATE_TO_WORKER`, no second deployment.

## Optional worker architecture

Only deploy this if you explicitly want Playwright/Lighthouse instead of the Vercel fetch pipeline. **Do not** run both against the same database.

```
User → Vercel (Next.js) → POST /api/audits → audit_runs (queued)
              ↓
    Optional Render worker polls DB
              ↓
    Playwright + Lighthouse + axe → completed
```

## Deploy on Render (optional)

### Option A — Blueprint

1. Push this repo to GitHub.
2. In [Render](https://render.com) → **New** → **Blueprint**.
3. Connect your fork of `TW-Audit-Tool`.
4. Render reads [`render.yaml`](../render.yaml) and creates **`tw-audit-worker`**.
5. In the worker service → **Environment**, set secrets:
   - `DATABASE_URL` — Supabase **direct** Postgres URI (**port 5432**), not the Vercel pooler (6543).
   - `NEXT_PUBLIC_SUPABASE_URL` — same project as Vercel.
   - `SUPABASE_SERVICE_ROLE_KEY` — for screenshot uploads to bucket `audit-screenshots` (optional).

6. **Do not** enable Vercel inline processing if using this worker (avoid running both).

### Option B — Manual worker service

1. **New** → **Background Worker**.
2. **Source**: this GitHub repo.
3. **Runtime**: Docker.
4. **Dockerfile path**: `worker/Dockerfile`
5. **Docker context**: `.` (repository root)
6. Add environment variables from [`worker/.env.example`](./.env.example).

## Environment variables

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | Yes | Direct Supabase Postgres `db.<ref>.supabase.co:5432` |
| `WORKER_CONCURRENCY` | No | Default `2` parallel audits |
| `WORKER_POLL_INTERVAL_MS` | No | Default `2000` |
| `AUDIT_USE_MOCK` | No | Keep `false` in production |
| `AUDIT_USE_FETCH` | No | Keep `false` on worker (browser pipeline) |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Screenshot storage |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Screenshot storage |

**Do not set** `VERCEL=1` or `AUDIT_USE_FETCH=true` on the worker.

## Local development

**Without worker (matches Vercel):** set `AUDIT_USE_FETCH=true` in `.env` and use `npm run dev` — polls process audits inline.

**With worker (full browser pipeline):**

```bash
# Use direct DATABASE_URL (5432) in .env
npm run worker
```

Production-style (env from shell/Render):

```bash
npm run worker:prod
```

## Files in this folder

| File | Purpose |
|------|---------|
| `Dockerfile` | Render Docker build (Playwright + Chromium) |
| `start.sh` | Container entrypoint, env validation |
| `.env.example` | Template for Render dashboard |
| `README.md` | This guide |

Root [`render.yaml`](../render.yaml) defines the optional Render Blueprint service.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Audits stay `queued` on Vercel | Check `DATABASE_URL` (pooler 6543) on Vercel; confirm `VERCEL=1` is set by platform |
| Audits stay `queued` with optional worker | Check worker logs; verify `DATABASE_URL` is direct 5432 |
| Duplicate/racing processing | Do not run Vercel inline processing and optional worker on the same DB |
| Worker crashes on launch | Ensure Docker plan has enough RAM (Playwright needs ~1GB+) |
| Pooler errors on worker | Worker must not use transaction pooler URL |

## Scaling

Increase `WORKER_CONCURRENCY` or run multiple worker instances. Claiming uses `FOR UPDATE SKIP LOCKED` so instances do not double-process the same run.
