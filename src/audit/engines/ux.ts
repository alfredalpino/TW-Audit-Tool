import type { AuditEngine, AuditFindingInput } from "@/audit/types";
import { scoreFromFindings } from "@/audit/scoring";

type UxSignals = {
  linkCount: number;
  emptyLinks: number;
  smallTapTargets: number;
  hasSkipLink: boolean;
  headingLevels: number[];
};

export const uxEngine: AuditEngine = {
  id: "ux",
  category: "ux",
  async run(ctx) {
    const signals: UxSignals = await ctx.page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a"));
      const emptyLinks = links.filter(
        (a) => !a.textContent?.trim() && !a.getAttribute("aria-label")
      ).length;
      const smallTapTargets = Array.from(
        document.querySelectorAll("a, button, [role='button']")
      ).filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && (r.width < 44 || r.height < 44);
      }).length;
      const headings = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).map(
        (h) => parseInt(h.tagName[1], 10)
      );
      return {
        linkCount: links.length,
        emptyLinks,
        smallTapTargets,
        hasSkipLink: !!document.querySelector('a[href="#main"], a[href="#content"]'),
        headingLevels: headings,
      };
    });

    const findings: AuditFindingInput[] = [];

    if (signals.emptyLinks > 0) {
      findings.push({
        category: "ux",
        severity: "medium",
        title: "Links without visible text or aria-label",
        description: `${signals.emptyLinks} link(s) lack accessible names.`,
        recommendation: "Add descriptive link text or aria-label for icon-only links.",
        businessImpact:
          "Unlabeled controls confuse users and screen readers, increasing exit rate on key navigation.",
      });
    }

    if (signals.smallTapTargets > 3) {
      findings.push({
        category: "ux",
        severity: "medium",
        title: "Tap targets may be too small on mobile",
        description: `${signals.smallTapTargets} interactive elements are smaller than 44×44px.`,
        recommendation: "Increase padding/min-size on buttons and nav links for touch.",
        businessImpact:
          "Small tap targets increase mis-taps and frustration — a common mobile conversion killer.",
      });
    }

    let prev = 0;
    let skippedLevel = false;
    for (const level of signals.headingLevels) {
      if (prev > 0 && level > prev + 1) skippedLevel = true;
      prev = level;
    }
    if (skippedLevel) {
      findings.push({
        category: "ux",
        severity: "low",
        title: "Heading hierarchy skips levels",
        description: "Heading levels jump (e.g. H2 to H4) which hurts document outline clarity.",
        recommendation: "Use sequential heading levels without skipping.",
        businessImpact:
          "Poor hierarchy makes scanning harder and weakens accessibility for assistive tech users.",
      });
    }

    if (!signals.hasSkipLink && signals.linkCount > 15) {
      findings.push({
        category: "ux",
        severity: "low",
        title: "No skip-to-content link detected",
        description: "Long pages benefit from a skip navigation link for keyboard users.",
        recommendation: 'Add <a href="#main-content">Skip to content</a> as first focusable element.',
        businessImpact:
          "Keyboard users face friction reaching primary content — minor but measurable on content-heavy pages.",
      });
    }

    return {
      category: "ux",
      score: scoreFromFindings(findings),
      findings,
      breakdown: signals,
    };
  },
};
