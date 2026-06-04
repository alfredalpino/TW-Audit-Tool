import type { AuditRunResponse } from "@/types/audit";

const memoryRuns = new Map<string, AuditRunResponse>();

export function seedMockRun(
  runId: string,
  url: string,
  auditId: string
): AuditRunResponse {
  const dto: AuditRunResponse = {
    id: runId,
    auditId,
    status: "queued",
    stage: "queued",
    url,
    overallScore: null,
    executiveSummary: null,
    unlocked: false,
    scores: [],
    impact: {},
    findings: [],
    createdAt: new Date().toISOString(),
  };
  memoryRuns.set(runId, dto);
  setTimeout(() => completeMockRun(runId), 1200);
  return dto;
}

function completeMockRun(runId: string) {
  const existing = memoryRuns.get(runId);
  if (!existing) return;
  memoryRuns.set(runId, {
    ...existing,
    status: "completed",
    stage: "complete",
    executiveSummary:
      "Torpedo Intelligence scored this site at 68/100 — moderate health with SEO and accessibility gaps to address first.",
    unlocked: false,
    overallScore: 68,
    scores: [
      { category: "seo", score: 68 },
      { category: "speed", score: 74 },
      { category: "ux", score: 71 },
      { category: "cro", score: 62 },
      { category: "technical", score: 78 },
      { category: "accessibility", score: 55 },
      { category: "security", score: 82 },
      { category: "ai_readiness", score: 48 },
    ],
    impact: {
      trafficLoss: {
        label: "Moderate",
        range: "8–15%",
        narrative: "SEO and speed signals suggest visibility risk.",
      },
      leadLoss: {
        label: "Elevated",
        range: "10–25%",
        narrative: "Mobile CTA friction may suppress form starts.",
      },
      revenueLeakage: {
        label: "Opportunity",
        range: "$2k–$8k/mo",
        narrative: "Estimated monthly opportunity if issues are fixed.",
      },
      growthOpportunity: {
        label: "High",
        narrative: "AI readiness gaps limit emerging search visibility.",
      },
    },
    findings: [
      {
        id: "mock-1",
        category: "seo",
        severity: "high",
        title: "Missing or weak meta description",
        description:
          "The homepage lacks a compelling meta description for search snippets.",
        recommendation: "Add a unique 150–160 character meta description.",
        businessImpact:
          "Lower CTR from search can reduce qualified traffic by an estimated 8–15%.",
        priorityScore: 85,
      },
      {
        id: "mock-2",
        category: "accessibility",
        severity: "critical",
        title: "Insufficient color contrast on CTAs",
        description: "Primary buttons may fail WCAG AA contrast.",
        recommendation: "Raise contrast to at least 4.5:1.",
        businessImpact:
          "Compliance exposure and excluded users reduce conversions and trust.",
        priorityScore: 92,
      },
    ],
    completedAt: new Date().toISOString(),
  });
}

export function getMockAuditRun(runId: string): AuditRunResponse | null {
  return memoryRuns.get(runId) ?? null;
}
