"use client";

import { useState } from "react";
import { Reveal } from "@/components/effects/Reveal";
import { BubbleButton } from "@/components/primitives/BubbleButton";
import { Container, SectionHeading2 } from "@/components/primitives/Typography";
import { Card } from "@/components/sections/ArticleGrid";
import type { ArticlePageData } from "@/lib/content/types";

type RelatedData = NonNullable<ArticlePageData["related"]>;

/** How many the reader is given before being asked whether they want more. */
const PAGE = 9;

/**
 * The tail of an article: everything else filed under the same category, in
 * the same card the listing uses, so the two can never drift apart. The list
 * arrives whole and is revealed a page at a time, which needs no request per
 * click and keeps every card in the HTML for a crawler to follow.
 */
export function RelatedArticles({ data }: { data: RelatedData }) {
  const [shown, setShown] = useState(PAGE);
  const visible = data.cards.slice(0, shown);
  const remaining = data.cards.length - visible.length;

  return (
    <section className="bg-surface py-[clamp(64px,7vw,100px)]">
      <Container>
        <Reveal variant="text">
          <SectionHeading2 className="mb-12">{data.title}</SectionHeading2>
        </Reveal>

        <div className="grid grid-cols-3 gap-10 max-lg:grid-cols-2 max-md:grid-cols-1">
          {visible.map((card) => (
            <Reveal key={card.href}>
              <Card card={card} />
            </Reveal>
          ))}
        </div>

        {remaining > 0 ? (
          <div className="mt-14 flex justify-center">
            <BubbleButton onClick={() => setShown((count) => count + PAGE)}>
              Voir plus d&apos;articles
            </BubbleButton>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
