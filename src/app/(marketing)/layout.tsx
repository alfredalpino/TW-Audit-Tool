import type { ReactNode } from "react";
import { ComingSoonHeader } from "@/components/layout/ComingSoonHeader";

export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--bg-void)] text-[var(--fg-primary)]">
      <ComingSoonHeader />
      <div className="w-full min-w-0 flex-1 pt-[var(--nav-h)]">{children}</div>
    </div>
  );
}
