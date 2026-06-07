import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { auditLeads } from "@/lib/db/schema";
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

  const existing = await db.query.auditLeads.findFirst({
    where: eq(auditLeads.auditRunId, input.runId),
  });
  if (existing) {
    return { ok: true, leadId: existing.id };
  }

  const [row] = await db
    .insert(auditLeads)
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
  const row = await db.query.auditLeads.findFirst({
    where: eq(auditLeads.auditRunId, runId),
  });
  return !!row;
}
