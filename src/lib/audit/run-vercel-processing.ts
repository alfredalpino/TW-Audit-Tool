import { eq } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { auditRuns } from "@/lib/db/schema";
import { createLogger } from "@/lib/logger";
import { claimQueuedRunById } from "@/lib/queue/claim-queued-run";

async function markRunFailed(db: Db, runId: string, message: string): Promise<void> {
  await db
    .update(auditRuns)
    .set({
      status: "failed",
      errorMessage: message,
      summary: {
        stage: "failed",
        mock: false,
        runtime: "fetch",
      },
      completedAt: new Date(),
    })
    .where(eq(auditRuns.id, runId));
}

/** True when GET poll should claim and run the fetch-based audit pipeline inline. */
export function shouldProcessOnVercel(): boolean {
  if (process.env.VERCEL === "1") return true;
  // Local dev without optional worker — set AUDIT_USE_FETCH=true in .env
  if (process.env.AUDIT_USE_FETCH === "true") return true;
  return false;
}

const PROCESSING_BUDGET_MS = 50_000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`${label} timed out after ${ms}ms`)),
      ms
    );
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
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
    await withTimeout(
      processAuditRun(db, runId),
      PROCESSING_BUDGET_MS,
      "audit processing"
    );
    log.info("audit processing finished");
    return "completed";
  } catch (error) {
    const message = error instanceof Error ? error.message : "Audit failed";
    log.error("audit processing failed", { error: message });
    try {
      await markRunFailed(db, runId, message);
    } catch (markError) {
      log.error("failed to mark run as failed", {
        error: markError instanceof Error ? markError.message : String(markError),
      });
    }
    return "failed";
  }
}
