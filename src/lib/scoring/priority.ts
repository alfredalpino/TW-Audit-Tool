import type { FindingCategory, FindingSeverity } from "@/types/audit";
import { CATEGORY_WEIGHTS } from "./weights";

const SEVERITY_WEIGHT: Record<FindingSeverity, number> = {
  critical: 100,
  high: 75,
  medium: 50,
  low: 25,
  info: 10,
};

/** priority_score = severityWeight × categoryWeight × businessMultiplier */
export function computePriorityScore(
  severity: FindingSeverity,
  category: FindingCategory
): number {
  const severityWeight = SEVERITY_WEIGHT[severity];
  const categoryWeight = (CATEGORY_WEIGHTS[category] || 0.05) * 100;
  const businessMultiplier = 1.2;
  return Math.round(
    (severityWeight * categoryWeight * businessMultiplier) / 10
  );
}
