import { eq } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { auditRuns, findings } from "@/lib/db/schema";

export type ExportFindingRow = {
  runId: string;
  url: string;
  organizationName: string | null;
  category: string;
  severity: string;
  title: string;
  description: string;
  recommendation: string | null;
  businessImpact: string;
  priorityScore: number;
  createdAt: string;
};

export async function loadFindingsForExport(
  db: Db,
  runId: string
): Promise<{ runId: string; url: string; organizationName: string | null; findings: ExportFindingRow[] } | null> {
  const run = await db.query.auditRuns.findFirst({
    where: eq(auditRuns.id, runId),
    with: {
      audit: {
        with: { organization: true },
      },
    },
  });

  if (!run?.audit) return null;

  const rows = await db.query.findings.findMany({
    where: eq(findings.auditRunId, runId),
    orderBy: (f, { desc }) => [desc(f.priorityScore)],
  });

  const organizationName = run.audit.organization?.name ?? null;
  const url = run.audit.url;

  return {
    runId,
    url,
    organizationName,
    findings: rows.map((f) => ({
      runId,
      url,
      organizationName,
      category: f.category,
      severity: f.severity,
      title: f.title,
      description: f.description,
      recommendation: f.recommendation,
      businessImpact: f.businessImpact,
      priorityScore: f.priorityScore,
      createdAt: f.createdAt.toISOString(),
    })),
  };
}

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function findingsToCsv(data: {
  runId: string;
  url: string;
  organizationName: string | null;
  findings: ExportFindingRow[];
}): string {
  const headers = [
    "runId",
    "url",
    "organizationName",
    "category",
    "severity",
    "title",
    "description",
    "recommendation",
    "businessImpact",
    "priorityScore",
    "createdAt",
  ];

  const lines = [headers.join(",")];
  for (const row of data.findings) {
    lines.push(
      [
        row.runId,
        row.url,
        row.organizationName ?? "",
        row.category,
        row.severity,
        row.title,
        row.description,
        row.recommendation ?? "",
        row.businessImpact,
        String(row.priorityScore),
        row.createdAt,
      ]
        .map(escapeCsv)
        .join(",")
    );
  }
  return lines.join("\n");
}
