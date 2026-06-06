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
    <div className="-mx-4 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)] px-4 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[640px] table-fixed text-left text-sm">
        <thead className="border-b border-[var(--border)] bg-[var(--bg-muted)] font-mono text-[10px] uppercase tracking-wider text-[var(--fg-tertiary)]">
          <tr>
            <th className="w-[4.5rem] px-3 py-3 sm:px-4">Priority</th>
            <th className="w-[5.5rem] px-3 py-3 sm:px-4">Severity</th>
            <th className="w-[5.5rem] px-3 py-3 sm:px-4">Category</th>
            <th className="w-[28%] px-3 py-3 sm:px-4">Issue</th>
            <th className="w-[24%] px-3 py-3 sm:px-4">Business impact</th>
            {unlocked && <th className="w-[24%] px-3 py-3 sm:px-4">Fix</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {sorted.map((f) => (
            <tr
              key={f.id}
              className="bg-[var(--bg-surface)] transition-colors hover:bg-[var(--bg-muted)]/50"
            >
              <td className="tw-metric max-w-0 px-3 py-4 text-[var(--brand)] sm:px-4">
                {f.priorityScore}
              </td>
              <td className="max-w-0 px-3 py-4 sm:px-4">
                <Badge severity={f.severity} className="max-w-full truncate">
                  {f.severity}
                </Badge>
              </td>
              <td className="max-w-0 px-3 py-4 font-mono text-[10px] uppercase leading-snug text-[var(--fg-tertiary)] sm:px-4 sm:text-xs">
                <span className="line-clamp-2 break-words">{f.category}</span>
              </td>
              <td className="max-w-0 px-3 py-4 sm:px-4">
                <p className="tw-contain-text font-medium text-[var(--fg-primary)]">{f.title}</p>
                <p className="tw-contain-text mt-1 line-clamp-3 text-xs text-[var(--fg-secondary)]">
                  {f.description}
                </p>
              </td>
              <td className="max-w-0 px-3 py-4 text-xs leading-relaxed text-[var(--fg-secondary)] sm:px-4">
                <span className="tw-contain-text line-clamp-4">{f.businessImpact}</span>
              </td>
              {unlocked && (
                <td className="max-w-0 px-3 py-4 text-xs text-[var(--fg-tertiary)] sm:px-4">
                  <span className="tw-contain-text line-clamp-4">
                    {f.recommendation ?? "—"}
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
