import { Reveal } from "@/components/effects/Reveal";
import { BoxGrid } from "@/components/sections/prestation/BoxGrid";
import { BubbleButton } from "@/components/primitives/BubbleButton";
import {
  Container,
  Eyebrow,
  HeadingSub,
  SectionHeading2,
} from "@/components/primitives/Typography";
import type { PricingBlock } from "@/lib/content/types";

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4 shrink-0 stroke-accent opacity-80"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/**
 * Priced pages list their formulas as cards; bespoke pages (événementiel,
 * packshot) invite a quote instead. Same section, two shapes of data.
 */
/**
 * How many formulas share a row, and how tightly. Four cards run narrower and
 * closer together than three, which is what the original does rather than
 * letting one auto fit rule decide.
 */
const GRID: Record<1 | 2 | 3 | 4, string> = {
  1: "grid-cols-1 gap-12",
  2: "grid-cols-2 gap-12 max-md:grid-cols-1",
  3: "grid-cols-3 gap-12 max-lg:grid-cols-2 max-md:grid-cols-1",
  4: "grid-cols-4 gap-6 max-xl:grid-cols-2 max-md:grid-cols-1",
};

export function PricingSection({ pricing }: { pricing: PricingBlock }) {
  return (
    <section id="pricing" className="bg-surface py-[var(--band)]">
      <Container>
        <Reveal>
          <Eyebrow>{pricing.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal variant="text">
          <SectionHeading2>
            {pricing.title}
            {pricing.subtitle ? <HeadingSub>{pricing.subtitle}</HeadingSub> : null}
          </SectionHeading2>
        </Reveal>

        {pricing.kind === "quote" ? (
          <Reveal className="mx-auto mt-10 max-w-[70ch] text-center">
            {pricing.lead.map((line, index) => (
              <p
                key={index}
                className={`text-[clamp(1.05rem,1.4vw,1.25rem)] leading-relaxed ${
                  index === 0 ? "text-ink" : "mt-4 text-muted"
                }`}
              >
                {line}
              </p>
            ))}
            <div className="mt-12 flex justify-center">
              <BubbleButton href={pricing.ctaHref}>{pricing.ctaLabel}</BubbleButton>
            </div>
          </Reveal>
        ) : (
          <>
            {pricing.intro?.length ? (
              <Reveal>
                {pricing.intro.map((line, index) => (
                  <p
                    key={index}
                    className="mt-5 max-w-[680px] text-[0.95rem] leading-relaxed text-ink opacity-70"
                  >
                    {line}
                  </p>
                ))}
              </Reveal>
            ) : null}

            <div className={`mt-10 grid ${GRID[Math.min(pricing.cards.length, 4) as 1 | 2 | 3 | 4] ?? GRID[3]}`}>
            {pricing.cards.map((card) => (
              <Reveal
                key={card.title}
                className="tactile relative flex flex-col overflow-hidden rounded-[18px] px-10 py-14 hover:!shadow-[0_30px_60px_var(--theme-shadow)]"
              >
                {card.tag ? (
                  <div className="mb-6 flex items-center justify-between font-display text-[0.65rem] font-semibold tracking-[2px] text-accent uppercase">
                    <span>{card.tag}</span>
                    {card.badge ? <span>{card.badge}</span> : null}
                  </div>
                ) : null}

                <h3 className="mb-4 font-display text-[clamp(1.5rem,3.4vw,1.9rem)] leading-tight font-bold tracking-[-0.03em] text-ink uppercase">
                  {card.title}
                </h3>
                <p className="mb-10 min-h-[70px] text-[0.95rem] leading-relaxed text-muted">
                  {card.description}
                </p>
                <div className="mb-10 flex items-baseline gap-2 border-b border-edge pb-10 font-body text-[2.5rem] font-bold text-ink">
                  {card.price}
                </div>
                {card.boxGrid ? <BoxGrid grid={card.boxGrid} /> : null}

                <ul className="mb-12 grow">
                  {card.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 py-[0.8rem] text-[0.95rem] text-ink">
                      <CheckIcon />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <BubbleButton href={card.ctaHref} fullWidth>
                  {card.ctaLabel}
                </BubbleButton>
              </Reveal>
            ))}
            </div>

            {pricing.footnote?.length ? (
              <Reveal>
                {pricing.footnote.map((line, index) => (
                  <p
                    key={index}
                    className="mx-auto mt-12 max-w-[80ch] text-center text-[0.85rem] leading-relaxed text-muted"
                  >
                    {line}
                  </p>
                ))}
              </Reveal>
            ) : null}
          </>
        )}
      </Container>
    </section>
  );
}
