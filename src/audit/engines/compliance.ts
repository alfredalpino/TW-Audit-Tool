import type { AuditEngine, AuditFindingInput } from "@/audit/types";
import { scoreFromFindings } from "@/audit/scoring";

type ComplianceSignals = {
  cookieBanner: boolean;
  privacyLink: boolean;
  termsLink: boolean;
  doNotSellLink: boolean;
  cookiePolicyLink: boolean;
  gdprKeywords: boolean;
};

export const complianceEngine: AuditEngine = {
  id: "compliance",
  category: "compliance",
  async run(ctx) {
    const signals: ComplianceSignals = await ctx.page.evaluate(() => {
      const bodyText = document.body?.innerText?.toLowerCase() ?? "";
      const links = Array.from(document.querySelectorAll("a[href]")).map((a) => ({
        text: (a.textContent ?? "").toLowerCase(),
        href: (a.getAttribute("href") ?? "").toLowerCase(),
      }));

      const matchLink = (patterns: RegExp[]) =>
        links.some(
          (l) => patterns.some((p) => p.test(l.text) || p.test(l.href))
        );

      const cookieBanner = !!document.querySelector(
        '[id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i], [id*="onetrust" i], [class*="gdpr" i], [aria-label*="cookie" i]'
      );

      return {
        cookieBanner,
        privacyLink: matchLink([/privacy/, /privacy-policy/]),
        termsLink: matchLink([/terms/, /terms-of-service/, /terms-and-conditions/]),
        doNotSellLink: matchLink([/do-not-sell/, /donotsell/, /do not sell/]),
        cookiePolicyLink: matchLink([/cookie-policy/, /cookies-policy/, /cookie policy/]),
        gdprKeywords:
          bodyText.includes("gdpr") ||
          bodyText.includes("data protection") ||
          bodyText.includes("personal data"),
      };
    });

    const findings: AuditFindingInput[] = [];

    if (!signals.cookieBanner) {
      findings.push({
        category: "compliance",
        severity: "high",
        title: "No cookie consent banner detected",
        description:
          "No common cookie/consent UI was found — required for GDPR/ePrivacy in EU traffic.",
        recommendation:
          "Deploy a consent management platform (CMP) with granular opt-in before non-essential cookies.",
        businessImpact:
          "Missing consent flows create regulatory fines (GDPR up to 4% revenue) and erode trust with privacy-conscious buyers.",
      });
    }

    if (!signals.privacyLink) {
      findings.push({
        category: "compliance",
        severity: "high",
        title: "Privacy policy link not found",
        description:
          "No link to a privacy policy was detected in the page navigation or footer.",
        recommendation:
          "Publish a privacy policy and link it from the footer on every page.",
        businessImpact:
          "Privacy policy gaps are a common GDPR/CCPA deficiency and can block enterprise procurement.",
      });
    }

    if (!signals.termsLink) {
      findings.push({
        category: "compliance",
        severity: "medium",
        title: "Terms of service link not found",
        description: "No terms-of-service link detected on the audited page.",
        recommendation:
          "Add terms of service covering data use, liability, and acceptable use.",
        businessImpact:
          "Weak legal coverage increases dispute risk and slows B2B vendor reviews.",
      });
    }

    if (!signals.doNotSellLink && signals.gdprKeywords) {
      findings.push({
        category: "compliance",
        severity: "medium",
        title: "CCPA 'Do Not Sell' link not detected",
        description:
          "Privacy-related copy exists but no CCPA opt-out / do-not-sell link was found.",
        recommendation:
          "Add a 'Do Not Sell My Personal Information' link for California visitors.",
        businessImpact:
          "CCPA non-compliance can trigger penalties and limit US enterprise deals.",
      });
    }

    if (!signals.cookiePolicyLink && signals.cookieBanner) {
      findings.push({
        category: "compliance",
        severity: "low",
        title: "Dedicated cookie policy link not found",
        description:
          "A consent banner exists but no standalone cookie policy link was detected.",
        recommendation:
          "Link to a cookie policy describing categories, retention, and third parties.",
        businessImpact:
          "Incomplete cookie transparency weakens consent validity under ePrivacy rules.",
      });
    }

    return {
      category: "compliance",
      score: scoreFromFindings(findings),
      findings,
      breakdown: signals,
    };
  },
};
