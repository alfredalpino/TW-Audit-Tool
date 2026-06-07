import { NextResponse } from "next/server";
import { getAuditRun } from "@/features/audit/get-audit-run";

type Params = { params: Promise<{ runId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { runId } = await params;
  try {
    const run = await getAuditRun(runId);
    if (!run) {
      return NextResponse.json({ error: "Audit run not found" }, { status: 404 });
    }
    return NextResponse.json(run);
  } catch (error) {
    console.error("[GET /api/audits/:runId]", { runId, error });
    return NextResponse.json(
      { error: "Failed to load audit run" },
      { status: 500 }
    );
  }
}
