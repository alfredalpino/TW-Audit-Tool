import type { FindingCategory } from "@/types/audit";

/** All 12 audit categories — scores persisted for every run. */
export const SCORE_CATEGORIES: FindingCategory[] = [
  "seo",
  "speed",
  "ux",
  "cro",
  "technical",
  "accessibility",
  "security",
  "compliance",
  "ai_readiness",
  "mobile",
  "content",
  "screenshot",
];
