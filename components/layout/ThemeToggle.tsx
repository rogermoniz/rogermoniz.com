"use client";

import { useTheme } from "./ThemeProvider";
import { MoonIcon, SunIcon } from "@/components/primitives/icons";

/**
 * Fixed bottom right on every page. The two icons are always mounted and slide
 * past each other, which is what produces the original's vertical swap.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Activer le thème sombre" : "Activer le thème clair"}
      className="group fixed right-8 bottom-8 z-[10001] flex size-[52px] items-center justify-center overflow-hidden rounded-full border border-edge bg-edge backdrop-blur-md transition-[border-color,background-color,scale] duration-400 ease-out-expo hover:scale-105 hover:border-accent hover:bg-[var(--theme-btn-hover)]"
    >
      <span
        className="absolute flex size-full items-center justify-center transition-[transform,opacity] duration-800 ease-out-expo"
        style={
          isLight
            ? { transform: "translateY(-150%)", opacity: 0 }
            : { transform: "translateY(0)", opacity: 1 }
        }
      >
        <SunIcon className="size-[22px] stroke-ink transition-[stroke] duration-400 group-hover:stroke-accent" />
      </span>
      <span
        className="absolute flex size-full items-center justify-center transition-[transform,opacity] duration-800 ease-out-expo"
        style={
          isLight
            ? { transform: "translateY(0)", opacity: 1 }
            : { transform: "translateY(150%)", opacity: 0 }
        }
      >
        <MoonIcon className="size-[22px] stroke-ink transition-[stroke] duration-400 group-hover:stroke-accent" />
      </span>
    </button>
  );
}
