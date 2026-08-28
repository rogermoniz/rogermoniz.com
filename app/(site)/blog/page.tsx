import type { Metadata } from "next";
import { BlogIndexPage } from "@/components/templates/BlogIndexPage";
import { getBlogPage } from "@/lib/content/source";

export async function generateMetadata(): Promise<Metadata> {
  const { metaTitle } = await getBlogPage();
  return { title: metaTitle, openGraph: { title: metaTitle } };
}

export default async function BlogRoute() {
  return <BlogIndexPage data={await getBlogPage()} />;
}
