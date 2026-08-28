import { Preloader } from "@/components/effects/Preloader";
import { Container } from "@/components/primitives/Typography";
import { ArticleGrid } from "@/components/sections/ArticleGrid";
import { HeroMarquee } from "@/components/sections/HeroMarquee";
import { RuledHeading } from "@/components/sections/RuledHeading";
import { FeaturedArticle } from "@/components/sections/blog/FeaturedArticle";
import type { getBlogPage } from "@/lib/content/source";

type BlogPageData = Awaited<ReturnType<typeof getBlogPage>>;

const SECTION = "bg-surface py-[clamp(64px,7vw,100px)]";

/**
 * The blog index. Every other listing page is this shape, so the layout lives
 * here once and the route only decides which data fills it.
 */
export function BlogIndexPage({ data }: { data: BlogPageData }) {
  return (
    <>
      <Preloader label={data.preloaderLabel} />
      <HeroMarquee hero={data.hero} />

      <Container as="section" id="featured" className={SECTION}>
        <RuledHeading>{data.featuredIntro}</RuledHeading>
        <FeaturedArticle cover={data.cover} />
      </Container>

      <Container as="section" id="articles" className={SECTION}>
        <RuledHeading>{data.articlesIntro}</RuledHeading>
        <ArticleGrid cards={data.cards} filters={data.filters} filterHead={data.filterHead} />
      </Container>
    </>
  );
}
