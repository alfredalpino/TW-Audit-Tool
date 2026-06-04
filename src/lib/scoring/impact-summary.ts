import type { AuditRunSummary } from "@/lib/db/schema";
import type { AuditFindingInput } from "@/audit/types";
import type { FindingCategory } from "@/types/audit";
import {
  formatPercentRange,
  formatRevenueRange,
  sanitizeBusinessImpactText,
} from "@/lib/scoring/format-impact";

export function buildImpactSummary(
  categoryScores: Partial<Record<FindingCategory, number>>,
  findings: AuditFindingInput[]
): AuditRunSummary["impact"] {
  const critical = findings.filter((f) => f.severity === "critical").length;
  const high = findings.filter((f) => f.severity === "high").length;
  const seo = categoryScores.seo ?? 100;
  const speed = categoryScores.speed ?? 100;
  const cro = categoryScores.cro ?? 100;
  const a11y = categoryScores.accessibility ?? 100;

  const trafficLabel =
    seo < 60 || speed < 60 ? "Elevated" : seo < 75 || speed < 75 ? "Moderate" : "Low";
  const trafficRange =
    seo < 60
      ? formatPercentRange(12, 22)
      : seo < 75
        ? formatPercentRange(8, 15)
        : speed < 70
          ? formatPercentRange(5, 10)
          : null;

  const leadLabel = cro < 60 ? "Elevated" : cro < 75 ? "Moderate" : "Low";
  const leadRange =
    cro < 60
      ? formatPercentRange(15, 30)
      : cro < 75
        ? formatPercentRange(10, 20)
        : null;

  const conversionLabel =
    a11y < 55 || critical > 0 ? "Elevated" : a11y < 70 ? "Moderate" : "Low";
  const conversionRange =
    critical > 0
      ? formatPercentRange(8, 18)
      : a11y < 70
        ? formatPercentRange(5, 12)
        : null;

  const issueCount = critical + high;
  const revenueLabel = issueCount >= 3 ? "Significant" : issueCount >= 1 ? "Moderate" : "Low";
  const revenueRange =
    issueCount >= 3
      ? formatRevenueRange(3, 12)
      : issueCount >= 1
        ? formatRevenueRange(1, 5)
        : null;

  const ai = categoryScores.ai_readiness ?? 100;
  const growthLabel = ai < 50 ? "High" : ai < 70 ? "Moderate" : "Emerging";
  const growthNarrative =
    ai < 50
      ? "Structured data and semantic gaps limit visibility in AI-assisted discovery."
      : "Solid foundation with room to optimize for AI search surfaces.";

  return {
    trafficLoss: {
      label: trafficLabel,
      range: trafficRange,
      narrative:
        "SEO and Core Web Vitals signals affect organic visibility and bounce-driven traffic loss.",
    },
    leadLoss: {
      label: leadLabel,
      range: leadRange,
      narrative:
        "CRO friction (CTAs, forms, trust) correlates with fewer qualified form starts.",
    },
    conversionLoss: {
      label: conversionLabel,
      range: conversionRange,
      narrative:
        "Accessibility and UX friction add drop-off before visitors complete key actions.",
    },
    revenueLeakage: {
      label: revenueLabel,
      range: revenueRange,
      narrative:
        "Estimated monthly opportunity if priority issues are fixed — indicative range only.",
    },
    growthOpportunity: {
      label: growthLabel,
      range: null,
      narrative: growthNarrative,
    },
  };
}

export function buildExecutiveSummary(
  overallScore: number,
  findings: AuditFindingInput[],
  url: string
): string {
  const critical = findings.filter((f) => f.severity === "critical").length;
  const high = findings.filter((f) => f.severity === "high").length;
  const topIssue = [...findings].sort((a, b) => {
    const rank = (s: string) =>
      s === "critical" ? 4 : s === "high" ? 3 : s === "medium" ? 2 : 1;
    return rank(b.severity) - rank(a.severity);
  })[0];

  const health =
    overallScore >= 80
      ? "strong"
      : overallScore >= 65
        ? "moderate"
        : overallScore >= 50
          ? "at risk"
          : "critical";

  const issueLine =
    critical + high > 0
      ? `${critical + high} high-priority issue${critical + high === 1 ? "" : "s"} need attention`
      : "no critical blockers detected in this pass";

  const focus = topIssue
    ? `Top focus: ${topIssue.title} (${topIssue.category}).`
    : "";

  return `Torpedo Intelligence scored ${url} at ${overallScore}/100 — overall health is ${health}. ${issueLine}. ${focus}`.trim();
}

/** Normalize finding business-impact copy to range-friendly language. */
export function normalizeFindingBusinessImpact(text: string): string {
  return sanitizeBusinessImpactText(text);
}
