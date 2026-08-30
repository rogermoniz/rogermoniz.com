import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticlePage } from "@/components/templates/ArticlePage";
import { LegalPage } from "@/components/templates/LegalPage";
import { PrestationPage } from "@/components/templates/PrestationPage";
import { isSignedIn } from "@/lib/cms/auth";
import { getEditorial, getPageKind, getPrestation } from "@/lib/content/source";

/**
 * The preview of a page that is not on the site yet.
 *
 * It renders the real template inside the real chrome, so what the author
 * approves is the page itself rather than an impression of it. It sits in the
 * site group for exactly that reason, and it is the only route here that reads
 * a cookie: the public routes stay cacheable, which is what keeps every
 * published page prerendered.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Aperçu",
  robots: { index: false, follow: false },
};

export default async function Preview({ params }: { params: Promise<{ slug: string[] }> }) {
  if (!(await isSignedIn())) notFound();

  const { slug: segments } = await params;
  const slug = segments.map(decodeURIComponent).join("/");

  switch (await getPageKind(slug)) {
    case "prestation":
      return <PrestationPage data={await getPrestation(slug)} />;
    case "article": {
      const data = await getEditorial(slug);
      if (data.kind !== "article") notFound();
      return <ArticlePage data={data} />;
    }
    case "legal": {
      const data = await getEditorial(slug);
      if (data.kind !== "legal") notFound();
      return <LegalPage data={data} />;
    }
    default:
      notFound();
  }
}
