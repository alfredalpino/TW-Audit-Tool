const memoryBuckets = new Map<string, { count: number; resetAt: number }>();

const MAX_BUCKETS = 10_000;
const DOMAIN_LIMIT_PER_HOUR = 5;

function getPublicLimit(): number {
  const raw = process.env.AUDIT_RATE_LIMIT_PER_HOUR ?? "10";
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 10;
}

function getApiKeyLimit(): number {
  const raw = process.env.AUDIT_API_RATE_LIMIT_PER_HOUR ?? "100";
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 100;
}

function getWindowMs(): number {
  return 60 * 60 * 1000;
}

function pruneExpiredBuckets(now: number): void {
  if (memoryBuckets.size < MAX_BUCKETS) return;
  for (const [key, bucket] of memoryBuckets) {
    if (bucket.resetAt <= now) {
      memoryBuckets.delete(key);
    }
  }
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
};

export async function checkAuditRateLimit(
  identifier: string,
  customLimit?: number
): Promise<RateLimitResult> {
  const limit = customLimit ?? getPublicLimit();
  const windowMs = getWindowMs();
  const key = `audit:${identifier}`;
  const now = Date.now();

  pruneExpiredBuckets(now);

  let bucket = memoryBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    memoryBuckets.set(key, bucket);
  }

  bucket.count += 1;

  return {
    allowed: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt,
    limit,
  };
}

export async function checkPublicAuditRateLimit(
  ip: string
): Promise<RateLimitResult> {
  return checkAuditRateLimit(`ip:${ip}`, getPublicLimit());
}

export async function checkDomainAuditRateLimit(
  normalizedUrl: string
): Promise<RateLimitResult> {
  return checkAuditRateLimit(`domain:${normalizedUrl}`, DOMAIN_LIMIT_PER_HOUR);
}

export async function checkApiKeyAuditRateLimit(
  keyId: string
): Promise<RateLimitResult> {
  return checkAuditRateLimit(`apikey:${keyId}`, getApiKeyLimit());
}

export function rateLimitHeaders(rate: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(rate.limit),
    "X-RateLimit-Remaining": String(rate.remaining),
    "X-RateLimit-Reset": String(Math.ceil(rate.resetAt / 1000)),
  };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
