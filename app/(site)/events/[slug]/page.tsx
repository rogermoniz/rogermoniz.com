import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { canonicalPath } from "@/lib/canonical";
import type { ArticleSection } from "@/lib/content/sections";
import { ArticlePage } from "@/components/templates/ArticlePage";
import { getEditorial, getPageKind, getPageStatus, getSlugsByKind } from "@/lib/content/source";

const SECTION: ArticleSection = "events";

/** Every events article renders through this one template. */
/** An article added from the editor renders on demand rather than 404ing. */
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getSlugsByKind("article");
  return slugs
    .filter((s) => s.startsWith(`${SECTION}/`))
    .map((s) => ({ slug: s.slice(SECTION.length + 1) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if ((await getPageKind(`${SECTION}/${slug}`)) !== "article") notFound();
  const data = await getEditorial(`${SECTION}/${slug}`);
  return {
    title: data.metaTitle,

    alternates: { canonical: canonicalPath(`/${SECTION}/${slug}`) },
    openGraph: { title: data.metaTitle },
  };
}

export default async function Route({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if ((await getPageKind(`${SECTION}/${slug}`)) !== "article") notFound();
  // A draft is not on the site at all. Its preview lives at /apercu.
  if ((await getPageStatus(`${SECTION}/${slug}`)) === "draft") notFound();
  const data = await getEditorial(`${SECTION}/${slug}`);
  if (data.kind !== "article") notFound();
  return <ArticlePage data={data} />;
}
