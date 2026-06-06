/**
 * BullMQ audit worker — Playwright, Lighthouse, axe-core.
 * Run: npm run worker (requires REDIS_URL + DATABASE_URL)
 */
import { Worker } from "bullmq";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/lib/db/schema";
import { requireDatabaseUrl, requireRedisUrl } from "../src/lib/env";
import { QUEUE_NAMES, type AuditRunJobPayload } from "../src/lib/queue/queues";
import { handleAuditRunJob } from "../src/workers/audit-run-processor";

let redisUrl: string;
let databaseUrl: string;

try {
  redisUrl = requireRedisUrl();
  databaseUrl = requireDatabaseUrl();
} catch (err) {
  console.error("[worker]", err instanceof Error ? err.message : err);
  process.exit(1);
}

const sql = postgres(databaseUrl, { max: 5 });
const db = drizzle(sql, { schema });

const concurrency = parseInt(process.env.WORKER_CONCURRENCY ?? "2", 10);

const worker = new Worker<AuditRunJobPayload>(
  QUEUE_NAMES.AUDIT_RUN,
  async (job) => {
    console.info(`[audit:run] start ${job.data.runId}`);
    await handleAuditRunJob(db, job);
  },
  {
    connection: { url: redisUrl, maxRetriesPerRequest: null },
    concurrency: Number.isFinite(concurrency) ? concurrency : 2,
  }
);

worker.on("completed", (job) => {
  console.info(`[audit:run] done ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`[audit:run] failed ${job?.id}`, err);
});

console.info(
  `[worker] listening on ${QUEUE_NAMES.AUDIT_RUN} (concurrency=${concurrency})`
);

process.on("SIGINT", async () => {
  await worker.close();
  await sql.end();
  process.exit(0);
});
