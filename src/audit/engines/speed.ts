import * as chromeLauncher from "chrome-launcher";
import type { AuditEngine, AuditFindingInput } from "@/audit/types";
import { scoreFromFindings } from "@/audit/scoring";

type LighthouseAuditRef = {
  id?: string;
  title?: string;
  displayValue?: string;
  score?: number | null;
};

function findingFromAudit(
  audit: LighthouseAuditRef,
  severity: AuditFindingInput["severity"],
  title: string,
  businessImpact: string,
  recommendation: string
): AuditFindingInput | null {
  if (audit.score === null || audit.score === undefined) return null;
  if (audit.score >= 0.9) return null;
  return {
    category: "speed",
    severity,
    title,
    description: audit.displayValue
      ? `${audit.title ?? title}: ${audit.displayValue}`
      : (audit.title ?? title),
    recommendation,
    businessImpact,
    evidence: { auditId: audit.id, score: audit.score },
  };
}

export const speedEngine: AuditEngine = {
  id: "speed",
  category: "speed",
  async run(ctx) {
    const chrome = await chromeLauncher.launch({
      chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
    });

    try {
      const lighthouse = (await import("lighthouse")).default;
      const result = await lighthouse(ctx.url, {
        logLevel: "error",
        output: "json",
        onlyCategories: ["performance"],
        port: chrome.port,
        formFactor: ctx.config.mobile !== false ? "mobile" : "desktop",
        screenEmulation: { disabled: false },
      });

      const lhr = result?.lhr;
      const perfScore = Math.round(
        (lhr?.categories?.performance?.score ?? 0) * 100
      );
      const audits = (lhr?.audits ?? {}) as Record<string, LighthouseAuditRef>;

      const findings: AuditFindingInput[] = [];

      const lcp = findingFromAudit(
        audits["largest-contentful-paint"] ?? {},
        perfScore < 50 ? "critical" : "high",
        "Largest Contentful Paint needs improvement",
        "Slow LCP delays first meaningful paint — each second of delay can increase bounce ~7%, leaking visitors before they convert.",
        "Optimize hero media, preload LCP image, reduce render-blocking resources."
      );
      if (lcp) findings.push(lcp);

      const cls = findingFromAudit(
        audits["cumulative-layout-shift"] ?? {},
        "medium",
        "Layout shift (CLS) above recommended threshold",
        "Unexpected layout shifts frustrate users and correlate with lower engagement on mobile.",
        "Reserve space for ads/images, use size attributes on media, avoid injecting content above existing UI."
      );
      if (cls) findings.push(cls);

      const tbt = findingFromAudit(
        audits["total-blocking-time"] ?? {},
        "medium",
        "Main-thread blocking time is elevated",
        "Heavy JavaScript blocks interaction and increases time-to-interactive on mid-tier devices.",
        "Split bundles, defer non-critical JS, and audit third-party scripts."
      );
      if (tbt) findings.push(tbt);

      if (perfScore < 50 && findings.length === 0) {
        findings.push({
          category: "speed",
          severity: "critical",
          title: "Performance score is critically low",
          description: `Lighthouse performance scored ${perfScore}/100.`,
          recommendation:
            "Run a full performance audit: compress images, enable CDN, reduce JS payload.",
          businessImpact:
            "Poor performance directly increases bounce and reduces ad/organic ROI — often 10–20% conversion loss on mobile.",
        });
      } else if (perfScore < 75 && findings.length === 0) {
        findings.push({
          category: "speed",
          severity: "medium",
          title: "Performance score below good threshold",
          description: `Lighthouse performance scored ${perfScore}/100 (target ≥75).`,
          recommendation: "Address Core Web Vitals: LCP, CLS, and interaction delay.",
          businessImpact:
            "Suboptimal speed erodes SEO rankings and increases paid traffic waste from high bounce.",
        });
      }

      const score =
        perfScore > 0
          ? Math.round(perfScore * 0.6 + scoreFromFindings(findings) * 0.4)
          : scoreFromFindings(findings);

      return {
        category: "speed",
        score: Math.max(0, Math.min(100, score)),
        findings,
        breakdown: {
          lighthousePerformance: perfScore,
          metrics: lhr?.audits?.["metrics"]?.details,
        },
      };
    } finally {
      await chrome.kill();
    }
  },
};
