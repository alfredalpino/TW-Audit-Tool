import type { Page } from "playwright";
import type { FindingCategory, FindingSeverity } from "@/types/audit";
import type { AuditRunConfig } from "@/lib/db/schema";

export type AuditStage =
  | "queued"
  | "crawling"
  | "analyzing"
  | "scoring"
  | "complete"
  | "failed";

export interface AuditFindingInput {
  category: FindingCategory;
  severity: FindingSeverity;
  title: string;
  description: string;
  recommendation?: string;
  businessImpact: string;
  evidence?: Record<string, unknown>;
}

/** @deprecated Alias for AuditFindingInput */
export type EngineFinding = AuditFindingInput;

export interface EngineResult {
  category: FindingCategory;
  score: number;
  findings: AuditFindingInput[];
  breakdown?: Record<string, unknown>;
}

export interface AuditContext {
  url: string;
  normalizedUrl: string;
  runId: string;
  page: Page;
  config: AuditRunConfig;
}

export interface AuditEngine {
  id: string;
  category: FindingCategory;
  run(ctx: AuditContext): Promise<EngineResult>;
}
