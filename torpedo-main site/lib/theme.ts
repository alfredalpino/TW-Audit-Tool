export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'torpedo-theme';

export const THEME_COLORS: Record<Theme, string> = {
  light: '#faf7f0',
  dark: '#0c0c0c',
};

export function readStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* ignore */
  }
  return null;
}

export function resolveSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function applyTheme(theme: Theme, persist = true): void {
  if (typeof document === 'undefined') return;

  document.documentElement.dataset.theme = theme;

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', THEME_COLORS[theme]);
}

export function toggleTheme(): Theme {
  const next: Theme = getTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}
