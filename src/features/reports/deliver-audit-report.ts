import { eq } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { auditRuns, leads } from "@/lib/db/schema";
import { generateAuditReportPdf } from "@/lib/reports/generate-pdf";
import { sendAuditReportEmail } from "@/lib/email/send-audit-report";

export type DeliverReportResult = {
  pdf: { ok: boolean; error?: string; cached?: boolean };
  email: { ok: boolean; skipped?: boolean; error?: string };
};

/** Generate PDF and email the report after lead unlock (non-blocking friendly). */
export async function deliverAuditReport(
  db: Db,
  runId: string,
  leadId: string
): Promise<DeliverReportResult> {
  const lead = await db.query.leads.findFirst({
    where: eq(leads.id, leadId),
  });
  if (!lead) {
    return {
      pdf: { ok: false, error: "Lead not found" },
      email: { ok: false, error: "Lead not found" },
    };
  }

  const run = await db.query.auditRuns.findFirst({
    where: eq(auditRuns.id, runId),
    with: { audit: true },
  });

  if (!run?.audit) {
    return {
      pdf: { ok: false, error: "Audit run not found" },
      email: { ok: false, error: "Audit run not found" },
    };
  }

  const pdfResult = await generateAuditReportPdf(db, runId);
  let emailResult: Awaited<ReturnType<typeof sendAuditReportEmail>>;
  if (pdfResult.ok) {
    emailResult = await sendAuditReportEmail(db, {
      runId,
      leadId,
      toEmail: lead.email,
      recipientName: lead.name ?? undefined,
      url: run.audit.url,
      overallScore: run.overallScore,
    });
  } else {
    emailResult = { ok: false, error: pdfResult.error };
  }

  return {
    pdf: pdfResult.ok
      ? { ok: true, cached: pdfResult.cached }
      : { ok: false, error: pdfResult.error },
    email: emailResult.ok
      ? { ok: true, skipped: "skipped" in emailResult && emailResult.skipped }
      : { ok: false, error: "error" in emailResult ? emailResult.error : "Email failed" },
  };
}
