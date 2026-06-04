import type { FindingDto } from "@/types/audit";

type Quadrant = "quick-wins" | "major-projects" | "fill-ins" | "monitor";

function quadrant(f: FindingDto): Quadrant {
  const highImpact =
    f.severity === "critical" ||
    f.severity === "high" ||
    f.priorityScore >= 70;
  const highEffort =
    f.category === "speed" ||
    f.category === "technical" ||
    f.severity === "critical";

  if (highImpact && !highEffort) return "quick-wins";
  if (highImpact && highEffort) return "major-projects";
  if (!highImpact && highEffort) return "monitor";
  return "fill-ins";
}

const QUADRANT_META: Record<
  Quadrant,
  { title: string; hint: string; className: string }
> = {
  "quick-wins": {
    title: "Quick wins",
    hint: "High impact, lower effort",
    className: "border-[var(--brand)]/40 bg-[var(--brand)]/5",
  },
  "major-projects": {
    title: "Major projects",
    hint: "High impact, higher effort",
    className: "border-amber-500/30 bg-amber-500/5",
  },
  "fill-ins": {
    title: "Fill-ins",
    hint: "Polish when capacity allows",
    className: "border-[var(--border)] bg-[var(--bg-muted)]",
  },
  monitor: {
    title: "Monitor",
    hint: "Track — lower urgency",
    className: "border-[var(--border)] bg-[var(--bg-surface)]",
  },
};

export function PriorityMatrix({ findings }: { findings: FindingDto[] }) {
  if (!findings.length) return null;

  const buckets: Record<Quadrant, FindingDto[]> = {
    "quick-wins": [],
    "major-projects": [],
    "fill-ins": [],
    monitor: [],
  };

  for (const f of findings) {
    buckets[quadrant(f)].push(f);
  }

  return (
    <section>
      <h2 className="mb-2 font-display text-lg font-bold">Priority matrix</h2>
      <p className="mb-4 text-sm text-[var(--fg-tertiary)]">
        Impact vs effort grouping from severity and category signals.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {(Object.keys(buckets) as Quadrant[]).map((key) => {
          const meta = QUADRANT_META[key];
          const items = buckets[key].slice(0, 4);
          return (
            <div
              key={key}
              className={`rounded-[var(--radius-lg)] border p-4 ${meta.className}`}
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-tertiary)]">
                {meta.title}
              </p>
              <p className="text-xs text-[var(--fg-secondary)]">{meta.hint}</p>
              <ul className="mt-3 space-y-2">
                {items.length === 0 ? (
                  <li className="text-xs text-[var(--fg-tertiary)]">—</li>
                ) : (
                  items.map((f) => (
                    <li
                      key={f.id}
                      className="text-sm text-[var(--fg-primary)] line-clamp-2"
                    >
                      {f.title}
                    </li>
                  ))
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
