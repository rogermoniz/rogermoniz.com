import Image from "next/image";
import { cloudinary } from "@/lib/cloudinary";
import type { ContentBlock } from "@/lib/content/types";

type FigureBlock = Extract<ContentBlock, { type: "figure" }>;

/**
 * A picture in an article. The variant decides its proportions and whether the
 * caption lies over the photograph or sits beneath it, so a new kind of figure
 * is a row in these tables rather than another component.
 */
const SHAPE: Record<string, { aspect: string; radius: string; width: number; sizes: string }> = {
  "or-card": {
    aspect: "aspect-4/5",
    radius: "rounded-2xl",
    width: 800,
    sizes: "(max-width: 768px) 100vw, 380px",
  },
  "or-step": {
    aspect: "aspect-3/4",
    radius: "rounded-[14px]",
    width: 600,
    sizes: "(max-width: 768px) 100vw, 250px",
  },
  "or-banner": {
    aspect: "aspect-video",
    radius: "rounded-[18px]",
    width: 1200,
    sizes: "(max-width: 768px) 100vw, 760px",
  },
};

/** Captions that lie over the photograph, in white on the shade. */
const OVERLAY: Record<string, string> = {
  "or-card":
    "px-[1.2rem] pt-[2.6rem] pb-[1.1rem] text-left text-[0.945rem] leading-[1.25] font-bold tracking-[0.4px] uppercase",
  "or-step":
    "px-[0.9rem] pt-[2.4rem] pb-[0.95rem] text-left text-[clamp(0.74rem,0.9vw,0.86rem)] leading-[1.3] font-semibold",
  "or-banner":
    "px-6 pt-[clamp(2.5rem,6vw,4rem)] pb-[clamp(1.2rem,3vw,2rem)] text-center text-[clamp(1.1rem,2vw,1.6rem)] leading-tight font-extrabold uppercase tracking-[0.5px]",
};

function Caption({ block }: { block: FigureBlock }) {
  return (
    <>
      {block.captionKicker ? (
        <span className="mb-2 block text-[0.5em] font-semibold tracking-[4px] text-[#ffd9e1]">
          {block.captionKicker}
        </span>
      ) : null}
      {block.caption}
      {block.captionSub ? (
        <span className="mt-[0.35rem] block text-[0.62em] font-semibold tracking-[1px] opacity-92">
          {block.captionSub}
        </span>
      ) : null}
    </>
  );
}

export function Figure({
  block,
  className = "",
  context,
}: {
  block: FigureBlock;
  className?: string;
  /** Where the picture sits, when that changes its proportions. */
  context?: "duo";
}) {
  if (!block.path) return null;

  const variant = block.variant ?? "";
  const base = SHAPE[variant];
  // A banner in a stacked pair is a tall portrait, not a wide strip.
  const shape =
    base && variant === "or-banner" && context === "duo"
      ? { ...base, aspect: "aspect-[2/3]", width: 900 }
      : base;
  const overlay = OVERLAY[variant];

  // A plain figure keeps its own height and puts the caption underneath.
  if (!shape || !overlay) {
    return (
      <figure
        className={`group relative m-0 mb-[clamp(1.6rem,3vw,2.4rem)] overflow-hidden rounded-2xl bg-figure-tint last:mb-0 ${className}`}
      >
        <Image
          src={cloudinary(block.path, { width: 1000 })}
          alt={block.alt}
          width={1000}
          height={1250}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 720px"
          className="aspect-4/5 w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
        />
        {block.caption ? (
          <figcaption className="px-4 py-4 text-[0.9rem] leading-snug text-muted">
            <Caption block={block} />
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure
      className={`group relative m-0 overflow-hidden bg-figure-tint ${shape.radius} ${shape.aspect} ${
        variant === "or-step" ? "shadow-[0_10px_30px_-18px_rgb(40_15_22/0.55)]" : ""
      } ${className}`}
    >
      {block.num ? (
        <span className="absolute top-[0.8rem] left-[0.8rem] z-3 inline-flex size-8 items-center justify-center rounded-full bg-[rgb(40_20_26/0.72)] font-display text-[0.86rem] font-extrabold text-white">
          {block.num}
        </span>
      ) : null}

      <Image
        src={cloudinary(block.path, { width: shape.width })}
        alt={block.alt}
        fill
        loading="lazy"
        sizes={shape.sizes}
        className="size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
      />

      {block.caption ? (
        <figcaption
          className={`absolute inset-x-0 bottom-0 z-2 bg-[image:var(--figure-shade)] font-display text-white ${overlay}`}
        >
          <Caption block={block} />
        </figcaption>
      ) : null}
    </figure>
  );
}
