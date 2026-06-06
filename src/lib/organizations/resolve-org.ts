import { eq } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { organizations } from "@/lib/db/schema";

export type ResolveOrgInput = {
  organizationId?: string;
  organizationSlug?: string;
};

export async function resolveOrganizationId(
  db: Db,
  input?: ResolveOrgInput
): Promise<string | null> {
  if (input?.organizationId) {
    const org = await db.query.organizations.findFirst({
      where: eq(organizations.id, input.organizationId),
      columns: { id: true },
    });
    return org?.id ?? null;
  }

  const slug =
    input?.organizationSlug?.trim() ||
    process.env.DEFAULT_ORGANIZATION_SLUG?.trim();
  if (!slug) return null;

  const org = await db.query.organizations.findFirst({
    where: eq(organizations.slug, slug),
    columns: { id: true },
  });
  return org?.id ?? null;
}
