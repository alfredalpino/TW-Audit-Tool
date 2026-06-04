import type { AuditEngine, AuditFindingInput } from "@/audit/types";
import { scoreFromFindings } from "@/audit/scoring";

type SeoSignals = {
  title: string | null;
  titleLength: number;
  metaDescription: string | null;
  metaDescriptionLength: number;
  h1Count: number;
  canonical: string | null;
  ogTitle: boolean;
  ogDescription: boolean;
  lang: string | null;
};

async function collectSeoSignals(page: import("playwright").Page): Promise<SeoSignals> {
  return page.evaluate(() => {
    const title = document.title?.trim() ?? null;
    const metaDesc = document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content")
      ?.trim() ?? null;
    const canonical =
      document.querySelector('link[rel="canonical"]')?.getAttribute("href") ??
      null;
    const ogTitle = !!document.querySelector('meta[property="og:title"]');
    const ogDescription = !!document.querySelector(
      'meta[property="og:description"]'
    );
    return {
      title,
      titleLength: title?.length ?? 0,
      metaDescription: metaDesc,
      metaDescriptionLength: metaDesc?.length ?? 0,
      h1Count: document.querySelectorAll("h1").length,
      canonical,
      ogTitle,
      ogDescription,
      lang: document.documentElement.lang || null,
    };
  });
}

function buildSeoFindings(signals: SeoSignals): AuditFindingInput[] {
  const findings: AuditFindingInput[] = [];

  if (!signals.title || signals.titleLength < 10) {
    findings.push({
      category: "seo",
      severity: "high",
      title: "Missing or very short page title",
      description:
        "The document title is empty or too short to perform well in search results.",
      recommendation:
        "Add a unique 50–60 character title with primary keyword and brand.",
      businessImpact:
        "Weak titles reduce organic CTR and brand recognition in SERPs, often costing 5–12% of potential search traffic.",
    });
  } else if (signals.titleLength > 65) {
    findings.push({
      category: "seo",
      severity: "medium",
      title: "Page title may truncate in search results",
      description: `Title is ${signals.titleLength} characters; Google typically displays ~50–60.`,
      recommendation: "Shorten the title while keeping the primary keyword upfront.",
      businessImpact:
        "Truncated titles dilute messaging in SERPs and can lower click-through from branded queries.",
    });
  }

  if (!signals.metaDescription) {
    findings.push({
      category: "seo",
      severity: "high",
      title: "Missing meta description",
      description:
        "No meta description tag was found; search engines will auto-generate snippets.",
      recommendation:
        "Write a unique 150–160 character meta description with value proposition and keyword.",
      businessImpact:
        "Missing descriptions often reduce CTR by 8–15%, leaking qualified traffic from organic search.",
    });
  } else if (
    signals.metaDescriptionLength < 70 ||
    signals.metaDescriptionLength > 170
  ) {
    findings.push({
      category: "seo",
      severity: "medium",
      title: "Meta description length is suboptimal",
      description: `Meta description is ${signals.metaDescriptionLength} characters.`,
      recommendation: "Target 150–160 characters with a clear benefit and CTA.",
      businessImpact:
        "Suboptimal snippets reduce SERP click-through and weaken positioning vs competitors.",
    });
  }

  if (signals.h1Count === 0) {
    findings.push({
      category: "seo",
      severity: "high",
      title: "No H1 heading found",
      description: "The page lacks a primary H1, weakening topical clarity for crawlers.",
      recommendation: "Add one descriptive H1 aligned with the page's primary intent.",
      businessImpact:
        "Unclear heading structure can suppress rankings for head terms and confuse visitors.",
    });
  } else if (signals.h1Count > 1) {
    findings.push({
      category: "seo",
      severity: "medium",
      title: "Multiple H1 headings detected",
      description: `Found ${signals.h1Count} H1 elements; one primary H1 is recommended.`,
      recommendation: "Consolidate to a single H1 and use H2–H6 for subsections.",
      businessImpact:
        "Split topical signals can dilute keyword focus and reduce clarity for users and bots.",
    });
  }

  if (!signals.canonical) {
    findings.push({
      category: "seo",
      severity: "medium",
      title: "No canonical URL declared",
      description: "A rel=canonical link helps prevent duplicate-content indexing issues.",
      recommendation: "Add a self-referencing canonical tag on indexable pages.",
      businessImpact:
        "Duplicate URLs can split ranking equity and waste crawl budget on variants.",
    });
  }

  if (!signals.ogTitle || !signals.ogDescription) {
    findings.push({
      category: "seo",
      severity: "low",
      title: "Incomplete Open Graph tags",
      description: "Open Graph title or description tags are missing for social sharing.",
      recommendation: "Add og:title and og:description matching your SEO messaging.",
      businessImpact:
        "Poor social previews reduce referral traffic from LinkedIn, Slack, and other share surfaces.",
    });
  }

  if (!signals.lang) {
    findings.push({
      category: "seo",
      severity: "low",
      title: "HTML lang attribute missing",
      description: "The html element has no lang attribute for locale targeting.",
      recommendation: 'Set lang="en" (or appropriate locale) on the <html> element.',
      businessImpact:
        "Locale ambiguity can hurt international targeting and accessibility tooling.",
    });
  }

  return findings;
}

export const seoEngine: AuditEngine = {
  id: "seo",
  category: "seo",
  async run(ctx) {
    const signals = await collectSeoSignals(ctx.page);
    const findings = buildSeoFindings(signals);
    return {
      category: "seo",
      score: scoreFromFindings(findings),
      findings,
      breakdown: signals,
    };
  },
};
