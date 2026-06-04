import { mkdir } from "fs/promises";
import path from "path";
import type { Page } from "playwright";
import type { Db } from "@/lib/db";
import { screenshots } from "@/lib/db/schema";

const STORAGE_ROOT =
  process.env.SCREENSHOT_STORAGE_PATH ?? "./storage/screenshots";

export async function captureDesktopScreenshot(
  runId: string,
  page: Page
): Promise<string> {
  const dir = path.join(STORAGE_ROOT, runId);
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, "desktop.png");
  await page.screenshot({ path: filePath, fullPage: false });
  return filePath;
}

export async function persistScreenshotRecord(
  db: Db,
  runId: string,
  storageKey: string
): Promise<void> {
  await db.insert(screenshots).values({
    auditRunId: runId,
    viewport: "desktop",
    storageKey,
    annotations: { stub: false, phase: 2 },
  });
}
