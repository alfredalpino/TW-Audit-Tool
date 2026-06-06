import Link from "next/link";
import { getDb } from "@/lib/db";
import { listRecentAuditRuns } from "@/features/admin/list-audit-runs";
import { verifyAdminKey } from "@/lib/admin/require-admin";
import { getAdminSecret } from "@/lib/env";

type PageProps = {
  searchParams: Promise<{ key?: string }>;
};

export default async function AdminPage({ searchParams }: PageProps) {
  const { key } = await searchParams;
  const secretConfigured = Boolean(getAdminSecret());

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-semibold text-[var(--fg-primary)]">
        Admin
      </h1>

      {!secretConfigured ? (
        <p className="text-sm text-[var(--fg-secondary)]">
          Set <code className="font-mono text-xs">ADMIN_SECRET</code> in your
          environment to enable the admin view.
        </p>
      ) : !verifyAdminKey(key) ? (
        <p className="text-sm text-[var(--fg-secondary)]">
          Unauthorized. Open this page with{" "}
          <code className="font-mono text-xs">?key=YOUR_ADMIN_SECRET</code> or
          use the API with{" "}
          <code className="font-mono text-xs">
            Authorization: Bearer YOUR_ADMIN_SECRET
          </code>
          .
        </p>
      ) : (
        <AdminRunsTable adminKey={key!} />
      )}
    </div>
  );
}

async function AdminRunsTable({ adminKey }: { adminKey: string }) {
  const db = getDb();
  if (!db) {
    return (
      <p className="text-sm text-[var(--fg-secondary)]">
        Database not configured.
      </p>
    );
  }

  const runs = await listRecentAuditRuns(db, 50);
  const keyQuery = `?key=${encodeURIComponent(adminKey)}`;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--fg-primary)]">
            Audit runs
          </h2>
          <p className="mt-1 text-sm text-[var(--fg-secondary)]">
            Recent runs · admin-lite (Phase 5)
          </p>
        </div>
        <p className="font-mono text-xs text-[var(--fg-tertiary)]">
          GET /api/admin/audit-runs
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--bg-surface)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[10px] uppercase tracking-wider text-[var(--fg-tertiary)]">
              <th className="px-4 py-3 font-medium">Run</th>
              <th className="px-4 py-3 font-medium">URL</th>
              <th className="px-4 py-3 font-medium">Org</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Export</th>
            </tr>
          </thead>
          <tbody>
            {runs.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-[var(--fg-secondary)]"
                >
                  No audit runs yet.
                </td>
              </tr>
            ) : (
              runs.map((run) => (
                <tr
                  key={run.id}
                  className="border-b border-[var(--border)] last:border-0"
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    <Link
                      href={`/audit/${run.id}`}
                      className="text-[var(--brand)] hover:underline"
                    >
                      {run.id.slice(0, 8)}…
                    </Link>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-[var(--fg-secondary)]">
                    {run.url}
                  </td>
                  <td className="px-4 py-3 text-[var(--fg-secondary)]">
                    {run.organizationName ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs uppercase">
                    {run.status}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {run.overallScore ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--fg-tertiary)]">
                    {new Date(run.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 font-mono text-xs">
                      <a
                        href={`/api/admin/audit-runs/${run.id}/export?format=json&key=${encodeURIComponent(adminKey)}`}
                        className="text-[var(--brand)] hover:underline"
                      >
                        JSON
                      </a>
                      <a
                        href={`/api/admin/audit-runs/${run.id}/export?format=csv&key=${encodeURIComponent(adminKey)}`}
                        className="text-[var(--brand)] hover:underline"
                      >
                        CSV
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-[var(--fg-tertiary)]">
        API:{" "}
        <Link
          href={`/api/admin/audit-runs${keyQuery}`}
          className="text-[var(--brand)] hover:underline"
        >
          /api/admin/audit-runs
        </Link>
      </p>
    </>
  );
}
