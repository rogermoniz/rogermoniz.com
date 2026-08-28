import type { Metadata } from "next";
import { Preloader } from "@/components/effects/Preloader";
import { Reveal } from "@/components/effects/Reveal";
import { RichText } from "@/components/primitives/RichText";
import {
  Container,
  Eyebrow,
  HeadingSub,
  SectionHeading2,
} from "@/components/primitives/Typography";
import { FaqSection } from "@/components/sections/FaqSection";
import { GiftBuilder } from "@/components/sections/GiftBuilder";
import { HeroMarquee } from "@/components/sections/HeroMarquee";
import { getGiftPage } from "@/lib/content/source";


export async function generateMetadata(): Promise<Metadata> {
  const { metaTitle } = await getGiftPage();
  return { title: metaTitle, openGraph: { title: metaTitle } };
}

export default async function CarteCadeauRoute() {
  const data = await getGiftPage();
  return (
    <>
      <Preloader label={data.preloaderLabel} />
      <HeroMarquee hero={data.hero} />

      <Container as="section" className="bg-surface pt-[clamp(70px,9vw,120px)] text-center">
        <Eyebrow>{data.intro.eyebrow}</Eyebrow>
        <Reveal variant="text">
          <SectionHeading2 className="mb-7">
            {data.intro.title}
            <HeadingSub>{data.intro.subtitle}</HeadingSub>
          </SectionHeading2>
        </Reveal>
        <Reveal
          as="p"
          className="mx-auto max-w-[62ch] text-[clamp(1.1rem,1.7vw,1.4rem)] leading-[1.75] text-muted"
        >
          <RichText spans={data.intro.lead} />
        </Reveal>
      </Container>

      <Container
        as="section"
        id="builder"
        className="relative z-10 bg-surface pt-[clamp(140px,15vw,220px)] pb-[clamp(90px,10vw,140px)]"
      >
        <GiftBuilder
          steps={data.steps}
          packages={data.packages}
          deliveries={data.deliveries}
          submitLabel={data.submitLabel}
          successMessage={data.formSuccess}
          cardLabels={data.cardLabels}
        />
      </Container>

      <FaqSection heading={data.faq} entries={data.faq.entries} />
    </>
  );
}
