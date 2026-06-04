import { SEVERITY_DEDUCTIONS } from "@/lib/scoring/weights";
import type { FindingCategory, FindingSeverity } from "@/types/audit";
import type { AuditFindingInput } from "./types";

export function scoreFromFindings(findings: AuditFindingInput[]): number {
  let score = 100;
  for (const f of findings) {
    score -= SEVERITY_DEDUCTIONS[f.severity] ?? 0;
  }
  return Math.max(0, Math.min(100, score));
}

const SEVERITY_PRIORITY: Record<FindingSeverity, number> = {
  critical: 95,
  high: 80,
  medium: 60,
  low: 35,
  info: 15,
};

const CATEGORY_PRIORITY_BOOST: Partial<Record<FindingCategory, number>> = {
  cro: 5,
  accessibility: 5,
  seo: 3,
  speed: 3,
};

export function computeFindingPriority(
  severity: FindingSeverity,
  category: FindingCategory
): number {
  const base = SEVERITY_PRIORITY[severity] ?? 50;
  const boost = CATEGORY_PRIORITY_BOOST[category] ?? 0;
  return Math.min(100, base + boost);
}
