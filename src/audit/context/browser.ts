import { chromium, type Browser, type Page } from "playwright";
import type { AuditContext } from "@/audit/types";
import type { AuditRunConfig } from "@/lib/db/schema";

export type BrowserSession = {
  browser: Browser;
  page: Page;
  ctx: AuditContext;
};

export async function createBrowserSession(
  url: string,
  normalizedUrl: string,
  runId: string,
  config: AuditRunConfig
): Promise<BrowserSession> {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const viewport = config.mobile !== false
    ? { width: 390, height: 844 }
    : { width: 1280, height: 720 };

  const page = await browser.newPage({ viewport });
  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 45_000,
  });

  const ctx: AuditContext = {
    url,
    normalizedUrl,
    runId,
    page,
    config,
  };

  return { browser, page, ctx };
}

export async function closeBrowserSession(session: BrowserSession): Promise<void> {
  await session.browser.close();
}
