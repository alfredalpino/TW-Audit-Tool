# Workers

The audit worker runs outside Vercel serverless (see `scripts/worker.ts`).

It polls `audit_runs` where `status = 'queued'`, claims rows with `FOR UPDATE SKIP LOCKED`, and runs the Playwright + Lighthouse pipeline.

**Deployment:** Vercel hosts the API (inserts queued runs only). Run `npm run worker` on Railway (or similar) with `DATABASE_URL` pointing at the same Postgres database.
