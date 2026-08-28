import type { Metadata } from "next";
import { canonicalPath } from "@/lib/canonical";
import { BlogIndexPage } from "@/components/templates/BlogIndexPage";
import { getBlogPage } from "@/lib/content/source";

export async function generateMetadata(): Promise<Metadata> {
  const { metaTitle } = await getBlogPage();
  return {
    title: metaTitle,
    alternates: { canonical: canonicalPath("/blog") },
    openGraph: { title: metaTitle },
  };
}

export default async function BlogRoute() {
  return <BlogIndexPage data={await getBlogPage()} />;
}
