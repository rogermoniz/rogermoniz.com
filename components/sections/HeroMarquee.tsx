"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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

/** Layout effects do not run on the server, and asking for one there warns. */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function HeroMarquee({ hero }: { hero: HomePage["hero"] }) {
  const aspect = hero.imageAspect;
  const pinRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
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
    // Measured on resize rather than on every frame: reading layout inside the
    // scroll handler forces the browser to lay the page out again before it can
    // answer, once per frame, for numbers that only change when the window does.
    let pinTop = 0;
    let pinHeight = 0;
    let viewportWidth = 0;
    let viewportHeight = 0;
    // Toggled rather than left on, because a promoted layer costs GPU memory
    // for as long as it is declared. Written only when it changes.
    let promoted = false;
    let interactive = true;

    const measure = () => {
      pinTop = pin.getBoundingClientRect().top + window.scrollY;
      pinHeight = pin.offsetHeight;
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
    };

    // Hovering an image runs an 800ms transition of its greyscale filter and a
    // 60px shadow. While the hero is flying away the columns sweep past a
    // stationary cursor, firing that on image after image underneath a move
    // that is already the heaviest thing on the page. Nothing is meant to be
    // hovered mid flight, so nothing is.
    const setInteractive = (on: boolean) => {
      if (on === interactive) return;
      interactive = on;
      const row = rowRef.current;
      if (row) row.style.pointerEvents = on ? "" : "none";
    };

    const promote = (on: boolean) => {
      if (on === promoted) return;
      promoted = on;
      const value = on ? "transform, opacity" : "";
      for (const node of columnRefs.current) if (node) node.style.willChange = value;
      const overlay = overlayRef.current;
      if (overlay) overlay.style.willChange = value;
    };

    const render = () => {
      frame = null;
      const isDesktop = viewportWidth >= 769;
      const travelled = window.scrollY - pinTop;
      let progress: number;
      if (isDesktop) {
        const distance = pinHeight - viewportHeight;
        progress = distance > 0 ? clamp(travelled / distance, 0, 1) : 0;
      } else {
        progress = clamp(travelled / viewportHeight, 0, 1);
      }

      // Every column and the title are re-rastered as they scale, and the
      // images carry a greyscale filter, so the work is real. Holding them on
      // the compositor for the length of the move is what keeps it smooth;
      // outside it there is nothing to hold.
      promote(progress > 0 && progress < 1);
      setInteractive(progress === 0);

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

    const remeasure = () => {
      measure();
      schedule();
    };

    measure();
    render();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });
    // The pin grows when a font swaps or an image settles, and the scroll
    // distance is derived from its height.
    const observer = new ResizeObserver(remeasure);
    observer.observe(pin);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      observer.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
      promote(false);
      setInteractive(true);
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

        <div
          ref={rowRef}
          className="flex h-[150%] w-[150vw] flex-none rotate-[-4deg] scale-110 gap-[1.5vw] [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)] max-lg:h-[180%] max-lg:w-[200vw] max-md:w-[150vw]"
        >
          {hero.columns.map((column, index) => (
            <div
              key={column.speed}
              ref={(node) => {
                columnRefs.current[index] = node;
              }}
              className="flex min-w-0 flex-1 flex-col [backface-visibility:hidden] [transform:translateZ(0)]"
            >
              <MarqueeStrip column={column} lead={index === 0} aspect={aspect} />
            </div>
          ))}
        </div>

        <ScrollCue />
      </section>
    </div>
  );
}

/**
 * One scrolling column.
 *
 * The strip holds every image twice so translateY(-50%) loops seamlessly, and
 * repeats further when one loop would be shorter than the column it has to
 * fill, otherwise the seam opens a gap and the column runs empty.
 */
function MarqueeStrip({
  column,
  lead,
  aspect,
}: {
  column: HomePage["hero"]["columns"][number];
  lead: boolean;
  aspect: string;
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [repeat, setRepeat] = useState(1);

  // Measured before the browser paints, so the strip is never briefly too
  // short: growing it afterwards would restart the animation and read as a
  // jump. The column is watched rather than the window because it is what the
  // strip actually has to cover, and a phone rotating changes it.
  useIsomorphicLayoutEffect(() => {
    const strip = stripRef.current;
    const column = strip?.parentElement;
    if (!strip || !column) return;

    const measure = () => {
      const loop = strip.scrollHeight / (2 * repeat);
      if (loop <= 0) return;
      // A tenth over the column height covers the parent's rotation.
      const next = Math.max(1, Math.ceil((column.clientHeight * 1.1) / loop));
      if (next !== repeat) setRepeat(next);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(column);
    return () => observer.disconnect();
  }, [repeat]);

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
          // Every column is on screen from the first frame, so nothing here is
          // deferred: lazy loading filled the hero in over several seconds and
          // left whole columns blank. Only the first of each column is
          // preloaded; the repeats reuse the same handful of URLs, so they cost
          // no extra requests.
          priority={lead && index === 0}
          loading={lead && index === 0 ? undefined : "eager"}
          sizes={COLUMN_SIZES}
          style={{ "--pos": image.focal, "--pos-m": image.focalMobile, aspectRatio: aspect } as React.CSSProperties}
          // `scale` is its own CSS property, not part of `transform`, so a
          // transition that names only `transform` leaves the hover scale to
          // snap while the colour and the shadow ease in around it.
          className="mb-[1.5vw] block h-auto w-full rounded-xl object-cover opacity-50 grayscale transition-[scale,opacity,filter,box-shadow] duration-800 ease-out-expo hover:z-10 hover:scale-[1.02] hover:opacity-100 hover:grayscale-0 hover:shadow-[0_30px_60px_var(--theme-shadow)] max-md:hover:scale-100"
        />
      ))}
    </div>
  );
}

/**
 * The row is 150vw wide (200vw on tablet) and splits into four columns, so a
 * column is roughly 37vw of the viewport, not the 25vw a four column grid
 * would suggest. Asking for the smaller number served a blurry image.
 */
const COLUMN_SIZES = "(max-width: 767px) 37vw, (max-width: 1023px) 49vw, 37vw";

const BASE_DURATION = {
  up: 36,
  down: 45,
  "up-slow": 54,
  "down-slow": 48,
} as const;
