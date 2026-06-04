import type { AuditRunResponse } from "@/types/audit";
import { formatImpactMetricDisplay } from "@/lib/scoring/format-impact";

const METRICS = [
  { key: "trafficLoss" as const, label: "Traffic risk" },
  { key: "leadLoss" as const, label: "Lead leakage" },
  { key: "conversionLoss" as const, label: "Conversion friction" },
  { key: "revenueLeakage" as const, label: "Revenue opportunity" },
  { key: "growthOpportunity" as const, label: "Growth opportunity" },
];

export function ImpactSummary({
  impact,
}: {
  impact: AuditRunResponse["impact"];
}) {
  const entries = METRICS.map((m) => ({
    ...m,
    data: impact[m.key],
  })).filter((e) => e.data);

  if (!entries.length) {
    return null;
  }

  return (
    <section className="tw-panel p-5 md:p-6">
      <h2 className="font-display text-lg font-bold tracking-tight">
        Business impact estimate
      </h2>
      <p className="mt-1 text-sm text-[var(--fg-tertiary)]">
        Ranges only — not financial advice. Derived from live audit signals.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map(({ key, label, data }) => (
          <div
            key={key}
            className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-muted)] p-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-tertiary)]">
              {label}
            </p>
            <p className="mt-2 font-display text-xl font-bold text-[var(--brand)]">
              {formatImpactMetricDisplay(data?.label ?? "", data?.range)}
            </p>
            {data?.narrative && (
              <p className="mt-2 text-sm leading-relaxed text-[var(--fg-secondary)]">
                {data.narrative}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
