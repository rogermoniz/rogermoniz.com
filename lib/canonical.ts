/**
 * The one address a page should be indexed under.
 *
 * Every route is served with a trailing slash and that is the form Google has
 * already selected, so the sitemap and the canonical tag both use it.
 *
 * The home page is written here as the bare origin. A URL parser normalises an
 * empty path to "/", so `https://rogermoniz.com` and `https://rogermoniz.com/`
 * are the same URL and the rendered tag will show the slash either way; the
 * sitemap keeps the bare form because that string is ours to choose.
 */
export const SITE_ORIGIN = "https://rogermoniz.com";

export function canonicalPath(route: string): string {
  if (route === "/" || route === "") return SITE_ORIGIN;
  return `${SITE_ORIGIN}${route.endsWith("/") ? route : `${route}/`}`;
}
