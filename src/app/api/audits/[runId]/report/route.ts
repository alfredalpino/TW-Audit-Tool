import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isRunUnlocked } from "@/features/leads/create-lead";
import { getOrGenerateReportPdf } from "@/lib/reports/generate-pdf";

type RouteContext = { params: Promise<{ runId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { runId } = await context.params;
  const db = getDb();

  if (!db) {
    return NextResponse.json(
      { error: "Report export requires database configuration" },
      { status: 503 }
    );
  }

  const unlocked = await isRunUnlocked(runId);
  if (!unlocked) {
    return NextResponse.json(
      { error: "Unlock the full report with your email before downloading PDF" },
      { status: 403 }
    );
  }

  const pdf = await getOrGenerateReportPdf(db, runId);
  if (!pdf) {
    return NextResponse.json(
      { error: "Could not generate report PDF" },
      { status: 500 }
    );
  }

  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="torpedo-audit-${runId.slice(0, 8)}.pdf"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
