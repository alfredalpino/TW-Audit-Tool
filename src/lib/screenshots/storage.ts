import fs from "node:fs/promises";
import path from "node:path";
import type { Db } from "@/lib/db";
import { screenshots } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { hasSupabaseConfig } from "@/lib/env";

const DEFAULT_DIR = "./storage/screenshots";
const SUPABASE_BUCKET = "audit-screenshots";

export type ScreenshotViewport = "desktop" | "mobile" | "tablet";

export function getScreenshotStorageDir(): string {
  if (process.env.VERCEL === "1") {
    return path.join("/tmp", "tw-audit-screenshots");
  }
  return process.env.SCREENSHOT_STORAGE_PATH ?? DEFAULT_DIR;
}

export function screenshotFileKey(
  runId: string,
  viewport: ScreenshotViewport
): string {
  return `screenshots/${runId}/${viewport}.png`;
}

export function screenshotAbsolutePath(
  runId: string,
  viewport: ScreenshotViewport
): string {
  return path.join(getScreenshotStorageDir(), runId, `${viewport}.png`);
}

async function ensureDir(runId: string): Promise<void> {
  await fs.mkdir(path.join(getScreenshotStorageDir(), runId), {
    recursive: true,
  });
}

async function trySupabaseUpload(
  runId: string,
  viewport: ScreenshotViewport,
  buffer: Buffer
): Promise<string | null> {
  if (!hasSupabaseConfig()) return null;
  try {
    const { createServiceClient } = await import("@/lib/supabase/service");
    const supabase = createServiceClient();
    const objectPath = `${runId}/${viewport}.png`;
    const { error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(objectPath, buffer, {
        contentType: "image/png",
        upsert: true,
      });
    if (error) return null;
    return `supabase://${SUPABASE_BUCKET}/${objectPath}`;
  } catch {
    return null;
  }
}

async function readFromSupabase(storageKey: string): Promise<Buffer | null> {
  const match = storageKey.match(/^supabase:\/\/([^/]+)\/(.+)$/);
  if (!match) return null;
  const [, bucket, objectPath] = match;
  try {
    const { createServiceClient } = await import("@/lib/supabase/service");
    const supabase = createServiceClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(objectPath);
    if (error || !data) return null;
    return Buffer.from(await data.arrayBuffer());
  } catch {
    return null;
  }
}

export async function saveScreenshot(
  runId: string,
  viewport: ScreenshotViewport,
  buffer: Buffer,
  meta: Record<string, unknown> = {}
): Promise<{ storageKey: string; annotations: Record<string, unknown> }> {
  const supabaseKey = await trySupabaseUpload(runId, viewport, buffer);
  if (supabaseKey) {
    return {
      storageKey: supabaseKey,
      annotations: { ...meta, source: "supabase", captured: true },
    };
  }

  try {
    await ensureDir(runId);
    const filePath = screenshotAbsolutePath(runId, viewport);
    await fs.writeFile(filePath, buffer);
    return {
      storageKey: screenshotFileKey(runId, viewport),
      annotations: { ...meta, source: "filesystem", captured: true },
    };
  } catch {
    return {
      storageKey: `inline://${runId}/${viewport}.png`,
      annotations: {
        ...meta,
        source: "inline",
        captured: true,
        inlineData: buffer.toString("base64"),
      },
    };
  }
}

export async function readScreenshotBuffer(
  db: Db,
  runId: string,
  viewport: ScreenshotViewport
): Promise<Buffer | null> {
  const [row] = await db
    .select()
    .from(screenshots)
    .where(
      and(
        eq(screenshots.auditRunId, runId),
        eq(screenshots.viewport, viewport)
      )
    )
    .limit(1);

  if (!row) return null;

  const key = row.storageKey;
  const annotations = (row.annotations ?? {}) as Record<string, unknown>;

  if (key.startsWith("supabase://")) {
    const fromSupabase = await readFromSupabase(key);
    if (fromSupabase) return fromSupabase;
  }

  if (key.startsWith("inline://")) {
    const inline = annotations.inlineData;
    if (typeof inline === "string") {
      return Buffer.from(inline, "base64");
    }
  }

  const filePath = key.startsWith("screenshots/")
    ? path.join(
        process.env.SCREENSHOT_STORAGE_PATH ?? DEFAULT_DIR,
        key.replace(/^screenshots\//, "")
      )
    : key;

  try {
    return await fs.readFile(filePath);
  } catch {
    try {
      return await fs.readFile(screenshotAbsolutePath(runId, viewport));
    } catch {
      return null;
    }
  }
}

export async function persistScreenshot(
  db: Db,
  runId: string,
  viewport: ScreenshotViewport,
  buffer: Buffer,
  meta: Record<string, unknown> = {}
): Promise<void> {
  const { storageKey, annotations } = await saveScreenshot(
    runId,
    viewport,
    buffer,
    meta
  );

  await db.insert(screenshots).values({
    auditRunId: runId,
    viewport,
    storageKey,
    annotations,
  });
}
