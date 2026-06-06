import type { AuditEngine, AuditFindingInput } from "@/audit/types";
import { scoreFromFindings } from "@/audit/scoring";

type VisualSignals = {
  aboveFoldElements: number;
  heroImage: boolean;
  fixedOverlays: number;
  colorContrastRisk: number;
  textAboveFold: number;
};

export const screenshotIntelligenceEngine: AuditEngine = {
  id: "screenshot",
  category: "screenshot",
  async run(ctx) {
    const signals: VisualSignals = await ctx.page.evaluate(() => {
      const viewportHeight = window.innerHeight;
      const allElements = Array.from(document.querySelectorAll("body *")).filter(
        (el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        }
      );

      const aboveFold = allElements.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.top < viewportHeight && r.bottom > 0;
      });

      const heroImage = !!document.querySelector(
        "header img, [class*='hero'] img, main img, section:first-of-type img"
      );

      const fixedOverlays = document.querySelectorAll(
        '[style*="position: fixed"], [style*="position:fixed"], .fixed, [class*="sticky-banner"]'
      ).length;

      let colorContrastRisk = 0;
      for (const el of Array.from(
        document.querySelectorAll("button, a[class*='btn'], a[class*='cta']")
      ).slice(0, 8)) {
        const style = window.getComputedStyle(el);
        const bg = style.backgroundColor;
        const fg = style.color;
        if (bg === "rgba(0, 0, 0, 0)" || bg === "transparent") continue;
        if (fg === bg) colorContrastRisk++;
      }

      const textAboveFold = aboveFold.filter(
        (el) => (el.textContent?.trim().length ?? 0) > 20
      ).length;

      return {
        aboveFoldElements: aboveFold.length,
        heroImage,
        fixedOverlays,
        colorContrastRisk,
        textAboveFold,
      };
    });

    const findings: AuditFindingInput[] = [];

    if (!signals.heroImage && signals.textAboveFold < 2) {
      findings.push({
        category: "screenshot",
        severity: "medium",
        title: "Weak above-the-fold visual hierarchy",
        description:
          "No hero imagery and limited text blocks detected in the initial viewport.",
        recommendation:
          "Add a clear hero with headline, subcopy, and visual anchor (image or illustration).",
        businessImpact:
          "Weak first impressions increase bounce — visitors decide relevance in ~3 seconds.",
      });
    }

    if (signals.fixedOverlays > 2) {
      findings.push({
        category: "screenshot",
        severity: "medium",
        title: "Multiple fixed overlays compete for attention",
        description: `${signals.fixedOverlays} fixed/sticky elements may obscure primary content.`,
        recommendation:
          "Limit to one persistent bar; dismiss or collapse secondary overlays on scroll.",
        businessImpact:
          "Overlay fatigue reduces engagement with primary CTAs and core messaging.",
      });
    }

    if (signals.colorContrastRisk > 0) {
      findings.push({
        category: "screenshot",
        severity: "high",
        title: "Potential CTA contrast issues",
        description: `${signals.colorContrastRisk} CTA-like element(s) may have insufficient contrast.`,
        recommendation:
          "Verify WCAG AA contrast (4.5:1) on all buttons and primary links.",
        businessImpact:
          "Low-contrast CTAs are harder to see — directly suppressing click-through and conversions.",
      });
    }

    if (signals.aboveFoldElements > 120) {
      findings.push({
        category: "screenshot",
        severity: "low",
        title: "Dense above-the-fold DOM",
        description: `${signals.aboveFoldElements} visible elements in the first viewport — possible clutter.`,
        recommendation:
          "Simplify hero layout; reduce competing widgets and animation layers above the fold.",
        businessImpact:
          "Visual clutter slows comprehension and weakens single primary action focus.",
      });
    }

    return {
      category: "screenshot",
      score: scoreFromFindings(findings),
      findings,
      breakdown: signals,
    };
  },
};
