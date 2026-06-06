import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", ["owner", "admin", "member"]);
export const auditRunStatusEnum = pgEnum("audit_run_status", [
  "queued",
  "running",
  "completed",
  "failed",
]);
export const auditRunTriggerEnum = pgEnum("audit_run_trigger", [
  "public",
  "dashboard",
  "api",
]);
export const findingCategoryEnum = pgEnum("finding_category", [
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
]);
export const findingSeverityEnum = pgEnum("finding_severity", [
  "critical",
  "high",
  "medium",
  "low",
  "info",
]);
export const reportStatusEnum = pgEnum("report_status", [
  "pending",
  "generating",
  "ready",
  "failed",
]);
export const emailLogStatusEnum = pgEnum("email_log_status", [
  "pending",
  "sent",
  "failed",
]);
export const leadSourceEnum = pgEnum("lead_source", [
  "audit_unlock",
  "consultation",
  "newsletter",
]);
export const screenshotViewportEnum = pgEnum("screenshot_viewport", [
  "desktop",
  "mobile",
  "tablet",
]);

export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [uniqueIndex("organizations_slug_idx").on(t.slug)]
);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id").references(() => organizations.id, {
      onDelete: "set null",
    }),
    email: varchar("email", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }),
    role: userRoleEnum("role").default("member").notNull(),
    image: text("image"),
    emailVerified: timestamp("email_verified", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)]
);

export const audits = pgTable(
  "audits",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id").references(() => organizations.id, {
      onDelete: "set null",
    }),
    url: text("url").notNull(),
    normalizedUrl: varchar("normalized_url", { length: 2048 }).notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("audits_normalized_url_idx").on(t.normalizedUrl),
    index("audits_org_idx").on(t.organizationId),
  ]
);

export const auditRuns = pgTable(
  "audit_runs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    auditId: uuid("audit_id")
      .references(() => audits.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    status: auditRunStatusEnum("status").default("queued").notNull(),
    trigger: auditRunTriggerEnum("trigger").default("public").notNull(),
    config: jsonb("config").$type<AuditRunConfig>().default({}),
    summary: jsonb("summary").$type<AuditRunSummary>(),
    overallScore: integer("overall_score"),
    errorMessage: text("error_message"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("audit_runs_audit_created_idx").on(t.auditId, t.createdAt),
    index("audit_runs_status_idx").on(t.status),
  ]
);

export const auditScores = pgTable(
  "audit_scores",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    auditRunId: uuid("audit_run_id")
      .references(() => auditRuns.id, { onDelete: "cascade" })
      .notNull(),
    category: findingCategoryEnum("category").notNull(),
    score: integer("score").notNull(),
    breakdown: jsonb("breakdown").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("audit_scores_run_idx").on(t.auditRunId)]
);

export const findings = pgTable(
  "findings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    auditRunId: uuid("audit_run_id")
      .references(() => auditRuns.id, { onDelete: "cascade" })
      .notNull(),
    category: findingCategoryEnum("category").notNull(),
    severity: findingSeverityEnum("severity").notNull(),
    title: varchar("title", { length: 512 }).notNull(),
    description: text("description").notNull(),
    recommendation: text("recommendation"),
    businessImpact: text("business_impact").notNull(),
    evidence: jsonb("evidence").$type<Record<string, unknown>>().default({}),
    priorityScore: integer("priority_score").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("findings_run_priority_idx").on(
      t.auditRunId,
      t.severity,
      t.priorityScore
    ),
  ]
);

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    auditRunId: uuid("audit_run_id").references(() => auditRuns.id, {
      onDelete: "set null",
    }),
    email: varchar("email", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }),
    phone: varchar("phone", { length: 50 }),
    company: varchar("company", { length: 255 }),
    source: leadSourceEnum("source").default("audit_unlock").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("leads_email_created_idx").on(t.email, t.createdAt)]
);

export const reports = pgTable(
  "reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    auditRunId: uuid("audit_run_id")
      .references(() => auditRuns.id, { onDelete: "cascade" })
      .notNull(),
    status: reportStatusEnum("status").default("pending").notNull(),
    storageKey: text("storage_key"),
    generatedAt: timestamp("generated_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [uniqueIndex("reports_run_idx").on(t.auditRunId)]
);

export const emailLogs = pgTable(
  "email_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    auditRunId: uuid("audit_run_id")
      .references(() => auditRuns.id, { onDelete: "cascade" })
      .notNull(),
    leadId: uuid("lead_id").references(() => leads.id, {
      onDelete: "set null",
    }),
    toEmail: varchar("to_email", { length: 255 }).notNull(),
    status: emailLogStatusEnum("status").default("pending").notNull(),
    providerId: varchar("provider_id", { length: 255 }),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("email_logs_run_idx").on(t.auditRunId)]
);

export const screenshots = pgTable(
  "screenshots",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    auditRunId: uuid("audit_run_id")
      .references(() => auditRuns.id, { onDelete: "cascade" })
      .notNull(),
    viewport: screenshotViewportEnum("viewport").notNull(),
    storageKey: text("storage_key").notNull(),
    annotations: jsonb("annotations").$type<Record<string, unknown>>().default(
      {}
    ),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("screenshots_run_idx").on(t.auditRunId)]
);

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  audits: many(audits),
}));

export const auditsRelations = relations(audits, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [audits.organizationId],
    references: [organizations.id],
  }),
  runs: many(auditRuns),
}));

export const auditRunsRelations = relations(auditRuns, ({ one, many }) => ({
  audit: one(audits, {
    fields: [auditRuns.auditId],
    references: [audits.id],
  }),
  user: one(users, {
    fields: [auditRuns.userId],
    references: [users.id],
  }),
  findings: many(findings),
  scores: many(auditScores),
  report: one(reports, {
    fields: [auditRuns.id],
    references: [reports.auditRunId],
  }),
  leads: many(leads),
  screenshots: many(screenshots),
  emailLogs: many(emailLogs),
}));

export const findingsRelations = relations(findings, ({ one }) => ({
  auditRun: one(auditRuns, {
    fields: [findings.auditRunId],
    references: [auditRuns.id],
  }),
}));

export const auditScoresRelations = relations(auditScores, ({ one }) => ({
  auditRun: one(auditRuns, {
    fields: [auditScores.auditRunId],
    references: [auditRuns.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  auditRun: one(auditRuns, {
    fields: [reports.auditRunId],
    references: [auditRuns.id],
  }),
}));

export type AuditRunConfig = {
  categories?: string[];
  mobile?: boolean;
  desktop?: boolean;
};

export type ImpactRange = {
  label: string;
  range?: string | null;
  narrative?: string;
};

export type AuditRunSummary = {
  stage?: "queued" | "crawling" | "analyzing" | "scoring" | "complete" | "failed";
  executiveSummary?: string;
  impact?: {
    trafficLoss?: ImpactRange;
    leadLoss?: ImpactRange;
    conversionLoss?: ImpactRange;
    revenueLeakage?: ImpactRange;
    growthOpportunity?: ImpactRange;
  };
  enginesCompleted?: string[];
  mock?: boolean;
  runtime?: "browser" | "fetch";
};
