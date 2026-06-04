import type { AuditFindingInput } from "@/audit/types";
import type { FindingCategory, FindingSeverity } from "@/types/audit";
import { SEVERITY_DEDUCTIONS } from "./weights";

export function scoreFromFindings(
  findings: AuditFindingInput[],
  category?: FindingCategory,
  scoreOverride?: number
): number {
  if (scoreOverride !== undefined) {
    return Math.max(0, Math.min(100, Math.round(scoreOverride)));
  }

  const scoped = category
    ? findings.filter((f) => f.category === category)
    : findings;
  if (!scoped.length) return 100;

  let score = 100;
  for (const f of scoped) {
    const deduction = SEVERITY_DEDUCTIONS[f.severity as FindingSeverity] ?? 0;
    score -= deduction;
  }
  return Math.max(0, Math.min(100, score));
}
