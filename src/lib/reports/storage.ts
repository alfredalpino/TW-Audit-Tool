import fs from "node:fs/promises";
import path from "node:path";

const DEFAULT_REPORT_DIR = "./storage/reports";

export function getReportStorageDir(): string {
  return process.env.REPORT_STORAGE_PATH ?? DEFAULT_REPORT_DIR;
}

export function reportFileKey(runId: string): string {
  return `reports/${runId}.pdf`;
}

export function reportAbsolutePath(runId: string): string {
  return path.join(getReportStorageDir(), `${runId}.pdf`);
}

export async function ensureReportDir(): Promise<void> {
  await fs.mkdir(getReportStorageDir(), { recursive: true });
}

export async function readReportPdf(runId: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(reportAbsolutePath(runId));
  } catch {
    return null;
  }
}

export async function writeReportPdf(
  runId: string,
  buffer: Buffer
): Promise<string> {
  await ensureReportDir();
  const filePath = reportAbsolutePath(runId);
  await fs.writeFile(filePath, buffer);
  return reportFileKey(runId);
}
