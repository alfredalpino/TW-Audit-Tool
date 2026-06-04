CREATE TYPE "public"."audit_run_status" AS ENUM('queued', 'running', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."audit_run_trigger" AS ENUM('public', 'dashboard', 'api');--> statement-breakpoint
CREATE TYPE "public"."finding_category" AS ENUM('seo', 'speed', 'ux', 'cro', 'technical', 'accessibility', 'security', 'compliance', 'ai_readiness', 'mobile', 'screenshot');--> statement-breakpoint
CREATE TYPE "public"."finding_severity" AS ENUM('critical', 'high', 'medium', 'low', 'info');--> statement-breakpoint
CREATE TYPE "public"."lead_source" AS ENUM('audit_unlock', 'consultation', 'newsletter');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('pending', 'generating', 'ready', 'failed');--> statement-breakpoint
CREATE TYPE "public"."screenshot_viewport" AS ENUM('desktop', 'mobile', 'tablet');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('owner', 'admin', 'member');--> statement-breakpoint
CREATE TABLE "audit_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"audit_id" uuid NOT NULL,
	"user_id" uuid,
	"status" "audit_run_status" DEFAULT 'queued' NOT NULL,
	"trigger" "audit_run_trigger" DEFAULT 'public' NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb,
	"summary" jsonb,
	"overall_score" integer,
	"error_message" text,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"audit_run_id" uuid NOT NULL,
	"category" "finding_category" NOT NULL,
	"score" integer NOT NULL,
	"breakdown" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"url" text NOT NULL,
	"normalized_url" varchar(2048) NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "findings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"audit_run_id" uuid NOT NULL,
	"category" "finding_category" NOT NULL,
	"severity" "finding_severity" NOT NULL,
	"title" varchar(512) NOT NULL,
	"description" text NOT NULL,
	"recommendation" text,
	"business_impact" text NOT NULL,
	"evidence" jsonb DEFAULT '{}'::jsonb,
	"priority_score" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"audit_run_id" uuid,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"phone" varchar(50),
	"company" varchar(255),
	"source" "lead_source" DEFAULT 'audit_unlock' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"audit_run_id" uuid NOT NULL,
	"status" "report_status" DEFAULT 'pending' NOT NULL,
	"storage_key" text,
	"generated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "screenshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"audit_run_id" uuid NOT NULL,
	"viewport" "screenshot_viewport" NOT NULL,
	"storage_key" text NOT NULL,
	"annotations" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"role" "user_role" DEFAULT 'member' NOT NULL,
	"image" text,
	"email_verified" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_runs" ADD CONSTRAINT "audit_runs_audit_id_audits_id_fk" FOREIGN KEY ("audit_id") REFERENCES "public"."audits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_runs" ADD CONSTRAINT "audit_runs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_scores" ADD CONSTRAINT "audit_scores_audit_run_id_audit_runs_id_fk" FOREIGN KEY ("audit_run_id") REFERENCES "public"."audit_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audits" ADD CONSTRAINT "audits_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "findings" ADD CONSTRAINT "findings_audit_run_id_audit_runs_id_fk" FOREIGN KEY ("audit_run_id") REFERENCES "public"."audit_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_audit_run_id_audit_runs_id_fk" FOREIGN KEY ("audit_run_id") REFERENCES "public"."audit_runs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_audit_run_id_audit_runs_id_fk" FOREIGN KEY ("audit_run_id") REFERENCES "public"."audit_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "screenshots" ADD CONSTRAINT "screenshots_audit_run_id_audit_runs_id_fk" FOREIGN KEY ("audit_run_id") REFERENCES "public"."audit_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_runs_audit_created_idx" ON "audit_runs" USING btree ("audit_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_runs_status_idx" ON "audit_runs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "audit_scores_run_idx" ON "audit_scores" USING btree ("audit_run_id");--> statement-breakpoint
CREATE INDEX "audits_normalized_url_idx" ON "audits" USING btree ("normalized_url");--> statement-breakpoint
CREATE INDEX "audits_org_idx" ON "audits" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "findings_run_priority_idx" ON "findings" USING btree ("audit_run_id","severity","priority_score");--> statement-breakpoint
CREATE INDEX "leads_email_created_idx" ON "leads" USING btree ("email","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "organizations_slug_idx" ON "organizations" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "reports_run_idx" ON "reports" USING btree ("audit_run_id");--> statement-breakpoint
CREATE INDEX "screenshots_run_idx" ON "screenshots" USING btree ("audit_run_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");