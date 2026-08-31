"use client";

import { useEffect, useState } from "react";

/**
 * Set once the first document load has been covered. A real page load resets
 * it, a navigation inside the site does not, which is how the loader tells the
 * two apart.
 */
let firstLoadDone = false;

/**
 * Holds the page while it settles, then slides away.
 *
 * A first document load has a paint to cover and a `load` event to wait for. A
 * navigation inside the site has neither, since the page is already built, so
 * there the loader is a short beat rather than a wait.
 *
 * **It renders last in a page and is positioned, never in flow.** The router
 * decides where to put the reader by measuring the first element of the page it
 * just opened; a full screen fixed panel sitting there reads as already in
 * view, so the router leaves the scroll alone and an article opened from a card
 * halfway down the blog begins halfway down. For the same reason the page is
 * only locked during the first load, where there is no router decision to
 * swallow.
 */
export function Preloader({ label }: { label: string }) {
  const [firstLoad] = useState(() => !firstLoadDone);
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    firstLoadDone = true;

    const root = document.documentElement;
    if (firstLoad) root.style.overflow = "hidden";

    let done = false;
    let settle: number | undefined;

    const creep = window.setInterval(() => {
      setProgress((value) => Math.min(90, value + Math.random() * 12));
    }, 120);

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

    if (firstLoad) window.addEventListener("load", finish);
    // On a navigation the beat is short on purpose. What actually decides how
    // long the loader stays up is the page being built behind it: timers wait
    // their turn on the main thread, so a heavy page holds it a little longer,
    // which is the point of covering the transition at all.
    const fallback = window.setTimeout(finish, firstLoad ? 700 : 260);

    return () => {
      window.clearInterval(creep);
      window.clearTimeout(fallback);
      if (settle) window.clearTimeout(settle);
      window.removeEventListener("load", finish);
      root.style.overflow = "";
    };
  }, [firstLoad]);

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
