import { eq } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { auditRuns } from "@/lib/db/schema";
import type { AuditRunSummary, ImpactRange } from "@/lib/db/schema";
import type { FindingCategory, FindingSeverity } from "@/types/audit";
import { normalizeFindingBusinessImpact } from "@/lib/scoring/impact-summary";
import { formatImpactMetricDisplay } from "@/lib/scoring/format-impact";

export type AuditReportFinding = {
  category: FindingCategory;
  severity: FindingSeverity;
  title: string;
  description: string;
  recommendation: string | null;
  businessImpact: string;
  priorityScore: number;
};

export type AuditReportData = {
  runId: string;
  url: string;
  organizationId: string | null;
  organizationName: string | null;
  overallScore: number | null;
  executiveSummary: string | null;
  completedAt: string | null;
  scores: { category: string; score: number }[];
  impact: {
    trafficLoss?: ImpactRange;
    leadLoss?: ImpactRange;
    conversionLoss?: ImpactRange;
    revenueLeakage?: ImpactRange;
    growthOpportunity?: ImpactRange;
  };
  findings: AuditReportFinding[];
};

const IMPACT_KEYS = [
  ["trafficLoss", "Traffic risk"],
  ["leadLoss", "Lead leakage"],
  ["conversionLoss", "Conversion friction"],
  ["revenueLeakage", "Revenue opportunity"],
  ["growthOpportunity", "Growth opportunity"],
] as const;

export function formatImpactRows(
  impact: AuditReportData["impact"]
): { label: string; value: string; narrative?: string }[] {
  return IMPACT_KEYS.flatMap(([key, label]) => {
    const row = impact[key];
    if (!row) return [];
    return [
      {
        label,
        value: formatImpactMetricDisplay(row.label, row.range),
        narrative: row.narrative,
      },
    ];
  });
}

export async function loadAuditReportData(
  db: Db,
  runId: string,
  options?: { fullFindings?: boolean }
): Promise<AuditReportData | null> {
  const fullFindings = options?.fullFindings ?? true;

  const run = await db.query.auditRuns.findFirst({
    where: eq(auditRuns.id, runId),
    with: {
      audit: {
        with: { organization: true },
      },
      scores: true,
      findings: true,
    },
  });

  if (!run?.audit || run.status !== "completed") return null;

  const summary = (run.summary ?? {}) as AuditRunSummary;
  const sortedFindings = [...run.findings].sort(
    (a, b) => b.priorityScore - a.priorityScore
  );

  const findings: AuditReportFinding[] = sortedFindings.map((f) => ({
    category: f.category,
    severity: f.severity,
    title: f.title,
    description: f.description,
    recommendation: fullFindings ? f.recommendation : null,
    businessImpact: normalizeFindingBusinessImpact(f.businessImpact),
    priorityScore: f.priorityScore,
  }));

  return {
    runId: run.id,
    url: run.audit.url,
    organizationId: run.audit.organizationId,
    organizationName: run.audit.organization?.name ?? null,
    overallScore: run.overallScore,
    executiveSummary: summary.executiveSummary ?? null,
    completedAt: run.completedAt?.toISOString() ?? null,
    scores: run.scores.map((s) => ({
      category: s.category,
      score: s.score,
    })),
    impact: summary.impact ?? {},
    findings,
  };
}
