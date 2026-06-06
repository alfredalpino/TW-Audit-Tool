/**
 * PostgreSQL-backed audit worker — polls audit_runs WHERE status='queued'.
 * Run: npm run worker (requires DATABASE_URL)
 *
 * Deploy on Railway (or similar) alongside Vercel API — API enqueues rows;
 * this process claims and runs Playwright + Lighthouse + axe-core.
 */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { processAuditRun } from "../src/audit/processor";
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

const sql = postgres(databaseUrl, { max: 5 });
const db = drizzle(sql, { schema });

const concurrency = parseInt(process.env.WORKER_CONCURRENCY ?? "2", 10);
const pollIntervalMs = parseInt(process.env.WORKER_POLL_INTERVAL_MS ?? "2000", 10);
const workerCount = Number.isFinite(concurrency) && concurrency > 0 ? concurrency : 2;

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
  `[worker] polling audit_runs (status=queued, concurrency=${workerCount}, poll=${pollIntervalMs}ms)`
);

void Promise.all(
  Array.from({ length: workerCount }, (_, i) => workerLoop(i + 1))
);

async function shutdown(): Promise<void> {
  running = false;
  await sql.end();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());
