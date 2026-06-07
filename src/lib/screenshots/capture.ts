import type { Page } from "playwright";
import type { Db } from "@/lib/db";
import {
  persistScreenshot,
  type ScreenshotViewport,
} from "@/lib/screenshots/storage";

type ViewportSpec = {
  viewport: ScreenshotViewport;
  width: number;
  height: number;
  mobile?: boolean;
};

const VIEWPORTS: ViewportSpec[] = [
  { viewport: "desktop", width: 1280, height: 720 },
  { viewport: "mobile", width: 390, height: 844, mobile: true },
];

async function fetchRemoteScreenshot(
  url: string,
  spec: ViewportSpec
): Promise<Buffer | null> {
  try {
    const params = new URLSearchParams({
      url,
      screenshot: "true",
      meta: "false",
      "viewport.width": String(spec.width),
      "viewport.height": String(spec.height),
    });
    if (spec.mobile) params.set("viewport.isMobile", "true");

    const res = await fetch(`https://api.microlink.io/?${params}`, {
      signal: AbortSignal.timeout(18_000),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`microlink ${res.status}`);
    const json = (await res.json()) as {
      data?: { screenshot?: { url?: string } };
    };
    const imageUrl = json.data?.screenshot?.url;
    if (!imageUrl) throw new Error("microlink missing screenshot url");

    const imgRes = await fetch(imageUrl, {
      signal: AbortSignal.timeout(12_000),
    });
    if (!imgRes.ok) throw new Error(`screenshot download ${imgRes.status}`);
    return Buffer.from(await imgRes.arrayBuffer());
  } catch {
    try {
      const thumPath = spec.mobile
        ? `width/390/crop/844/noanimate`
        : `width/1280/crop/720/noanimate`;
      const thumUrl = `https://image.thum.io/get/${thumPath}/${encodeURIComponent(url)}`;
      const res = await fetch(thumUrl, {
        redirect: "follow",
        signal: AbortSignal.timeout(18_000),
      });
      if (!res.ok) return null;
      return Buffer.from(await res.arrayBuffer());
    } catch {
      return null;
    }
  }
}

async function capturePlaywrightViewport(
  page: Page,
  spec: ViewportSpec
): Promise<Buffer> {
  await page.setViewportSize({ width: spec.width, height: spec.height });
  await page.waitForTimeout(400);
  return page.screenshot({ type: "png", fullPage: false });
}

/** Capture desktop + mobile via remote render API (Vercel / fetch pipeline). */
export async function captureRemoteScreenshots(
  db: Db,
  runId: string,
  url: string
): Promise<number> {
  let saved = 0;
  for (const spec of VIEWPORTS) {
    const buffer = await fetchRemoteScreenshot(url, spec);
    if (!buffer?.length) continue;
    await persistScreenshot(db, runId, spec.viewport, buffer, {
      width: spec.width,
      height: spec.height,
      runtime: "fetch",
    });
    saved += 1;
  }
  return saved;
}

/** Capture desktop + mobile via Playwright (worker pipeline). */
export async function capturePlaywrightScreenshots(
  db: Db,
  runId: string,
  page: Page
): Promise<number> {
  let saved = 0;
  for (const spec of VIEWPORTS) {
    try {
      const buffer = await capturePlaywrightViewport(page, spec);
      await persistScreenshot(db, runId, spec.viewport, buffer, {
        width: spec.width,
        height: spec.height,
        runtime: "browser",
      });
      saved += 1;
    } catch (e) {
      console.warn(`[audit] ${spec.viewport} screenshot failed`, e);
    }
  }
  return saved;
}
