"use client";

import { useEffect, useRef } from "react";
import { ChevronDownIcon } from "@/components/primitives/icons";

/**
 * The hero scroll hint. Opacity is written to the node inside a rAF so the
 * fade costs no React render while scrolling.
 */
export function ScrollCue({ label = "Défiler" }: { label?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame: number | null = null;

    const update = () => {
      frame = null;
      const hero = node.closest("section");
      const height = hero?.offsetHeight || window.innerHeight;
      const ratio = 1 - Math.min(1, window.scrollY / (height * 0.5));
      node.style.opacity = ratio.toFixed(3);
    };

    const schedule = () => {
      frame ??= requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute bottom-[clamp(18px,3.2vh,40px)] left-1/2 z-25 flex -translate-x-1/2 flex-col items-center gap-[9px] text-white mix-blend-difference transition-opacity duration-350 max-md:flex-col-reverse"
    >
      <span className="font-body text-[0.6rem] font-semibold tracking-[0.22em] uppercase">
        {label}
      </span>
      <span className="relative h-12 w-px overflow-hidden bg-white/35">
        <span className="absolute top-0 left-0 h-2/5 w-full animate-cue-drop bg-white max-md:[animation-direction:reverse]" />
      </span>
      <ChevronDownIcon className="size-4 animate-cue-bob max-md:rotate-180" />
    </div>
  );
}
