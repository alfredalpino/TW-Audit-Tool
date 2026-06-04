import type { FindingDto } from "@/types/audit";
import { Badge } from "@/components/ui/badge";

export function FindingsTable({
  findings,
  unlocked = true,
}: {
  findings: FindingDto[];
  unlocked?: boolean;
}) {
  if (!findings.length) {
    return (
      <p className="font-mono text-xs text-[var(--fg-tertiary)]">
        No findings yet — audit in progress.
      </p>
    );
  }

  const sorted = [...findings].sort(
    (a, b) => b.priorityScore - a.priorityScore
  );

  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)]">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-[var(--border)] bg-[var(--bg-muted)] font-mono text-[10px] uppercase tracking-wider text-[var(--fg-tertiary)]">
          <tr>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Severity</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Issue</th>
            <th className="px-4 py-3">Business impact</th>
            {unlocked && <th className="px-4 py-3">Fix</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {sorted.map((f) => (
            <tr
              key={f.id}
              className="bg-[var(--bg-surface)] transition-colors hover:bg-[var(--bg-muted)]/50"
            >
              <td className="tw-metric px-4 py-4 text-[var(--brand)]">
                {f.priorityScore}
              </td>
              <td className="px-4 py-4">
                <Badge severity={f.severity}>{f.severity}</Badge>
              </td>
              <td className="px-4 py-4 font-mono text-xs uppercase text-[var(--fg-tertiary)]">
                {f.category}
              </td>
              <td className="max-w-xs px-4 py-4">
                <p className="font-medium text-[var(--fg-primary)]">{f.title}</p>
                <p className="mt-1 text-xs text-[var(--fg-secondary)] line-clamp-2">
                  {f.description}
                </p>
              </td>
              <td className="max-w-sm px-4 py-4 text-xs leading-relaxed text-[var(--fg-secondary)]">
                {f.businessImpact}
              </td>
              {unlocked && (
                <td className="max-w-xs px-4 py-4 text-xs text-[var(--fg-tertiary)]">
                  {f.recommendation ?? "—"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
