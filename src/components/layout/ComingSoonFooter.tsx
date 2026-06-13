import { TORPEDO_WEB_SITE } from "@/lib/contact";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function ComingSoonFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-base)] px-[var(--gutter)] py-8 text-[var(--fg-primary)]">
      <div className="tw-section flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="font-mono text-xs text-[var(--fg-tertiary)]">
          © {new Date().getFullYear()} Torpedo Web LLC. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-xs text-[var(--fg-tertiary)]">
          <ThemeToggle className="shrink-0" />
          <a
            href={TORPEDO_WEB_SITE}
            className="transition-colors hover:text-[var(--fg-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          >
            torpedoweb.org
          </a>
        </div>
      </div>
    </footer>
  );
}
