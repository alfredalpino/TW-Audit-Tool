/**
 * Shared env accessors — same Supabase project as torpedoweb.org main site.
 *
 * API keys (Dashboard → Project Settings → API):
 *   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
 *
 * Drizzle/worker also need direct Postgres (Dashboard → Database → Connection string):
 *   DATABASE_URL — use Transaction pooler (6543) on Vercel; direct (5432) for worker/migrations.
 */

const REDIS_URL_FORMAT_HINT =
  "REDIS_URL must be rediss://default:token@host:6379 — not the redis-cli command";

function trim(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v && v.length > 0 ? v : undefined;
}

function collapseDoubleRedisScheme(value: string): string {
  let result = value;
  while (/^(?:rediss?:\/\/)(?:rediss?:\/\/)+/i.test(result)) {
    result = result.replace(/^(rediss?:\/\/)(?:rediss?:\/\/)+/i, "$1");
  }
  return result;
}

/**
 * Normalizes REDIS_URL — fixes redis-cli paste mistakes and Upstash TLS scheme.
 * Returns undefined when unset; throws with setup hints when present but invalid.
 */
export function normalizeRedisUrl(raw: string | undefined): string | undefined {
  let value = trim(raw);
  if (!value) return undefined;

  if (/redis-cli/i.test(value)) {
    const afterFlag = value.match(/(?:^|\s)-u\s+(\S+)/i);
    if (afterFlag?.[1]) {
      value = afterFlag[1];
    }
  }

  const embedded = value.match(/(rediss?:\/\/[^\s'"]+)/i);
  if (embedded?.[1]) {
    value = embedded[1];
  }

  value = collapseDoubleRedisScheme(value);

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(REDIS_URL_FORMAT_HINT);
  }

  if (parsed.protocol !== "redis:" && parsed.protocol !== "rediss:") {
    throw new Error(REDIS_URL_FORMAT_HINT);
  }

  if (parsed.hostname.endsWith(".upstash.io") && parsed.protocol === "redis:") {
    parsed.protocol = "rediss:";
    value = parsed.toString();
  }

  try {
    new URL(value);
  } catch {
    throw new Error(REDIS_URL_FORMAT_HINT);
  }

  return value;
}

export function getRedisUrl(): string | undefined {
  return normalizeRedisUrl(process.env.REDIS_URL);
}

/** Worker + BullMQ require a valid Redis URI. */
export function requireRedisUrl(): string {
  const url = getRedisUrl();
  if (!url) {
    throw new Error(
      "REDIS_URL is required. Use rediss://default:token@host:6379 (Upstash REST → Redis tab → copy URL only, not redis-cli)."
    );
  }
  return url;
}

export function getSupabaseUrl(): string | undefined {
  return trim(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function getSupabaseAnonKey(): string | undefined {
  return trim(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseServiceRoleKey(): string | undefined {
  return trim(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function hasSupabaseConfig(): boolean {
  return Boolean(
    getSupabaseUrl() && getSupabaseAnonKey() && getSupabaseServiceRoleKey()
  );
}

export function getDatabaseUrl(): string | undefined {
  return trim(process.env.DATABASE_URL);
}

/** Throws with setup hints when Supabase API vars are incomplete. */
export function requireSupabaseApiEnv(): {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
} {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy from the main site .env or Supabase Dashboard → Project Settings → API."
    );
  }
  if (!serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Copy from Supabase Dashboard → Project Settings → API (service_role, server-only)."
    );
  }

  return { url, anonKey, serviceRoleKey };
}

/** Drizzle + worker require DATABASE_URL (Postgres URI from the same Supabase project). */
export function requireDatabaseUrl(): string {
  const url = getDatabaseUrl();
  if (url) return url;

  if (hasSupabaseConfig() || getSupabaseUrl()) {
    throw new Error(
      "DATABASE_URL is required for Drizzle. In the same Supabase project: Dashboard → Database → Connection string → URI (pooler 6543 for Vercel, direct 5432 for worker)."
    );
  }

  throw new Error(
    "DATABASE_URL is not set. Use local Docker Postgres or your Supabase connection string."
  );
}
