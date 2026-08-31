import type { Metadata } from "next";
import { canonicalPath } from "@/lib/canonical";
import { Reveal } from "@/components/effects/Reveal";
import {
  Container,
  Eyebrow,
  HeadingSub,
  SectionHeading2,
} from "@/components/primitives/Typography";
import { ArticleGrid } from "@/components/sections/ArticleGrid";
import { CoverStory } from "@/components/sections/blog/CoverStory";
import { RuledHeading } from "@/components/sections/RuledHeading";
import { FaqSection } from "@/components/sections/FaqSection";
import { HeroMarquee } from "@/components/sections/HeroMarquee";
import { getEventsPage } from "@/lib/content/source";


export async function generateMetadata(): Promise<Metadata> {
  const { metaTitle } = await getEventsPage();
  return {
    title: metaTitle,
    alternates: { canonical: canonicalPath("/events") },
    openGraph: { title: metaTitle },
  };
}

export default async function EventsRoute() {
  const data = await getEventsPage();

  return (
    <>
      <HeroMarquee hero={data.hero} />

      {/* The next event, held up the way the blog holds up its newest article:
          the same component, so the two listings read as one site. */}
      {data.cover ? (
        <section id="featured" className="bg-surface pt-[var(--band)] pb-[var(--band)]">
          <Container>
            <RuledHeading>{data.featuredIntro}</RuledHeading>
            <CoverStory cover={data.cover} />
          </Container>
        </section>
      ) : null}

      <Container as="section" id="evenements" className="bg-surface py-[var(--band)]">
        <Reveal>
          <Eyebrow>{data.listEyebrow}</Eyebrow>
        </Reveal>
        <Reveal variant="text">
          <SectionHeading2 className="mb-12">
            {data.listTitle}
            {data.listSubtitle ? <HeadingSub>{data.listSubtitle}</HeadingSub> : null}
          </SectionHeading2>
        </Reveal>
        <ArticleGrid cards={data.cards} />
      </Container>

      <FaqSection heading={data.faq} entries={data.faq.entries} />
    </>
  );
}
