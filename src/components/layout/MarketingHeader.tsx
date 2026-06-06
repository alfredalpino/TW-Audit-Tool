"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const nav = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#categories", label: "Categories" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function MarketingHeader() {
  const isScrolled = useScrollPosition(60);
  const logoMarkRef = useRef<HTMLSpanElement>(null);

  const pulseLogo = useCallback(() => {
    const el = logoMarkRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.remove("tw-logo-pulse");
    void el.offsetWidth;
    el.classList.add("tw-logo-pulse");
    el.addEventListener(
      "animationend",
      () => el.classList.remove("tw-logo-pulse"),
      { once: true }
    );
  }, []);

  const scrolledClass = isScrolled
    ? "tw-nav-glass border-b border-[var(--border)]"
    : "border-b border-[var(--border)] bg-[var(--bg-void)]";

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 h-[var(--nav-h)] transition-[background,box-shadow,border-color,backdrop-filter] duration-300 ${scrolledClass}`}
    >
      <div className="tw-section flex h-full min-w-0 items-center justify-between gap-3 sm:gap-4">
        <Link
          href="/"
          className="relative z-[60] flex min-w-0 shrink items-center gap-2"
          onMouseEnter={pulseLogo}
          aria-label="Torpedo Website Intelligence Auditor home"
        >
          <span ref={logoMarkRef} className="inline-flex shrink-0" aria-hidden>
            <Image
              src="/logo.svg"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8"
              priority
            />
          </span>
          <span className="tw-contain-text min-w-0 font-display text-xs font-bold leading-tight tracking-tight text-[var(--fg-primary)] min-[380px]:text-sm sm:text-base">
            <span className="hidden min-[360px]:inline">TORPEDO WEB </span>
            <span className="min-[360px]:hidden">TW </span>
            <span className="text-[var(--fg-tertiary)]">AUDITOR</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="tw-nav-link text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle size="nav" className="shrink-0" />
        </div>
      </div>
    </header>
  );
}
