import { sql } from "drizzle-orm";
import type { Db } from "@/lib/db";

/** Atomically claim the oldest queued run (SKIP LOCKED for multi-worker safety). */
export async function claimNextQueuedRun(db: Db): Promise<string | null> {
  const rows = await db.execute<{ id: string }>(sql`
    UPDATE audit_runs
    SET status = 'running', started_at = NOW()
    WHERE id = (
      SELECT id FROM audit_runs
      WHERE status = 'queued'
      ORDER BY created_at ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    )
    RETURNING id
  `);

  const row = rows[0];
  return row?.id ?? null;
}

/** Claim a specific queued run (used when Vercel polls trigger processing). */
export async function claimQueuedRunById(
  db: Db,
  runId: string
): Promise<boolean> {
  const rows = await db.execute<{ id: string }>(sql`
    UPDATE audit_runs
    SET status = 'running', started_at = NOW()
    WHERE id = ${runId} AND status = 'queued'
    RETURNING id
  `);

  return Boolean(rows[0]?.id);
}
