/** En-dash for ranges — never fake decimal precision in impact copy. */
export const RANGE_DASH = "–";

export function formatPercentRange(low: number, high: number): string {
  return `${low}${RANGE_DASH}${high}%`;
}

/** Monthly revenue opportunity band, e.g. $3k–$12k/mo */
export function formatRevenueRange(
  lowK: number,
  highK: number,
  period = "/mo"
): string {
  return `$${lowK}k${RANGE_DASH}$${highK}k${period}`;
}

/** UI / PDF line: "Elevated · 8–15%" */
export function formatImpactMetricDisplay(
  label: string,
  range?: string | null
): string {
  if (!range?.trim()) return label;
  return `${label} · ${range}`;
}

/**
 * Strip fake financial precision from finding narratives.
 * Leaves intentional range copy (8–15%, $3k–$8k) untouched.
 */
export function sanitizeBusinessImpactText(text: string): string {
  return text
    .replace(/\$([\d,]+)\.(\d{2})\b/g, (_, whole: string) => {
      const n = parseInt(whole.replace(/,/g, ""), 10);
      if (!Number.isFinite(n) || n < 1000) return `$${whole.replace(/,/g, "")}`;
      const k = Math.max(1, Math.round(n / 1000));
      return `$${k}k`;
    })
    .replace(/(\d{1,3})%\.(\d+)/g, "$1%");
}
