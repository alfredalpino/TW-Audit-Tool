import { Queue } from "bullmq";
import { getRedisUrl } from "@/lib/env";
import {
  QUEUE_NAMES,
  type AuditRunJobPayload,
} from "./queues";

function getConnectionOptions() {
  const url = getRedisUrl();
  if (!url) return null;
  return {
    url,
    maxRetriesPerRequest: null as null,
  };
}

export function getAuditQueue(): Queue<AuditRunJobPayload> | null {
  const connection = getConnectionOptions();
  if (!connection) return null;
  return new Queue<AuditRunJobPayload>(QUEUE_NAMES.AUDIT_RUN, {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: 1000,
      removeOnFail: 5000,
    },
  });
}

export async function enqueueAuditRun(runId: string): Promise<boolean> {
  const queue = getAuditQueue();
  if (!queue) return false;
  await queue.add("run", { runId }, { jobId: runId });
  return true;
}
