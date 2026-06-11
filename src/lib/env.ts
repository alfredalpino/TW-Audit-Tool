/**
 * Shared env accessors — same Supabase project as torpedoweb.org main site.
 *
 * API keys (Dashboard → Project Settings → API):
 *   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
 *
 * Drizzle (Dashboard → Database → Connection string):
 *   DATABASE_URL — Transaction pooler (6543) on Vercel; direct (5432) for local dev / optional worker / migrations.
 */

function trim(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v && v.length > 0 ? v : undefined;
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

/** Comma-separated API keys for POST /api/audits (X-API-Key header). */
export function getAuditApiKeys(): string[] {
  const raw = trim(process.env.AUDIT_API_KEYS);
  if (!raw) return [];
  return raw
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean);
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

/** Drizzle requires DATABASE_URL (Postgres URI from the same Supabase project). */
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

/** Phase 5 admin-lite — protects /api/admin/* and /admin page. */
export function getAdminSecret(): string | undefined {
  return trim(process.env.ADMIN_SECRET);
}
