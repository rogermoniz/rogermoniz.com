import type { Metadata } from "next";
import { SiteAnalytics } from "@/components/analytics/SiteAnalytics";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { BubbleButton } from "@/components/primitives/BubbleButton";
import { getNavigation, getSiteIdentity } from "@/lib/content/source";
import {
  Container,
  DisplayHeading,
  Eyebrow,
  HeadingSub,
} from "@/components/primitives/Typography";

export const metadata: Metadata = {
  title: "Page introuvable | Roger Moniz Photographe à Nice",
};

export default async function NotFound() {
  const [nav, identity] = await Promise.all([getNavigation(), getSiteIdentity()]);

  /* A 404 is a page a visitor lands on, so it honours consent like any other. */
  return (
    <ConsentProvider>
      <SiteHeader nav={nav.primaryNav} identity={identity} />
    <Container
      as="section"
      className="flex min-h-svh flex-col items-center justify-center bg-surface py-32 text-center"
    >
      <Eyebrow>Erreur 404</Eyebrow>
      <DisplayHeading as="h1">Page introuvable</DisplayHeading>
      <HeadingSub>Cette page n’existe pas ou a été déplacée.</HeadingSub>
      <div className="mt-12">
        <BubbleButton href="/">Retour à l’accueil</BubbleButton>
      </div>
    </Container>
      <SiteFooter />
      <ThemeToggle />
      <ConsentBanner />
      <SiteAnalytics />
    </ConsentProvider>
  );
}
