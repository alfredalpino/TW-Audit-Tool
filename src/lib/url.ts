/** Normalize URL for deduplication and SSRF-safe validation. */
export function normalizeAuditUrl(raw: string): string {
  const parsed = new URL(raw);
  parsed.hash = "";
  parsed.search = "";
  let host = parsed.hostname.toLowerCase();
  if (host.startsWith("www.")) {
    host = host.slice(4);
  }
  const path = parsed.pathname.replace(/\/+$/, "") || "";
  return `${parsed.protocol}//${host}${path}`;
}

const BLOCKED_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^0\.0\.0\.0$/,
  /\.local$/i,
];

export function assertPublicUrl(url: string): void {
  const parsed = new URL(url);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only HTTP(S) URLs are allowed");
  }
  const host = parsed.hostname;
  if (BLOCKED_HOST_PATTERNS.some((re) => re.test(host))) {
    throw new Error("URL target is not allowed");
  }
}
