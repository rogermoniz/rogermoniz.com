import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LegalPage } from "@/components/templates/LegalPage";
import { PrestationPage } from "@/components/templates/PrestationPage";
import { getEditorial, getPrestation, getSlugsByKind } from "@/lib/content/source";

/**
 * Every prestation and every legal page renders through here. Editing a
 * template changes all eleven at once; the pages differ only by their data.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getSlugsByKind("prestation", "legal");
  return slugs.map((slug) => ({ slug }));
}

async function load(slug: string) {
  const prestationSlugs = await getSlugsByKind("prestation");
  return prestationSlugs.includes(slug)
    ? ({ kind: "prestation" as const, data: await getPrestation(slug) })
    : ({ kind: "legal" as const, data: await getEditorial(slug) });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await load(slug);
  return { title: data.metaTitle, openGraph: { title: data.metaTitle } };
}

export default async function Route({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loaded = await load(slug);

  if (loaded.kind === "prestation") return <PrestationPage data={loaded.data} />;
  if (loaded.data.kind !== "legal") notFound();
  return <LegalPage data={loaded.data} />;
}
