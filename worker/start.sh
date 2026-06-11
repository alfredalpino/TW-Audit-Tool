#!/usr/bin/env bash
set -euo pipefail

echo "[tw-audit-worker] starting Torpedo audit worker"

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "[tw-audit-worker] ERROR: DATABASE_URL is required."
  echo "  Use Supabase direct connection (port 5432), not the Vercel pooler (6543)."
  exit 1
fi

if [[ "${DATABASE_URL}" == *":6543"* ]] || [[ "${DATABASE_URL}" == *"pooler.supabase.com"* ]]; then
  echo "[tw-audit-worker] WARN: DATABASE_URL looks like a pooler URL."
  echo "  Worker should use direct Postgres: db.<project>.supabase.co:5432"
fi

export AUDIT_USE_FETCH="${AUDIT_USE_FETCH:-false}"
export AUDIT_USE_MOCK="${AUDIT_USE_MOCK:-false}"
export WORKER_CONCURRENCY="${WORKER_CONCURRENCY:-2}"
export WORKER_POLL_INTERVAL_MS="${WORKER_POLL_INTERVAL_MS:-2000}"

echo "[tw-audit-worker] concurrency=${WORKER_CONCURRENCY} poll=${WORKER_POLL_INTERVAL_MS}ms"

exec npx tsx scripts/worker.ts
