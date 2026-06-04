import type { Job } from "bullmq";
import type { Db } from "@/lib/db";
import { processAuditRun } from "@/audit/processor";
import type { AuditRunJobPayload } from "@/lib/queue/queues";

export async function handleAuditRunJob(
  db: Db,
  job: Job<AuditRunJobPayload>
): Promise<void> {
  await processAuditRun(db, job.data.runId);
}
