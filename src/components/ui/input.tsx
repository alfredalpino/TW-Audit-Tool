import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "tw-clay-input h-12 w-full px-4 text-sm text-[var(--fg-primary)] placeholder:text-[var(--fg-tertiary)]",
        className
      )}
      {...props}
    />
  );
}
