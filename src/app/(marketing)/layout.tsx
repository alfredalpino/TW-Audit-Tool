import type { ReactNode } from "react";
import { MarketingHeader } from "@/components/layout/MarketingHeader";

export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--bg-void)] text-[var(--fg-primary)]">
      <MarketingHeader />
      <div className="w-full min-w-0 flex-1 pt-[var(--nav-h)]">{children}</div>
    </div>
  );
}
