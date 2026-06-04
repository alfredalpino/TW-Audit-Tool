import { eq } from "drizzle-orm";
import type { Db } from "@/lib/db";
import {
  auditRuns,
  auditScores,
  findings,
  reports,
} from "@/lib/db/schema";
import { computeOverallScore } from "@/lib/scoring/weights";
import type { FindingCategory } from "@/types/audit";

const MOCK_CATEGORY_SCORES: Record<FindingCategory, number> = {
  seo: 68,
  speed: 74,
  ux: 71,
  cro: 62,
  technical: 78,
  accessibility: 55,
  security: 82,
  compliance: 70,
  ai_readiness: 48,
  mobile: 66,
  screenshot: 100,
};

const MOCK_FINDINGS = [
  {
    category: "seo" as const,
    severity: "high" as const,
    title: "Missing or weak meta description",
    description:
      "The homepage lacks a compelling meta description, reducing click-through from search results.",
    recommendation:
      "Write a unique 150–160 character meta description with primary keyword and value proposition.",
    businessImpact:
      "Lower organic CTR can reduce qualified traffic by an estimated 8–15%, directly impacting lead volume from search.",
    priorityScore: 85,
  },
  {
    category: "speed" as const,
    severity: "medium" as const,
    title: "Largest Contentful Paint above recommended threshold",
    description:
      "LCP is likely above 2.5s on mobile, delaying first meaningful paint.",
    recommendation:
      "Optimize hero images, defer non-critical JS, and enable CDN caching.",
    businessImpact:
      "Each second of delay can increase bounce rate ~7%, leaking visitors before they convert.",
    priorityScore: 72,
  },
  {
    category: "accessibility" as const,
    severity: "critical" as const,
    title: "Insufficient color contrast on primary CTAs",
    description:
      "Several call-to-action elements may fail WCAG AA contrast requirements.",
    recommendation:
      "Increase contrast ratio to at least 4.5:1 for normal text on buttons.",
    businessImpact:
      "Accessibility gaps create compliance exposure and exclude users who cannot perceive low-contrast controls—reducing conversions and trust.",
    priorityScore: 92,
  },
  {
    category: "cro" as const,
    severity: "high" as const,
    title: "Primary CTA below the fold on mobile",
    description:
      "The main conversion action requires scrolling on common mobile viewports.",
    recommendation:
      "Place a sticky or above-the-fold primary CTA on mobile layouts.",
    businessImpact:
      "Hidden CTAs increase friction in the conversion path—often correlating with 10–25% fewer form starts on mobile.",
    priorityScore: 80,
  },
];

/** Phase 1: structured placeholder audit completion when DB is available. */
export async function processMockAuditRun(db: Db, runId: string): Promise<void> {
  const now = new Date();
  await db
    .update(auditRuns)
    .set({ status: "running", startedAt: now })
    .where(eq(auditRuns.id, runId));

  const scoreRows = Object.entries(MOCK_CATEGORY_SCORES)
    .filter(([cat]) =>
      ["seo", "speed", "ux", "cro", "technical", "accessibility", "security", "ai_readiness"].includes(
        cat
      )
    )
    .map(([category, score]) => ({
      auditRunId: runId,
      category: category as FindingCategory,
      score,
    }));

  await db.insert(auditScores).values(scoreRows);

  await db.insert(findings).values(
    MOCK_FINDINGS.map((f) => ({
      auditRunId: runId,
      ...f,
    }))
  );

  const overall = computeOverallScore(
    Object.fromEntries(
      scoreRows.map((r) => [r.category, r.score])
    ) as Partial<Record<FindingCategory, number>>
  );

  const summary = {
    mock: true,
    stage: "complete" as const,
    enginesCompleted: scoreRows.map((r) => r.category),
    executiveSummary: `Torpedo Intelligence scored ${overall}/100 on this URL (mock data — start Redis + worker for live Lighthouse and axe analysis). Priority issues include meta description, mobile CTA placement, and accessibility contrast.`,
    impact: {
      trafficLoss: {
        label: "Moderate",
        range: "8–15%",
        narrative: "SEO and speed signals suggest visibility and retention risk.",
      },
      leadLoss: {
        label: "Elevated",
        range: "10–25%",
        narrative: "CRO friction on mobile may suppress form starts.",
      },
      conversionLoss: {
        label: "Moderate",
        range: "5–12%",
        narrative: "UX and accessibility issues add conversion friction.",
      },
      revenueLeakage: {
        label: "Opportunity",
        range: "$2k–$8k/mo",
        narrative:
          "Estimated monthly opportunity if issues are addressed—range only, not a guarantee.",
      },
      growthOpportunity: {
        label: "High",
        range: null,
        narrative:
          "AI readiness and structured data gaps limit discoverability in emerging search surfaces.",
      },
    },
  };

  await db
    .update(auditRuns)
    .set({
      status: "completed",
      overallScore: overall,
      summary,
      completedAt: new Date(),
    })
    .where(eq(auditRuns.id, runId));

  await db.insert(reports).values({
    auditRunId: runId,
    status: "pending",
  });
}
