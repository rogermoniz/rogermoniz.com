"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame: number | null = null;

    const render = () => {
      frame = null;
      const rect = section.getBoundingClientRect();
      const distance = section.offsetHeight - window.innerHeight;
      const progress = distance > 0 ? clamp(-rect.top / distance, 0, 1) : 0;
      const count = slideRefs.current.length;
      const total = (count - 1) * SLIDE_STEP + SLIDE_SPAN;
      const travelled = progress * total;

      slideRefs.current.forEach((slide, index) => {
        if (!slide) return;
        const open = clamp((travelled - index * SLIDE_STEP) / SLIDE_SPAN, 0, 1);
        slide.style.clipPath = `circle(${(150 * open).toFixed(2)}% at 50% 50%)`;

        const bg = bgRefs.current[index];
        if (bg) bg.style.transform = `scale(${(1.3 - 0.3 * open).toFixed(3)})`;

        const content = contentRefs.current[index];
        if (content) {
          const shown = clamp((travelled - (index * SLIDE_STEP + 0.5)) / 1, 0, 1);
          content.style.transform = `translateY(${(80 * (1 - shown)).toFixed(1)}px)`;
          content.style.opacity = shown.toFixed(3);
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
      <div className="sticky top-0 h-svh w-screen overflow-hidden">
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
            className="absolute top-0 left-0 h-svh w-screen"
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
      </div>
    </section>
  );
}
