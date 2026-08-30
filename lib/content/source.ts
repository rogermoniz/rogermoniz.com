import "server-only";
import { cache } from "react";
import { supabase } from "@/lib/supabase/server";
import type {
  ArticlePageData,
  CloudinaryImage,
  CtaLink,
  EditorialPage,
  FaqEntry,
  HomePage,
  LegalPageData,
  MarqueeColumn,
  PrestationPage,
  Span,
} from "./types";

/* ==========================================================================
   Content source: Supabase.

   Every table is read once, at build time, and assembled into exactly the
   shapes the components already take. That is why moving the content into a
   database changed no component: only this file knows where content lives.
   ========================================================================== */

const SPEEDS = ["up", "down", "up-slow", "down-slow"] as const;

type Row = Record<string, unknown>;

/**
 * `position` only counts inside a group, so tables split across groups tie on
 * it and Postgres is free to break the tie however it likes. Falling back to
 * `id` makes every read a total order, so a row edited in the CMS cannot come
 * back in a different place.
 */
async function table(name: string, order = "position"): Promise<Row[]> {
  let query = supabase.from(name).select("*").order(order);
  if (order !== "id" && !NO_ID.has(name)) query = query.order("id");
  const { data, error } = await query;
  if (error) throw new Error(`Reading ${name}: ${error.message}`);
  return (data ?? []) as Row[];
}

/** Tables keyed by something other than a numeric id. */
const NO_ID = new Set([
  "pages", "about_close", "about_hero", "about_story", "article_hero",
  "blog_cover", "contact_form", "cta_blocks", "event_featured", "gift_form", "gift_intro",
  "hero_marquee", "home_welcome", "pricing_blocks", "section_headings", "vision_blocks",
]);

const str = (v: unknown): string => (typeof v === "string" ? v : "");
const nullable = (v: unknown): string | null => (typeof v === "string" ? v : null);

function image(path: unknown, alt: unknown): CloudinaryImage {
  return { path: str(path), alt: str(alt) };
}

function bySlug<T extends Row>(rows: T[], slug: string): T[] {
  return rows.filter((r) => r.page_slug === slug);
}

function one<T extends Row>(rows: T[], slug: string): T | undefined {
  return rows.find((r) => r.page_slug === slug);
}

/** Assembles the whole site once; every page then reads from memory. */
async function fetchAll() {
  const names = [
    "site_settings", "nav_items", "footer_images", "pages",
    "hero_marquee", "hero_marquee_images", "article_hero", "about_hero", "about_hero_backgrounds",
    "section_headings", "faq_entries", "cta_blocks", "cta_lead_paragraphs", "cta_links",
    "rich_sections", "toc_entries", "article_meta", "read_next_cards",
    "vision_blocks", "vision_paragraphs", "vision_images", "process_steps",
    "pricing_blocks", "pricing_cards", "pricing_features", "pricing_notes", "gallery_items",
    "home_welcome", "home_welcome_paragraphs", "prestation_teasers", "reviews",
    "contact_info", "contact_form", "contact_subject_options",
    "blog_cover", "blog_filters", "article_cards",
    "event_featured", "event_featured_paragraphs", "event_featured_stats",
    "about_story", "about_story_paragraphs", "about_figures", "about_strip", "about_close",
    "gift_intro", "gift_steps", "gift_packages", "gift_deliveries", "gift_form",
  ];

  // Derived from the live schema: tables without a `position` column sort by
  // whatever key they actually have, so a read can never fail on a bad order.
  const orderBy: Record<string, string> = {
    about_close: "page_slug",
    about_hero: "page_slug",
    // Two rows per page (light and dark), so sort by id for a stable order.
    about_hero_backgrounds: "id",
    about_story: "page_slug",
    article_hero: "page_slug",
    blog_cover: "page_slug",
    contact_form: "page_slug",
    cta_blocks: "page_slug",
    event_featured: "page_slug",
    gift_form: "page_slug",
    gift_intro: "page_slug",
    hero_marquee: "page_slug",
    home_welcome: "page_slug",
    pages: "sort_order",
    pricing_blocks: "page_slug",
    section_headings: "page_slug",
    site_settings: "id",
    vision_blocks: "page_slug",
  };

  const results = await Promise.all(names.map((n) => table(n, orderBy[n] ?? "position")));
  return Object.fromEntries(names.map((n, i) => [n, results[i] ?? []])) as Record<string, Row[]>;
}

/**
 * Deduped per render pass rather than memoised for the life of the process, so
 * a revalidation genuinely re-reads the database and content edits appear
 * without a redeploy.
 */
const db = cache(fetchAll);

/* -------------------------------------------------------------------------- */

function heroFor(d: Record<string, Row[]>, slug: string): HomePage["hero"] {
  const head = one(d.hero_marquee ?? [], slug);
  const images = bySlug(d.hero_marquee_images ?? [], slug);
  const columns: MarqueeColumn[] = SPEEDS.map((speed) => ({
    speed,
    images: images
      .filter((i) => i.speed === speed)
      .map((i) => image(i.path, i.alt)),
  })).filter((c) => c.images.length > 0);

  return {
    eyebrow: str(head?.eyebrow),
    title: str(head?.title),
    subtitle: nullable(head?.subtitle),
    imageAspect: str(head?.image_aspect) || "3 / 4",
    columns,
  };
}

function headingFor(d: Record<string, Row[]>, slug: string, key: string) {
  const row = (d.section_headings ?? []).find(
    (r) => r.page_slug === slug && r.section_key === key,
  );
  return {
    eyebrow: nullable(row?.eyebrow),
    title: str(row?.title),
    subtitle: nullable(row?.subtitle),
  };
}

function faqFor(d: Record<string, Row[]>, slug: string): FaqEntry[] {
  return bySlug(d.faq_entries ?? [], slug).map((r) => ({
    question: str(r.question),
    answer: str(r.answer),
  }));
}

function ctaLinksFor(d: Record<string, Row[]>, slug: string): CtaLink[] {
  return bySlug(d.cta_links ?? [], slug).map((r) => ({
    href: str(r.href),
    label: str(r.label),
    variant: r.variant === "solid" ? "solid" : "outline",
  }));
}

/* -------------------------------------------------------------------------- */

export async function getSiteIdentity() {
  const d = await db();
  const s = d.site_settings?.[0];
  return {
    name: str(s?.name),
    location: str(s?.location),
    email: str(s?.email),
    phone: str(s?.phone),
    phoneDisplay: str(s?.phone_display),
    instagram: str(s?.instagram),
    logo: str(s?.logo_path),
  };
}

export async function getNavigation() {
  const d = await db();
  const items = d.nav_items ?? [];
  const primary = items.filter((i) => i.group_key === "primary");
  const children = items.filter((i) => i.group_key === "prestations");

  return {
    primaryNav: primary.map((i) => {
      const kids = children.filter((c) => c.parent_label === i.label);
      return {
        label: str(i.label),
        href: str(i.href),
        ...(kids.length ? { children: kids.map((c) => ({ label: str(c.label), href: str(c.href) })) } : {}),
      };
    }),
    legalNav: items
      .filter((i) => i.group_key === "legal")
      .map((i) => ({ label: str(i.label), href: str(i.href) })),
  };
}

export async function getFooterImages(): Promise<string[]> {
  const d = await db();
  return (d.footer_images ?? []).map((r) => str(r.path));
}

/** Slugs of every page of a kind, for generateStaticParams. */
export async function getSlugsByKind(...kinds: string[]): Promise<string[]> {
  const d = await db();
  return (d.pages ?? [])
    .filter((p) => kinds.includes(str(p.kind)))
    .map((p) => str(p.slug));
}

export async function getPageKind(slug: string): Promise<string> {
  const d = await db();
  return str((d.pages ?? []).find((p) => p.slug === slug)?.kind);
}

export async function getRoutes(): Promise<string[]> {
  const d = await db();
  return (d.pages ?? []).map((p) => str(p.route));
}

/** Route plus what the page is, so the sitemap can weight it honestly. */
export async function getRouteKinds(): Promise<{ route: string; kind: string }[]> {
  const d = await db();
  return (d.pages ?? []).map((p) => ({ route: str(p.route), kind: str(p.kind) }));
}

export async function getPageMeta(slug: string) {
  const d = await db();
  const page = (d.pages ?? []).find((p) => p.slug === slug);
  return {
    metaTitle: str(page?.meta_title),
    preloaderLabel: str(page?.preloader_label),
  };
}

export async function getHomePage(): Promise<HomePage> {
  const d = await db();
  const slug = "index";
  const welcome = one(d.home_welcome ?? [], slug);
  const welcomeHeading = headingFor(d, slug, "welcome");
  const ctaLink = ctaLinksFor(d, slug)[0];

  return {
    hero: heroFor(d, slug),
    welcome: {
      eyebrow: str(welcomeHeading.eyebrow),
      title: welcomeHeading.title,
      subtitle: str(welcomeHeading.subtitle),
      paragraphs: (d.home_welcome_paragraphs ?? []).map((r) => str(r.body)),
      image: image(welcome?.image_path, welcome?.image_alt),
    },
    prestations: {
      heading: headingFor(d, slug, "prestations"),
      slides: (d.prestation_teasers ?? []).map((r) => ({
        index: str(r.index_label),
        title: str(r.title),
        description: str(r.description),
        href: str(r.href),
        ctaLabel: str(r.cta_label),
        image: image(r.path, r.alt),
      })),
    },
    reviews: {
      heading: headingFor(d, slug, "reviews"),
      items: (d.reviews ?? []).map((r) => ({
        name: str(r.name),
        date: str(r.date_label),
        avatar: image(r.avatar_path, r.avatar_alt),
        stars: typeof r.stars === "number" ? r.stars : 5,
        text: str(r.quote),
      })),
    },
    faq: { heading: headingFor(d, slug, "faq"), entries: faqFor(d, slug) },
    cta: { label: ctaLink?.label ?? "", href: ctaLink?.href ?? "/contact" },
  };
}

export async function getPrestation(slug: string): Promise<PrestationPage> {
  const d = await db();
  const meta = await getPageMeta(slug);
  const vision = one(d.vision_blocks ?? [], slug);
  const pricing = one(d.pricing_blocks ?? [], slug);
  const ctaBlock = one(d.cta_blocks ?? [], slug);
  const notes = bySlug(d.pricing_notes ?? [], slug);
  const note = (placement: string) =>
    notes.filter((n) => n.placement === placement).map((n) => str(n.body));

  const cards = bySlug(d.pricing_cards ?? [], slug).map((c) => ({
    featured: c.featured === true,
    boxGrid:
      typeof c.box_grid_cells === "number"
        ? {
            columns: typeof c.box_grid_columns === "number" ? c.box_grid_columns : 3,
            cells: c.box_grid_cells,
            large: Array.isArray(c.box_grid_large) ? (c.box_grid_large as number[]) : [],
          }
        : null,
    tag: nullable(c.tag),
    badge: nullable(c.badge),
    title: str(c.title),
    description: str(c.description),
    price: str(c.price),
    features: (d.pricing_features ?? [])
      .filter((f) => f.card_id === c.id)
      .map((f) => str(f.body)),
    ctaLabel: str(c.cta_label),
    ctaHref: str(c.cta_href),
  }));

  const gallery = bySlug(d.gallery_items ?? [], slug);
  const lead = bySlug(d.cta_lead_paragraphs ?? [], slug).map((r) => str(r.body));

  return {
    slug,
    metaTitle: meta.metaTitle,
    preloaderLabel: meta.preloaderLabel,
    hero: heroFor(d, slug),
    vision: {
      kind: vision?.kind === "stacked" ? "stacked" : "split",
      eyebrow: str(vision?.eyebrow),
      heading: str(vision?.heading),
      paragraphs: bySlug(d.vision_paragraphs ?? [], slug).map((r) => str(r.body)),
      images: bySlug(d.vision_images ?? [], slug).map((r) => image(r.path, r.alt)),
    },
    process: {
      ...headingFor(d, slug, "process"),
      steps: bySlug(d.process_steps ?? [], slug).map((r) => ({
        num: str(r.num),
        title: str(r.title),
        description: str(r.description),
      })),
    },
    pricing:
      pricing?.kind === "quote"
        ? {
            kind: "quote",
            ...headingFor(d, slug, "pricing"),
            lead: note("lead"),
            ctaLabel: str(pricing.cta_label),
            ctaHref: str(pricing.cta_href),
          }
        : {
            kind: "cards",
            ...headingFor(d, slug, "pricing"),
            cards,
            // Omitted rather than empty, so the shape matches a page that has none.
            ...(note("intro").length ? { intro: note("intro") } : {}),
            ...(note("footnote").length ? { footnote: note("footnote") } : {}),
          },
    portfolio: {
      kind: gallery[0]?.kind === "trio" ? "trio" : "bento",
      ...headingFor(d, slug, "portfolio"),
      items: gallery.map((g) => ({
        span: (nullable(g.span) as never) ?? null,
        image: image(g.path, g.alt),
      })),
    },
    ...(ctaBlock
      ? { ctaHeading: { title: str(ctaBlock.title), subtitle: nullable(ctaBlock.subtitle) } }
      : {}),
    ...(lead.length ? { ctaLead: lead } : {}),
    cta: ctaLinksFor(d, slug),
  };
}

/**
 * Every other article filed under the same category. The category lives on the
 * listing card rather than on the page, which is also what the blog filters
 * read, so the tail of an article and the filtered index can never disagree.
 */
function relatedFor(d: Record<string, Row[]>, slug: string) {
  const withoutSlash = (href: string) => href.replace(/\/+$/, "");
  const route = `/${slug}`;
  const cards = d.article_cards ?? [];

  const own = cards.find((r) => withoutSlash(str(r.href)) === route);
  const category = str(own?.category);
  if (!category) return null;

  // Same listing as well as same category: the events cards live in this table
  // too, and one of them is a plain link to the contact page.
  const listing = str(own?.page_slug);
  const siblings = cards
    .filter(
      (r) =>
        str(r.page_slug) === listing &&
        str(r.category) === category &&
        withoutSlash(str(r.href)) !== route,
    )
    .map((r) => ({
      href: str(r.href),
      badge: nullable(r.badge),
      path: nullable(r.path),
      alt: str(r.alt),
      title: nullable(r.title),
      description: nullable(r.description),
      ctaLabel: str(r.cta_label),
      category: nullable(r.category) ?? undefined,
    }));
  if (!siblings.length) return null;

  return {
    title: headingFor(d, slug, "related").title || "Dans la même catégorie",
    cards: siblings,
  };
}

export async function getEditorial(slug: string): Promise<EditorialPage> {
  const d = await db();
  const page = (d.pages ?? []).find((p) => p.slug === slug);
  const meta = await getPageMeta(slug);
  const shared = {
    route: str(page?.route),
    metaTitle: meta.metaTitle,
    preloaderLabel: meta.preloaderLabel,
    toc: bySlug(d.toc_entries ?? [], slug).map((r) => ({
      href: str(r.href),
      label: str(r.label),
    })),
    sections: bySlug(d.rich_sections ?? [], slug).map((r) => ({
      id: nullable(r.anchor),
      variant: nullable(r.variant),
      blocks: r.blocks as never,
    })),
  };

  if (page?.kind === "legal") {
    const legal: LegalPageData = {
      ...shared,
      kind: "legal",
      hero: heroFor(d, slug),
      backLabel: "Retour à l'accueil",
    };
    return legal;
  }

  const hero = one(d.article_hero ?? [], slug);
  const ctaBlock = one(d.cta_blocks ?? [], slug);
  const leadRow = bySlug(d.cta_lead_paragraphs ?? [], slug)[0];
  const cards = bySlug(d.read_next_cards ?? [], slug);

  const article: ArticlePageData = {
    ...shared,
    kind: "article",
    related: relatedFor(d, slug),
    template: str(page?.template) === "feature" ? "feature" : "standard",
    hero: {
      category: nullable(hero?.category),
      date: nullable(hero?.date_label),
      readingTime: nullable(hero?.reading_time),
      title: nullable(hero?.title),
      path: nullable(hero?.image_path),
      alt: str(hero?.image_alt),
      scrollLabel: str(hero?.scroll_label) || "Scroll",
    },
    meta: {
      blocks: bySlug(d.article_meta ?? [], slug).map((r) => ({
        label: str(r.label),
        value: str(r.value),
      })),
      shareLabel: nullable(hero?.share_label),
    },
    cta: ctaBlock
      ? {
          title: nullable(ctaBlock.title),
          lead: leadRow ? str(leadRow.body) : null,
          links: ctaLinksFor(d, slug),
        }
      : null,
    readNext: cards.length
      ? {
          title: headingFor(d, slug, "read_next").title,
          cards: cards.map((c) => ({
            href: nullable(c.href),
            badge: nullable(c.badge),
            path: nullable(c.path),
            alt: str(c.alt),
            title: nullable(c.title),
            description: nullable(c.description),
          })),
        }
      : null,
  };
  return article;
}

/* ---- the five one-off pages ---- */

export async function getContactPage() {
  const d = await db();
  const slug = "contact";
  const form = one(d.contact_form ?? [], slug);
  const heading = headingFor(d, slug, "form");
  return {
    ...(await getPageMeta(slug)),
    hero: heroFor(d, slug),
    info: bySlug(d.contact_info ?? [], slug).map((r) => ({
      label: str(r.label),
      href: nullable(r.href),
      value: nullable(r.value),
      note: nullable(r.note),
    })),
    formEyebrow: str(heading.eyebrow),
    formTitle: heading.title,
    formSubtitle: str(heading.subtitle),
    formSuccess: str(form?.success_message),
    subjectOptions: (d.contact_subject_options ?? []).map((r) => ({
      value: str(r.value),
      label: str(r.label),
    })),
    faq: { ...headingFor(d, slug, "faq"), entries: faqFor(d, slug) },
  };
}

export async function getBlogPage() {
  const d = await db();
  const slug = "blog";
  const cover = one(d.blog_cover ?? [], slug);
  return {
    ...(await getPageMeta(slug)),
    hero: heroFor(d, slug),
    featuredIntro: headingFor(d, slug, "featured").title,
    cover: {
      href: str(cover?.href),
      flag: str(cover?.flag),
      path: str(cover?.path),
      alt: str(cover?.alt),
      meta: str(cover?.meta),
      title: str(cover?.title),
      excerpt: str(cover?.excerpt),
      ctaLabel: str(cover?.cta_label),
    },
    filterHead: headingFor(d, slug, "filters").title,
    filters: (d.blog_filters ?? []).map((r) => ({ value: str(r.value), label: str(r.label) })),
    articlesIntro: headingFor(d, slug, "articles").title,
    cards: bySlug(d.article_cards ?? [], slug).map((r) => ({
      href: str(r.href),
      date: nullable(r.date_label),
      badge: nullable(r.badge),
      path: nullable(r.path),
      alt: str(r.alt),
      title: nullable(r.title),
      description: nullable(r.description),
      ctaLabel: str(r.cta_label),
      category: nullable(r.category) ?? undefined,
    })),
  };
}

export async function getEventsPage() {
  const d = await db();
  const slug = "events";
  const featured = one(d.event_featured ?? [], slug);
  const fh = headingFor(d, slug, "featured");
  const lh = headingFor(d, slug, "list");
  return {
    ...(await getPageMeta(slug)),
    hero: heroFor(d, slug),
    featured: {
      eyebrow: str(fh.eyebrow),
      badge: str(featured?.badge),
      path: str(featured?.path),
      alt: str(featured?.alt),
      title: fh.title,
      subtitle: str(fh.subtitle),
      paragraphs: (d.event_featured_paragraphs ?? []).map((r) => str(r.body)),
      stats: (d.event_featured_stats ?? []).map((r) => ({
        label: str(r.label),
        value: str(r.value),
      })),
      ctaHref: str(featured?.cta_href),
      ctaLabel: str(featured?.cta_label),
    },
    listEyebrow: str(lh.eyebrow),
    listTitle: lh.title,
    listSubtitle: lh.subtitle,
    cards: bySlug(d.article_cards ?? [], slug).map((r) => ({
      href: str(r.href),
      date: nullable(r.date_label),
      badge: nullable(r.badge),
      path: nullable(r.path),
      alt: str(r.alt),
      title: nullable(r.title),
      description: nullable(r.description),
      ctaLabel: str(r.cta_label),
    })),
    faq: { ...headingFor(d, slug, "faq"), entries: faqFor(d, slug) },
  };
}

export async function getAboutPage() {
  const d = await db();
  const slug = "a-propos";
  const hero = one(d.about_hero ?? [], slug);
  const story = one(d.about_story ?? [], slug);
  const close = one(d.about_close ?? [], slug);
  const storyHeading = headingFor(d, slug, "story");
  return {
    ...(await getPageMeta(slug)),
    hero: {
      eyebrow: str(hero?.eyebrow),
      titleLines: Array.isArray(hero?.title_lines) ? (hero.title_lines as string[]) : [],
      tag: str(hero?.tag),
      lead: str(hero?.lead),
      backgrounds: bySlug(d.about_hero_backgrounds ?? [], slug).map((r) => ({
        theme: str(r.theme),
        path: str(r.path),
        alt: str(r.alt),
        focal: nullable(r.focal),
      })),
      scrollLabel: str(hero?.scroll_label),
    },
    story: {
      image: {
        path: str(story?.image_path),
        alt: str(story?.image_alt),
        focal: nullable(story?.image_focal),
      },
      eyebrow: str(storyHeading.eyebrow),
      title: storyHeading.title,
      paragraphs: (d.about_story_paragraphs ?? []).map((r) => r.spans as Span[]),
    },
    figures: (d.about_figures ?? []).map((r) => ({ value: str(r.value), label: str(r.label) })),
    process: {
      ...headingFor(d, slug, "process"),
      steps: bySlug(d.process_steps ?? [], slug).map((r) => ({
        num: str(r.num),
        title: str(r.title),
        description: str(r.description),
      })),
    },
    strip: (d.about_strip ?? []).map((r) => ({ path: str(r.path), alt: str(r.alt) })),
    close: { quote: str(close?.quote), name: str(close?.name) },
    cta: ctaLinksFor(d, slug),
  };
}

export async function getGiftPage() {
  const d = await db();
  const slug = "carte-cadeau";
  const intro = one(d.gift_intro ?? [], slug);
  const form = one(d.gift_form ?? [], slug);
  return {
    ...(await getPageMeta(slug)),
    hero: heroFor(d, slug),
    intro: { ...headingFor(d, slug, "intro"), lead: (intro?.lead ?? []) as Span[] },
    steps: (d.gift_steps ?? []).map((r) => str(r.label)),
    packages: (d.gift_packages ?? []).map((r) => ({
      value: str(r.value),
      price: str(r.price),
      checked: r.is_default === true,
      title: str(r.title),
      description: str(r.description),
    })),
    deliveries: (d.gift_deliveries ?? []).map((r) => ({
      value: str(r.value),
      checked: r.is_default === true,
      title: str(r.title),
      description: str(r.description),
      price: str(r.price),
    })),
    submitLabel: str(form?.submit_label),
    formSuccess: str(form?.success_message),
    cardLabels: { brand: str(form?.card_brand), caption: str(form?.card_caption) },
    faq: { ...headingFor(d, slug, "faq"), entries: faqFor(d, slug) },
  };
}
