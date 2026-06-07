import { NextResponse } from "next/server";
import { getAuditRun } from "@/features/audit/get-audit-run";
import { getDb } from "@/lib/db";
import {
  runVercelAuditProcessing,
  shouldProcessOnVercel,
} from "@/lib/audit/run-vercel-processing";

type Params = { params: Promise<{ runId: string }> };

export const maxDuration = 60;

export async function GET(_request: Request, { params }: Params) {
  const { runId } = await params;
  try {
    let run = await getAuditRun(runId);
    if (!run) {
      return NextResponse.json({ error: "Audit run not found" }, { status: 404 });
    }

    if (shouldProcessOnVercel() && run.status === "queued") {
      const db = getDb();
      if (db) {
        await runVercelAuditProcessing(db, runId, { claim: true });
        run = (await getAuditRun(runId)) ?? run;
      }
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
