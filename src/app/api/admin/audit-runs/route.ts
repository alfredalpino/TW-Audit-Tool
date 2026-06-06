import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { listRecentAuditRuns } from "@/features/admin/list-audit-runs";
import {
  adminUnauthorizedResponse,
  isAdminAuthorized,
} from "@/lib/admin/require-admin";

export async function GET(request: Request) {
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

  const { searchParams } = new URL(request.url);
  const limit = Math.min(
    Math.max(Number(searchParams.get("limit") ?? 50), 1),
    200
  );

  const runs = await listRecentAuditRuns(db, limit);
  return NextResponse.json({ runs, count: runs.length });
}
