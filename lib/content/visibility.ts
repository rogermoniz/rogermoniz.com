import "server-only";
import { isSignedIn } from "@/lib/cms/auth";
import { getPageStatus } from "@/lib/content/source";

/**
 * Whether this request may see a page that has not been published.
 *
 * A draft is served at its real address, with the real template and the real
 * chrome, but only to whoever is signed into the editor. That is what makes
 * the preview the page itself rather than an approximation of it, and it is
 * why there is no second route to keep in step with the first.
 *
 * The signed in check reads a cookie, which opts the route out of static
 * rendering, so it runs only once a page is known to be a draft. Published
 * pages are prerendered exactly as before.
 */
export async function isHiddenDraft(slug: string): Promise<boolean> {
  if ((await getPageStatus(slug)) !== "draft") return false;
  return !(await isSignedIn());
}

/** A draft that is on screen is a preview, and must never be indexed. */
export async function isDraft(slug: string): Promise<boolean> {
  return (await getPageStatus(slug)) === "draft";
}
