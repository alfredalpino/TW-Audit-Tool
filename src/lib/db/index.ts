import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getDatabaseUrl } from "@/lib/env";
import * as schema from "./schema";

const connectionString = getDatabaseUrl();

const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof postgres> | undefined;
};

function createClient() {
  if (!connectionString) {
    return null;
  }
  if (!globalForDb.client) {
    globalForDb.client = postgres(connectionString, { max: 10 });
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
