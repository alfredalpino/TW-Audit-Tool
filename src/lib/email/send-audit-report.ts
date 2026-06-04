import { and, eq } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { emailLogs } from "@/lib/db/schema";
import { buildAuditReportEmailHtml } from "@/lib/email/audit-report-template";
import { getResendClient, getResendFromAddress } from "@/lib/email/resend";
import { readReportPdf } from "@/lib/reports/storage";
import { generateAuditReportPdf } from "@/lib/reports/generate-pdf";

export type SendAuditReportResult =
  | { ok: true; providerId?: string; skipped?: boolean }
  | { ok: false; error: string };

export async function sendAuditReportEmail(
  db: Db,
  params: {
    runId: string;
    leadId: string;
    toEmail: string;
    recipientName?: string;
    url: string;
    overallScore: number | null;
  }
): Promise<SendAuditReportResult> {
  const resend = getResendClient();
  const from = getResendFromAddress();

  if (!resend || !from) {
    return { ok: true, skipped: true };
  }

  const alreadySent = await db.query.emailLogs.findFirst({
    where: and(
      eq(emailLogs.auditRunId, params.runId),
      eq(emailLogs.leadId, params.leadId),
      eq(emailLogs.status, "sent")
    ),
  });
  if (alreadySent) {
    return { ok: true, skipped: true };
  }

  let pdf = await readReportPdf(params.runId);
  if (!pdf) {
    const gen = await generateAuditReportPdf(db, params.runId);
    if (!gen.ok) {
      return { ok: false, error: gen.error };
    }
    pdf = await readReportPdf(params.runId);
  }
  if (!pdf) {
    return { ok: false, error: "Report PDF not available" };
  }

  const [logRow] = await db
    .insert(emailLogs)
    .values({
      auditRunId: params.runId,
      leadId: params.leadId,
      toEmail: params.toEmail,
      status: "pending",
    })
    .returning();

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  const reportUrl = `${appUrl}/api/audits/${params.runId}/report`;
  const name = params.recipientName?.trim() || "there";
  const scoreLine =
    params.overallScore != null
      ? `Overall score: ${params.overallScore}/100.`
      : "";

  const html = buildAuditReportEmailHtml({
    name,
    url: params.url,
    scoreLine,
    reportUrl,
  });

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: params.toEmail,
      subject: `Your Torpedo audit report — ${params.url}`,
      html,
      attachments: [
        {
          filename: `torpedo-audit-${params.runId.slice(0, 8)}.pdf`,
          content: pdf,
        },
      ],
    });

    if (error) {
      await db
        .update(emailLogs)
        .set({ status: "failed", errorMessage: error.message })
        .where(eq(emailLogs.id, logRow.id));
      return { ok: false, error: error.message };
    }

    await db
      .update(emailLogs)
      .set({
        status: "sent",
        providerId: data?.id ?? null,
      })
      .where(eq(emailLogs.id, logRow.id));

    return { ok: true, providerId: data?.id };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Email send failed";
    await db
      .update(emailLogs)
      .set({ status: "failed", errorMessage: message })
      .where(eq(emailLogs.id, logRow.id));
    return { ok: false, error: message };
  }
}
