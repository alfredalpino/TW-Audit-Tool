import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Rate limiting with Upstash Redis when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 * are set (required for correct limits on Vercel serverless). Falls back to in-memory per
 * process for local dev when Redis is not configured.
 */

const store = new Map<string, { count: number; resetAt: number }>();

const ratelimitCache = new Map<string, Ratelimit>();

let redisClient: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    redisClient = null;
    return null;
  }

  redisClient = new Redis({ url, token });
  return redisClient;
}

function getUpstashRatelimit(config: RateLimitConfig, prefix: string): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;

  const cacheKey = `${prefix}:${config.windowMs}:${config.max}`;
  let limiter = ratelimitCache.get(cacheKey);
  if (!limiter) {
    const windowSec = Math.max(1, Math.ceil(config.windowMs / 1000));
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(config.max, `${windowSec} s`),
      prefix: `rl:${prefix}`,
    });
    ratelimitCache.set(cacheKey, limiter);
  }
  return limiter;
}

function getKey(prefix: string, ip: string): string {
  return `${prefix}:${ip}`;
}

export interface RateLimitConfig {
  windowMs: number;
  max: number;
}

function checkRateLimitMemory(
  prefix: string,
  ip: string,
  config: RateLimitConfig
): { ok: boolean; remaining: number } {
  const key = getKey(prefix, ip);
  const now = Date.now();
  let entry = store.get(key);
  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + config.windowMs };
    store.set(key, entry);
  }
  entry.count += 1;
  const remaining = Math.max(0, config.max - entry.count);
  const ok = entry.count <= config.max;
  return { ok, remaining };
}

export async function checkRateLimit(
  prefix: string,
  ip: string,
  config: RateLimitConfig
): Promise<{ ok: boolean; remaining: number }> {
  const upstash = getUpstashRatelimit(config, prefix);
  if (upstash) {
    const { success, remaining } = await upstash.limit(getKey(prefix, ip));
    return { ok: success, remaining };
  }
  return checkRateLimitMemory(prefix, ip, config);
}

/** Prefer Vercel-trusted IP; avoid spoofable x-forwarded-for when x-real-ip is set. */
export function getClientIp(request: Request): string {
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;

  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded.split(',').map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1]!;
  }

  return '127.0.0.1';
}
