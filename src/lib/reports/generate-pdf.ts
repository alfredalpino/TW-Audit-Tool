import React, { type ReactElement } from "react";
import { pdf, type DocumentProps } from "@react-pdf/renderer";
import type { Db } from "@/lib/db";
import { reports } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { AuditReportDocument } from "@/lib/reports/AuditReportDocument";
import { loadAuditReportData } from "@/lib/reports/report-data";
import { readReportPdf, writeReportPdf } from "@/lib/reports/storage";

export type GeneratePdfResult =
  | { ok: true; storageKey: string; cached: boolean }
  | { ok: false; error: string };

export async function generateAuditReportPdf(
  db: Db,
  runId: string,
  options?: { force?: boolean }
): Promise<GeneratePdfResult> {
  const existing = await readReportPdf(runId);
  if (existing && !options?.force) {
    const row = await db.query.reports.findFirst({
      where: eq(reports.auditRunId, runId),
    });
    if (row?.status === "ready" && row.storageKey) {
      return { ok: true, storageKey: row.storageKey, cached: true };
    }
  }

  const data = await loadAuditReportData(db, runId, { fullFindings: true });
  if (!data) {
    return { ok: false, error: "Audit run not found or not completed" };
  }

  const reportRow = await db.query.reports.findFirst({
    where: eq(reports.auditRunId, runId),
  });
  if (!reportRow) {
    await db.insert(reports).values({ auditRunId: runId, status: "generating" });
  } else {
    await db
      .update(reports)
      .set({ status: "generating" })
      .where(eq(reports.auditRunId, runId));
  }

  try {
    const doc = React.createElement(AuditReportDocument, {
      data,
    }) as ReactElement<DocumentProps>;
    const blob = await pdf(doc).toBlob();
    const storageKey = await writeReportPdf(
      runId,
      Buffer.from(await blob.arrayBuffer())
    );

    await db
      .update(reports)
      .set({
        status: "ready",
        storageKey,
        generatedAt: new Date(),
      })
      .where(eq(reports.auditRunId, runId));

    return { ok: true, storageKey, cached: false };
  } catch (e) {
    const message = e instanceof Error ? e.message : "PDF generation failed";
    await db
      .update(reports)
      .set({ status: "failed" })
      .where(eq(reports.auditRunId, runId));
    return { ok: false, error: message };
  }
}

export async function getOrGenerateReportPdf(
  db: Db,
  runId: string
): Promise<Buffer | null> {
  const cached = await readReportPdf(runId);
  if (cached) return cached;

  const result = await generateAuditReportPdf(db, runId);
  if (!result.ok) return null;
  return readReportPdf(runId);
}
