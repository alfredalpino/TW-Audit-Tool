import type { AuditEngine, AuditFindingInput } from "@/audit/types";
import { scoreFromFindings } from "@/audit/scoring";

type CroSignals = {
  formCount: number;
  ctaCount: number;
  ctaAboveFold: number;
  phoneLinks: number;
  trustSignals: number;
};

export const croEngine: AuditEngine = {
  id: "cro",
  category: "cro",
  async run(ctx) {
    const signals: CroSignals = await ctx.page.evaluate(() => {
      const viewportHeight = window.innerHeight;
      const ctas = Array.from(
        document.querySelectorAll(
          'a[class*="btn"], button[class*="btn"], a[class*="cta"], button[class*="cta"], input[type="submit"], button[type="submit"]'
        )
      );
      const ctaAboveFold = ctas.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.top < viewportHeight && r.bottom > 0;
      }).length;
      const trustKeywords = ["testimonial", "review", "trusted", "certified", "guarantee"];
      const trustSignals = trustKeywords.filter((kw) =>
        document.body.innerText.toLowerCase().includes(kw)
      ).length;
      return {
        formCount: document.querySelectorAll("form").length,
        ctaCount: ctas.length,
        ctaAboveFold,
        phoneLinks: document.querySelectorAll('a[href^="tel:"]').length,
        trustSignals,
      };
    });

    const findings: AuditFindingInput[] = [];

    if (signals.ctaCount === 0) {
      findings.push({
        category: "cro",
        severity: "high",
        title: "No obvious primary CTA detected",
        description:
          "No button/CTA-styled elements found — visitors may lack a clear next step.",
        recommendation:
          "Add a high-contrast primary CTA above the fold with action-oriented copy.",
        businessImpact:
          "Missing CTAs often correlate with 15–30% fewer goal completions on landing pages.",
      });
    } else if (signals.ctaAboveFold === 0) {
      findings.push({
        category: "cro",
        severity: "high",
        title: "Primary CTA below the fold on mobile viewport",
        description:
          "CTA-styled elements exist but none appear in the initial viewport.",
        recommendation: "Place or duplicate a primary CTA visible without scrolling on mobile.",
        businessImpact:
          "Hidden CTAs increase friction — often 10–25% fewer form starts on mobile.",
      });
    }

    if (signals.formCount === 0 && signals.ctaCount > 0) {
      findings.push({
        category: "cro",
        severity: "medium",
        title: "No lead capture form detected",
        description:
          "The page has CTAs but no <form> — lead gen may rely only on mailto/tel links.",
        recommendation:
          "Add a lightweight lead form or embedded scheduler with clear value exchange.",
        businessImpact:
          "Without inline capture, you may lose 20–40% of visitors who won't initiate email/call.",
      });
    }

    if (signals.trustSignals === 0) {
      findings.push({
        category: "cro",
        severity: "medium",
        title: "Limited trust signals on page",
        description:
          "No common trust keywords (reviews, guarantees, certifications) detected in body copy.",
        recommendation:
          "Add social proof: logos, testimonials, ratings, or guarantees near the CTA.",
        businessImpact:
          "Low trust increases hesitation at decision point — typical 5–15% conversion drag for B2B.",
      });
    }

    return {
      category: "cro",
      score: scoreFromFindings(findings),
      findings,
      breakdown: signals,
    };
  },
};
