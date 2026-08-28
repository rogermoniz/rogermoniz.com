"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Holds the page still while the first paint settles, then slides away.
 * The bar creeps to 90% on a timer and completes on load, exactly as the
 * original did; the hard 700ms fallback guarantees it never traps the page.
 */
export function Preloader({
  label,
  onFinish,
}: {
  label: string;
  onFinish?: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const doneRef = useRef(false);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = "hidden";

    const creep = window.setInterval(() => {
      setProgress((value) => Math.min(90, value + Math.random() * 10));
    }, 200);

    let settle: number | undefined;

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      window.clearInterval(creep);
      setProgress(100);
      settle = window.setTimeout(() => {
        setHidden(true);
        root.style.overflow = "";
        finishRef.current?.();
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
  }, []);

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
