import type { FindingCategory } from "@/types/audit";

export const CATEGORY_WEIGHTS: Record<FindingCategory, number> = {
  seo: 0.2,
  speed: 0.2,
  ux: 0.15,
  accessibility: 0.1,
  cro: 0.15,
  technical: 0.1,
  security: 0.05,
  compliance: 0,
  ai_readiness: 0.05,
  mobile: 0,
  screenshot: 0,
};

export const SEVERITY_DEDUCTIONS: Record<
  "critical" | "high" | "medium" | "low" | "info",
  number
> = {
  critical: 25,
  high: 15,
  medium: 8,
  low: 3,
  info: 0,
};

export function computeOverallScore(
  categoryScores: Partial<Record<FindingCategory, number>>
): number {
  let total = 0;
  let weightSum = 0;
  for (const [cat, weight] of Object.entries(CATEGORY_WEIGHTS)) {
    if (weight <= 0) continue;
    const score = categoryScores[cat as FindingCategory];
    if (score === undefined) continue;
    total += score * weight;
    weightSum += weight;
  }
  if (weightSum === 0) return 0;
  return Math.round(total / weightSum);
}
