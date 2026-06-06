import * as cheerio from "cheerio";
import type { AuditRunConfig } from "@/lib/db/schema";
import { assertPublicUrl } from "@/lib/url";
import type { AuditFindingInput, EngineResult } from "@/audit/types";
import { scoreFromFindings } from "@/audit/scoring";
import type { FindingCategory } from "@/types/audit";

export type FetchAuditContext = {
  url: string;
  normalizedUrl: string;
  runId: string;
  config: AuditRunConfig;
  runtime: "fetch";
  html: string;
  headers: Record<string, string>;
  responseTimeMs: number;
  htmlBytes: number;
};

export type FetchSession = {
  ctx: FetchAuditContext;
  $: cheerio.CheerioAPI;
};

export async function createFetchSession(
  url: string,
  normalizedUrl: string,
  runId: string,
  config: AuditRunConfig
): Promise<FetchSession> {
  assertPublicUrl(url);
  const start = Date.now();
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "User-Agent":
        "TorpedoAuditBot/1.0 (+https://audit.torpedoweb.org; website intelligence)",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(30_000),
  });

  const html = await response.text();
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  const ctx: FetchAuditContext = {
    url,
    normalizedUrl,
    runId,
    config,
    runtime: "fetch",
    html,
    headers,
    responseTimeMs: Date.now() - start,
    htmlBytes: Buffer.byteLength(html, "utf8"),
  };

  return { ctx, $: cheerio.load(html) };
}

type FetchEngine = {
  id: string;
  category: FindingCategory;
  run: (session: FetchSession) => Promise<EngineResult>;
};

function seoFetchEngine(session: FetchSession): EngineResult {
  const { $, ctx } = session;
  const findings: AuditFindingInput[] = [];
  const title = $("title").first().text().trim();
  const metaDesc = $('meta[name="description"]').attr("content")?.trim() ?? "";
  const h1Count = $("h1").length;
  const canonical = $('link[rel="canonical"]').attr("href") ?? null;

  if (!title || title.length < 10) {
    findings.push({
      category: "seo",
      severity: "high",
      title: "Missing or very short page title",
      description: "The document title is empty or too short for search performance.",
      recommendation: "Add a unique 50–60 character title with primary keyword and brand.",
      businessImpact:
        "Weak titles reduce organic CTR — often costing 5–12% of potential search traffic.",
    });
  }
  if (!metaDesc) {
    findings.push({
      category: "seo",
      severity: "high",
      title: "Missing meta description",
      description: "No meta description tag was found in the HTML response.",
      recommendation: "Write a unique 150–160 character meta description.",
      businessImpact:
        "Missing descriptions often reduce CTR by 8–15% from organic search.",
    });
  }
  if (h1Count === 0) {
    findings.push({
      category: "seo",
      severity: "high",
      title: "No H1 heading found",
      description: "The HTML lacks a primary H1 element.",
      recommendation: "Add one descriptive H1 aligned with page intent.",
      businessImpact: "Missing H1 weakens topical clarity for crawlers and visitors.",
    });
  }
  if (!canonical) {
    findings.push({
      category: "seo",
      severity: "medium",
      title: "No canonical URL declared",
      description: "No rel=canonical link in HTML.",
      recommendation: "Add a self-referencing canonical tag.",
      businessImpact: "Duplicate URLs can split ranking equity.",
    });
  }

  return {
    category: "seo",
    score: scoreFromFindings(findings),
    findings,
    breakdown: { title, metaDescLength: metaDesc.length, h1Count, canonical, mode: "fetch" },
  };
}

function speedFetchEngine(session: FetchSession): EngineResult {
  const { ctx } = session;
  const findings: AuditFindingInput[] = [];
  const scriptCount = (ctx.html.match(/<script\b/gi) ?? []).length;
  const ttfbMs = ctx.responseTimeMs;

  if (ttfbMs > 800) {
    findings.push({
      category: "speed",
      severity: ttfbMs > 2000 ? "critical" : "high",
      title: "Slow server response time (TTFB heuristic)",
      description: `HTML fetch took ${ttfbMs}ms (target <800ms). Lighthouse not available in fetch mode.`,
      recommendation: "Optimize origin TTFB: CDN, caching, database queries, serverless cold starts.",
      businessImpact:
        "Slow TTFB delays first paint — each second increases bounce ~7% on mobile.",
    });
  }

  if (ctx.htmlBytes > 500_000) {
    findings.push({
      category: "speed",
      severity: "medium",
      title: "Large HTML payload",
      description: `HTML document is ~${Math.round(ctx.htmlBytes / 1024)}KB uncompressed.`,
      recommendation: "Reduce inline scripts/styles; lazy-load below-fold content.",
      businessImpact: "Heavy HTML slows parse and render on mobile networks.",
    });
  }

  if (scriptCount > 25) {
    findings.push({
      category: "speed",
      severity: "medium",
      title: "High script tag count",
      description: `${scriptCount} <script> tags detected — likely render-blocking JS debt.`,
      recommendation: "Audit third-party scripts; defer non-critical JS.",
      businessImpact: "Script bloat increases main-thread blocking and interaction delay.",
    });
  }

  if (findings.length === 0 && ttfbMs > 400) {
    findings.push({
      category: "speed",
      severity: "low",
      title: "Speed audit limited in fetch mode",
      description:
        "Core Web Vitals (LCP, CLS, INP) require Lighthouse on the worker tier.",
      recommendation: "Run a full audit via worker for Lighthouse performance scoring.",
      businessImpact: "Fetch mode provides TTFB/size heuristics only — not full CWV data.",
    });
  }

  return {
    category: "speed",
    score: scoreFromFindings(findings),
    findings,
    breakdown: { ttfbMs, htmlBytes: ctx.htmlBytes, scriptCount, mode: "fetch" },
  };
}

function securityFetchEngine(session: FetchSession): EngineResult {
  const { ctx } = session;
  const findings: AuditFindingInput[] = [];
  const headers = ctx.headers;

  if (!ctx.url.startsWith("https://")) {
    findings.push({
      category: "security",
      severity: "critical",
      title: "TLS not in use",
      description: "Site is not loaded over HTTPS.",
      recommendation: "Deploy TLS 1.2+ and redirect HTTP to HTTPS.",
      businessImpact: "Data in transit is exposed; browsers warn users.",
    });
  }
  if (!headers["strict-transport-security"]) {
    findings.push({
      category: "security",
      severity: "medium",
      title: "HSTS header not present",
      description: "Strict-Transport-Security was not returned.",
      recommendation: "Add HSTS after HTTPS is stable site-wide.",
      businessImpact: "Without HSTS, SSL stripping attacks remain possible.",
    });
  }
  if (!headers["content-security-policy"]) {
    findings.push({
      category: "security",
      severity: "medium",
      title: "No Content-Security-Policy header",
      description: "CSP helps mitigate XSS and script injection.",
      recommendation: "Start with report-only CSP, then enforce.",
      businessImpact: "XSS incidents can steal sessions and trigger compliance issues.",
    });
  }

  const mixedContent = (ctx.html.match(/(?:src|href)=["']http:\/\//gi) ?? []).length;
  if (mixedContent > 0 && ctx.url.startsWith("https://")) {
    findings.push({
      category: "security",
      severity: "high",
      title: "Mixed content references in HTML",
      description: `${mixedContent} HTTP resource reference(s) on HTTPS page.`,
      recommendation: "Upgrade all asset URLs to HTTPS.",
      businessImpact: "Browsers may block mixed content, breaking UI.",
    });
  }

  return {
    category: "security",
    score: scoreFromFindings(findings),
    findings,
    breakdown: { mode: "fetch" },
  };
}

function technicalFetchEngine(session: FetchSession): EngineResult {
  const { $, ctx } = session;
  const findings: AuditFindingInput[] = [];

  if ($('meta[name="viewport"]').length === 0) {
    findings.push({
      category: "technical",
      severity: "high",
      title: "Missing viewport meta tag",
      description: "No viewport meta — mobile layouts may not scale.",
      recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.',
      businessImpact: "Broken mobile rendering increases bounce on phones.",
    });
  }
  if ($("meta[charset]").length === 0) {
    findings.push({
      category: "technical",
      severity: "low",
      title: "No charset meta declaration",
      description: "Character encoding should be declared in <head>.",
      recommendation: 'Use <meta charset="utf-8">.',
      businessImpact: "Encoding issues can garble copy for crawlers.",
    });
  }

  const encoding = ctx.headers["content-encoding"];
  if (!encoding?.includes("gzip") && !encoding?.includes("br")) {
    findings.push({
      category: "technical",
      severity: "medium",
      title: "Response may not use compression",
      description: "No gzip/br content-encoding on HTML response.",
      recommendation: "Enable Brotli or gzip on origin/CDN.",
      businessImpact: "Uncompressed HTML slows delivery on mobile networks.",
    });
  }

  return {
    category: "technical",
    score: scoreFromFindings(findings),
    findings,
    breakdown: { mode: "fetch" },
  };
}

function accessibilityFetchEngine(session: FetchSession): EngineResult {
  const { $ } = session;
  const findings: AuditFindingInput[] = [];
  const images = $("img");
  const missingAlt = images.filter((_, el) => !$(el).attr("alt")?.trim()).length;
  const inputs = $("input:not([type='hidden'])");
  const unlabeled = inputs.filter((_, el) => {
    const id = $(el).attr("id");
    const hasLabel = id ? $(`label[for="${id}"]`).length > 0 : false;
    const hasAria = !!$(el).attr("aria-label") || !!$(el).attr("aria-labelledby");
    return !hasLabel && !hasAria;
  }).length;

  if (missingAlt > 0) {
    findings.push({
      category: "accessibility",
      severity: missingAlt > 3 ? "high" : "medium",
      title: "Images missing alt text",
      description: `${missingAlt} image(s) lack alt attributes (HTML heuristic).`,
      recommendation: "Add descriptive alt text; use alt=\"\" for decorative images.",
      businessImpact: "Missing alt text excludes screen-reader users and fails WCAG 1.1.1.",
    });
  }
  if (unlabeled > 0) {
    findings.push({
      category: "accessibility",
      severity: "high",
      title: "Form inputs without labels",
      description: `${unlabeled} visible input(s) lack associated labels or aria labels.`,
      recommendation: "Associate each input with a <label> or aria-label.",
      businessImpact: "Unlabeled forms block assistive tech users from converting.",
    });
  }
  if (!$("html").attr("lang")) {
    findings.push({
      category: "accessibility",
      severity: "medium",
      title: "HTML lang attribute missing",
      description: "Page language is not declared on <html>.",
      recommendation: 'Set lang="en" (or locale) on <html>.',
      businessImpact: "Screen readers may mispronounce content.",
    });
  }

  findings.push({
    category: "accessibility",
    severity: "info",
    title: "Full WCAG audit requires worker tier",
    description:
      "axe-core + Playwright runs on the worker for complete accessibility violations.",
    recommendation: "Deploy worker for axe WCAG 2.1 AA analysis.",
    businessImpact: "Fetch mode catches common HTML issues only.",
  });

  const scored = findings.filter((f) => f.severity !== "info");
  return {
    category: "accessibility",
    score: scoreFromFindings(scored),
    findings,
    breakdown: { missingAlt, unlabeled, mode: "fetch" },
  };
}

function uxFetchEngine(session: FetchSession): EngineResult {
  const { $ } = session;
  const findings: AuditFindingInput[] = [];
  const emptyLinks = $("a").filter((_, el) => {
    const text = $(el).text().trim();
    const aria = $(el).attr("aria-label");
    return !text && !aria;
  }).length;

  if (emptyLinks > 0) {
    findings.push({
      category: "ux",
      severity: "medium",
      title: "Links without visible text or aria-label",
      description: `${emptyLinks} link(s) lack accessible names in HTML.`,
      recommendation: "Add descriptive link text or aria-label.",
      businessImpact: "Unlabeled links confuse users and screen readers.",
    });
  }

  const headings = $("h1,h2,h3,h4,h5,h6")
    .map((_, el) => parseInt(el.tagName[1], 10))
    .get();
  let prev = 0;
  let skipped = false;
  for (const level of headings) {
    if (prev > 0 && level > prev + 1) skipped = true;
    prev = level;
  }
  if (skipped) {
    findings.push({
      category: "ux",
      severity: "low",
      title: "Heading hierarchy skips levels",
      description: "Heading levels jump in the HTML outline.",
      recommendation: "Use sequential heading levels.",
      businessImpact: "Poor hierarchy makes scanning harder.",
    });
  }

  return {
    category: "ux",
    score: scoreFromFindings(findings),
    findings,
    breakdown: { emptyLinks, mode: "fetch" },
  };
}

function croFetchEngine(session: FetchSession): EngineResult {
  const { $ } = session;
  const findings: AuditFindingInput[] = [];
  const forms = $("form").length;
  const ctas = $(
    'a[class*="btn"], button[class*="btn"], a[class*="cta"], button[class*="cta"], input[type="submit"]'
  ).length;
  const bodyText = $("body").text().toLowerCase();
  const trustKeywords = ["testimonial", "review", "trusted", "certified", "guarantee"];
  const trustSignals = trustKeywords.filter((kw) => bodyText.includes(kw)).length;

  if (ctas === 0) {
    findings.push({
      category: "cro",
      severity: "high",
      title: "No obvious primary CTA detected",
      description: "No button/CTA-styled elements in HTML.",
      recommendation: "Add a high-contrast primary CTA above the fold.",
      businessImpact: "Missing CTAs correlate with 15–30% fewer goal completions.",
    });
  }
  if (forms === 0 && ctas > 0) {
    findings.push({
      category: "cro",
      severity: "medium",
      title: "No lead capture form detected",
      description: "CTAs exist but no <form> in HTML.",
      recommendation: "Add inline lead capture or scheduler embed.",
      businessImpact: "Without inline capture, visitors may not convert.",
    });
  }
  if (trustSignals === 0) {
    findings.push({
      category: "cro",
      severity: "medium",
      title: "Limited trust signals on page",
      description: "No common trust keywords in body copy.",
      recommendation: "Add testimonials, logos, or guarantees near CTAs.",
      businessImpact: "Low trust increases hesitation at decision point.",
    });
  }

  return {
    category: "cro",
    score: scoreFromFindings(findings),
    findings,
    breakdown: { forms, ctas, trustSignals, mode: "fetch" },
  };
}

function complianceFetchEngine(session: FetchSession): EngineResult {
  const { $ } = session;
  const findings: AuditFindingInput[] = [];
  const bodyText = $("body").text().toLowerCase();
  const links = $("a")
    .map((_, el) => ({
      text: $(el).text().toLowerCase(),
      href: ($(el).attr("href") ?? "").toLowerCase(),
    }))
    .get();

  const matchLink = (patterns: RegExp[]) =>
    links.some((l) => patterns.some((p) => p.test(l.text) || p.test(l.href)));

  const cookieBanner =
    $('[id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i]').length >
    0;

  if (!cookieBanner) {
    findings.push({
      category: "compliance",
      severity: "high",
      title: "No cookie consent banner detected",
      description: "No cookie/consent UI markers in HTML.",
      recommendation: "Deploy a CMP with granular opt-in.",
      businessImpact: "Missing consent creates GDPR/ePrivacy exposure.",
    });
  }
  if (!matchLink([/privacy/, /privacy-policy/])) {
    findings.push({
      category: "compliance",
      severity: "high",
      title: "Privacy policy link not found",
      description: "No privacy policy link in HTML.",
      recommendation: "Publish and link a privacy policy from the footer.",
      businessImpact: "Privacy gaps block enterprise procurement.",
    });
  }
  if (
    !matchLink([/do-not-sell/, /donotsell/]) &&
    (bodyText.includes("gdpr") || bodyText.includes("california"))
  ) {
    findings.push({
      category: "compliance",
      severity: "medium",
      title: "CCPA opt-out link not detected",
      description: "Privacy copy exists but no do-not-sell link found.",
      recommendation: "Add CCPA opt-out for California visitors.",
      businessImpact: "CCPA gaps limit US enterprise deals.",
    });
  }

  return {
    category: "compliance",
    score: scoreFromFindings(findings),
    findings,
    breakdown: { cookieBanner, mode: "fetch" },
  };
}

function aiReadinessFetchEngine(session: FetchSession): EngineResult {
  const { $ } = session;
  const findings: AuditFindingInput[] = [];
  const jsonLd = $('script[type="application/ld+json"]').length;
  const semanticMain = $("main, article").length;
  const robotsMeta = $('meta[name="robots"]').attr("content") ?? "";

  if (jsonLd === 0) {
    findings.push({
      category: "ai_readiness",
      severity: "high",
      title: "No structured data (JSON-LD) detected",
      description: "No JSON-LD scripts in HTML.",
      recommendation: "Add JSON-LD for Organization and page type.",
      businessImpact: "Weak structure limits rich results and AI citation.",
    });
  }
  if (semanticMain === 0) {
    findings.push({
      category: "ai_readiness",
      severity: "medium",
      title: "Limited semantic HTML landmarks",
      description: "No <main> or <article> in HTML.",
      recommendation: "Wrap primary content in <main>.",
      businessImpact: "Poor landmarks reduce crawler/LLM extraction quality.",
    });
  }
  if (robotsMeta.includes("noindex")) {
    findings.push({
      category: "ai_readiness",
      severity: "critical",
      title: "Page marked noindex",
      description: "robots meta includes noindex.",
      recommendation: "Remove noindex on public marketing pages.",
      businessImpact: "Noindex pages cannot drive organic or AI traffic.",
    });
  }

  return {
    category: "ai_readiness",
    score: scoreFromFindings(findings),
    findings,
    breakdown: { jsonLd, semanticMain, mode: "fetch" },
  };
}

function mobileFetchEngine(session: FetchSession): EngineResult {
  const { $ } = session;
  const findings: AuditFindingInput[] = [];
  const viewport = $('meta[name="viewport"]').attr("content") ?? "";

  if (!viewport) {
    findings.push({
      category: "mobile",
      severity: "critical",
      title: "Missing viewport meta tag",
      description: "No viewport meta in HTML.",
      recommendation: 'Add width=device-width viewport meta.',
      businessImpact: "Broken mobile layout drives high bounce on phones.",
    });
  } else if (!viewport.includes("width=device-width")) {
    findings.push({
      category: "mobile",
      severity: "medium",
      title: "Viewport meta may not target device width",
      description: `Viewport content: "${viewport}"`,
      recommendation: "Use width=device-width, initial-scale=1.",
      businessImpact: "Incorrect viewport settings break responsive layouts.",
    });
  }

  findings.push({
    category: "mobile",
    severity: "info",
    title: "Mobile layout audit limited in fetch mode",
    description:
      "Overflow and tap-target checks require Playwright on the worker tier.",
    recommendation: "Run worker audit for mobile viewport rendering tests.",
    businessImpact: "Fetch mode validates viewport meta only.",
  });

  const scored = findings.filter((f) => f.severity !== "info");
  return {
    category: "mobile",
    score: scoreFromFindings(scored),
    findings,
    breakdown: { viewport, mode: "fetch" },
  };
}

function contentFetchEngine(session: FetchSession): EngineResult {
  const { $ } = session;
  const findings: AuditFindingInput[] = [];
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const words = bodyText ? bodyText.split(/\s+/).length : 0;
  const images = $("img");
  const missingAlt = images.filter((_, el) => !$(el).attr("alt")?.trim()).length;

  if (words < 150) {
    findings.push({
      category: "content",
      severity: "high",
      title: "Thin content detected",
      description: `~${words} words in body text.`,
      recommendation: "Expand with unique value, proof, and FAQs.",
      businessImpact: "Thin pages struggle to rank and convert.",
    });
  }
  if (/lorem ipsum/i.test(bodyText)) {
    findings.push({
      category: "content",
      severity: "critical",
      title: "Placeholder (lorem ipsum) text detected",
      description: "Placeholder copy visible in HTML.",
      recommendation: "Replace with production-ready copy.",
      businessImpact: "Placeholder content destroys credibility.",
    });
  }
  if (images.length > 0 && missingAlt / images.length > 0.3) {
    findings.push({
      category: "content",
      severity: "medium",
      title: "Many images missing alt text",
      description: `${missingAlt}/${images.length} images lack alt.`,
      recommendation: "Add descriptive alt attributes.",
      businessImpact: "Hurts accessibility and image SEO.",
    });
  }

  return {
    category: "content",
    score: scoreFromFindings(findings),
    findings,
    breakdown: { wordCount: words, mode: "fetch" },
  };
}

function screenshotFetchEngine(session: FetchSession): EngineResult {
  const findings: AuditFindingInput[] = [
    {
      category: "screenshot",
      severity: "info",
      title: "Screenshot capture requires worker tier",
      description:
        "Desktop/mobile screenshots and visual analysis run via Playwright on the worker.",
      recommendation: "Deploy worker for screenshot capture and visual intelligence.",
      businessImpact: "Screenshots support sales-ready reports and visual QA.",
    },
  ];

  return {
    category: "screenshot",
    score: 100,
    findings,
    breakdown: { mode: "fetch", captured: false },
  };
}

const FETCH_ENGINES: FetchEngine[] = [
  { id: "seo", category: "seo", run: async (s) => seoFetchEngine(s) },
  { id: "technical", category: "technical", run: async (s) => technicalFetchEngine(s) },
  { id: "ux", category: "ux", run: async (s) => uxFetchEngine(s) },
  { id: "cro", category: "cro", run: async (s) => croFetchEngine(s) },
  { id: "security", category: "security", run: async (s) => securityFetchEngine(s) },
  { id: "compliance", category: "compliance", run: async (s) => complianceFetchEngine(s) },
  { id: "ai-readiness", category: "ai_readiness", run: async (s) => aiReadinessFetchEngine(s) },
  { id: "content", category: "content", run: async (s) => contentFetchEngine(s) },
  { id: "mobile", category: "mobile", run: async (s) => mobileFetchEngine(s) },
  { id: "accessibility", category: "accessibility", run: async (s) => accessibilityFetchEngine(s) },
  { id: "speed", category: "speed", run: async (s) => speedFetchEngine(s) },
  { id: "screenshot", category: "screenshot", run: async (s) => screenshotFetchEngine(s) },
];

export type FetchOrchestratorProgress = (
  engineId: string,
  result: EngineResult
) => Promise<void>;

export async function runFetchAuditEngines(
  session: FetchSession,
  onProgress?: FetchOrchestratorProgress
): Promise<{ results: EngineResult[]; allFindings: AuditFindingInput[] }> {
  const categories = session.ctx.config.categories;
  const engines = categories?.length
    ? FETCH_ENGINES.filter((e) => categories.includes(e.category))
    : FETCH_ENGINES;

  const results: EngineResult[] = [];
  const allFindings: AuditFindingInput[] = [];

  for (const engine of engines) {
    const result = await engine.run(session);
    results.push(result);
    allFindings.push(...result.findings);
    if (onProgress) await onProgress(engine.id, result);
  }

  return { results, allFindings };
}
