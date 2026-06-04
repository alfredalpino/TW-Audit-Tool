"use client";

import { AuditUrlForm } from "@/components/audit/AuditUrlForm";

const HERO_EYEBROW = "[ WEBSITE INTELLIGENCE PLATFORM ]";

export function MarketingHero() {
  return (
    <section
      className="tw-texture-void relative flex min-h-[calc(100dvh-var(--nav-h))] min-w-0 flex-col items-center justify-center overflow-hidden border-b border-[var(--border)] bg-[var(--bg-void)] pb-24 pt-6 sm:pb-28 sm:pt-8"
      aria-labelledby="marketing-hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />
      <div className="tw-grid-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden />

      <div className="tw-section relative z-[10] flex w-full flex-col items-center pb-16 text-center md:pb-12">
        <p className="tw-animate-in-eyebrow tw-prose-flow mb-4 max-w-full font-display text-[clamp(0.805rem,2.3vw,0.934rem)] font-bold uppercase leading-snug tracking-[0.16em] text-[var(--brand)] sm:text-[clamp(0.863rem,1.725vw,1.006rem)] sm:tracking-[0.18em]">
          {HERO_EYEBROW}
        </p>

        <h1
          id="marketing-hero-heading"
          className="tw-animate-in-hero tw-hero-h1 max-w-4xl font-display font-extrabold tracking-[-0.02em] text-[var(--fg-primary)]"
        >
          Find What Is Costing Your Website{" "}
          <span className="whitespace-nowrap text-[var(--brand)]">Traffic, Leads,</span>
          <br />
          and Revenue.
        </h1>

        <p className="tw-animate-in-hero-delay tw-hero-sub tw-prose-flow mx-auto mt-8 max-w-2xl font-sans font-light text-[var(--fg-secondary)]">
          Analyze speed, SEO, accessibility, conversions, security, compliance, and growth
          opportunities in under 60 seconds — built for operators who need decisions, not noise.
        </p>

        <div className="tw-animate-in-cta mt-10 flex w-full max-w-2xl flex-col items-stretch gap-4 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
          <div className="w-full sm:max-w-xl">
            <AuditUrlForm />
          </div>
        </div>

        <dl className="tw-animate-in-cta mt-14 grid w-full max-w-3xl grid-cols-2 gap-4 border-t border-[var(--border)] pt-10 sm:grid-cols-4">
          {[
            { label: "Audit engines", value: "12+" },
            { label: "Business impact", value: "Every issue" },
            { label: "Target time", value: "<60s" },
            { label: "Report depth", value: "Executive" },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-tertiary)]">
                {stat.label}
              </dt>
              <dd className="tw-metric mt-1 text-xl text-[var(--fg-primary)]">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
