import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import type { CreateLeadInput } from "@/lib/validations/lead";

export type CreateLeadResult =
  | { ok: true; leadId: string }
  | { ok: false; error: string };

export async function createLead(
  input: CreateLeadInput
): Promise<CreateLeadResult> {
  const db = getDb();
  if (!db) {
    return { ok: false, error: "Database not configured" };
  }

  const existing = await db.query.leads.findFirst({
    where: eq(leads.auditRunId, input.runId),
  });
  if (existing) {
    return { ok: true, leadId: existing.id };
  }

  const [row] = await db
    .insert(leads)
    .values({
      auditRunId: input.runId,
      email: input.email,
      name: input.name,
      phone: input.phone,
      company: input.company,
      source: "audit_unlock",
    })
    .returning();

  return { ok: true, leadId: row.id };
}

export async function isRunUnlocked(runId: string): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  const row = await db.query.leads.findFirst({
    where: eq(leads.auditRunId, runId),
  });
  return !!row;
}
