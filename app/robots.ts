import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // The CMS shares the public domain, so keep crawlers out of it entirely
    // rather than relying on the noindex tag alone.
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: "https://rogermoniz.com/sitemap.xml",
  };
}
