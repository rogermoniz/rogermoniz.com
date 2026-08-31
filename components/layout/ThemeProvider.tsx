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

import { THEME_COLOR, type Theme } from "@/lib/theme";

export type { Theme };

const STORAGE_KEY = "rm-theme";
const DEFAULT_THEME: Theme = "light";

/**
 * The browser's own bars follow the theme, at boot and at every toggle.
 *
 * Left unsaid, a phone browser picks that colour itself by looking at the page,
 * which is why the bar around the address blended at the top of the page, went
 * to a flat white block partway down, and stayed there. Saying it outright
 * stops the guessing.
 */
function paintBrowserBars(theme: Theme) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
}

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
      paintBrowserBars(next);
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
export const THEME_BOOTSTRAP = `try{var t=localStorage.getItem("${STORAGE_KEY}")||"${DEFAULT_THEME}";document.documentElement.setAttribute("data-theme",t);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",t==="dark"?"${THEME_COLOR.dark}":"${THEME_COLOR.light}")}catch(e){document.documentElement.setAttribute("data-theme","${DEFAULT_THEME}")}`;
