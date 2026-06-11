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
      status: "queued" | "completed" | "failed";
      pollUrl: string;
      cached?: boolean;
    }
  | { ok: false; error: string; code?: "database" | "validation" };

export type CreateAuditOptions = {
  trigger?: "public" | "api";
  skipCache?: boolean;
};

function formatDbError(error: unknown): string {
  if (error instanceof Error) {
    const parts = [error.message];
    if (error.cause instanceof Error) {
      parts.push(error.cause.message);
    }
    return parts.join(" | ");
  }
  return String(error);
}

function dbErrorMessage(error: unknown): { error: string; code: "database" } {
  const message = formatDbError(error);
  if (
    /ECONNREFUSED|ENOTFOUND|ETIMEDOUT|connect|Failed query|password authentication|timeout/i.test(
      message
    )
  ) {
    return {
      error: "Database is temporarily unavailable. Please try again.",
      code: "database",
    };
  }
  if (/relation .* does not exist|undefined_table/i.test(message)) {
    return {
      error: "Audit database is not initialized. Contact support.",
      code: "database",
    };
  }
  return {
    error: "Could not start audit. Please try again.",
    code: "database",
  };
}

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

  const log = createLogger({ component: "audit.create", trigger });

  try {
    if (!options.skipCache) {
      try {
        const cached = await findCachedAuditRun(db, normalized, config);
        if (cached) {
          const cacheLog = log.child({ runId: cached.runId });
          cacheLog.info("audit cache hit", {
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
      } catch (cacheError) {
        log.warn("audit cache lookup failed", {
          normalized,
          error:
            cacheError instanceof Error ? cacheError.message : String(cacheError),
        });
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

    const runLog = log.child({ runId: run.id, auditId: audit.id });
    runLog.info("audit run queued", { url: input.url, normalized });

    return {
      ok: true,
      auditId: audit.id,
      runId: run.id,
      status: "queued",
      pollUrl: `/api/audits/${run.id}`,
    };
  } catch (error) {
    log.error("audit run database error", {
      url: input.url,
      normalized,
      error: formatDbError(error),
    });
    return { ok: false, ...dbErrorMessage(error) };
  }
}
