"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/effects/Reveal";
import { ArrowRightIcon } from "@/components/primitives/icons";
import { DisplayHeading, Eyebrow, HeadingSub } from "@/components/primitives/Typography";
import { cloudinary } from "@/lib/cloudinary";
import type { HomePage } from "@/lib/content/types";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/** Each slide takes 1.5 units to open and 2 units to finish. */
const SLIDE_STEP = 1.5;
const SLIDE_SPAN = 2;

/**
 * The aperture reveal. Slides open as circular clip paths driven by scroll
 * position through a tall pinned section, so each prestation irises in over
 * the one before it.
 */
export function ApertureGallery({ prestations }: { prestations: HomePage["prestations"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  // What was last written to each node, so an unchanged frame writes nothing.
  const lastRef = useRef<{ clip: string; bg: string; shift: string; fade: string; hidden: boolean }[]>([]);
  const [armed, setArmed] = useState(false);

  // Eight full screen photographs cannot wait for the aperture that reveals
  // them: left to lazy loading they only start once the slide is already on
  // screen, and the first ones irised open onto nothing. They are fetched when
  // the section is a viewport and a half away, and never before the reader has
  // scrolled at all, so a visitor who reads the top of the page and leaves is
  // not charged for them.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || armed) return;

    let near = false;
    let moved = window.scrollY > 0;

    const arm = () => {
      if (near && moved) setArmed(true);
    };
    const onScroll = () => {
      moved = true;
      arm();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          near = true;
          arm();
        }
      },
      { rootMargin: "150% 0px" },
    );
    observer.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [armed]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame: number | null = null;

    const render = () => {
      frame = null;
      // Read, then write, and never the other way round: the browser lays the
      // page out once for this and the writes below cost nothing extra. Caching
      // the section's offset instead would be a frame faster and wrong, because
      // anything above it changing height moves it.
      const rect = section.getBoundingClientRect();
      const distance = section.offsetHeight - window.innerHeight;
      const progress = distance > 0 ? clamp(-rect.top / distance, 0, 1) : 0;
      const count = slideRefs.current.length;
      const total = (count - 1) * SLIDE_STEP + SLIDE_SPAN;
      const travelled = progress * total;

      const opens = slideRefs.current.map((_, index) =>
        clamp((travelled - index * SLIDE_STEP) / SLIDE_SPAN, 0, 1),
      );
      // The highest slide that has finished opening covers the screen edge to
      // edge, so every slide stacked under it is painting a full screen
      // photograph nobody can see. Derived from the opened amounts rather than
      // from the formula, so it cannot drift out of step with them.
      let topFull = -1;
      for (const [index, open] of opens.entries()) if (open >= 1) topFull = index;

      slideRefs.current.forEach((slide, index) => {
        if (!slide) return;
        const open = opens[index] ?? 0;
        const shown = clamp((travelled - (index * SLIDE_STEP + 0.5)) / 1, 0, 1);

        const clip = `circle(${(150 * open).toFixed(2)}% at 50% 50%)`;
        const bgScale = `scale(${(1.3 - 0.3 * open).toFixed(3)})`;
        const shift = `translateY(${(80 * (1 - shown)).toFixed(1)}px)`;
        const fade = shown.toFixed(3);

        // Seven of the eight slides hold still on any given frame. Writing the
        // value they already carry still costs a style recalculation each, so
        // the ones that are not moving are left alone.
        const last = (lastRef.current[index] ??= { clip: "", bg: "", shift: "", fade: "", hidden: false });
        // Nothing that has not started opening is drawn, and nothing sitting
        // under a slide that is already covering the screen.
        const hidden = index < topFull || open === 0;
        if (last.hidden !== hidden) {
          slide.style.visibility = hidden ? "hidden" : "";
          last.hidden = hidden;
        }
        if (hidden) return;

        if (last.clip !== clip) {
          slide.style.clipPath = clip;
          last.clip = clip;
        }

        const bg = bgRefs.current[index];
        if (bg && last.bg !== bgScale) {
          bg.style.transform = bgScale;
          last.bg = bgScale;
        }

        const content = contentRefs.current[index];
        if (content && (last.shift !== shift || last.fade !== fade)) {
          content.style.transform = shift;
          content.style.opacity = fade;
          last.shift = shift;
          last.fade = fade;
        }
      });
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
    <section
      ref={sectionRef}
      id="prestations"
      className="relative h-[1150vh] bg-surface max-md:h-[870vh]"
    >
      {/* `dvh`, not `svh`: on a phone the address bar retracts as you scroll,
          the viewport grows by its height, and a panel measured against the
          smaller figure leaves a band of page showing underneath it. */}
      <div className="sticky top-0 h-dvh w-screen overflow-hidden">
        <div className="absolute inset-0 z-1 flex flex-col items-center justify-center text-center">
          <Reveal>
            <Eyebrow>{prestations.heading.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal>
            <DisplayHeading>{prestations.heading.title}</DisplayHeading>
          </Reveal>
          <Reveal>
            <HeadingSub>{prestations.heading.subtitle}</HeadingSub>
          </Reveal>
        </div>

        {prestations.slides.map((slide, index) => (
          <div
            key={slide.href}
            ref={(node) => {
              slideRefs.current[index] = node;
            }}
            style={{ zIndex: index + 2, clipPath: "circle(0% at 50% 50%)" }}
            className="absolute top-0 left-0 h-dvh w-screen"
          >
            <div
              ref={(node) => {
                bgRefs.current[index] = node;
              }}
              className="absolute inset-0 scale-[1.3]"
            >
              <Image
                src={cloudinary(slide.image.path, { width: 1400 })}
                alt={slide.image.alt}
                fill
                sizes="100vw"
                loading={armed ? "eager" : "lazy"}
                className="size-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.9)_0%,rgb(0_0_0/0.2)_60%,rgb(0_0_0/0.4)_100%)]" />
            <div
              ref={(node) => {
                contentRefs.current[index] = node;
              }}
              style={{ opacity: 0, transform: "translateY(80px)" }}
              className="relative z-10 flex size-full flex-col justify-end px-[var(--padding-x)] py-[10vh] text-white"
            >
              <span className="mb-4 font-body text-[clamp(1rem,2vw,1.5rem)] text-accent">
                {slide.index}
              </span>
              <h3 className="mt-0 mb-6 font-display text-[clamp(1.75rem,10vw,2.5rem)] leading-none font-bold tracking-[-0.04em] uppercase [text-shadow:0_10px_30px_rgb(0_0_0/0.5)] md:text-[clamp(3rem,7vw,7rem)]">
                {slide.title}
              </h3>
              <p className="mb-12 max-w-[50ch] text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed text-white/80">
                {slide.description}
              </p>
              <Link
                href={slide.href}
                className="group inline-flex items-center gap-2 font-display text-sm font-bold tracking-[0.05em] text-white uppercase transition-[gap,color] duration-400 ease-out-expo hover:gap-6 hover:text-accent"
              >
                {slide.ctaLabel}
                <ArrowRightIcon className="size-5" />
              </Link>
            </div>
          </div>
        ))}

        {/* The photograph dissolves into the page across the top, the way the
            hero's marquee already does. On a phone the browser draws its own
            bar hard against the top of the viewport, and a full bleed picture
            meeting it edge to edge reads as a white block sitting on the
            image; against a fade it reads as the page continuing underneath.
            Only below the tablet breakpoint, where that bar overlaps content. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-20 hidden h-[16vh] bg-[linear-gradient(to_bottom,var(--color-surface)_0%,var(--surface-fade)_100%)] max-nav:block"
        />
      </div>
    </section>
  );
}
