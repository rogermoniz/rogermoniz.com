import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // The CMS and the draft previews share the public domain, so keep crawlers
    // out of both entirely rather than relying on the noindex tag alone.
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/apercu"] },
    sitemap: "https://rogermoniz.com/sitemap.xml",
  };
}
