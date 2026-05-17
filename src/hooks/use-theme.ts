import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark" | "system";

const THEME_KEY = "continuum_theme";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const resolved = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.classList.toggle("dark", resolved === "dark");
  // Keep native scrollbars, form controls, and the browser UA stylesheet in sync
  // with the resolved theme so they don't render in the opposite scheme.
  document.documentElement.style.colorScheme = resolved;
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    // Default to "system" (not "light") so dark-OS users without an explicit
    // preference automatically get dark mode. Matches the anti-FOUC bootstrap
    // in __root.tsx — keep both in sync to avoid hydration flashes.
    return (localStorage.getItem(THEME_KEY) as Theme) || "system";
  });

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem(THEME_KEY, t);
    applyTheme(t);
  }, []);

  useEffect(() => {
    applyTheme(theme);

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme]);

  const resolved = theme === "system" ? getSystemTheme() : theme;

  return { theme, resolved, setTheme };
}
