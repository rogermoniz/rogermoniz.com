"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollCue } from "@/components/effects/ScrollCue";
import { Eyebrow, HeadingSub } from "@/components/primitives/Typography";
import { cloudinary } from "@/lib/cloudinary";
import type { HomePage } from "@/lib/content/types";

/** Column animation, keyed by the speed the data asks for. */
const COLUMN_ANIMATION = {
  up: "animate-scroll-up",
  down: "animate-scroll-down",
  "up-slow": "animate-scroll-up-slow",
  "down-slow": "animate-scroll-down-slow",
} as const;

/** Per column parallax as the hero scrolls away, desktop then mobile. */
const DESKTOP_PARALLAX = [
  { x: -150, y: -50, r: -25, s: 1.5 },
  { x: -50, y: 100, r: 15, s: 1.5 },
  { x: 50, y: -100, r: -15, s: 1.5 },
  { x: 150, y: 50, r: 25, s: 1.5 },
] as const;

const MOBILE_PARALLAX = [
  { x: -120, y: -40, r: -20, s: 1.4 },
  { x: 120, y: 40, r: 20, s: 1.4 },
  { x: -120, y: -40, r: -20, s: 1.4 },
  { x: 120, y: 40, r: 20, s: 1.4 },
] as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function HeroMarquee({ hero }: { hero: HomePage["hero"] }) {
  const aspect = hero.imageAspect;
  const pinRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [entered, setEntered] = useState(false);

  // The hero enters once the page has settled, matching the original's
  // load-or-750ms whichever comes first.
  useEffect(() => {
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setEntered(true);
    };
    window.addEventListener("load", reveal);
    const timer = window.setTimeout(reveal, 750);
    return () => {
      window.removeEventListener("load", reveal);
      window.clearTimeout(timer);
    };
  }, []);

  // Scroll scrubbed parallax. Transforms are written straight to the nodes
  // inside one rAF, so scrolling never triggers a React render.
  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    let frame: number | null = null;

    const render = () => {
      frame = null;
      const isDesktop = window.innerWidth >= 769;
      const rect = pin.getBoundingClientRect();
      let progress: number;
      if (isDesktop) {
        const distance = pin.offsetHeight - window.innerHeight;
        progress = distance > 0 ? clamp(-rect.top / distance, 0, 1) : 0;
      } else {
        progress = clamp(-rect.top / window.innerHeight, 0, 1);
      }

      const table = isDesktop ? DESKTOP_PARALLAX : MOBILE_PARALLAX;
      columnRefs.current.forEach((node, index) => {
        if (!node) return;
        const step = table[index] ?? table[0];
        node.style.transform = `translate(${step.x * progress}%, ${step.y * progress}%) rotate(${step.r * progress}deg) scale(${1 + (step.s - 1) * progress})`;
        node.style.opacity = (1 - progress).toFixed(3);
      });

      const overlay = overlayRef.current;
      if (overlay) {
        const scale = isDesktop ? 0.5 : 0.3;
        overlay.style.transform = `translate(-50%, -50%) scale(${1 + scale * progress})`;
        overlay.style.opacity = (1 - progress).toFixed(3);
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

  const entranceTransition = "transform .8s cubic-bezier(.16,1,.3,1)";

  return (
    <div ref={pinRef} className="relative nav:h-[calc(100vh_+_1100px)]">
      <section className="relative flex h-svh w-full items-center justify-center overflow-hidden bg-surface nav:sticky nav:top-0 nav:h-screen">
        <div
          ref={overlayRef}
          // Centring lives in `transform` (not Tailwind's `translate` utilities) so
          // the scroll parallax can rewrite the whole value without stacking on
          // top of a second translation.
          style={{ transform: "translate(-50%, -50%)" }}
          className="pointer-events-none absolute top-1/2 left-1/2 z-20 w-full px-[var(--padding-x)] text-center text-white mix-blend-difference [backface-visibility:hidden]"
        >
          <div
            style={{
              transform: entered ? "none" : "translateY(22px)",
              transition: entranceTransition,
              transitionDelay: ".05s",
            }}
          >
            <Eyebrow plain>{hero.eyebrow}</Eyebrow>
          </div>
          <h1
            className="m-0 font-display text-[clamp(2.75rem,9vw,7.5rem)] leading-[0.95] font-bold tracking-[-0.04em] text-white uppercase"
            style={{
              transform: entered ? "none" : "translateY(22px)",
              transition: entranceTransition,
              transitionDelay: ".15s",
            }}
          >
            {hero.title}
          </h1>
          {hero.subtitle ? (
            <div
              style={{
                transform: entered ? "none" : "translateY(22px)",
                transition: entranceTransition,
                transitionDelay: ".25s",
              }}
            >
              <HeadingSub className="!text-hero-gold">{hero.subtitle}</HeadingSub>
            </div>
          ) : null}
        </div>

        <div className="flex h-[150%] w-[150vw] flex-none rotate-[-4deg] scale-110 gap-[1.5vw] [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)] max-lg:h-[180%] max-lg:w-[200vw] max-md:w-[150vw]">
          {hero.columns.map((column, index) => (
            <div
              key={column.speed}
              ref={(node) => {
                columnRefs.current[index] = node;
              }}
              className="flex min-w-0 flex-1 flex-col [backface-visibility:hidden] [transform:translateZ(0)]"
            >
              <MarqueeStrip column={column} priority={index === 0} aspect={aspect} />
            </div>
          ))}
        </div>

        <ScrollCue />
      </section>
    </div>
  );
}

/**
 * One scrolling column. The strip holds the images twice so translateY(-50%)
 * loops seamlessly, and repeats further when a single loop would be shorter
 * than the viewport — otherwise a gap appears at the seam on tall screens.
 */
function MarqueeStrip({
  column,
  priority,
  aspect,
}: {
  column: HomePage["hero"]["columns"][number];
  priority: boolean;
  aspect: string;
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [repeat, setRepeat] = useState(1);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const unit = strip.scrollHeight / 2;
    if (unit <= 0) return;
    const needed = window.innerHeight * 1.1;
    if (unit >= needed) return;
    setRepeat(Math.ceil(needed / unit));
  }, []);

  const images = useMemo(() => {
    const doubled = [...column.images, ...column.images];
    return Array.from({ length: repeat }, () => doubled).flat();
  }, [column.images, repeat]);

  return (
    <div
      ref={stripRef}
      className={`block ${COLUMN_ANIMATION[column.speed]} [backface-visibility:hidden] [transform:translateZ(0)]`}
      // Repeating the strip lengthens the loop, so the duration scales with it
      // to keep the scroll speed identical.
      style={repeat > 1 ? { animationDuration: `${BASE_DURATION[column.speed] * repeat}s` } : undefined}
    >
      {images.map((image, index) => (
        <Image
          key={`${image.path}-${index}`}
          src={cloudinary(image.path, { width: 500, quality: "auto:eco" })}
          alt={image.alt}
          width={500}
          height={667}
          priority={priority && index < 2}
          loading={priority && index < 2 ? undefined : "lazy"}
          sizes="(max-width: 768px) 50vw, 25vw"
          style={{ "--pos": image.focal, "--pos-m": image.focalMobile, aspectRatio: aspect } as React.CSSProperties}
          className="mb-[1.5vw] block h-auto w-full rounded-xl object-cover opacity-50 grayscale transition-all duration-800 ease-out-expo hover:z-10 hover:scale-[1.02] hover:opacity-100 hover:grayscale-0 hover:shadow-[0_30px_60px_var(--theme-shadow)] max-md:hover:scale-100"
        />
      ))}
    </div>
  );
}

const BASE_DURATION = {
  up: 36,
  down: 45,
  "up-slow": 54,
  "down-slow": 48,
} as const;
