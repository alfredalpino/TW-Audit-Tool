import { and, desc, eq, gt } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { auditRuns, audits, type AuditRunConfig, type AuditRunSummary } from "@/lib/db/schema";
import type { CreateAuditInput } from "@/lib/validations/audit";

export const AUDIT_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export function buildAuditRunConfig(input: CreateAuditInput): AuditRunConfig {
  const categories = input.categories?.slice().sort();
  return {
    categories: categories?.length ? categories : undefined,
    mobile: input.options?.mobile ?? true,
    desktop: input.options?.desktop ?? true,
  };
}

function normalizeCategories(categories: string[] | undefined): string[] {
  return (categories ?? []).slice().sort();
}

export function auditConfigMatches(
  stored: AuditRunConfig | null | undefined,
  target: AuditRunConfig
): boolean {
  const a = stored ?? {};
  if ((a.mobile ?? true) !== (target.mobile ?? true)) return false;
  if ((a.desktop ?? true) !== (target.desktop ?? true)) return false;

  const storedCats = normalizeCategories(a.categories);
  const targetCats = normalizeCategories(target.categories);
  if (storedCats.length !== targetCats.length) return false;
  return storedCats.every((cat, i) => cat === targetCats[i]);
}

/** Returns a completed run for the same URL + config within the 24h TTL, if any. */
export async function findCachedAuditRun(
  db: Db,
  normalizedUrl: string,
  config: AuditRunConfig
): Promise<{ runId: string; auditId: string } | null> {
  const cutoff = new Date(Date.now() - AUDIT_CACHE_TTL_MS);

  const rows = await db
    .select({
      runId: auditRuns.id,
      auditId: auditRuns.auditId,
      config: auditRuns.config,
      summary: auditRuns.summary,
    })
    .from(auditRuns)
    .innerJoin(audits, eq(auditRuns.auditId, audits.id))
    .where(
      and(
        eq(audits.normalizedUrl, normalizedUrl),
        eq(auditRuns.status, "completed"),
        gt(auditRuns.completedAt, cutoff)
      )
    )
    .orderBy(desc(auditRuns.completedAt))
    .limit(10);

  for (const row of rows) {
    const summary = row.summary as AuditRunSummary | null;
    if (summary?.mock) continue;
    if (auditConfigMatches(row.config, config)) {
      return { runId: row.runId, auditId: row.auditId };
    }
  }

  return null;
}
