import type { AuditEngine, AuditFindingInput } from "@/audit/types";
import { scoreFromFindings } from "@/audit/scoring";

export const technicalEngine: AuditEngine = {
  id: "technical",
  category: "technical",
  async run(ctx) {
    const response = await ctx.page.goto(ctx.url, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    const headers = response?.headers() ?? {};
    const findings: AuditFindingInput[] = [];

    const viewport = await ctx.page
      .locator('meta[name="viewport"]')
      .count();
    if (viewport === 0) {
      findings.push({
        category: "technical",
        severity: "high",
        title: "Missing viewport meta tag",
        description: "No viewport meta tag — mobile layouts may not scale correctly.",
        recommendation:
          'Add <meta name="viewport" content="width=device-width, initial-scale=1">.',
        businessImpact:
          "Broken mobile rendering increases bounce on phones — often 15–30% of traffic.",
      });
    }

    const charset = await ctx.page.locator("meta[charset]").count();
    if (charset === 0) {
      findings.push({
        category: "technical",
        severity: "low",
        title: "No charset meta declaration",
        description: "Character encoding should be declared early in the document.",
        recommendation: 'Use <meta charset="utf-8"> in <head>.',
        businessImpact:
          "Encoding issues can garble copy and hurt crawl quality on non-ASCII content.",
      });
    }

    const hasCompression =
      headers["content-encoding"]?.includes("gzip") ||
      headers["content-encoding"]?.includes("br");
    if (!hasCompression && response) {
      findings.push({
        category: "technical",
        severity: "medium",
        title: "Response may not use compression",
        description: "No gzip/br content-encoding header detected on HTML response.",
        recommendation: "Enable Brotli or gzip compression on the origin or CDN.",
        businessImpact:
          "Uncompressed HTML slows TTFB perception and increases data costs on mobile networks.",
      });
    }

    const server = headers["server"] ?? headers["x-powered-by"];
    if (server) {
      findings.push({
        category: "technical",
        severity: "info",
        title: "Server fingerprint exposed",
        description: `Response exposes stack hint: ${server}`,
        recommendation: "Remove or genericize Server / X-Powered-By headers in production.",
        businessImpact:
          "Version leaks assist targeted attacks — low direct revenue impact but elevated security risk.",
        evidence: { server },
      });
    }

    const isHttps = ctx.url.startsWith("https://");
    if (!isHttps) {
      findings.push({
        category: "technical",
        severity: "critical",
        title: "Site not served over HTTPS",
        description: "The audited URL uses HTTP without TLS.",
        recommendation: "Enforce HTTPS with valid certificates and HSTS.",
        businessImpact:
          "Browsers flag non-HTTPS sites; trust and SEO suffer, and form data may be intercepted.",
      });
    }

    return {
      category: "technical",
      score: scoreFromFindings(findings),
      findings,
      breakdown: { headerKeys: Object.keys(headers).slice(0, 20) },
    };
  },
};
