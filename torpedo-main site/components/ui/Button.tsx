import React from 'react';
import Link from 'next/link';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.js';
import { cn } from '@/lib/cn';

export type ButtonVariant =
  | 'brand'
  | 'secondary'
  | 'surface'
  | 'ghost'
  | 'nav'
  | 'light-brand'
  | 'light-secondary';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  href?: string;
  className?: string;
  withArrow?: boolean;
  fullWidth?: boolean;
  shimmer?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  /** For external links or data attributes on anchor */
  target?: string;
  rel?: string;
  /** Passed to anchor/button (e.g. data-cta) */
  'data-cta'?: string;
  'data-cta-location'?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
  tabIndex?: number;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-[44px] px-5 py-2.5 text-sm',
  md: 'min-h-[48px] px-6 py-3 text-sm',
  lg: 'min-h-[52px] px-8 py-4 text-base',
};

/** Skeuomorphic variants — styles live in app/globals.css (.tw-clay-btn-*) */
const variantClasses: Record<ButtonVariant, string> = {
  brand: 'tw-clay-btn tw-clay-btn-brand',
  secondary: 'tw-clay-btn tw-clay-btn-secondary',
  surface: 'tw-clay-btn tw-clay-btn-secondary tw-clay-btn-surface',
  ghost: 'tw-clay-btn tw-clay-btn-ghost px-0 py-2 min-h-0 font-medium shadow-none',
  nav: 'tw-clay-btn tw-clay-btn-secondary tw-clay-btn-nav',
  'light-brand': 'tw-clay-btn tw-clay-btn-light-brand',
  'light-secondary': 'tw-clay-btn tw-clay-btn-light-secondary',
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'brand',
  size = 'md',
  onClick,
  href,
  className = '',
  withArrow = false,
  fullWidth = false,
  shimmer = false,
  disabled = false,
  type = 'button',
  target,
  rel,
  'data-cta': dataCta,
  'data-cta-location': dataCtaLocation,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  tabIndex,
}) => {
  const classes = cn(
    variantClasses[variant],
    variant !== 'ghost' && sizeClasses[size],
    fullWidth && 'w-full',
    disabled && 'pointer-events-none opacity-50',
    'group font-semibold tracking-wide',
    className,
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
      {shimmer && (
        <div
          className="absolute inset-0 z-[1] h-full w-full -translate-x-full skew-x-[-15deg] animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent motion-reduce:animate-none"
          aria-hidden
        />
      )}
    </>
  );

  const disabledProps = disabled
    ? { 'aria-disabled': true as const, tabIndex: -1 }
    : {};

  if (href) {
    const isExternal = href.startsWith('http');
    const linkProps = {
      className: classes,
      onClick: disabled ? undefined : onClick,
      ...disabledProps,
      ...(dataCta && { 'data-cta': dataCta }),
      ...(dataCtaLocation && { 'data-cta-location': dataCtaLocation }),
      ...(ariaLabel && { 'aria-label': ariaLabel }),
      ...(ariaHidden !== undefined && { 'aria-hidden': ariaHidden }),
      ...(tabIndex !== undefined && { tabIndex }),
    };

    if (isExternal) {
      return (
        <a
          href={disabled ? undefined : href}
          target={target ?? '_blank'}
          rel={rel ?? 'noopener noreferrer'}
          {...linkProps}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={disabled ? '#' : href} {...linkProps}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      tabIndex={tabIndex}
      {...(dataCta && { 'data-cta': dataCta })}
      {...(dataCtaLocation && { 'data-cta-location': dataCtaLocation })}
    >
      {content}
    </button>
  );
};

export default Button;
