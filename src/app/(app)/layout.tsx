import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--bg-void)]">
      <header className="border-b border-[var(--border)] bg-[var(--bg-base)]">
        <div className="mx-auto flex h-12 w-full min-w-0 max-w-6xl items-center justify-between gap-3 px-4 md:gap-4 md:px-6">
          <Link href="/" className="tw-contain-text min-w-0 shrink font-mono text-xs text-[var(--fg-secondary)] hover:text-[var(--brand)]">
            ← Torpedo Auditor
          </Link>
          <span className="hidden font-mono text-[10px] uppercase tracking-wider text-[var(--fg-tertiary)] sm:inline">
            Audit results
          </span>
        </div>
      </header>
      <div className="mx-auto w-full min-w-0 max-w-6xl px-4 py-8 md:px-6 md:py-10">{children}</div>
    </div>
  );
}
