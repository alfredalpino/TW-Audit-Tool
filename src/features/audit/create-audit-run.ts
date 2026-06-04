import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { audits, auditRuns } from "@/lib/db/schema";
import { enqueueAuditRun } from "@/lib/queue/client";
import { normalizeAuditUrl, assertPublicUrl } from "@/lib/url";
import { seedMockRun } from "@/lib/audit/mock-store";
import type { CreateAuditInput } from "@/lib/validations/audit";

export type CreateAuditResult =
  | {
      ok: true;
      auditId: string;
      runId: string;
      status: "queued" | "completed";
      pollUrl: string;
    }
  | { ok: false; error: string };

export async function createAuditRun(
  input: CreateAuditInput
): Promise<CreateAuditResult> {
  try {
    assertPublicUrl(input.url);
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Invalid URL",
    };
  }

  const normalized = normalizeAuditUrl(input.url);
  const db = getDb();

  if (!db) {
    const runId = crypto.randomUUID();
    const auditId = crypto.randomUUID();
    seedMockRun(runId, input.url, auditId);
    return {
      ok: true,
      auditId,
      runId,
      status: "queued",
      pollUrl: `/api/audits/${runId}`,
    };
  }

  let audit = await db.query.audits.findFirst({
    where: eq(audits.normalizedUrl, normalized),
  });

  if (!audit) {
    const [inserted] = await db
      .insert(audits)
      .values({
        url: input.url,
        normalizedUrl: normalized,
        metadata: {},
      })
      .returning();
    audit = inserted;
  }

  const [run] = await db
    .insert(auditRuns)
    .values({
      auditId: audit.id,
      status: "queued",
      trigger: "public",
      config: {
        categories: input.categories,
        mobile: input.options?.mobile ?? true,
        desktop: input.options?.desktop ?? true,
      },
    })
    .returning();

  const enqueued = await enqueueAuditRun(run.id);

  if (!enqueued) {
    // Dev fallback: run real engines inline when Redis is unavailable
    void import("@/audit/processor")
      .then(({ processAuditRun }) => processAuditRun(db, run.id))
      .catch((err) => {
        console.error("[audit] inline processing failed", err);
      });
  }

  return {
    ok: true,
    auditId: audit.id,
    runId: run.id,
    status: "queued",
    pollUrl: `/api/audits/${run.id}`,
  };
}
