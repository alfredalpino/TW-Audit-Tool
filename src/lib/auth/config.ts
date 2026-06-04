import type { NextAuthConfig } from "next-auth";

/**
 * Phase 1 auth placeholder — wire providers and Drizzle adapter in Phase 2.
 * @see https://authjs.dev/getting-started/adapters/drizzle
 */
export const authConfig = {
  providers: [],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized() {
      return true;
    },
  },
} satisfies NextAuthConfig;
