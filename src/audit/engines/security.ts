import type { AuditEngine, AuditFindingInput } from "@/audit/types";
import { scoreFromFindings } from "@/audit/scoring";

export const securityEngine: AuditEngine = {
  id: "security",
  category: "security",
  async run(ctx) {
    const response = await ctx.page.goto(ctx.url, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    const headers = response?.headers() ?? {};
    const findings: AuditFindingInput[] = [];

    if (!ctx.url.startsWith("https://")) {
      findings.push({
        category: "security",
        severity: "critical",
        title: "TLS not in use",
        description: "Site is not loaded over HTTPS.",
        recommendation: "Deploy TLS 1.2+ and redirect HTTP to HTTPS.",
        businessImpact:
          "Data in transit is exposed; browsers warn users, eroding trust and conversions.",
      });
    }

    if (!headers["strict-transport-security"]) {
      findings.push({
        category: "security",
        severity: "medium",
        title: "HSTS header not present",
        description: "Strict-Transport-Security was not returned on the response.",
        recommendation:
          "Add HSTS with includeSubDomains after HTTPS is stable site-wide.",
        businessImpact:
          "Without HSTS, SSL stripping attacks remain possible on first visit.",
      });
    }

    if (!headers["content-security-policy"]) {
      findings.push({
        category: "security",
        severity: "medium",
        title: "No Content-Security-Policy header",
        description: "CSP helps mitigate XSS and unauthorized script injection.",
        recommendation: "Start with a report-only CSP, then enforce a strict policy.",
        businessImpact:
          "XSS incidents can deface sites, steal sessions, and trigger compliance incidents.",
      });
    }

    if (!headers["x-content-type-options"]) {
      findings.push({
        category: "security",
        severity: "low",
        title: "X-Content-Type-Options missing",
        description: "nosniff prevents MIME-type confusion attacks.",
        recommendation: 'Set X-Content-Type-Options: nosniff on all responses.',
        businessImpact: "Low immediate revenue impact; reduces exploit surface.",
      });
    }

    const mixedContent = await ctx.page.evaluate(() => {
      const insecure = Array.from(
        document.querySelectorAll('img[src^="http:"], script[src^="http:"], link[href^="http:"]')
      );
      return insecure.length;
    });

    if (mixedContent > 0 && ctx.url.startsWith("https://")) {
      findings.push({
        category: "security",
        severity: "high",
        title: "Mixed content detected on HTTPS page",
        description: `${mixedContent} resource(s) load over HTTP on an HTTPS page.`,
        recommendation: "Upgrade all asset URLs to HTTPS or use protocol-relative CDN paths.",
        businessImpact:
          "Browsers may block mixed content, breaking UI and undermining trust badges.",
      });
    }

    return {
      category: "security",
      score: scoreFromFindings(findings),
      findings,
      breakdown: {
        hasHsts: !!headers["strict-transport-security"],
        hasCsp: !!headers["content-security-policy"],
      },
    };
  },
};
