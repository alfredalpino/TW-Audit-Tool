import type { AuditEngine, AuditFindingInput } from "@/audit/types";
import { scoreFromFindings } from "@/audit/scoring";

type ContentSignals = {
  wordCount: number;
  paragraphCount: number;
  imagesTotal: number;
  imagesMissingAlt: number;
  emptyParagraphs: number;
  loremIpsum: boolean;
  headingCount: number;
};

export const contentEngine: AuditEngine = {
  id: "content",
  category: "content",
  async run(ctx) {
    const signals: ContentSignals = await ctx.page.evaluate(() => {
      const bodyText = (document.body?.innerText ?? "").replace(/\s+/g, " ").trim();
      const words = bodyText ? bodyText.split(/\s+/).length : 0;
      const paragraphs = document.querySelectorAll("p");
      const emptyParagraphs = Array.from(paragraphs).filter(
        (p) => !p.textContent?.trim()
      ).length;
      const images = Array.from(document.querySelectorAll("img"));
      const imagesMissingAlt = images.filter(
        (img) => !img.getAttribute("alt")?.trim()
      ).length;

      return {
        wordCount: words,
        paragraphCount: paragraphs.length,
        imagesTotal: images.length,
        imagesMissingAlt,
        emptyParagraphs,
        loremIpsum: /lorem ipsum/i.test(bodyText),
        headingCount: document.querySelectorAll("h1,h2,h3,h4,h5,h6").length,
      };
    });

    const findings: AuditFindingInput[] = [];

    if (signals.wordCount < 150) {
      findings.push({
        category: "content",
        severity: "high",
        title: "Thin content detected",
        description: `Page body contains ~${signals.wordCount} words — below typical indexable thresholds.`,
        recommendation:
          "Expand primary content with unique value: benefits, proof, FAQs, and clear CTAs.",
        businessImpact:
          "Thin pages struggle to rank and convert — visitors lack context to take action.",
      });
    } else if (signals.wordCount < 300) {
      findings.push({
        category: "content",
        severity: "medium",
        title: "Content depth is limited",
        description: `~${signals.wordCount} words on page; competitive pages often exceed 500+.`,
        recommendation:
          "Add sections addressing buyer objections, use cases, and social proof.",
        businessImpact:
          "Shallow copy reduces SEO topical authority and weakens conversion narratives.",
      });
    }

    if (signals.imagesTotal > 0 && signals.imagesMissingAlt / signals.imagesTotal > 0.3) {
      findings.push({
        category: "content",
        severity: "medium",
        title: "Many images missing alt text",
        description: `${signals.imagesMissingAlt} of ${signals.imagesTotal} images lack meaningful alt attributes.`,
        recommendation:
          "Add descriptive alt text for informative images; empty alt for decorative ones.",
        businessImpact:
          "Missing alt text hurts accessibility, image SEO, and screen-reader comprehension.",
      });
    }

    if (signals.loremIpsum) {
      findings.push({
        category: "content",
        severity: "critical",
        title: "Placeholder (lorem ipsum) text detected",
        description: "Lorem ipsum or placeholder copy is visible in page content.",
        recommendation: "Replace all placeholder text with production-ready copy before launch.",
        businessImpact:
          "Placeholder content destroys credibility and signals an unfinished site to buyers.",
      });
    }

    if (signals.headingCount === 0 && signals.wordCount > 100) {
      findings.push({
        category: "content",
        severity: "medium",
        title: "No headings structure long-form content",
        description: "Substantial body copy exists without H2–H6 headings for scanability.",
        recommendation: "Break content into scannable sections with descriptive subheadings.",
        businessImpact:
          "Wall-of-text pages increase bounce and reduce comprehension for busy buyers.",
      });
    }

    if (signals.emptyParagraphs > 3) {
      findings.push({
        category: "content",
        severity: "low",
        title: "Empty paragraph elements in markup",
        description: `${signals.emptyParagraphs} empty <p> tags add noise to the DOM.`,
        recommendation: "Remove empty paragraphs and fix CMS spacing with CSS instead.",
        businessImpact:
          "Markup bloat slightly affects parse quality; minor SEO and maintenance cost.",
      });
    }

    return {
      category: "content",
      score: scoreFromFindings(findings),
      findings,
      breakdown: signals,
    };
  },
};
