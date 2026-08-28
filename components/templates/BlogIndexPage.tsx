import { Preloader } from "@/components/effects/Preloader";
import { Container } from "@/components/primitives/Typography";
import { HeroMarquee } from "@/components/sections/HeroMarquee";
import { RuledHeading } from "@/components/sections/RuledHeading";
import { CoverStory } from "@/components/sections/blog/CoverStory";
import { JournalBrowser } from "@/components/sections/blog/JournalBrowser";
import type { getBlogPage } from "@/lib/content/source";

type BlogPageData = Awaited<ReturnType<typeof getBlogPage>>;

/**
 * The journal index: a cover story, then the filters and the grid they drive.
 * The route only decides which data fills it.
 */
export function BlogIndexPage({ data }: { data: BlogPageData }) {
  return (
    <>
      <Preloader label={data.preloaderLabel} />
      <HeroMarquee hero={data.hero} />

      <section
        id="featured"
        className="bg-surface pt-[clamp(110px,13vw,200px)] pb-[clamp(70px,8vw,120px)]"
      >
        <Container>
          <RuledHeading>{data.featuredIntro}</RuledHeading>
          <CoverStory cover={data.cover} />
        </Container>
      </section>

      <JournalBrowser
        cards={data.cards}
        filters={data.filters}
        filterHead={data.filterHead}
        articlesIntro={data.articlesIntro}
      />
    </>
  );
}
