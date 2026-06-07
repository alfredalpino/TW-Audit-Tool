import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getDatabaseUrl } from "@/lib/env";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof postgres> | undefined;
  connectionString: string | undefined;
};

function postgresOptions(connectionString: string) {
  const isSupabase =
    connectionString.includes("supabase.co") ||
    connectionString.includes("pooler.supabase.com");
  const usesPooler =
    connectionString.includes(":6543") ||
    connectionString.includes("pooler.supabase.com");

  return {
    max: usesPooler ? 1 : 10,
    idle_timeout: 20,
    connect_timeout: 10,
    // Supabase transaction pooler (Vercel) rejects prepared statements.
    prepare: !usesPooler,
    ...(isSupabase ? { ssl: "require" as const } : {}),
  };
}

function createClient() {
  const connectionString = getDatabaseUrl();
  if (!connectionString) {
    return null;
  }

  if (
    globalForDb.client &&
    globalForDb.connectionString &&
    globalForDb.connectionString !== connectionString
  ) {
    void globalForDb.client.end({ timeout: 1 }).catch(() => undefined);
    globalForDb.client = undefined;
  }

  if (!globalForDb.client) {
    globalForDb.connectionString = connectionString;
    globalForDb.client = postgres(
      connectionString,
      postgresOptions(connectionString)
    );
  }
  return globalForDb.client;
}

export function getDb() {
  const client = createClient();
  if (!client) {
    return null;
  }
  return drizzle(client, { schema });
}

export type Db = NonNullable<ReturnType<typeof getDb>>;
