import type { AuditEngine, AuditFindingInput, EngineResult } from "@/audit/types";
import type { AuditContext } from "@/audit/types";
import { seoEngine } from "@/audit/engines/seo";
import { speedEngine } from "@/audit/engines/speed";
import { accessibilityEngine } from "@/audit/engines/accessibility";
import { technicalEngine } from "@/audit/engines/technical";
import { uxEngine } from "@/audit/engines/ux";
import { croEngine } from "@/audit/engines/cro";
import { securityEngine } from "@/audit/engines/security";
import { aiReadinessEngine } from "@/audit/engines/ai-readiness";
import { complianceEngine } from "@/audit/engines/compliance";
import { mobileEngine } from "@/audit/engines/mobile";
import { contentEngine } from "@/audit/engines/content";
import { screenshotIntelligenceEngine } from "@/audit/engines/screenshot-intelligence";
import type { FindingCategory } from "@/types/audit";

const ALL_ENGINES: AuditEngine[] = [
  seoEngine,
  technicalEngine,
  uxEngine,
  croEngine,
  securityEngine,
  complianceEngine,
  aiReadinessEngine,
  contentEngine,
  mobileEngine,
  accessibilityEngine,
  screenshotIntelligenceEngine,
  speedEngine,
];

const ENGINE_MAP = Object.fromEntries(
  ALL_ENGINES.map((e) => [e.category, e])
) as Record<FindingCategory, AuditEngine>;

export type OrchestratorProgress = (
  engineId: string,
  result: EngineResult
) => Promise<void>;

export type OrchestratorOutput = {
  results: EngineResult[];
  allFindings: AuditFindingInput[];
};

function resolveEngines(categories?: string[]): AuditEngine[] {
  if (!categories?.length) return ALL_ENGINES;
  const selected = categories
    .map((c) => ENGINE_MAP[c as FindingCategory])
    .filter(Boolean);
  return selected.length ? selected : ALL_ENGINES;
}

/** DOM-based engines run before Lighthouse to reuse Playwright page. */
const DOM_FIRST = new Set([
  "seo",
  "technical",
  "ux",
  "cro",
  "security",
  "compliance",
  "ai_readiness",
  "content",
  "mobile",
  "accessibility",
  "screenshot",
]);

export async function runAuditEngines(
  ctx: AuditContext,
  onProgress?: OrchestratorProgress
): Promise<OrchestratorOutput> {
  const engines = resolveEngines(ctx.config.categories);
  const ordered = [
    ...engines.filter((e) => DOM_FIRST.has(e.category)),
    ...engines.filter((e) => !DOM_FIRST.has(e.category)),
  ];

  const results: EngineResult[] = [];
  const allFindings: AuditFindingInput[] = [];

  for (const engine of ordered) {
    const result = await engine.run(ctx);
    results.push(result);
    allFindings.push(...result.findings);
    if (onProgress) await onProgress(engine.id, result);
  }

  return { results, allFindings };
}
