"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "rm-theme";
const DEFAULT_THEME: Theme = "light";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** The inline bootstrap runs before paint, so it is the source of truth on first render. */
function readTheme(): Theme {
  if (typeof document === "undefined") return DEFAULT_THEME;
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Private browsing or a blocked storage partition: the theme still
        // applies for this page view, it simply will not be remembered.
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

/**
 * Applied before first paint so a reader who chose dark never sees a light
 * flash. Kept to a single attribute write; all other behaviour is React.
 */
export const THEME_BOOTSTRAP = `try{var t=localStorage.getItem("${STORAGE_KEY}")||"${DEFAULT_THEME}";document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","${DEFAULT_THEME}")}`;
