export function postgresOptions(connectionString: string) {
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
    prepare: !usesPooler,
    ...(isSupabase ? { ssl: "require" as const } : {}),
  };
}
