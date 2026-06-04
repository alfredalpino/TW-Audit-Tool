import { NextResponse } from "next/server";
import { createLeadSchema } from "@/lib/validations/lead";
import { createLead } from "@/features/leads/create-lead";
import { getDb } from "@/lib/db";
import { deliverAuditReport } from "@/features/reports/deliver-audit-report";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const result = await createLead(parsed.data);
  if (!result.ok) {
    const status = result.error === "Database not configured" ? 503 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  const db = getDb();
  let delivery: Awaited<ReturnType<typeof deliverAuditReport>> | undefined;
  if (db) {
    try {
      delivery = await deliverAuditReport(db, parsed.data.runId, result.leadId);
    } catch (e) {
      console.error("[leads] report delivery failed", e);
      delivery = {
        pdf: { ok: false, error: "Delivery failed" },
        email: { ok: false, error: "Delivery failed" },
      };
    }
  }

  return NextResponse.json(
    {
      ok: true,
      leadId: result.leadId,
      unlocked: true,
      report: delivery
        ? {
            pdfReady: delivery.pdf.ok,
            emailSent: delivery.email.ok && !delivery.email.skipped,
            emailSkipped: delivery.email.skipped === true,
          }
        : undefined,
    },
    { status: 201 }
  );
}
