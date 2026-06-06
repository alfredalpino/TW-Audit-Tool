import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  findingsToCsv,
  loadFindingsForExport,
} from "@/features/admin/export-findings";
import {
  adminUnauthorizedResponse,
  isAdminAuthorized,
} from "@/lib/admin/require-admin";

type Params = { params: Promise<{ runId: string }> };

export async function GET(request: Request, { params }: Params) {
  if (!isAdminAuthorized(request)) {
    return adminUnauthorizedResponse();
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  const { runId } = await params;
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "json";

  const data = await loadFindingsForExport(db, runId);
  if (!data) {
    return NextResponse.json({ error: "Audit run not found" }, { status: 404 });
  }

  if (format === "csv") {
    const csv = findingsToCsv(data);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="audit-${runId}-findings.csv"`,
      },
    });
  }

  return NextResponse.json({
    runId: data.runId,
    url: data.url,
    organizationName: data.organizationName,
    findings: data.findings,
    count: data.findings.length,
  });
}
