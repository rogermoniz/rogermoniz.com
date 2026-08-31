import { Reveal } from "@/components/effects/Reveal";
import { RichText } from "@/components/primitives/RichText";
import { Figure } from "@/components/sections/editorial/Figure";
import { FigureGroup, figureColumns } from "@/components/sections/editorial/FigureGroup";
import type { ContentBlock, ContentSection } from "@/lib/content/types";

const PROSE = "mb-[1.6rem] text-[clamp(1.08rem,1.3vw,1.2rem)] leading-[1.85] text-ink";

/**
 * The air around a picture, whether it stands alone or in a grid of four.
 *
 * The two used to carry different rules and only half of one each: a lone
 * picture pushed the text below it away but nothing above, a grid did the
 * opposite, so a paragraph following a grid sat flat against the photographs.
 * Both now say the same thing, which is why it is said once. Margins collapse,
 * so a heading or a quote with more air of its own still wins.
 */
const MEDIA = "mt-[clamp(1.6rem,3vw,2.4rem)] mb-[clamp(1.6rem,3vw,2.4rem)] last:mb-0";


function Block({ block, context }: { block: ContentBlock; context?: "duo" }) {
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
          className={`mt-[clamp(2.5rem,4vw,3.5rem)] mb-5 font-display text-[clamp(1.7rem,2.6vw,2.3rem)] leading-[1.12] font-bold tracking-[-0.02em] text-ink ${centred ? "text-center" : ""}`}
        >
          {block.text}
        </Reveal>
      );
    }
    case "paragraph": {
      const lead = block.variant === "or-duo-lead";
      const strong = block.variant?.includes("note-strong");
      return (
        <Reveal
          as="p"
          className={
            lead
              ? "mt-[1.2rem] mb-0 text-[clamp(1.08rem,1.3vw,1.2rem)] leading-[1.6] text-ink"
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
      // The spacing sits on the wrapper, where `last` can see the blocks either
      // side of it: on the figure itself it only ever saw its own wrapper.
      return (
        <Reveal className={MEDIA}>
          <Figure block={block} context={context} />
        </Reveal>
      );
    case "figureGroup": {
      // Only the slots that hold a photograph exist as far as the page is
      // concerned. A layout chosen in the editor arrives as empty slots waiting
      // to be filled, and until they are they must take up no room at all: an
      // empty grid would otherwise open a gap in a published article.
      const pictures = block.figures.filter((f) => f.type === "figure" && f.path);
      if (!pictures.length) return null;

      const cols = figureColumns(block.variant, block.columns);
      // A layout chosen in the editor is rendered literally, so the page and the
      // picker never disagree. The older grids, whose shape comes from a variant
      // rather than from a choice, keep the flourish they were built with: a
      // last picture alone on its row spreads across it.
      const spreadsOrphan = block.columns === undefined;
      return (
        <FigureGroup variant={block.variant} columns={block.columns} className={MEDIA}>
          {pictures.map((figure, index) => {
            const orphan =
              spreadsOrphan && pictures.length % cols === 1 && index === pictures.length - 1;
            return (
              <Figure
                key={index}
                block={figure as Extract<ContentBlock, { type: "figure" }>}
                className={orphan ? "col-span-full !aspect-[16/10]" : ""}
              />
            );
          })}
        </FigureGroup>
      );
    }
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
        <div className="flex flex-col gap-[clamp(2.4rem,4.5vw,3.5rem)]">
          {block.columns.map((column, index) => (
            <div key={column.id ?? index} id={column.id ?? undefined}>
              {column.blocks.map((child, i) => (
                <Block key={i} block={child} context="duo" />
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
