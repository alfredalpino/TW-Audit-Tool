export type FindingCategory =
  | "seo"
  | "speed"
  | "ux"
  | "cro"
  | "technical"
  | "accessibility"
  | "security"
  | "compliance"
  | "ai_readiness"
  | "mobile"
  | "content"
  | "screenshot";

export type FindingSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "info";

export type AuditRunStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed";

export interface ImpactRange {
  label: string;
  range?: string | null;
  narrative?: string;
}

export interface CategoryScoreDto {
  category: FindingCategory;
  score: number;
  breakdown?: Record<string, unknown>;
}

export interface FindingDto {
  id: string;
  category: FindingCategory;
  severity: FindingSeverity;
  title: string;
  description: string;
  recommendation?: string | null;
  businessImpact: string;
  priorityScore: number;
  evidence?: Record<string, unknown>;
}

export interface ScreenshotDto {
  viewport: "desktop" | "mobile" | "tablet";
  url: string;
  width?: number;
  height?: number;
}

export interface MethodologyToolDto {
  name: string;
  role: string;
}

export interface AuditMethodologyDto {
  runtime: "browser" | "fetch";
  label: string;
  summary: string;
  tools: MethodologyToolDto[];
  limitations: string[];
}

export type AuditStage =
  | "queued"
  | "crawling"
  | "analyzing"
  | "scoring"
  | "complete"
  | "failed";

export interface AuditRunResponse {
  id: string;
  auditId: string;
  status: AuditRunStatus;
  stage?: AuditStage;
  url: string;
  organizationId?: string | null;
  organizationName?: string | null;
  overallScore: number | null;
  executiveSummary?: string | null;
  unlocked: boolean;
  scores: CategoryScoreDto[];
  impact: {
    trafficLoss?: ImpactRange;
    leadLoss?: ImpactRange;
    conversionLoss?: ImpactRange;
    revenueLeakage?: ImpactRange;
    growthOpportunity?: ImpactRange;
  };
  findings: FindingDto[];
  screenshots?: ScreenshotDto[];
  enginesCompleted?: string[];
  runtime?: "browser" | "fetch";
  methodology?: AuditMethodologyDto;
  createdAt: string;
  completedAt?: string | null;
}
