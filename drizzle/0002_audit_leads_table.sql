-- Audit lead capture uses audit_leads to avoid colliding with the main-site CRM leads table.
CREATE TABLE IF NOT EXISTS "audit_leads" (
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
DO $$ BEGIN
 ALTER TABLE "audit_leads" ADD CONSTRAINT "audit_leads_audit_run_id_audit_runs_id_fk" FOREIGN KEY ("audit_run_id") REFERENCES "public"."audit_runs"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_leads_email_created_idx" ON "audit_leads" USING btree ("email","created_at");
