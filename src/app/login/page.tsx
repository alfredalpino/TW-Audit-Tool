import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-void)] px-4">
      <div className="tw-panel w-full min-w-0 max-w-md p-6 text-center sm:p-8">
        <h1 className="font-display text-xl font-bold">Sign in</h1>
        <p className="tw-contain-text mt-3 text-sm text-[var(--fg-secondary)]">
          Authentication providers wire up in Phase 2 (NextAuth + organization
          roles).
        </p>
        <Link
          href="/"
          className="mt-6 inline-block font-mono text-xs text-[var(--brand)] hover:underline"
        >
          ← Back to auditor
        </Link>
      </div>
    </main>
  );
}
