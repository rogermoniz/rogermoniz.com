"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cloudinary } from "@/lib/cloudinary";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/**
 * The pinned article opening: the photograph grows from an inset card to
 * fullscreen while the title lifts away. Driven by scroll position in one rAF.
 */
export function ArticleHero({
  category,
  date,
  readingTime,
  title,
  path,
  alt,
  scrollLabel,
}: {
  category: string | null;
  date: string | null;
  readingTime: string | null;
  title: string | null;
  path: string | null;
  alt: string;
  scrollLabel: string;
}) {
  const wrapRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let frame: number | null = null;

    const render = () => {
      frame = null;
      const distance = wrap.offsetHeight - window.innerHeight;
      const progress = distance > 0 ? clamp(-wrap.getBoundingClientRect().top / distance, 0, 1) : 0;

      // Title and cue clear out over the first 45% of the track.
      const fade = clamp(progress / 0.45, 0, 1);
      if (contentRef.current) {
        contentRef.current.style.opacity = (1 - fade).toFixed(3);
        contentRef.current.style.transform = `translateY(${(-100 * fade).toFixed(1)}px)`;
      }
      if (cueRef.current) {
        cueRef.current.style.opacity = (1 - fade).toFixed(3);
        cueRef.current.style.transform = `translateX(-50%) translateY(${(-100 * fade).toFixed(1)}px)`;
      }

      const eased = easeInOut(progress);
      const desktop = window.innerWidth >= 769;
      const startW = desktop ? 40 : 88;
      const startH = desktop ? 60 : 46;
      if (frameRef.current) {
        frameRef.current.style.width = `${(startW + (100 - startW) * eased).toFixed(2)}vw`;
        frameRef.current.style.height = `${(startH + (100 - startH) * eased).toFixed(2)}vh`;
        frameRef.current.style.top = `${(75 - 75 * eased).toFixed(2)}%`;
        frameRef.current.style.borderRadius = `${(24 - 24 * eased).toFixed(1)}px`;
      }
      if (imageRef.current) {
        imageRef.current.style.transform = `scale(${(1.15 - 0.15 * eased).toFixed(3)})`;
      }
    };

    const schedule = () => {
      frame ??= requestAnimationFrame(render);
    };

    render();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={wrapRef} className="relative h-[220vh] w-full bg-surface">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          ref={contentRef}
          className="absolute inset-0 z-2 flex flex-col items-center justify-center px-[var(--padding-x)] text-center"
        >
          <div className="mb-6 flex flex-wrap items-center justify-center gap-[0.55rem] font-body text-[0.72rem] font-semibold tracking-[0.12em] text-muted uppercase">
            {category ? <span className="text-accent">{category}</span> : null}
            {date ? (
              <>
                <span className="opacity-45">/</span>
                <span>{date}</span>
              </>
            ) : null}
            {readingTime ? (
              <>
                <span className="opacity-45">/</span>
                <span>{readingTime}</span>
              </>
            ) : null}
          </div>
          <h1 className="mb-[clamp(7vh,11vh,15vh)] max-w-[85vw] font-display text-[clamp(3rem,7vw,7rem)] leading-[1.05] font-extrabold tracking-[-0.04em] text-ink uppercase">
            {title}
          </h1>
        </div>

        {path ? (
          <div
            ref={frameRef}
            style={{ width: "40vw", height: "60vh", top: "75%", borderRadius: 24 }}
            className="absolute left-1/2 z-3 -translate-x-1/2 overflow-hidden shadow-[0_30px_60px_var(--theme-shadow)] max-md:!w-[88vw]"
          >
            <div ref={imageRef} className="size-full scale-[1.15]">
              <Image
                src={cloudinary(path, { width: 1400 })}
                alt={alt}
                fill
                priority
                sizes="100vw"
                className="size-full object-cover"
              />
            </div>
          </div>
        ) : null}

        <div
          ref={cueRef}
          aria-hidden="true"
          className="absolute bottom-12 left-1/2 z-2 flex -translate-x-1/2 flex-col items-center gap-[0.6rem]"
        >
          <span className="text-[0.75rem] font-semibold tracking-[0.1em] text-accent uppercase">
            {scrollLabel}
          </span>
          <span className="block h-12 w-px bg-accent/40" />
        </div>
      </div>
    </section>
  );
}
