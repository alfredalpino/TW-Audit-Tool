import Image from "next/image";
import { ClayCard } from "@/components/ui/ClayCard";
import { Button } from "@/components/ui/button";
import { TORPEDO_WEB_SITE } from "@/lib/contact";

export function ComingSoonPage() {
  return (
    <main
      id="main-content"
      className="tw-texture-void relative flex min-h-[calc(100dvh-var(--nav-h))] flex-col items-center justify-center overflow-hidden bg-[var(--bg-void)] px-[var(--gutter)] py-12 text-[var(--fg-primary)] sm:py-16"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />
      <div className="tw-grid-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden />

      <div className="tw-section relative z-[10] flex w-full max-w-3xl flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt=""
            width={48}
            height={48}
            className="h-10 w-10 sm:h-12 sm:w-12"
            priority
          />
          <p className="font-display text-sm font-bold tracking-tight text-[var(--fg-primary)] sm:text-base">
            TORPEDO WEB
          </p>
        </div>

        <p className="font-display text-[clamp(0.756rem,2vw,0.98rem)] font-bold uppercase tracking-[0.2em] text-[var(--brand)]">
          [ Website Intelligence Auditor ]
        </p>

        <h1 className="tw-hero-h1 mt-4 min-h-0 font-display font-extrabold tracking-[-0.02em] text-[var(--fg-primary)] md:min-h-[2.2em]">
          Coming
          <br />
          Soon
        </h1>

        <p className="tw-hero-sub mt-6 max-w-2xl font-sans font-light text-[var(--fg-secondary)]">
          We&apos;re building a multi-engine audit tool for SEO, speed, accessibility,
          conversions, and security — with business impact, not vanity scores.
        </p>

        <ClayCard className="mt-10 w-full max-w-xl p-6 sm:p-8">
          <p className="text-sm leading-relaxed text-[var(--fg-secondary)]">
            Launch updates and early access will be announced on{" "}
            <span className="text-[var(--fg-primary)]">torpedoweb.org</span>. Visit the main
            site for agency services, strategy, and contact.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button href={TORPEDO_WEB_SITE} variant="brand" size="lg" withArrow>
              Visit Torpedo Web
            </Button>
            <Button href="https://offer.torpedoweb.org" variant="secondary" size="lg">
              View pricing
            </Button>
          </div>
        </ClayCard>
      </div>
    </main>
  );
}
