"use client";

import { useEffect, useState } from "react";

/**
 * The first document load belongs to it, and nothing else does.
 *
 * Every template renders one, so React mounted a fresh preloader on every
 * client navigation too, where there is no first paint left to cover: the load
 * event had long since fired, so it always ran the full fallback, flashed over
 * an already painted page, and held `html { overflow: hidden }` for 700ms.
 * That lock swallowed the router's scroll reset, which is why opening an
 * article from a card halfway down the blog landed halfway down the article.
 *
 * The flag lives at module scope, so it is reset by a real page load and by
 * nothing else.
 */
let consumed = false;

/**
 * Holds the page still while the first paint settles, then slides away.
 * The bar creeps to 90% on a timer and completes on load; the hard 700ms
 * fallback guarantees it never traps the page.
 */
export function Preloader({ label }: { label: string }) {
  const [active] = useState(() => !consumed);
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    consumed = true;
    if (!active) return;

    const root = document.documentElement;
    root.style.overflow = "hidden";

    let done = false;
    let settle: number | undefined;

    const creep = window.setInterval(() => {
      setProgress((value) => Math.min(90, value + Math.random() * 10));
    }, 200);

    const finish = () => {
      if (done) return;
      done = true;
      window.clearInterval(creep);
      setProgress(100);
      settle = window.setTimeout(() => {
        setHidden(true);
        root.style.overflow = "";
      }, 80);
    };

    window.addEventListener("load", finish);
    const fallback = window.setTimeout(finish, 700);

    return () => {
      window.clearInterval(creep);
      window.clearTimeout(fallback);
      if (settle) window.clearTimeout(settle);
      window.removeEventListener("load", finish);
      root.style.overflow = "";
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      // Skipped on mobile so it never delays first paint, matching the original.
      className="fixed top-0 left-0 z-[10000] flex h-dvh w-full flex-col items-center justify-center bg-surface transition-transform duration-1000 ease-preloader max-md:hidden"
      style={hidden ? { transform: "translateY(-100%)" } : undefined}
    >
      <div className="animate-preloader-pulse font-display text-[2vw] font-bold tracking-[0.2em] text-accent uppercase">
        {label}
      </div>
      <div className="relative mt-8 h-0.5 w-[200px] overflow-hidden bg-edge">
        <div
          className="absolute top-0 left-0 h-full bg-accent transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
