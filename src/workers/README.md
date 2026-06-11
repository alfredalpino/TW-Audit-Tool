# Workers (optional)

Production runs on **Vercel only**: `POST /api/audits` inserts a queued run, and `GET /api/audits/[runId]` claims and processes it with the fetch/Cheerio pipeline (no separate worker service).

The optional background worker in [`scripts/worker.ts`](../../scripts/worker.ts) polls Postgres for queued runs and runs the **Playwright + Lighthouse + axe** pipeline. Use it only if you need full browser audits outside Vercel serverless limits.

| Mode | When to use |
|------|-------------|
| **Vercel (default)** | Production on audit.torpedoweb.org — Supabase DB + Vercel processing |
| **Optional worker** | Render/Railway/local — see [`worker/`](../../worker/README.md) and [`render.yaml`](../../render.yaml) |

Do **not** run the optional worker alongside Vercel processing for the same database (duplicate claims/races).
