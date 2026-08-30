import type { Metadata } from "next";
import { canonicalPath } from "@/lib/canonical";
import Image from "next/image";
import { Preloader } from "@/components/effects/Preloader";
import { ScrollCue } from "@/components/effects/ScrollCue";
import { Reveal } from "@/components/effects/Reveal";
import { RichText } from "@/components/primitives/RichText";
import {
  Container,
  DisplayHeading,
  Eyebrow,
  SectionHeading2,
} from "@/components/primitives/Typography";
import { DualCta } from "@/components/sections/prestation/DualCta";
import { ProcessSection } from "@/components/sections/prestation/ProcessSection";
import { cloudinary } from "@/lib/cloudinary";
import { getAboutPage } from "@/lib/content/source";


export async function generateMetadata(): Promise<Metadata> {
  const { metaTitle } = await getAboutPage();
  return {
    title: metaTitle,
    alternates: { canonical: canonicalPath("/a-propos") },
    openGraph: { title: metaTitle },
  };
}

export default async function AProposRoute() {
  const data = await getAboutPage();
  const hero = data.hero;

  return (
    <>
      <Preloader label={data.preloaderLabel} />

      <section className="relative flex min-h-svh items-center overflow-hidden bg-surface text-ink">
        {/* The portrait bleeds in from the right and dissolves into the page. */}
        <div className="absolute inset-y-0 right-0 w-[48%] max-[900px]:w-full max-[900px]:opacity-30">
          {hero.backgrounds.map((background) => (
            <Image
              key={background.theme}
              src={cloudinary(background.path, { width: 1400 })}
              alt={background.alt}
              fill
              priority={background.theme === "light"}
              sizes="50vw"
              style={{ objectPosition: background.focal ?? undefined }}
              className={`size-full object-cover ${
                background.theme === "dark" ? "hidden dark:block" : "block dark:hidden"
              }`}
            />
          ))}
          <span className="absolute inset-0 bg-[linear-gradient(90deg,var(--theme-bg)_1%,var(--surface-fade)_58%)]" />
        </div>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[14px] z-4 border border-[rgb(194_154_75_/_0.38)]"
        />

        <ScrollCue label={hero.scrollLabel} tone="ink" />

        <div className="relative z-2 mx-auto w-full max-w-[1500px] px-[clamp(40px,6vw,90px)]">
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <DisplayHeading as="h1" className="!leading-[0.9]">
            {hero.titleLines.map((line, index) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </DisplayHeading>
          <p className="mt-5 font-body text-[clamp(1.1rem,2.2vw,1.8rem)] font-light text-accent italic">
            {hero.tag}
          </p>
          <p className="mt-6 max-w-[42ch] text-[clamp(0.98rem,1.05vw,1.08rem)] leading-[1.8] text-muted">
            {hero.lead}
          </p>
        </div>
      </section>

      <Container as="section" className="py-[clamp(55px,7vw,90px)] pb-[clamp(80px,11vw,150px)]">
        <div className="grid grid-cols-[0.85fr_1.15fr] items-center gap-[clamp(2rem,5vw,5.5rem)] max-[900px]:grid-cols-1">
          <Reveal className="group aspect-4/5 overflow-hidden rounded-2xl bg-surface max-[900px]:max-w-[420px]">
            <Image
              src={cloudinary(data.story.image.path, { width: 1000 })}
              alt={data.story.image.alt}
              width={1000}
              height={1250}
              sizes="(max-width: 1024px) 100vw, 40vw"
              style={{ objectPosition: data.story.image.focal ?? undefined }}
              className="size-full scale-[1.03] object-cover transition-transform duration-1400 ease-out-expo group-hover:scale-100"
            />
          </Reveal>

          <div>
            <Reveal>
              <Eyebrow>{data.story.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal variant="text">
              <SectionHeading2 className="mt-4 mb-6">{data.story.title}</SectionHeading2>
            </Reveal>
            {data.story.paragraphs.map((paragraph, index) => (
              <Reveal
                key={index}
                as="p"
                className="mb-[1.1rem] text-[1.02rem] leading-[1.85] text-muted [&_strong]:font-semibold [&_strong]:text-ink"
              >
                <RichText spans={paragraph} />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>

      <Container>
        <Reveal className="grid grid-cols-4 gap-px border-y border-edge bg-edge max-[900px]:grid-cols-2">
          {data.figures.map((figure) => (
            <div key={figure.label} className="bg-surface px-5 py-[clamp(30px,4vw,52px)]">
              <div className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-[0.85] font-bold tracking-[-0.02em] text-accent">
                {figure.value}
              </div>
              <div className="mt-4 font-body text-[0.58rem] tracking-[0.16em] text-muted uppercase">
                {figure.label}
              </div>
            </div>
          ))}
        </Reveal>
      </Container>

      <ProcessSection heading={data.process} steps={data.process.steps} />

      <div className="py-[clamp(60px,8vw,110px)]">
        <div className="-mx-[50vw] ml-[calc(50%-50vw)] flex w-screen snap-x snap-mandatory gap-[clamp(0.6rem,1vw,1rem)] overflow-x-auto px-[clamp(0.6rem,1vw,1rem)] [scrollbar-width:none]">
          {data.strip.map((shot) => (
            <div
              key={shot.path}
              className="group h-[clamp(260px,40vw,560px)] flex-none snap-center overflow-hidden rounded-xl bg-surface"
            >
              <Image
                src={cloudinary(shot.path, { width: 1000 })}
                alt={shot.alt}
                width={800}
                height={1000}
                loading="lazy"
                sizes="60vw"
                className="h-full w-auto object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-[1000px] px-[var(--padding-x)] pt-[clamp(80px,11vw,150px)] pb-[clamp(60px,8vw,110px)] text-center">
        <Reveal
          as="p"
          className="font-display text-[clamp(1.4rem,2.8vw,2.2rem)] leading-snug text-ink italic"
        >
          {data.close.quote}
        </Reveal>
        <Reveal className="mt-8 font-display text-[0.7rem] font-semibold tracking-[2px] text-muted uppercase">
          {data.close.name}
        </Reveal>
      </section>

      <DualCta links={data.cta} />
    </>
  );
}
