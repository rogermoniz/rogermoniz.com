import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticlePage } from "@/components/templates/ArticlePage";
import { getEditorial, getSlugsByKind } from "@/lib/content/source";

const SECTION = "events";

/** Every events article renders through this one template. */
export const dynamicParams = false;

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
  const data = await getEditorial(`${SECTION}/${slug}`);
  return { title: data.metaTitle, openGraph: { title: data.metaTitle } };
}

export default async function Route({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getEditorial(`${SECTION}/${slug}`);
  if (data.kind !== "article") notFound();
  return <ArticlePage data={data} />;
}
