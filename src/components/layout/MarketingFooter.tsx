"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Globe } from "lucide-react";
import { ClayCard } from "@/components/ui/ClayCard";
import { Button } from "@/components/ui/button";
import { MonoBracketEyebrowScramble } from "@/components/ui/MonoBracketEyebrowScramble";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_INDIA,
  CONTACT_INDIA_PHONES,
  CONTACT_PHONE,
  CONTACT_PHONE_TEL,
  GOOGLE_CALENDAR_APPOINTMENT_URL,
  torpedoSitePath,
} from "@/lib/contact";

type ContactPhone = { label: string; tel: string };

function ContactRegionBlock({
  region,
  phones,
  address,
}: {
  region: string;
  phones: readonly ContactPhone[];
  address: string;
}) {
  return (
    <div className="tw-footer-region min-w-0">
      <p className="tw-footer-heading mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
        {region}
      </p>
      <div className="space-y-2 font-mono text-[11px] leading-relaxed">
        {phones.map((p) => (
          <a
            key={p.tel}
            href={p.tel}
            className="tw-footer-link block text-[var(--fg-primary)] hover:text-[var(--brand)]"
          >
            {p.label}
          </a>
        ))}
        <p className="whitespace-pre-wrap text-[var(--fg-secondary)]">{address}</p>
      </div>
    </div>
  );
}

const usPhones: ContactPhone[] = [
  { label: CONTACT_PHONE, tel: CONTACT_PHONE_TEL },
];
const indiaPhones: ContactPhone[] = CONTACT_INDIA_PHONES.map((p) => ({
  label: p.label,
  tel: p.tel,
}));

export function MarketingFooter() {
  return (
    <footer className="tw-footer relative w-full max-w-[100vw] overflow-hidden text-[var(--fg-primary)]">
      <div className="tw-section relative z-10 w-full min-w-0 max-w-full pb-6 pt-10 md:pb-8 md:pt-12 lg:pt-14">
        <div className="relative mb-8 w-full min-w-0 max-w-full overflow-x-clip md:mb-10">
          <div className="mb-6 flex flex-wrap items-center gap-4 md:mb-8">
            <Link
              href="/"
              aria-label="Torpedo Web Website Auditor home"
              className="tw-footer-logo-well shrink-0"
            >
              <Image
                src="/logo.svg"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 md:h-9 md:w-9"
                aria-hidden
              />
            </Link>
            <span
              className="tw-footer-tagline-rule hidden w-12 sm:block"
              aria-hidden
            />
            <p className="max-w-md font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-tertiary)]">
              Digital engineering · North India &amp; US
            </p>
          </div>

          <p className="tw-prose-flow max-w-2xl text-base leading-relaxed text-[var(--fg-secondary)] md:text-lg">
            Engineering digital systems since 2026: performance, search, and
            conversion infrastructure built to move like a torpedo. Fast,
            directed, impossible to ignore.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center md:mt-10">
            <Button
              href={GOOGLE_CALENDAR_APPOINTMENT_URL}
              variant="brand"
              className="font-display tracking-wide"
            >
              Book a discovery call
              <ArrowUpRight className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            </Button>
            <Button
              href={torpedoSitePath("/services")}
              variant="secondary"
              className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]"
            >
              View capabilities
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>

        <ClayCard className="tw-footer-panel relative isolate p-6 md:p-10 lg:p-12">
          <div
            className="tw-footer-panel-rim absolute left-6 right-6 top-0 z-10 md:left-10 md:right-10 lg:left-12 lg:right-12"
            aria-hidden
          />

          <div className="grid min-w-0 grid-cols-1 gap-10 pt-2 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            <div className="min-w-0">
              <h2 className="tw-footer-heading mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--brand)]">
                Contact
              </h2>
              <div className="space-y-3 font-mono text-[11px] leading-relaxed text-[var(--fg-secondary)]">
                <ContactRegionBlock
                  region="US"
                  phones={usPhones}
                  address={CONTACT_ADDRESS}
                />
                <ContactRegionBlock
                  region="IN"
                  phones={indiaPhones}
                  address={CONTACT_INDIA.address}
                />
              </div>
              <div className="mt-6 flex gap-3">
                <a
                  href="https://x.com/TorpedoWebOrg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tw-footer-social"
                  aria-label="X (opens in new tab)"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/torpedoweb/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tw-footer-social"
                  aria-label="LinkedIn (opens in new tab)"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/people/Torpedo-Web/61589591844825/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tw-footer-social"
                  aria-label="Facebook (opens in new tab)"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/torpedoweb/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tw-footer-social"
                  aria-label="Instagram (opens in new tab)"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="min-w-0">
              <h2 className="tw-footer-heading mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--brand)]">
                Services
              </h2>
              <ul className="space-y-3 text-sm text-[var(--fg-secondary)]">
                <li>
                  <a
                    href={torpedoSitePath("/services")}
                    className="tw-footer-link hover:text-[var(--fg-primary)]"
                  >
                    Capabilities
                  </a>
                </li>
                <li>
                  <a
                    href={torpedoSitePath("/what-we-do")}
                    className="tw-footer-link hover:text-[var(--fg-primary)]"
                  >
                    What we do
                  </a>
                </li>
                <li>
                  <a
                    href={GOOGLE_CALENDAR_APPOINTMENT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tw-footer-link inline-flex items-center gap-1 hover:text-[var(--fg-primary)]"
                  >
                    Book a discovery call
                    <ArrowUpRight
                      className="h-3.5 w-3.5 opacity-70"
                      aria-hidden
                    />
                  </a>
                </li>
              </ul>
            </div>

            <div className="min-w-0">
              <h2 className="tw-footer-heading mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--brand)]">
                Company
              </h2>
              <ul className="space-y-3 text-sm text-[var(--fg-secondary)]">
                <li>
                  <a
                    href={torpedoSitePath("/process")}
                    className="tw-footer-link hover:text-[var(--fg-primary)]"
                  >
                    Process
                  </a>
                </li>
                <li>
                  <a
                    href={torpedoSitePath("/systems")}
                    className="tw-footer-link hover:text-[var(--fg-primary)]"
                  >
                    Systems
                  </a>
                </li>
                <li>
                  <a
                    href={torpedoSitePath("/blog")}
                    className="tw-footer-link hover:text-[var(--fg-primary)]"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href={torpedoSitePath("/privacy-policy")}
                    className="tw-footer-link hover:text-[var(--fg-primary)]"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href={torpedoSitePath("/terms-of-service")}
                    className="tw-footer-link hover:text-[var(--fg-primary)]"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>

            <div className="min-w-0">
              <MonoBracketEyebrowScramble text="[DISPATCH]" className="mb-2" />
              <p className="mb-4 text-sm text-[var(--fg-secondary)]">
                Strategic insights, zero noise.
              </p>
              <form
                className="flex flex-col gap-2 sm:flex-row sm:items-stretch"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const addr = String(fd.get("email") ?? "").trim();
                  const q = new URLSearchParams({
                    subject: "Newsletter / dispatch signup",
                    body: addr
                      ? `Please add: ${addr}`
                      : "Please add me to strategic updates.",
                  });
                  window.location.href = `mailto:${CONTACT_EMAIL}?${q.toString()}`;
                }}
              >
                <label htmlFor="footer-dispatch-email" className="sr-only">
                  Email for dispatch
                </label>
                <input
                  id="footer-dispatch-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="tw-footer-input min-h-[44px] w-full flex-1 px-3 font-mono text-xs text-[var(--fg-primary)] placeholder:text-[var(--fg-tertiary)] sm:min-w-0"
                />
                <Button
                  type="submit"
                  variant="brand"
                  size="sm"
                  className="min-w-[44px] px-3"
                  aria-label="Submit dispatch signup"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </form>
              <p className="mt-4 text-xs text-[var(--fg-tertiary)]">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="tw-mono-block underline-offset-2 hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>
          </div>
        </ClayCard>

        <div className="tw-footer-bar mt-8 flex flex-col gap-4 pt-6 md:mt-10 md:flex-row md:items-center md:justify-between md:pt-7">
          <p className="font-mono text-xs text-[var(--fg-tertiary)]">
            © {new Date().getFullYear()} Torpedo Web LLC. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-[var(--fg-tertiary)]">
            <a
              href={torpedoSitePath("/")}
              className="group inline-flex items-center gap-1.5 transition-colors hover:text-[var(--fg-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-void)]"
              aria-label="Torpedo Web site — English"
            >
              <Globe
                className="h-3.5 w-3.5 shrink-0 opacity-70 transition-opacity group-hover:opacity-100"
                aria-hidden
              />
              <span>English</span>
            </a>
            <a
              href={torpedoSitePath("/privacy-policy")}
              className="tw-footer-link hover:text-[var(--fg-secondary)]"
            >
              Privacy
            </a>
            <a
              href={torpedoSitePath("/terms-of-service")}
              className="tw-footer-link hover:text-[var(--fg-secondary)]"
            >
              Terms
            </a>
            <a
              href={torpedoSitePath("/dmca")}
              className="tw-footer-link hover:text-[var(--fg-secondary)]"
            >
              DMCA
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
