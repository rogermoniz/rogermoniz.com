/**
 * The one address a page should be indexed under.
 *
 * Every route is served with a trailing slash and that is the form Google has
 * already selected, so the sitemap and the canonical tag both use it.
 *
 * The root is written the same way, for one line of consistency rather than for
 * meaning: a URL with an empty path is defined as equivalent to one with "/",
 * so `https://rogermoniz.com` and `https://rogermoniz.com/` are the same URL
 * and every parser normalises between them. On any other page the slash is not
 * cosmetic, because the server redirects the form without it.
 */
export const SITE_ORIGIN = "https://rogermoniz.com";

export function canonicalPath(route: string): string {
  if (route === "/" || route === "") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${route.endsWith("/") ? route : `${route}/`}`;
}
