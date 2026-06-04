'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { getTheme, toggleTheme, type Theme } from '@/lib/theme';

function SunIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="tw-theme-toggle__icon tw-theme-toggle__icon--sun"
      data-active={active ? 'true' : 'false'}
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" opacity={active ? 0.95 : 0.42} />
      <g stroke="currentColor" opacity={active ? 0.9 : 0.36}>
        <line x1="12" y1="2.5" x2="12" y2="5.5" />
        <line x1="12" y1="18.5" x2="12" y2="21.5" />
        <line x1="2.5" y1="12" x2="5.5" y2="12" />
        <line x1="18.5" y1="12" x2="21.5" y2="12" />
        <line x1="4.8" y1="4.8" x2="6.9" y2="6.9" />
        <line x1="17.1" y1="17.1" x2="19.2" y2="19.2" />
        <line x1="4.8" y1="19.2" x2="6.9" y2="17.1" />
        <line x1="17.1" y1="6.9" x2="19.2" y2="4.8" />
      </g>
    </svg>
  );
}

function MoonIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      className="tw-theme-toggle__icon tw-theme-toggle__icon--moon"
      data-active={active ? 'true' : 'false'}
      aria-hidden
    >
      <path
        d="M14.5 2.2a8.5 8.5 0 1 0 7.3 12.4A7.2 7.2 0 0 1 14.5 2.2Z"
        opacity={active ? 0.95 : 0.4}
      />
    </svg>
  );
}

type ThemeToggleProps = {
  className?: string;
  size?: 'default' | 'nav';
};

export function ThemeToggle({ className = '', size = 'default' }: ThemeToggleProps) {
  const sizeClass = size === 'nav' ? 'tw-theme-toggle--nav' : '';
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(getTheme());
  }, []);

  const handleToggle = useCallback(() => {
    const next = toggleTheme();
    setTheme(next);
  }, []);

  if (!mounted) {
    return (
      <span
        className={`tw-theme-toggle tw-theme-toggle--placeholder ${sizeClass} ${className}`.trim()}
        aria-hidden
      />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`tw-theme-toggle ${sizeClass} ${pressed ? 'tw-theme-toggle--pressed' : ''} ${className}`.trim()}
      onClick={handleToggle}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') setPressed(true);
      }}
      onKeyUp={() => setPressed(false)}
    >
      <span className="tw-theme-toggle__well">
        <span className="tw-theme-toggle__track" data-theme={theme}>
          <span className="tw-theme-toggle__icons">
            <SunIcon active={!isDark} />
            <MoonIcon active={isDark} />
          </span>
          <span className="tw-theme-toggle__knob" aria-hidden>
            <span className="tw-theme-toggle__knob-face">
              {isDark ? <MoonIcon active /> : <SunIcon active />}
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}

export default ThemeToggle;
