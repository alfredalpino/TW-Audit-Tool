import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--bg-void)]">
      <header className="border-b border-[var(--border)] bg-[var(--bg-base)]">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
          <Link href="/" className="font-mono text-xs text-[var(--fg-secondary)] hover:text-[var(--brand)]">
            ← Torpedo Auditor
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-[10px] uppercase tracking-wider text-[var(--fg-tertiary)] sm:inline">
              Audit results
            </span>
            <ThemeToggle size="nav" className="shrink-0" />
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">{children}</div>
    </div>
  );
}
