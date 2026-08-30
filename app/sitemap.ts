import type { MetadataRoute } from "next";
import { canonicalPath } from "@/lib/canonical";
import { getRouteKinds } from "@/lib/content/source";

/**
 * A metadata route carries its own segment config: the root layout's
 * revalidate never reaches it, so without this a page added from the editor
 * stays out of the sitemap until the next deploy.
 */
export const revalidate = 600;

/**
 * Every page in the database, weighted by what it is. No lastModified: the
 * content has no edit timestamp, and a generated one would be a crawl signal
 * that means nothing, which is worse than none at all.
 */
const WEIGHT: Record<string, { priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = {
  home: { priority: 1, changeFrequency: "weekly" },
  prestation: { priority: 0.9, changeFrequency: "monthly" },
  standalone: { priority: 0.7, changeFrequency: "weekly" },
  article: { priority: 0.6, changeFrequency: "yearly" },
  legal: { priority: 0.2, changeFrequency: "yearly" },
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getRouteKinds();

  return pages.map(({ route, kind }) => {
    const weight = WEIGHT[kind] ?? WEIGHT.article!;
    return {
      url: canonicalPath(route),
      changeFrequency: weight.changeFrequency,
      priority: weight.priority,
    };
  });
}
