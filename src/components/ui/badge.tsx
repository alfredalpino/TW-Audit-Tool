import { cn } from "@/lib/utils";

const severityStyles: Record<string, string> = {
  critical: "bg-red-500/15 text-red-400 border-red-500/30",
  high: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  low: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  info: "bg-[var(--bg-ghost)] text-[var(--fg-tertiary)] border-[var(--border)]",
};

export function Badge({
  children,
  severity,
  className,
}: {
  children: React.ReactNode;
  severity?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center overflow-hidden rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider border",
        severity ? severityStyles[severity] : "border-[var(--border)] text-[var(--fg-secondary)]",
        className
      )}
    >
      {children}
    </span>
  );
}
