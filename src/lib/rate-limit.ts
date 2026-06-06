import Redis from "ioredis";
import { getRedisUrl } from "@/lib/env";

const memoryBuckets = new Map<string, { count: number; resetAt: number }>();

function getLimit(): number {
  const raw = process.env.AUDIT_RATE_LIMIT_PER_HOUR ?? "10";
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 10;
}

function getWindowMs(): number {
  return 60 * 60 * 1000;
}

let redisClient: Redis | null = null;

function getRedis(): Redis | null {
  const url = getRedisUrl();
  if (!url) return null;
  if (!redisClient) {
    redisClient = new Redis(url, { maxRetriesPerRequest: 1, lazyConnect: true });
  }
  return redisClient;
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export async function checkAuditRateLimit(
  identifier: string,
  customLimit?: number
): Promise<RateLimitResult> {
  const limit = customLimit ?? getLimit();
  const windowMs = getWindowMs();
  const key = `ratelimit:audit:${identifier}`;
  const now = Date.now();

  const redis = getRedis();
  if (redis) {
    try {
      if (redis.status !== "ready") await redis.connect();
      const count = await redis.incr(key);
      if (count === 1) {
        await redis.pexpire(key, windowMs);
      }
      const ttl = await redis.pttl(key);
      const resetAt = now + (ttl > 0 ? ttl : windowMs);
      return {
        allowed: count <= limit,
        remaining: Math.max(0, limit - count),
        resetAt,
      };
    } catch {
      /* fall through to memory */
    }
  }

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
  };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
