/**
 * Phase 2+: BullMQ worker entry. Phase 1 logs readiness only.
 * Run: npm run worker (requires REDIS_URL + DATABASE_URL)
 */
import { Worker } from "bullmq";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/lib/db/schema";
import { QUEUE_NAMES, type AuditRunJobPayload } from "../src/lib/queue/queues";
import { processAuditRun } from "../src/audit/processor";

const redisUrl = process.env.REDIS_URL;
const databaseUrl = process.env.DATABASE_URL;

if (!redisUrl || !databaseUrl) {
  console.error(
    "[worker-stub] REDIS_URL and DATABASE_URL required. Skipping worker start."
  );
  process.exit(1);
}

const sql = postgres(databaseUrl, { max: 5 });
const db = drizzle(sql, { schema });

const worker = new Worker<AuditRunJobPayload>(
  QUEUE_NAMES.AUDIT_RUN,
  async (job) => {
    console.info(`[audit:run] processing ${job.data.runId}`);
    await processAuditRun(db, job.data.runId);
  },
  {
    connection: { url: redisUrl, maxRetriesPerRequest: null },
    concurrency: 5,
  }
);

worker.on("completed", (job) => {
  console.info(`[audit:run] completed ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`[audit:run] failed ${job?.id}`, err);
});

console.info("[worker-stub] listening on queue:", QUEUE_NAMES.AUDIT_RUN);
