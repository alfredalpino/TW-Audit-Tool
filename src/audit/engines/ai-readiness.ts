import type { AuditEngine, AuditFindingInput } from "@/audit/types";
import { scoreFromFindings } from "@/audit/scoring";

export const aiReadinessEngine: AuditEngine = {
  id: "ai-readiness",
  category: "ai_readiness",
  async run(ctx) {
    const signals = await ctx.page.evaluate(() => {
      const jsonLd = document.querySelectorAll('script[type="application/ld+json"]').length;
      const microdata = document.querySelectorAll("[itemtype]").length;
      const semanticMain = document.querySelectorAll("main, article").length;
      const robotsMeta = document.querySelector('meta[name="robots"]')?.getAttribute("content");
      return { jsonLd, microdata, semanticMain, robotsMeta };
    });

    const findings: AuditFindingInput[] = [];

    if (signals.jsonLd === 0 && signals.microdata === 0) {
      findings.push({
        category: "ai_readiness",
        severity: "high",
        title: "No structured data (JSON-LD) detected",
        description:
          "Structured data helps search engines and AI crawlers understand entities and offers.",
        recommendation:
          "Add JSON-LD for Organization, WebSite, and primary page type (Product, Service, FAQ).",
        businessImpact:
          "Weak structure limits rich results and AI citation — reducing discoverability in emerging surfaces.",
      });
    }

    if (signals.semanticMain === 0) {
      findings.push({
        category: "ai_readiness",
        severity: "medium",
        title: "Limited semantic HTML landmarks",
        description: "No <main> or <article> elements found for content extraction.",
        recommendation: "Wrap primary content in <main> and use article/section where appropriate.",
        businessImpact:
          "LLM and crawler parsers rely on landmarks; poor structure reduces answer-engine visibility.",
      });
    }

    if (signals.robotsMeta?.includes("noindex")) {
      findings.push({
        category: "ai_readiness",
        severity: "critical",
        title: "Page marked noindex",
        description: "robots meta includes noindex — page may be excluded from search and AI indexes.",
        recommendation: "Remove noindex on public marketing pages intended to rank.",
        businessImpact:
          "Noindex pages cannot drive organic or AI-referred traffic — total visibility loss for this URL.",
      });
    }

    let llmsTxt = false;
    try {
      const origin = new URL(ctx.url).origin;
      const res = await fetch(`${origin}/llms.txt`, { method: "HEAD" });
      llmsTxt = res.ok;
    } catch {
      llmsTxt = false;
    }

    if (!llmsTxt) {
      findings.push({
        category: "ai_readiness",
        severity: "low",
        title: "No llms.txt discovered",
        description: "/llms.txt was not found (optional but emerging best practice for AI crawlers).",
        recommendation:
          "Publish llms.txt with site summary, allowed paths, and contact for AI systems.",
        businessImpact:
          "Early movers in AI discoverability may capture referral traffic from answer engines.",
      });
    }

    return {
      category: "ai_readiness",
      score: scoreFromFindings(findings),
      findings,
      breakdown: signals,
    };
  },
};
