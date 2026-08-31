/**
 * The sections an article can live in.
 *
 * An article's address is its slug, and only these have a route to render it,
 * so an article filed anywhere else is a page that answers 404 to everyone
 * including its author. The list is the one the editor checks against when a
 * page is created, and each route declares its own section as this type, so a
 * new section cannot be added here without a route to go with it.
 */
export const ARTICLE_SECTIONS = ["blog", "events"] as const;

export type ArticleSection = (typeof ARTICLE_SECTIONS)[number];
