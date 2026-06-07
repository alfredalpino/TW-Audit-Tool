import type { AuditRunResponse } from "@/types/audit";

function formatDuration(start: string, end: string | null | undefined): string | null {
  if (!end) return null;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (ms < 1000) return `${ms}ms`;
  const sec = Math.round(ms / 1000);
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}

export function AuditMetaStrip({ run }: { run: AuditRunResponse }) {
  const duration = formatDuration(run.createdAt, run.completedAt);
  const engines = run.enginesCompleted?.length ?? 0;
  const findings = run.findings.length;
  const screenshots = run.screenshots?.length ?? 0;

  const items = [
    duration ? { label: "Duration", value: duration } : null,
    run.completedAt
      ? {
          label: "Completed",
          value: new Date(run.completedAt).toLocaleString(),
        }
      : null,
    { label: "Engines", value: String(engines) },
    { label: "Findings", value: String(findings) },
    screenshots > 0
      ? { label: "Previews", value: `${screenshots} captured` }
      : null,
    run.runtime
      ? {
          label: "Runtime",
          value: run.runtime === "fetch" ? "Fast scan" : "Full browser",
        }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  if (!items.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2"
        >
          <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--fg-tertiary)]">
            {item.label}
          </p>
          <p className="mt-0.5 font-mono text-xs text-[var(--fg-primary)]">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
