import { SITE_ORIGIN } from "@/lib/canonical";

const INTERNAL_HOSTS = new Set(["rogermoniz.com", "www.rogermoniz.com"]);

/** A scheme the browser hands to something other than the router. */
const OPAQUE = /^(mailto:|tel:|sms:|#)/i;

/**
 * Accepts whatever the editor pastes and stores the form the router reads.
 *
 * Copying the address out of the browser bar is the obvious way to fill a link
 * field, and it produces `https://rogermoniz.com/blog/x/` where the site keeps
 * `/blog/x/`. Both navigate, so the mistake looks harmless — but every place
 * the site matches a link against a page compares paths, so an absolute link
 * silently stops being the same page: the listing loses the card's publication
 * date and drops it to the bottom, and the article loses its own category and
 * with it the list of related articles. Reducing the link here is the same
 * answer `normalisePath` gives for a pasted image URL, and for the same reason.
 *
 * An address on another site is left exactly as it was typed.
 */
export function normaliseHref(input: string): string {
  const value = input.trim();
  if (!value || OPAQUE.test(value)) return value;

  let path = value;
  if (/^https?:\/\//i.test(value)) {
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      return value;
    }
    if (!INTERNAL_HOSTS.has(url.hostname.toLowerCase())) return value;
    path = `${url.pathname}${url.search}${url.hash}`;
  } else if (value.startsWith(SITE_ORIGIN)) {
    path = value.slice(SITE_ORIGIN.length);
  }

  return withTrailingSlash(path.startsWith("/") ? path : `/${path}`);
}

/**
 * The site is `trailingSlash: true`, so a link without the slash is served by
 * a redirect. The slash goes before the query and the fragment, which is where
 * the server would have put it.
 */
function withTrailingSlash(path: string): string {
  const cut = path.search(/[?#]/);
  const head = cut === -1 ? path : path.slice(0, cut);
  const tail = cut === -1 ? "" : path.slice(cut);
  if (head === "" || head === "/") return `/${tail}`;
  // A file has an extension; a page does not, and only a page gets the slash.
  if (/\.[a-z0-9]{2,5}$/i.test(head)) return `${head}${tail}`;
  return `${head.endsWith("/") ? head : `${head}/`}${tail}`;
}
