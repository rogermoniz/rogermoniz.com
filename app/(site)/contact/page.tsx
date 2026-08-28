import type { Metadata } from "next";
import { canonicalPath } from "@/lib/canonical";
import { Preloader } from "@/components/effects/Preloader";
import { Reveal } from "@/components/effects/Reveal";
import {
  Container,
  Eyebrow,
  HeadingSub,
  SectionHeading2,
} from "@/components/primitives/Typography";
import { ContactForm } from "@/components/sections/ContactForm";
import { FaqSection } from "@/components/sections/FaqSection";
import { HeroMarquee } from "@/components/sections/HeroMarquee";
import { getContactPage } from "@/lib/content/source";


export async function generateMetadata(): Promise<Metadata> {
  const { metaTitle } = await getContactPage();
  return {
    title: metaTitle,
    alternates: { canonical: canonicalPath("/contact") },
    openGraph: { title: metaTitle },
  };
}

export default async function ContactRoute() {
  const data = await getContactPage();
  return (
    <>
      <Preloader label={data.preloaderLabel} />
      <HeroMarquee hero={data.hero} />

      <Container
        as="section"
        id="welcome"
        className="bg-surface pt-[clamp(140px,15vw,220px)] pb-[clamp(90px,10vw,140px)]"
      >
        <div className="grid grid-cols-2 gap-20 max-lg:grid-cols-1 max-lg:gap-12">
          <div className="flex flex-col">
            {data.info.map((block) => (
              <Reveal key={block.label} className="mb-12">
                <span className="mb-4 block font-body text-[0.85rem] font-semibold text-muted">
                  {block.label}
                </span>
                {block.href ? (
                  <a
                    href={block.href}
                    className="group relative inline-block w-fit font-body text-[clamp(1.25rem,1.8vw,1.75rem)] leading-relaxed font-medium text-ink transition-colors duration-400 hover:text-accent"
                  >
                    {block.value}
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-right scale-x-0 bg-accent transition-transform duration-400 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
                  </a>
                ) : (
                  <p className="font-body text-[clamp(1.25rem,1.8vw,1.75rem)] leading-relaxed font-medium text-ink">
                    {block.value}
                    {block.note ? (
                      <span className="mt-2 block text-[clamp(1rem,1.2vw,1.2rem)] font-normal text-muted">
                        {block.note}
                      </span>
                    ) : null}
                  </p>
                )}
              </Reveal>
            ))}
          </div>

          <div className="flex flex-col">
            <div>
              <Eyebrow>{data.formEyebrow}</Eyebrow>
            </div>
            <Reveal variant="text">
              <SectionHeading2 className="mb-12">
                {data.formTitle}
                <HeadingSub>{data.formSubtitle}</HeadingSub>
              </SectionHeading2>
            </Reveal>
            <Reveal>
              <ContactForm
                subjectOptions={data.subjectOptions}
                successMessage={data.formSuccess}
              />
            </Reveal>
          </div>
        </div>
      </Container>

      <FaqSection heading={data.faq} entries={data.faq.entries} />
    </>
  );
}
