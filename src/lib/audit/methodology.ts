export type AuditRuntime = "browser" | "fetch";

export type MethodologyTool = {
  name: string;
  role: string;
};

export type AuditMethodology = {
  runtime: AuditRuntime;
  label: string;
  summary: string;
  tools: MethodologyTool[];
  limitations: string[];
};

const FETCH_TOOLS: MethodologyTool[] = [
  { name: "HTTP fetch", role: "Downloads live HTML + response headers from the target URL" },
  { name: "Cheerio", role: "Parses DOM structure, meta tags, links, forms, and content" },
  { name: "Header analysis", role: "Checks TLS, HSTS, CSP, compression, and cache signals" },
  { name: "robots.txt / llms.txt", role: "Fetches crawl and AI-discovery policy files when available" },
  { name: "Microlink / thum.io", role: "Captures desktop and mobile visual previews" },
  { name: "Torpedo heuristics", role: "12 category engines scoring SEO, speed, security, CRO, compliance, and more" },
];

const BROWSER_TOOLS: MethodologyTool[] = [
  { name: "Playwright (Chromium)", role: "Loads the page in a real browser with desktop and mobile viewports" },
  { name: "Lighthouse", role: "Measures Core Web Vitals (LCP, CLS, TBT) and performance audits" },
  { name: "axe-core", role: "Runs WCAG 2.x accessibility rule checks on the rendered DOM" },
  { name: "DOM intelligence", role: "UX, CRO, mobile layout, compliance, and content engines on live DOM" },
  { name: "Playwright screenshots", role: "Desktop and mobile PNG captures from the rendered page" },
];

export function getAuditMethodology(runtime: AuditRuntime = "fetch"): AuditMethodology {
  if (runtime === "browser") {
    return {
      runtime: "browser",
      label: "Full browser audit",
      summary:
        "This report used a headless Chromium worker with Lighthouse and axe-core on the live rendered page.",
      tools: BROWSER_TOOLS,
      limitations: [
        "JavaScript-heavy SPAs are fully rendered before analysis.",
        "Third-party scripts and network waterfalls are included in Lighthouse scoring.",
      ],
    };
  }

  return {
    runtime: "fetch",
    label: "Live HTML intelligence scan",
    summary:
      "This report analyzed the real HTML response and HTTP headers from your URL — not mock or demo data.",
    tools: FETCH_TOOLS,
    limitations: [
      "Content injected only via client-side JavaScript may not appear in the initial HTML.",
      "Core Web Vitals (LCP, CLS, INP) require the full browser worker tier with Lighthouse.",
      "WCAG violations beyond HTML structure require axe-core on the worker tier.",
    ],
  };
}
