import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // The CMS, the draft previews, the booking forms and the order confirmation
    // share the public domain, so keep crawlers out of all of them rather than
    // relying on the noindex tag alone.
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/apercu", "/merci", "/reserver"] },
    sitemap: "https://rogermoniz.com/sitemap.xml",
  };
}
