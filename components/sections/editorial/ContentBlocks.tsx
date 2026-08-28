import Image from "next/image";
import { Reveal } from "@/components/effects/Reveal";
import { RichText } from "@/components/primitives/RichText";
import { FigureGroup } from "@/components/sections/editorial/FigureGroup";
import { cloudinary } from "@/lib/cloudinary";
import type { ContentBlock, ContentSection } from "@/lib/content/types";

const PROSE = "mb-[1.6rem] text-[clamp(1.08rem,1.3vw,1.2rem)] leading-[1.85] text-ink";

function Figure({ block }: { block: Extract<ContentBlock, { type: "figure" }> }) {
  if (!block.path) return null;
  const isStep = block.variant === "or-step";
  const isCard = block.variant === "or-card";
  const isBanner = block.variant === "or-banner";

  return (
    <figure
      className={`group relative m-0 overflow-hidden rounded-2xl bg-surface ${
        isBanner ? "" : "mb-[clamp(1.6rem,3vw,2.4rem)] last:mb-0"
      }`}
    >
      {block.num ? (
        <span className="absolute top-3 left-3 z-2 flex size-8 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-white">
          {block.num}
        </span>
      ) : null}
      <Image
        src={cloudinary(block.path, { width: isStep ? 600 : isCard ? 800 : 1000 })}
        alt={block.alt}
        width={1000}
        height={isBanner ? 560 : 1250}
        loading="lazy"
        sizes="(max-width: 768px) 100vw, 700px"
        className={`w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04] ${isBanner ? "aspect-video" : "aspect-4/5"}`}
      />
      {block.caption ? (
        <figcaption
          className={`px-4 py-4 text-[0.9rem] leading-snug ${
            isBanner ? "text-center font-display text-ink uppercase" : "text-muted"
          }`}
        >
          {block.caption}
          {block.captionSub ? (
            <span className="mt-1 block text-[0.75rem] tracking-[1px] text-accent uppercase">
              {block.captionSub}
            </span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "heading": {
      const centred = block.variant?.includes("or-center");
      return block.level === 3 ? (
        <Reveal
          variant="text"
          as="h3"
          className="mt-10 mb-4 font-display text-[clamp(1.35rem,1.9vw,1.7rem)] font-bold tracking-[-0.01em] text-ink"
        >
          {block.text}
        </Reveal>
      ) : (
        <Reveal
          variant="text"
          as="h2"
          className={`mt-[clamp(2.5rem,4vw,3.5rem)] mb-5 font-display text-[clamp(1.7rem,2.6vw,2.3rem)] leading-[1.12] font-bold tracking-[-0.02em] text-ink first:mt-0 ${centred ? "text-center" : ""}`}
        >
          {block.text}
        </Reveal>
      );
    }
    case "paragraph": {
      const lead = block.variant?.includes("lead");
      const strong = block.variant?.includes("note-strong");
      return (
        <Reveal
          as="p"
          className={
            lead
              ? "mb-8 text-[clamp(1.05rem,1.4vw,1.25rem)] leading-[1.75] text-muted"
              : strong
                ? "mb-0 font-medium text-ink"
                : PROSE
          }
        >
          <RichText spans={block.spans} />
        </Reveal>
      );
    }
    case "list":
      return (
        <Reveal as={block.ordered ? "ol" : "ul"} className="mb-8 space-y-3">
          {block.items.map((item, index) => (
            <li
              key={index}
              className="relative pl-6 text-[clamp(1.08rem,1.3vw,1.2rem)] leading-[1.85] text-ink before:absolute before:top-[0.7em] before:left-0 before:size-1.5 before:rounded-full before:bg-accent"
            >
              <RichText spans={item} />
            </li>
          ))}
        </Reveal>
      );
    case "quote":
      return (
        <Reveal
          as="blockquote"
          className="my-12 border-l-2 border-accent pl-8 font-display text-[clamp(1.3rem,2.4vw,1.9rem)] leading-snug text-ink italic"
        >
          <RichText spans={block.spans} />
        </Reveal>
      );
    case "figure":
      return (
        <Reveal>
          <Figure block={block} />
        </Reveal>
      );
    case "figureGroup":
      return (
        <FigureGroup variant={block.variant} columns={block.columns}>
          {block.figures.map((figure, index) =>
            figure.type === "figure" ? <Figure key={index} block={figure} /> : null,
          )}
        </FigureGroup>
      );
    case "note":
      return (
        <Reveal className="my-10 rounded-2xl border border-edge bg-surface-card p-8">
          {block.blocks.map((child, index) => (
            <Block key={index} block={child} />
          ))}
        </Reveal>
      );
    case "group":
      return (
        <>
          {block.blocks.map((child, index) => (
            <Block key={index} block={child} />
          ))}
        </>
      );
    case "duo":
      return (
        <div className="my-10 grid grid-cols-2 gap-8 max-md:grid-cols-1">
          {block.columns.map((column, index) => (
            <div key={column.id ?? index} id={column.id ?? undefined}>
              {column.blocks.map((child, i) => (
                <Block key={i} block={child} />
              ))}
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export function ContentBlocks({ sections }: { sections: readonly ContentSection[] }) {
  return (
    <>
      {sections.map((section, index) => (
        <section
          key={section.id ?? index}
          id={section.id ?? undefined}
          className="mb-[clamp(2.5rem,4vw,3.5rem)] scroll-mt-[90px] last:mb-0"
        >
          {section.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </section>
      ))}
    </>
  );
}
