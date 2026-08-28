import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Preloader } from "@/components/effects/Preloader";
import { Reveal } from "@/components/effects/Reveal";
import { BubbleButton } from "@/components/primitives/BubbleButton";
import { Container, SectionHeading2 } from "@/components/primitives/Typography";
import { ArticleGrid } from "@/components/sections/ArticleGrid";
import { HeroMarquee } from "@/components/sections/HeroMarquee";
import { cloudinary } from "@/lib/cloudinary";
import { getBlogPage } from "@/lib/content/source";


export async function generateMetadata(): Promise<Metadata> {
  const { metaTitle } = await getBlogPage();
  return { title: metaTitle, openGraph: { title: metaTitle } };
}

export default async function BlogRoute() {
  const data = await getBlogPage();
  const cover = data.cover;

  return (
    <>
      <Preloader label={data.preloaderLabel} />
      <HeroMarquee hero={data.hero} />

      <Container as="section" id="featured" className="bg-surface py-[clamp(64px,7vw,100px)]">
        <Reveal className="mb-12 flex items-center gap-6">
          <SectionHeading2>{data.featuredIntro}</SectionHeading2>
          <span className="h-px grow bg-edge" />
        </Reveal>

        <Reveal className="grid grid-cols-2 gap-12 max-lg:grid-cols-1">
          <Link
            href={cover.href}
            className="group relative aspect-4/3 overflow-hidden rounded-3xl bg-surface"
          >
            <span className="absolute top-5 left-5 z-2 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 font-display text-[0.6rem] font-semibold tracking-[1.5px] text-white uppercase backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-accent" />
              {cover.flag}
            </span>
            <Image
              src={cloudinary(cover.path, { width: 1400 })}
              alt={cover.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="size-full object-cover transition-transform duration-800 ease-out-expo group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.5),transparent_50%)]" />
          </Link>

          <div className="flex flex-col justify-center">
            <span className="mb-4 font-display text-[0.7rem] font-semibold tracking-[2px] text-accent uppercase">
              {cover.meta}
            </span>
            <h3 className="mb-6 font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.1] font-bold tracking-[-0.03em] text-ink uppercase">
              {cover.title}
            </h3>
            <p className="mb-10 text-[1.05rem] leading-relaxed text-muted">{cover.excerpt}</p>
            <BubbleButton href={cover.href}>{cover.ctaLabel}</BubbleButton>
          </div>
        </Reveal>
      </Container>

      <Container as="section" id="articles" className="bg-surface py-[clamp(64px,7vw,100px)]">
        <Reveal className="mb-12 flex items-center gap-6">
          <SectionHeading2>{data.articlesIntro}</SectionHeading2>
          <span className="h-px grow bg-edge" />
        </Reveal>
        <ArticleGrid cards={data.cards} filters={data.filters} filterHead={data.filterHead} />
      </Container>
    </>
  );
}
