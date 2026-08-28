"use client";

import { useState } from "react";
import { Reveal } from "@/components/effects/Reveal";
import { Container } from "@/components/primitives/Typography";
import { ArticleGrid, type ArticleCard } from "@/components/sections/ArticleGrid";
import { RuledHeading } from "@/components/sections/RuledHeading";

/**
 * The filters and the journal are two bands on the page but one control, so
 * they share this component rather than a store: the chips sit in their own
 * full width section above the grid, exactly as they do on the original.
 */
export function JournalBrowser({
  cards,
  filters,
  filterHead,
  articlesIntro,
}: {
  cards: readonly ArticleCard[];
  filters: readonly { value: string; label: string }[];
  filterHead: string;
  articlesIntro: string;
}) {
  const [active, setActive] = useState("all");

  return (
    <>
      {filters.length ? (
        <section className="bg-surface py-[clamp(40px,5vw,72px)]">
          <Container>
            {filterHead ? (
              <Reveal className="mb-5 text-[0.7rem] font-semibold tracking-[0.16em] text-muted uppercase">
                {filterHead}
              </Reveal>
            ) : null}
            <Reveal className="flex flex-wrap items-center gap-[0.7rem]">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  aria-pressed={active === filter.value}
                  onClick={() => setActive(filter.value)}
                  className={`tactile rounded-[100px] px-4 py-2 font-display text-[0.74rem] font-bold tracking-[0.04em] whitespace-nowrap uppercase ${
                    active === filter.value ? "shadow-[var(--tactile-active)]" : ""
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </Reveal>
          </Container>
        </section>
      ) : null}

      <section
        id="articles"
        className="bg-surface pt-[clamp(24px,3vw,48px)] pb-[clamp(90px,10vw,140px)]"
      >
        <Container>
          <RuledHeading>{articlesIntro}</RuledHeading>
          <ArticleGrid cards={cards} active={active} />
        </Container>
      </section>
    </>
  );
}
