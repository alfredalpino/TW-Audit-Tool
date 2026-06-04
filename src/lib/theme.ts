export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "torpedo-theme";

export const THEME_COLORS: Record<Theme, string> = {
  light: "#faf7f0",
  dark: "#0c0c0c",
};

export function getTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function applyTheme(theme: Theme, persist = true): void {
  if (typeof document === "undefined") return;

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }
}

export function toggleTheme(): Theme {
  const next: Theme = getTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}
