import Image from "next/image";
import Link from "next/link";

export function ComingSoonHeader() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-[var(--nav-h)] border-b border-[var(--border)] bg-[var(--bg-void)]">
      <div className="tw-section flex h-full min-w-0 items-center justify-between gap-3">
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-2"
          aria-label="Torpedo Website Intelligence Auditor — coming soon"
        >
          <Image
            src="/logo.svg"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 shrink-0"
            priority
          />
          <span className="tw-contain-text min-w-0 font-display text-xs font-bold leading-tight tracking-tight text-[var(--fg-primary)] min-[380px]:text-sm sm:text-base">
            <span className="hidden min-[360px]:inline">TORPEDO WEB </span>
            <span className="min-[360px]:hidden">TW </span>
            <span className="text-[var(--fg-tertiary)]">AUDITOR</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
