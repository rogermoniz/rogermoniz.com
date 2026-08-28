import type { Metadata } from "next";
import { Preloader } from "@/components/effects/Preloader";
import { ApertureGallery } from "@/components/sections/ApertureGallery";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { HeroMarquee } from "@/components/sections/HeroMarquee";
import { ReviewsMarquee } from "@/components/sections/ReviewsMarquee";
import { WelcomeSection } from "@/components/sections/WelcomeSection";
import { getHomePage, getPageMeta } from "@/lib/content/source";

export async function generateMetadata(): Promise<Metadata> {
  const { metaTitle } = await getPageMeta("index");
  return { title: metaTitle, openGraph: { title: metaTitle } };
}

export default async function HomeRoute() {
  const [homePage, { preloaderLabel }] = await Promise.all([
    getHomePage(),
    getPageMeta("index"),
  ]);

  return (
    <>
      <Preloader label={preloaderLabel} />
      <HeroMarquee hero={homePage.hero} />
      <WelcomeSection welcome={homePage.welcome} />
      <ApertureGallery prestations={homePage.prestations} />
      <ReviewsMarquee reviews={homePage.reviews} />
      <FaqSection heading={homePage.faq.heading} entries={homePage.faq.entries} />
      <CtaSection label={homePage.cta.label} href={homePage.cta.href} />
    </>
  );
}
