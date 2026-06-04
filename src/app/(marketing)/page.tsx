import { MarketingHero } from "@/components/marketing/MarketingHero";

const categories = [
  "SEO",
  "Speed",
  "UX",
  "CRO",
  "Technical",
  "Accessibility",
  "Security",
  "Compliance",
  "AI Readiness",
  "Mobile",
];

export default function HomePage() {
  return (
    <main id="main-content" className="bg-[var(--bg-base)] text-[var(--fg-primary)]">
      <MarketingHero />

      <section
        id="features"
        className="border-b border-[var(--border)] bg-[var(--bg-base)] py-16 md:py-20"
      >
        <div className="tw-section">
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--brand)]">
            [ Intelligence, not vanity scores ]
          </p>
          <h2 className="tw-heading-section mt-4 font-display font-bold tracking-tight">
            Every finding maps to business impact
          </h2>
          <p className="mt-3 max-w-2xl text-[var(--fg-secondary)]">
            Traffic loss, lead leakage, conversion friction, or revenue opportunity — built for
            operators who need decisions, not dashboards full of noise.
          </p>
        </div>
      </section>

      <section id="categories" className="border-b border-[var(--border)] bg-[var(--bg-void)] py-16 md:py-20">
        <div className="tw-section">
          <h2 className="font-display text-2xl font-bold tracking-tight">Audit categories</h2>
          <ul className="mt-8 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat) => (
              <li
                key={cat}
                className="tw-panel px-4 py-3 font-mono text-xs uppercase tracking-wider text-[var(--fg-secondary)]"
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-b border-[var(--border)] bg-[var(--bg-base)] py-16 md:py-20"
      >
        <div className="tw-section">
          <ol className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Submit URL",
                body: "We normalize and queue a full multi-engine audit run.",
              },
              {
                step: "02",
                title: "Analyze",
                body: "Workers run SEO, speed, a11y, CRO, security, and AI readiness checks.",
              },
              {
                step: "03",
                title: "Prioritize",
                body: "Scores, impact ranges, and a priority matrix drive what to fix first.",
              },
            ].map((item) => (
              <li key={item.step} className="tw-panel p-6">
                <span className="tw-metric text-[var(--brand)]">{item.step}</span>
                <h3 className="mt-3 font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--fg-secondary)]">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="pricing" className="border-b border-[var(--border)] bg-[var(--bg-void)] py-16 md:py-20">
        <div className="tw-section text-center">
          <h2 className="font-display text-2xl font-bold">Free audits during launch</h2>
          <p className="mt-3 text-[var(--fg-secondary)]">
            Live audits powered by Lighthouse, Playwright, and axe-core — with executive summaries
            and lead-gated full reports.
          </p>
        </div>
      </section>

      <section id="faq" className="bg-[var(--bg-base)] py-16">
        <div className="tw-section">
          <h2 className="font-display text-xl font-bold">FAQ</h2>
          <p className="mt-4 text-sm text-[var(--fg-secondary)]">
            Business impact figures are expressed as ranges, never fake precision. Unlock your
            report to download a branded PDF and receive it by email.
          </p>
        </div>
      </section>
    </main>
  );
}
