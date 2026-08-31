import type { Metadata } from "next";
import { canonicalPath } from "@/lib/canonical";
import Image from "next/image";
import { Preloader } from "@/components/effects/Preloader";
import { Reveal } from "@/components/effects/Reveal";
import { BubbleButton } from "@/components/primitives/BubbleButton";
import {
  Container,
  Eyebrow,
  HeadingSub,
  SectionHeading2,
} from "@/components/primitives/Typography";
import { ArticleGrid } from "@/components/sections/ArticleGrid";
import { FaqSection } from "@/components/sections/FaqSection";
import { HeroMarquee } from "@/components/sections/HeroMarquee";
import { cloudinary } from "@/lib/cloudinary";
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
  const featured = data.featured;

  return (
    <>
      <Preloader label={data.preloaderLabel} />
      <HeroMarquee hero={data.hero} />

      <Container as="section" id="featured" className="bg-surface py-[var(--band)]">
        <Reveal>
          <Eyebrow>{featured.eyebrow}</Eyebrow>
        </Reveal>

        <div className="grid grid-cols-2 items-center gap-16 max-lg:grid-cols-1 max-lg:gap-10">
          <Reveal className="group relative aspect-4/5 overflow-hidden rounded-3xl bg-surface">
            <span className="absolute top-5 left-5 z-2 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 font-display text-[0.6rem] font-semibold tracking-[1.5px] text-white uppercase backdrop-blur-sm">
              {/* A live marker: reservations are currently open. */}
              <span className="size-1.5 animate-pulse rounded-full bg-[#ff453a]" />
              {featured.badge}
            </span>
            <Image
              src={cloudinary(featured.path, { width: 1000 })}
              alt={featured.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="size-full object-cover transition-transform duration-1500 ease-out-expo group-hover:scale-105"
            />
          </Reveal>

          <Reveal className="flex flex-col">
            <SectionHeading2 className="mb-8">
              {featured.title}
              <HeadingSub>{featured.subtitle}</HeadingSub>
            </SectionHeading2>

            {featured.paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-5 text-[1.05rem] leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}

            <dl className="my-8 flex flex-col gap-4 border-t border-edge pt-8">
              {featured.stats.map((stat) => (
                <div key={stat.label} className="flex flex-wrap items-baseline justify-between gap-3">
                  <dt className="font-display text-[0.7rem] font-semibold tracking-[2px] text-muted uppercase">
                    {stat.label}
                  </dt>
                  <dd className="m-0 text-[0.95rem] font-medium text-ink">{stat.value}</dd>
                </div>
              ))}
            </dl>

            <BubbleButton href={featured.ctaHref}>{featured.ctaLabel}</BubbleButton>
          </Reveal>
        </div>
      </Container>

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
