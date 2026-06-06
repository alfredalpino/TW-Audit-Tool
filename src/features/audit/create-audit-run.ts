import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { audits, auditRuns } from "@/lib/db/schema";
import { normalizeAuditUrl, assertPublicUrl } from "@/lib/url";
import { seedMockRun } from "@/lib/audit/mock-store";
import {
  buildAuditRunConfig,
  findCachedAuditRun,
} from "@/lib/audit/cache";
import { createLogger } from "@/lib/logger";
import type { CreateAuditInput } from "@/lib/validations/audit";

export type CreateAuditResult =
  | {
      ok: true;
      auditId: string;
      runId: string;
      status: "queued" | "completed";
      pollUrl: string;
      cached?: boolean;
    }
  | { ok: false; error: string };

export type CreateAuditOptions = {
  trigger?: "public" | "api";
  skipCache?: boolean;
};

export async function createAuditRun(
  input: CreateAuditInput,
  options: CreateAuditOptions = {}
): Promise<CreateAuditResult> {
  const trigger = options.trigger ?? "public";
  const config = buildAuditRunConfig(input);

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
    const log = createLogger({ runId, component: "audit.create", trigger });
    log.info("audit run created (no database)", { url: input.url, normalized });
    seedMockRun(runId, input.url, auditId);
    return {
      ok: true,
      auditId,
      runId,
      status: "queued",
      pollUrl: `/api/audits/${runId}`,
    };
  }

  if (!options.skipCache) {
    const cached = await findCachedAuditRun(db, normalized, config);
    if (cached) {
      const log = createLogger({
        runId: cached.runId,
        component: "audit.create",
        trigger,
      });
      log.info("audit cache hit", {
        auditId: cached.auditId,
        normalized,
      });
      return {
        ok: true,
        auditId: cached.auditId,
        runId: cached.runId,
        status: "completed",
        pollUrl: `/api/audits/${cached.runId}`,
        cached: true,
      };
    }
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
      trigger,
      config,
    })
    .returning();

  const log = createLogger({
    runId: run.id,
    auditId: audit.id,
    component: "audit.create",
    trigger,
  });
  log.info("audit run queued for worker", { url: input.url, normalized });

  return {
    ok: true,
    auditId: audit.id,
    runId: run.id,
    status: "queued",
    pollUrl: `/api/audits/${run.id}`,
  };
}
