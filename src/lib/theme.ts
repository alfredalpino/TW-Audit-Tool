export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "torpedo-theme";

export const THEME_COLORS: Record<Theme, string> = {
  light: "#faf7f0",
  dark: "#0c0c0c",
};

export function getTheme(): Theme {
  return "light";
}

export function applyTheme(_theme: Theme = "light", persist = true): void {
  if (typeof document === "undefined") return;

  document.documentElement.dataset.theme = "light";
  document.documentElement.style.colorScheme = "light";

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, "light");
    } catch {
      /* ignore */
    }
  }
}

export function toggleTheme(): Theme {
  applyTheme("light");
  return "light";
}
