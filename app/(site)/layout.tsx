import { SiteAnalytics } from "@/components/analytics/SiteAnalytics";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { getNavigation, getSiteIdentity } from "@/lib/content/source";

/** The public site's chrome. The CMS sits outside this group and has none of it. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [nav, identity] = await Promise.all([getNavigation(), getSiteIdentity()]);

  return (
    <ConsentProvider>
      <SiteHeader nav={nav.primaryNav} identity={identity} />
      <main>{children}</main>
      <SiteFooter />
      <ThemeToggle />
      <ConsentBanner />
      <SiteAnalytics />
    </ConsentProvider>
  );
}
