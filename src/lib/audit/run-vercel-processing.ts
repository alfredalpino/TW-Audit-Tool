import type { Db } from "@/lib/db";
import { createLogger } from "@/lib/logger";
import { claimQueuedRunById } from "@/lib/queue/claim-queued-run";

export function shouldProcessOnVercel(): boolean {
  return process.env.VERCEL === "1";
}

/** Run the fetch-based audit pipeline on Vercel (serverless-safe). */
export async function runVercelAuditProcessing(
  db: Db,
  runId: string,
  options: { claim?: boolean } = {}
): Promise<"completed" | "failed" | "skipped"> {
  const log = createLogger({ runId, component: "audit.vercel" });

  if (options.claim) {
    const claimed = await claimQueuedRunById(db, runId);
    if (!claimed) {
      return "skipped";
    }
  }

  try {
    const { processAuditRun } = await import("@/audit/processor");
    await processAuditRun(db, runId);
    log.info("audit processing finished");
    return "completed";
  } catch (error) {
    log.error("audit processing failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return "failed";
  }
}
