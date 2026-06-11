/**
 * OPTIONAL PostgreSQL-backed audit worker — polls audit_runs WHERE status='queued'.
 * Production uses Vercel inline processing; only run this for Playwright/Lighthouse.
 * Run locally: npm run worker
 * Deploy: optional Render background worker (see worker/README.md + render.yaml)
 */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { processAuditRun } from "../src/audit/processor";
import { postgresOptions } from "../src/lib/db/postgres-options";
import * as schema from "../src/lib/db/schema";
import { requireDatabaseUrl } from "../src/lib/env";
import { claimNextQueuedRun } from "../src/lib/queue/claim-queued-run";
import { createLogger } from "../src/lib/logger";

let databaseUrl: string;

try {
  databaseUrl = requireDatabaseUrl();
} catch (err) {
  console.error("[worker]", err instanceof Error ? err.message : err);
  process.exit(1);
}

const workerConcurrency = parseInt(process.env.WORKER_CONCURRENCY ?? "2", 10);
const pollIntervalMs = parseInt(process.env.WORKER_POLL_INTERVAL_MS ?? "2000", 10);
const workerCount =
  Number.isFinite(workerConcurrency) && workerConcurrency > 0 ? workerConcurrency : 2;

const sql = postgres(databaseUrl, {
  ...postgresOptions(databaseUrl),
  max: Math.max(workerCount + 2, 5),
});
const db = drizzle(sql, { schema });

let running = true;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processOne(workerId: number): Promise<boolean> {
  const runId = await claimNextQueuedRun(db);
  if (!runId) return false;

  const log = createLogger({ runId, component: "worker", workerId });
  log.info("audit run claimed");
  try {
    await processAuditRun(db, runId);
    log.info("audit run finished");
  } catch (err) {
    log.error("audit run processing failed", {
      error: err instanceof Error ? err.message : String(err),
    });
  }
  return true;
}

async function workerLoop(workerId: number): Promise<void> {
  while (running) {
    const hadWork = await processOne(workerId);
    if (!hadWork) {
      await sleep(pollIntervalMs);
    }
  }
}

console.info(
  `[worker] polling audit_runs (queued + stale running, concurrency=${workerCount}, poll=${pollIntervalMs}ms)`
);

void Promise.all(Array.from({ length: workerCount }, (_, i) => workerLoop(i + 1)));

async function shutdown(): Promise<void> {
  running = false;
  await sql.end();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());
