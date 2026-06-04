import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "brand"
  | "secondary"
  | "surface"
  | "ghost"
  | "nav"
  | "light-brand"
  | "light-secondary"
  | "outline";

export type ButtonSize = "sm" | "md" | "lg";

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-[44px] px-5 py-2.5 text-sm",
  md: "min-h-[48px] px-6 py-3 text-sm",
  lg: "min-h-[52px] px-8 py-4 text-base",
};

const variantClasses: Record<ButtonVariant, string> = {
  brand: "tw-clay-btn tw-clay-btn-brand",
  secondary: "tw-clay-btn tw-clay-btn-secondary",
  surface: "tw-clay-btn tw-clay-btn-secondary tw-clay-btn-surface",
  ghost: "tw-clay-btn tw-clay-btn-ghost px-0 py-2 min-h-0 font-medium shadow-none",
  nav: "tw-clay-btn tw-clay-btn-secondary tw-clay-btn-nav",
  "light-brand": "tw-clay-btn tw-clay-btn-light-brand",
  "light-secondary": "tw-clay-btn tw-clay-btn-light-secondary",
  outline: "tw-clay-btn tw-clay-btn-secondary",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  withArrow?: boolean;
  fullWidth?: boolean;
  target?: string;
  rel?: string;
}

export function Button({
  children,
  className,
  variant = "brand",
  size = "md",
  href,
  withArrow = false,
  fullWidth = false,
  disabled,
  type = "button",
  target,
  rel,
  onClick,
  ...props
}: ButtonProps) {
  const classes = cn(
    variantClasses[variant],
    variant !== "ghost" && sizeClasses[size],
    fullWidth && "w-full",
    disabled && "pointer-events-none opacity-50",
    "group font-semibold tracking-wide",
    className
  );

  const content = (
    <>
      <span className="relative z-[2] flex items-center justify-center gap-2">
        {children}
        {withArrow && (
          <ArrowRight
            className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
            aria-hidden
          />
        )}
      </span>
    </>
  );

  const disabledProps = disabled ? { "aria-disabled": true as const, tabIndex: -1 } : {};

  if (href) {
    const isExternal = href.startsWith("http");
    const linkProps = {
      className: classes,
      ...disabledProps,
    };

    if (isExternal) {
      return (
        <a
          href={disabled ? undefined : href}
          target={target ?? "_blank"}
          rel={rel ?? "noopener noreferrer"}
          {...linkProps}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={disabled ? "#" : href} {...linkProps}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick} {...props}>
      {content}
    </button>
  );
}
