import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { auditRuns } from "@/lib/db/schema";
import type { AuditRunResponse } from "@/types/audit";
import { getMockAuditRun } from "@/lib/audit/mock-store";
import { isRunUnlocked } from "@/features/leads/create-lead";
import type { AuditRunSummary } from "@/lib/db/schema";
import type { FindingDto } from "@/types/audit";
import { normalizeFindingBusinessImpact } from "@/lib/scoring/impact-summary";
import { getAuditMethodology } from "@/lib/audit/methodology";

const GATE_PRIORITY_THRESHOLD = 75;

function gateFindings(
  findings: FindingDto[],
  unlocked: boolean
): FindingDto[] {
  if (unlocked) return findings;
  return findings.map((f) => {
    if (f.priorityScore >= GATE_PRIORITY_THRESHOLD) return f;
    return {
      ...f,
      description:
        "Unlock the full Torpedo report to see detailed analysis for this issue.",
      recommendation: null,
      businessImpact:
        "Submit your email below to view business impact and fix steps for lower-priority findings.",
      evidence: undefined,
    };
  });
}

export async function getAuditRun(
  runId: string
): Promise<AuditRunResponse | null> {
  const db = getDb();

  if (!db) {
    return getMockAuditRun(runId);
  }

  try {
    const run = await db.query.auditRuns.findFirst({
      where: eq(auditRuns.id, runId),
      with: {
        audit: {
          with: { organization: true },
        },
        scores: true,
        findings: true,
        screenshots: true,
      },
    });

    if (!run?.audit) return null;

    const screenshotRows = run.screenshots ?? [];

    const summary = run.summary as AuditRunSummary | null;
    const impact = summary?.impact ?? {};
    const unlocked = await isRunUnlocked(runId);

    const findingsDto: FindingDto[] = (run.findings ?? []).map((f) => ({
      id: f.id,
      category: f.category,
      severity: f.severity,
      title: f.title,
      description: f.description,
      recommendation: f.recommendation,
      businessImpact: normalizeFindingBusinessImpact(f.businessImpact ?? ""),
      priorityScore: f.priorityScore,
      evidence:
        Object.keys((f.evidence as Record<string, unknown>) ?? {}).length > 0
          ? (f.evidence as Record<string, unknown>)
          : undefined,
    }));

    return {
      id: run.id,
      auditId: run.auditId,
      status: run.status,
      errorMessage: run.errorMessage ?? undefined,
      stage: summary?.stage ?? (run.status === "queued" ? "queued" : undefined),
      url: run.audit.url,
      organizationId: run.audit.organizationId,
      organizationName: run.audit.organization?.name ?? null,
      overallScore: run.overallScore,
      executiveSummary: summary?.executiveSummary ?? null,
      unlocked,
      scores: (run.scores ?? []).map((s) => ({
        category: s.category,
        score: s.score,
        breakdown:
          Object.keys((s.breakdown as Record<string, unknown>) ?? {}).length > 0
            ? (s.breakdown as Record<string, unknown>)
            : undefined,
      })),
      impact,
      findings: gateFindings(findingsDto, unlocked),
      screenshots: screenshotRows.map((shot) => {
        const meta = (shot.annotations ?? {}) as Record<string, unknown>;
        return {
          viewport: shot.viewport,
          url: `/api/audits/${runId}/screenshots/${shot.viewport}`,
          width: typeof meta.width === "number" ? meta.width : undefined,
          height: typeof meta.height === "number" ? meta.height : undefined,
        };
      }),
      enginesCompleted: summary?.enginesCompleted,
      runtime: summary?.runtime,
      methodology: getAuditMethodology(summary?.runtime ?? "fetch"),
      createdAt: run.createdAt.toISOString(),
      completedAt: run.completedAt?.toISOString() ?? null,
    };
  } catch (error) {
    console.error("[getAuditRun] failed", { runId, error });
    throw error;
  }
}
