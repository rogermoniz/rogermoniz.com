"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox } from "@/components/effects/Lightbox";
import { Reveal } from "@/components/effects/Reveal";
import {
  Container,
  Eyebrow,
  HeadingSub,
  SectionHeading2,
} from "@/components/primitives/Typography";
import { cloudinary } from "@/lib/cloudinary";
import type { BentoSpan, PortfolioBlock } from "@/lib/content/types";

/** Tile footprint in the mosaic. */
const SPAN: Record<BentoSpan, string> = {
  "span-1x1": "col-span-1 row-span-1",
  "span-1x2": "col-span-1 row-span-2",
  "span-2x1": "col-span-2 row-span-1",
  "span-2x2": "col-span-2 row-span-2",
};

/**
 * The grid is four columns, so a tile is a quarter of the row unless it spans
 * two. Telling the browser the wrong fraction is the difference between a
 * sharp photo and a soft one on the wide tiles.
 */
const SIZES: Record<BentoSpan, string> = {
  "span-1x1": "(max-width: 768px) 82vw, 25vw",
  "span-1x2": "(max-width: 768px) 82vw, 25vw",
  "span-2x1": "(max-width: 768px) 82vw, 50vw",
  "span-2x2": "(max-width: 768px) 82vw, 50vw",
};

/**
 * The gallery. On desktop the bento variant is a dense mosaic that dims its
 * unhovered tiles; below 768px it becomes a snap scrolling carousel, which is
 * the same markup with different layout rules.
 */
export function PortfolioSection({ portfolio }: { portfolio: PortfolioBlock }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [poster, setPoster] = useState<string | null>(null);
  const images = portfolio.items.map((item) => item.image);

  return (
    <section id="portfolio" className="relative z-10 bg-surface py-[var(--band)]">
      <Container>
        <Reveal>
          <Eyebrow>{portfolio.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal variant="text">
          <SectionHeading2 className="mb-12">
            {portfolio.title}
            {portfolio.subtitle ? <HeadingSub>{portfolio.subtitle}</HeadingSub> : null}
          </SectionHeading2>
        </Reveal>

        {portfolio.kind === "trio" ? (
          <Reveal className="grid grid-cols-3 gap-[clamp(8px,1vw,16px)] max-md:grid-cols-1">
            {portfolio.items.map((item, index) => (
              <figure key={item.image.path} className="m-0 overflow-hidden rounded-2xl">
                <button
                  type="button"
                  onClick={(event) => {
                  // Hand the viewer the file this thumbnail already decoded, so
                  // it opens on the photo rather than on a black screen.
                  const thumb = event.currentTarget.querySelector("img");
                  setPoster(thumb?.currentSrc || null);
                  setOpenIndex(index);
                }}
                  aria-label={`Agrandir la photo ${index + 1}`}
                  className="block size-full"
                >
                  <Image
                    src={cloudinary(item.image.path, { width: 900 })}
                    alt={item.image.alt}
                    width={900}
                    height={1125}
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="aspect-4/5 size-full object-cover transition-transform duration-800 ease-out-expo hover:scale-[1.04]"
                  />
                </button>
              </figure>
            ))}
          </Reveal>
        ) : (
          <Reveal
            className="group/grid grid w-full grid-flow-dense grid-cols-4 gap-6 [grid-auto-rows:350px] max-md:flex max-md:snap-x max-md:snap-mandatory max-md:gap-3.5 max-md:overflow-x-auto max-md:pb-2 max-md:[grid-auto-rows:auto] max-md:[scrollbar-width:none]"
            role="list"
          >
            {portfolio.items.map((item, index) => (
              <button
                key={`${item.image.path}-${index}`}
                type="button"
                role="listitem"
                onClick={(event) => {
                  // Hand the viewer the file this thumbnail already decoded, so
                  // it opens on the photo rather than on a black screen.
                  const thumb = event.currentTarget.querySelector("img");
                  setPoster(thumb?.currentSrc || null);
                  setOpenIndex(index);
                }}
                aria-label={`Agrandir la photo ${index + 1}`}
                className={`relative min-h-[120px] overflow-hidden rounded-3xl bg-surface transition-[box-shadow] duration-600 ease-out-expo hover:z-2 hover:shadow-[0_24px_60px_rgb(0_0_0/0.1)] max-md:aspect-3/4 max-md:min-h-0 max-md:w-[82%] max-md:shrink-0 max-md:snap-center dark:hover:shadow-[0_24px_60px_rgb(0_0_0/0.6)] ${
                  item.span ? SPAN[item.span] : ""
                } max-md:col-auto max-md:row-auto`}
              >
                <Image
                  src={cloudinary(item.image.path, { width: 1000 })}
                  alt={item.image.alt}
                  fill
                  loading="lazy"
                  sizes={item.span ? SIZES[item.span] : "(max-width: 768px) 82vw, 25vw"}
                  className="size-full scale-[1.02] object-cover transition-transform duration-800 ease-out-expo hover:scale-[1.08]"
                />
              </button>
            ))}
          </Reveal>
        )}
      </Container>

      <Lightbox
        images={images}
        openIndex={openIndex}
        poster={poster}
        onClose={() => setOpenIndex(null)}
      />
    </section>
  );
}
