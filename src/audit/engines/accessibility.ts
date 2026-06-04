import AxeBuilder from "@axe-core/playwright";
import type { AuditEngine, AuditFindingInput } from "@/audit/types";
import { scoreFromFindings } from "@/audit/scoring";

const IMPACT_SEVERITY: Record<string, AuditFindingInput["severity"]> = {
  critical: "critical",
  serious: "high",
  moderate: "medium",
  minor: "low",
};

export const accessibilityEngine: AuditEngine = {
  id: "accessibility",
  category: "accessibility",
  async run(ctx) {
    const axeResult = await new AxeBuilder({ page: ctx.page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    const findings: AuditFindingInput[] = [];
    const seen = new Set<string>();

    for (const violation of axeResult.violations.slice(0, 12)) {
      const key = violation.id;
      if (seen.has(key)) continue;
      seen.add(key);

      const nodes = violation.nodes.length;
      findings.push({
        category: "accessibility",
        severity: IMPACT_SEVERITY[violation.impact ?? ""] ?? "medium",
        title: violation.help,
        description: `${violation.description} (${nodes} instance${nodes === 1 ? "" : "s"} on page).`,
        recommendation: violation.helpUrl
          ? `See ${violation.helpUrl} for remediation guidance.`
          : "Fix the failing selectors reported in evidence.",
        businessImpact:
          violation.impact === "critical" || violation.impact === "serious"
            ? "Serious accessibility gaps create ADA/WCAG compliance exposure and exclude users who rely on assistive tech — reducing trust and conversions."
            : "Moderate accessibility issues add friction for keyboard and screen-reader users, often correlating with 3–8% conversion loss.",
        evidence: {
          ruleId: violation.id,
          impact: violation.impact,
          selectors: violation.nodes.slice(0, 3).map((n) => n.target),
        },
      });
    }

    if (axeResult.violations.length > 12) {
      findings.push({
        category: "accessibility",
        severity: "medium",
        title: `${axeResult.violations.length - 12} additional accessibility violations`,
        description:
          "Additional axe violations were detected beyond the top issues shown.",
        recommendation: "Run a full WCAG audit and remediate by severity.",
        businessImpact:
          "Accumulated violations compound compliance risk and usability debt.",
      });
    }

    return {
      category: "accessibility",
      score: scoreFromFindings(findings),
      findings,
      breakdown: {
        violationCount: axeResult.violations.length,
        passCount: axeResult.passes.length,
      },
    };
  },
};
