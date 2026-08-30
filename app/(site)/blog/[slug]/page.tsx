import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { canonicalPath } from "@/lib/canonical";
import { ArticlePage } from "@/components/templates/ArticlePage";
import { getEditorial, getPageKind, getSlugsByKind } from "@/lib/content/source";
import { isDraft, isHiddenDraft } from "@/lib/content/visibility";

const SECTION = "blog";

/** Every blog article renders through this one template. */
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
  const draft = await isDraft(`${SECTION}/${slug}`);
  const data = await getEditorial(`${SECTION}/${slug}`);
  return {
    title: data.metaTitle,
    // An unpublished page is on screen only for its author.
    robots: draft ? { index: false, follow: false } : undefined,

    alternates: { canonical: canonicalPath(`/${SECTION}/${slug}`) },
    openGraph: { title: data.metaTitle },
  };
}

export default async function Route({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if ((await getPageKind(`${SECTION}/${slug}`)) !== "article") notFound();
  if (await isHiddenDraft(`${SECTION}/${slug}`)) notFound();
  const data = await getEditorial(`${SECTION}/${slug}`);
  if (data.kind !== "article") notFound();
  return <ArticlePage data={data} />;
}
