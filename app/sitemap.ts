import type { MetadataRoute } from "next";
import { getRoutes } from "@/lib/content/source";

const BASE = "https://rogermoniz.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = await getRoutes();
  return routes.map((route) => ({
    url: `${BASE}${route === "/" ? "/" : `${route}/`}`,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
