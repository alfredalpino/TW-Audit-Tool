import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { auditRuns } from "@/lib/db/schema";
import type { AuditRunResponse } from "@/types/audit";
import { getMockAuditRun } from "@/lib/audit/mock-store";
import { isRunUnlocked } from "@/features/leads/create-lead";
import type { AuditRunSummary } from "@/lib/db/schema";
import type { FindingDto } from "@/types/audit";
import { normalizeFindingBusinessImpact } from "@/lib/scoring/impact-summary";

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

  const run = await db.query.auditRuns.findFirst({
    where: eq(auditRuns.id, runId),
    with: {
      audit: true,
      scores: true,
      findings: true,
    },
  });

  if (!run) return null;

  const summary = run.summary as AuditRunSummary | null;
  const impact = summary?.impact ?? {};
  const unlocked = await isRunUnlocked(runId);

  const findingsDto: FindingDto[] = run.findings.map((f) => ({
    id: f.id,
    category: f.category,
    severity: f.severity,
    title: f.title,
    description: f.description,
    recommendation: f.recommendation,
    businessImpact: normalizeFindingBusinessImpact(f.businessImpact),
    priorityScore: f.priorityScore,
  }));

  return {
    id: run.id,
    auditId: run.auditId,
    status: run.status,
    stage: summary?.stage,
    url: run.audit.url,
    overallScore: run.overallScore,
    executiveSummary: summary?.executiveSummary ?? null,
    unlocked,
    scores: run.scores.map((s) => ({
      category: s.category,
      score: s.score,
    })),
    impact,
    findings: gateFindings(findingsDto, unlocked),
    enginesCompleted: summary?.enginesCompleted,
    createdAt: run.createdAt.toISOString(),
    completedAt: run.completedAt?.toISOString() ?? null,
  };
}
