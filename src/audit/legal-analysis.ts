import type { CheerioAPI } from "cheerio";
import type { AuditFindingInput } from "@/audit/types";

export type LegalPageType =
  | "privacy"
  | "terms"
  | "dmca"
  | "cookie"
  | "legal";

type LegalLink = { type: LegalPageType; url: string };

const LEGAL_PATTERNS: { type: LegalPageType; patterns: RegExp[] }[] = [
  { type: "privacy", patterns: [/privacy/i, /privacy-policy/i, /data-protection/i] },
  { type: "terms", patterns: [/terms/i, /terms-of-service/i, /terms-of-use/i, /tos\b/i] },
  { type: "dmca", patterns: [/dmca/i, /copyright/i, /ip-policy/i] },
  { type: "cookie", patterns: [/cookie/i, /cookie-policy/i] },
  { type: "legal", patterns: [/legal/i, /imprint/i, /disclaimer/i] },
];

export function discoverLegalLinks(
  $: CheerioAPI,
  origin: string
): LegalLink[] {
  const found = new Map<LegalPageType, string>();

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href")?.trim() ?? "";
    const text = $(el).text().trim();
    const haystack = `${text} ${href}`.toLowerCase();
    if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;

    for (const { type, patterns } of LEGAL_PATTERNS) {
      if (found.has(type)) continue;
      if (patterns.some((p) => p.test(haystack))) {
        try {
          const absolute = new URL(href, origin).href;
          if (absolute.startsWith("http")) found.set(type, absolute);
        } catch {
          /* ignore bad URLs */
        }
      }
    }
  });

  return [...found.entries()].map(([type, url]) => ({ type, url }));
}

async function fetchLegalHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(8_000),
      headers: {
        "User-Agent": "TorpedoAuditBot/1.0",
        Accept: "text/html",
      },
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text.slice(0, 120_000);
  } catch {
    return null;
  }
}

function analyzeLegalContent(
  html: string,
  type: LegalPageType,
  url: string
): AuditFindingInput[] {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  const words = text.split(/\s+/).filter(Boolean).length;
  const findings: AuditFindingInput[] = [];

  const labels: Record<LegalPageType, string> = {
    privacy: "Privacy policy",
    terms: "Terms of service",
    dmca: "DMCA / copyright policy",
    cookie: "Cookie policy",
    legal: "Legal / disclaimer page",
  };

  if (words < 120) {
    findings.push({
      category: "compliance",
      severity: "high",
      title: `${labels[type]} appears too thin`,
      description: `${labels[type]} at ${url} has ~${words} words — likely incomplete for compliance.`,
      recommendation: `Expand ${labels[type].toLowerCase()} with data practices, user rights, and contact details.`,
      businessImpact: "Thin legal pages increase regulatory and enterprise procurement risk.",
      evidence: { url, type, wordCount: words },
    });
  }

  const checks: { label: string; patterns: RegExp[]; severity: "high" | "medium" | "low" }[] =
    type === "privacy"
      ? [
          { label: "data collection disclosure", patterns: [/collect/, /personal data/, /information we/], severity: "high" },
          { label: "contact method", patterns: [/contact/, /@/, /email/], severity: "medium" },
          { label: "GDPR/CCPA rights", patterns: [/gdpr/, /ccpa/, /right to/, /delete your/, /opt.?out/], severity: "medium" },
          { label: "last updated date", patterns: [/last updated/, /effective date/, /revised/], severity: "low" },
        ]
      : type === "terms"
        ? [
            { label: "limitation of liability", patterns: [/liability/, /warranty/, /as.?is/], severity: "medium" },
            { label: "governing law", patterns: [/governing law/, /jurisdiction/, /dispute/], severity: "medium" },
            { label: "acceptable use", patterns: [/acceptable use/, /prohibited/, /must not/], severity: "low" },
          ]
        : type === "dmca"
          ? [
              { label: "DMCA agent contact", patterns: [/dmca/, /copyright agent/, /designated agent/], severity: "high" },
              { label: "takedown procedure", patterns: [/takedown/, /notice/, /counter.?notification/], severity: "medium" },
            ]
          : type === "cookie"
            ? [
                { label: "cookie categories", patterns: [/essential/, /analytics/, /marketing/, /third.?party/], severity: "medium" },
                { label: "opt-out mechanism", patterns: [/opt.?out/, /manage preferences/, /consent/], severity: "medium" },
              ]
            : [
                { label: "business identity", patterns: [/company/, /address/, /registered/], severity: "medium" },
                { label: "disclaimer language", patterns: [/disclaimer/, /liability/, /warranty/], severity: "low" },
              ];

  for (const check of checks) {
    if (!check.patterns.some((p) => p.test(text))) {
      findings.push({
        category: "compliance",
        severity: check.severity,
        title: `${labels[type]} missing ${check.label}`,
        description: `Could not detect "${check.label}" in ${labels[type].toLowerCase()} content.`,
        recommendation: `Add a clear ${check.label} section to ${url}.`,
        businessImpact: "Incomplete legal coverage blocks trust with regulated buyers.",
        evidence: { url, type, missingSection: check.label },
      });
    }
  }

  if (findings.length === 0) {
    findings.push({
      category: "compliance",
      severity: "info",
      title: `${labels[type]} passes baseline review`,
      description: `${labels[type]} at ${url} includes expected sections (~${words} words).`,
      recommendation: "Review annually and after product or data-practice changes.",
      businessImpact: "Maintained legal pages reduce compliance friction in sales cycles.",
      evidence: { url, type, wordCount: words, analysis: "heuristic" },
    });
  }

  return findings;
}

const REQUIRED_PAGES: LegalPageType[] = ["privacy", "terms", "dmca"];

export async function analyzeLegalPages(
  $: CheerioAPI,
  origin: string
): Promise<AuditFindingInput[]> {
  const links = discoverLegalLinks($, origin);
  const findings: AuditFindingInput[] = [];
  const foundTypes = new Set(links.map((l) => l.type));

  for (const required of REQUIRED_PAGES) {
    if (!foundTypes.has(required) && !links.some((l) => l.type === "cookie" && required === "privacy")) {
      const label =
        required === "privacy"
          ? "Privacy policy"
          : required === "terms"
            ? "Terms of service"
            : "DMCA policy";
      findings.push({
        category: "compliance",
        severity: required === "privacy" ? "critical" : "high",
        title: `No ${label.toLowerCase()} link found`,
        description: `The homepage HTML does not link to a ${label.toLowerCase()} page.`,
        recommendation: `Publish and link a ${label.toLowerCase()} from your site footer.`,
        businessImpact: "Missing legal pages block enterprise deals and ad platform approvals.",
        evidence: { missingPage: required },
      });
    }
  }

  for (const link of links.slice(0, 5)) {
    const html = await fetchLegalHtml(link.url);
    if (!html) {
      findings.push({
        category: "compliance",
        severity: "medium",
        title: `Could not fetch ${link.type} page`,
        description: `Linked ${link.type} page at ${link.url} did not return HTML.`,
        recommendation: "Fix broken legal URLs and ensure pages are publicly accessible.",
        businessImpact: "Broken legal links fail compliance reviews.",
        evidence: { url: link.url, type: link.type },
      });
      continue;
    }
    findings.push(...analyzeLegalContent(html, link.type, link.url));
  }

  return findings;
}
