import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { readScreenshotBuffer } from "@/lib/screenshots/storage";
import type { ScreenshotViewport } from "@/lib/screenshots/storage";

type Params = {
  params: Promise<{ runId: string; viewport: string }>;
};

const VALID: ScreenshotViewport[] = ["desktop", "mobile", "tablet"];

export async function GET(_request: Request, { params }: Params) {
  const { runId, viewport } = await params;
  if (!VALID.includes(viewport as ScreenshotViewport)) {
    return NextResponse.json({ error: "Invalid viewport" }, { status: 400 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Not available" }, { status: 503 });
  }

  const buffer = await readScreenshotBuffer(
    db,
    runId,
    viewport as ScreenshotViewport
  );
  if (!buffer) {
    return NextResponse.json({ error: "Screenshot not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
