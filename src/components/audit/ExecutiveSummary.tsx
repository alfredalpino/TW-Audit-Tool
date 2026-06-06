export function ExecutiveSummary({
  summary,
  overallScore,
}: {
  summary: string | null | undefined;
  overallScore: number | null;
}) {
  if (!summary && overallScore === null) return null;

  return (
    <section className="tw-panel min-w-0 border-l-4 border-l-[var(--brand)] p-5 md:p-6">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--brand)]">
        Executive summary
      </p>
      {summary ? (
        <p className="tw-contain-text mt-3 text-sm leading-relaxed text-[var(--fg-primary)] md:text-base">
          {summary}
        </p>
      ) : (
        <p className="mt-3 text-sm text-[var(--fg-secondary)]">
          Analysis in progress…
        </p>
      )}
    </section>
  );
}
