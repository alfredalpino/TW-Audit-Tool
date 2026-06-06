import type { AuditEngine, AuditFindingInput } from "@/audit/types";
import { scoreFromFindings } from "@/audit/scoring";

type MobileSignals = {
  viewportMeta: boolean;
  horizontalOverflow: boolean;
  smallTapTargets: number;
  inputFontTooSmall: number;
  fixedElements: number;
};

export const mobileEngine: AuditEngine = {
  id: "mobile",
  category: "mobile",
  async run(ctx) {
    const mobileViewport = { width: 390, height: 844 };
    await ctx.page.setViewportSize(mobileViewport);

    const signals: MobileSignals = await ctx.page.evaluate(() => {
      const viewportMeta = !!document.querySelector('meta[name="viewport"]');
      const horizontalOverflow =
        document.documentElement.scrollWidth > window.innerWidth + 2;

      const smallTapTargets = Array.from(
        document.querySelectorAll("a, button, [role='button'], input[type='submit']")
      ).filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && (r.width < 44 || r.height < 44);
      }).length;

      const inputFontTooSmall = Array.from(
        document.querySelectorAll("input, select, textarea")
      ).filter((el) => {
        const size = parseFloat(window.getComputedStyle(el).fontSize);
        return size > 0 && size < 16;
      }).length;

      const fixedElements = document.querySelectorAll(
        '[style*="position: fixed"], [style*="position:fixed"]'
      ).length;

      return {
        viewportMeta,
        horizontalOverflow,
        smallTapTargets,
        inputFontTooSmall,
        fixedElements,
      };
    });

    const findings: AuditFindingInput[] = [];

    if (!signals.viewportMeta) {
      findings.push({
        category: "mobile",
        severity: "critical",
        title: "Missing viewport meta tag",
        description:
          "Without a viewport meta tag, mobile browsers render a desktop-width layout.",
        recommendation:
          'Add <meta name="viewport" content="width=device-width, initial-scale=1">.',
        businessImpact:
          "Broken mobile layout drives 15–30% bounce on phone traffic — often half of visits.",
      });
    }

    if (signals.horizontalOverflow) {
      findings.push({
        category: "mobile",
        severity: "high",
        title: "Horizontal scroll detected on mobile",
        description:
          "Page content exceeds the mobile viewport width, causing sideways scrolling.",
        recommendation:
          "Fix overflowing elements: max-width:100% on media, audit fixed-width containers.",
        businessImpact:
          "Horizontal scroll frustrates mobile users and correlates with higher exit rates.",
      });
    }

    if (signals.smallTapTargets > 5) {
      findings.push({
        category: "mobile",
        severity: "high",
        title: "Tap targets too small for touch",
        description: `${signals.smallTapTargets} interactive elements are smaller than 44×44px.`,
        recommendation:
          "Increase button/link padding to meet WCAG 2.5.5 target size (44×44px minimum).",
        businessImpact:
          "Undersized tap targets cause mis-taps and abandoned conversions on mobile.",
      });
    }

    if (signals.inputFontTooSmall > 0) {
      findings.push({
        category: "mobile",
        severity: "medium",
        title: "Form inputs may trigger iOS zoom",
        description: `${signals.inputFontTooSmall} form field(s) use font-size below 16px.`,
        recommendation: "Set input font-size to at least 16px to prevent auto-zoom on iOS.",
        businessImpact:
          "Unexpected zoom disrupts form completion — a common mobile lead-capture leak.",
      });
    }

    if (signals.fixedElements > 4) {
      findings.push({
        category: "mobile",
        severity: "low",
        title: "Many fixed-position elements on mobile",
        description: `${signals.fixedElements} inline fixed elements may reduce usable viewport.`,
        recommendation:
          "Consolidate sticky headers/CTAs; avoid stacking multiple fixed bars on mobile.",
        businessImpact:
          "Cluttered mobile chrome hides primary content and CTAs above the fold.",
      });
    }

    return {
      category: "mobile",
      score: scoreFromFindings(findings),
      findings,
      breakdown: signals,
    };
  },
};
