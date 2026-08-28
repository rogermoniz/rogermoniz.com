import { Preloader } from "@/components/effects/Preloader";
import { Container } from "@/components/primitives/Typography";
import { ArticleHero } from "@/components/sections/editorial/ArticleHero";
import { ArticleSidebar } from "@/components/sections/editorial/ArticleSidebar";
import { ContentBlocks } from "@/components/sections/editorial/ContentBlocks";
import { ReadNext } from "@/components/sections/editorial/ReadNext";
import { DualCta } from "@/components/sections/prestation/DualCta";
import type { ArticlePageData } from "@/lib/content/types";

/**
 * One template for every blog post and event write up, in two variants: a
 * feature runs the wider column its editorial pictures need, a standard
 * article the narrower one that reads better for plain prose.
 */
const COLUMN: Record<ArticlePageData["template"], string> = {
  standard: "max-w-[720px]",
  feature: "max-w-[744px]",
};

export function ArticlePage({ data }: { data: ArticlePageData }) {
  const hero = data.hero;

  return (
    /* display:contents keeps the layout identical while the type scale below
       reaches every button in the article, including the ones further down. */
    <div className="contents [--button-label-size:0.875rem] [--button-label-weight:600]">
      <Preloader label={data.preloaderLabel ?? "Roger Moniz"} />
      <ArticleHero {...hero} />

      <section className="relative z-10 bg-surface px-[var(--padding-x)] pt-[clamp(3rem,6vw,5rem)] pb-[clamp(90px,12vw,135px)]">
        <div className="mx-auto grid max-w-[1080px] grid-cols-[260px_minmax(0,1fr)] items-start gap-[clamp(2.5rem,5vw,5vw)] max-lg:grid-cols-1">
          <div className="sticky top-10 h-max self-start max-lg:static">
            <div className="tactile flex max-h-[calc(100vh-5rem)] flex-col gap-7 overflow-y-auto rounded-[20px] p-7 max-lg:max-h-none">
              <ArticleSidebar toc={data.toc} meta={data.meta} />
            </div>
          </div>
          <div className={`flex flex-col ${COLUMN[data.template]}`}>
            <ContentBlocks sections={data.sections} />
          </div>
        </div>
      </section>

      {data.cta ? (
        <section id="cta-contact" className="bg-surface py-[clamp(80px,10vw,135px)] text-center">
          <Container>
            {data.cta.title ? (
              <h2 className="mb-6 font-display text-[clamp(2rem,4.5vw,4rem)] leading-[1.12] font-bold tracking-[-0.04em] text-ink uppercase">
                {data.cta.title}
              </h2>
            ) : null}
            {data.cta.lead ? (
              <p className="mx-auto mb-12 max-w-[56ch] text-[1.05rem] leading-[1.7] text-muted">
                {data.cta.lead}
              </p>
            ) : null}
          </Container>
          <DualCta links={data.cta.links} />
        </section>
      ) : null}

      {data.readNext ? <ReadNext data={data.readNext} /> : null}
    </div>
  );
}
