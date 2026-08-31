import { HeroMarquee } from "@/components/sections/HeroMarquee";
import { DualCta } from "@/components/sections/prestation/DualCta";
import { PortfolioSection } from "@/components/sections/prestation/PortfolioSection";
import { PricingSection } from "@/components/sections/prestation/PricingSection";
import { ProcessSection } from "@/components/sections/prestation/ProcessSection";
import { VisionSection } from "@/components/sections/prestation/VisionSection";
import type { PrestationPage as PrestationData } from "@/lib/content/types";

/**
 * One template for all eight prestation pages. A route file picks the data and
 * nothing else, so a redesign happens here rather than eight times over.
 */
export function PrestationPage({ data }: { data: PrestationData }) {
  return (
    <>
      <HeroMarquee hero={data.hero} />
      <VisionSection vision={data.vision} />
      <ProcessSection heading={data.process} steps={data.process.steps} />
      <PricingSection pricing={data.pricing} />
      <PortfolioSection portfolio={data.portfolio} />
      <DualCta links={data.cta} heading={data.ctaHeading} lead={data.ctaLead} />
    </>
  );
}
