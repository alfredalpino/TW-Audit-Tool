import type { AuditMethodology as Methodology } from "@/lib/audit/methodology";

export function AuditMethodologyPanel({
  methodology,
}: {
  methodology: Methodology;
}) {
  return (
    <section className="tw-panel min-w-0 p-5 md:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--brand)]">
        How this audit works
      </p>
      <h2 className="mt-2 font-display text-lg font-bold tracking-tight">
        {methodology.label}
      </h2>
      <p className="tw-contain-text mt-2 max-w-3xl text-sm leading-relaxed text-[var(--fg-secondary)]">
        {methodology.summary}
      </p>

      <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2">
        {methodology.tools.map((tool) => (
          <div
            key={tool.name}
            className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-muted)] p-3"
          >
            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--brand)]">
              {tool.name}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--fg-primary)]">
              {tool.role}
            </p>
          </div>
        ))}
      </div>

      {methodology.limitations.length > 0 && (
        <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-tertiary)]">
            Known limits
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-[var(--fg-secondary)]">
            {methodology.limitations.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[var(--brand)]" aria-hidden>
                  ·
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
