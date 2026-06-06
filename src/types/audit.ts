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
  enginesCompleted?: string[];
  createdAt: string;
  completedAt?: string | null;
}
