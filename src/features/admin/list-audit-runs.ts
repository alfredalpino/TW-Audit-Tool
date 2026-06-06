import { desc } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { auditRuns } from "@/lib/db/schema";

export type AdminAuditRunRow = {
  id: string;
  auditId: string;
  url: string;
  organizationId: string | null;
  organizationName: string | null;
  status: string;
  overallScore: number | null;
  trigger: string;
  createdAt: string;
  completedAt: string | null;
};

export async function listRecentAuditRuns(
  db: Db,
  limit = 50
): Promise<AdminAuditRunRow[]> {
  const rows = await db.query.auditRuns.findMany({
    orderBy: desc(auditRuns.createdAt),
    limit,
    with: {
      audit: {
        with: {
          organization: true,
        },
      },
    },
  });

  return rows.map((run) => ({
    id: run.id,
    auditId: run.auditId,
    url: run.audit.url,
    organizationId: run.audit.organizationId,
    organizationName: run.audit.organization?.name ?? null,
    status: run.status,
    overallScore: run.overallScore,
    trigger: run.trigger,
    createdAt: run.createdAt.toISOString(),
    completedAt: run.completedAt?.toISOString() ?? null,
  }));
}
