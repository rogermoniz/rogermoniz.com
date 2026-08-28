/**
 * The content model. Every page renders one of these shapes, which is what
 * lets 21 routes share three templates, and what the database schema mirrors.
 */

export type CloudinaryImage = {
  /** Cloudinary public path, e.g. "v1779962864/OPPLR_2026_Marion_7_wmt1q9.webp" */
  path: string;
  alt: string;
  /** Focal point under object-fit: cover, e.g. "50% 25%". */
  focal?: string;
  focalMobile?: string;
};

export type Eyebrow = string;

export type SectionHeading = {
  eyebrow?: Eyebrow | null;
  title: string;
  subtitle?: string | null;
};

export type FaqEntry = {
  question: string;
  answer: string;
};

export type Review = {
  name: string;
  date: string;
  avatar: CloudinaryImage;
  stars: number;
  text: string;
};

export type PrestationTeaser = {
  index: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  image: CloudinaryImage;
};

export type MarqueeColumn = {
  speed: "up" | "down" | "up-slow" | "down-slow";
  images: readonly CloudinaryImage[];
};

export type HomePage = {
  hero: {
    eyebrow: Eyebrow;
    title: string;
    /** Some pages set only a title. */
    subtitle: string | null;
    /** In The Box crops its hero squares; every other page uses 3 / 4. */
    imageAspect: string;
    columns: readonly MarqueeColumn[];
  };
  welcome: {
    eyebrow: Eyebrow;
    title: string;
    subtitle: string;
    paragraphs: readonly string[];
    image: CloudinaryImage;
  };
  prestations: {
    heading: SectionHeading;
    slides: readonly PrestationTeaser[];
  };
  reviews: {
    heading: SectionHeading;
    items: readonly Review[];
  };
  faq: {
    heading: SectionHeading;
    entries: readonly FaqEntry[];
  };
  cta: {
    label: string;
    href: string;
  };
};

/* ==========================================================================
   PRESTATION TEMPLATE
   Eight pages share this shape. Where they genuinely differ, the difference
   is a variant on the data, never a forked component.
   ========================================================================== */

export type ProcessStep = {
  num: string;
  title: string;
  description: string;
};

/** The In The Box cards preview the montage as a grid of cases. */
export type BoxGrid = {
  columns: number;
  cells: number;
  /** Zero based indexes of the cells that span 2x2. */
  large: readonly number[];
};

export type PricingCard = {
  featured: boolean;
  boxGrid?: BoxGrid | null;
  tag: string | null;
  badge: string | null;
  title: string;
  description: string;
  price: string;
  features: readonly string[];
  ctaLabel: string;
  ctaHref: string;
};

/** Priced pages list formulas; bespoke pages invite a quote instead. */
export type PricingBlock =
  | ({
      kind: "cards";
      cards: readonly PricingCard[];
      /** Copy above the grid, and the small print below it. */
      intro?: readonly string[];
      footnote?: readonly string[];
    } & SectionHeading)
  | ({ kind: "quote"; lead: string[]; ctaLabel: string; ctaHref: string } & SectionHeading);

export type BentoSpan = "span-1x1" | "span-1x2" | "span-2x1" | "span-2x2";

export type GalleryItem = {
  span: BentoSpan | null;
  image: CloudinaryImage;
};

/** Most pages use the bento mosaic; In The Box shows a plain trio. */
export type PortfolioBlock = { kind: "bento" | "trio"; items: GalleryItem[] } & SectionHeading;

/** The split layout pairs prose with a 2x2 grid; stacked runs full width. */
export type VisionBlock = {
  kind: "split" | "stacked";
  eyebrow: Eyebrow;
  heading: string;
  paragraphs: readonly string[];
  images: readonly CloudinaryImage[];
};

export type CtaLink = {
  href: string;
  label: string;
  variant: "outline" | "solid";
};

export type PrestationPage = {
  slug: string;
  metaTitle: string;
  /** Shown by the preloader while the page settles. */
  preloaderLabel: string;
  hero: HomePage["hero"];
  vision: VisionBlock;
  process: SectionHeading & { steps: ProcessStep[] };
  pricing: PricingBlock;
  portfolio: PortfolioBlock;
  /** Six of the eight pages introduce the call to action with a heading. */
  ctaHeading?: { title: string; subtitle: string | null };
  /** Some also carry one or two lead paragraphs above the buttons. */
  ctaLead?: readonly string[];
  cta: readonly CtaLink[];
};

/* ==========================================================================
   RICH EDITORIAL CONTENT
   Prose modelled as typed blocks and inline runs, so an article is data the
   components render, never a string of HTML handed to the DOM.
   ========================================================================== */

export type Span =
  | string
  | { text: string; bold?: boolean; italic?: boolean; code?: boolean; href?: string }
  | { break: boolean };

export type ContentBlock =
  | { type: "heading"; level: number; text: string; variant?: string | null }
  | { type: "paragraph"; spans: readonly Span[]; variant?: string | null }
  | { type: "list"; ordered: boolean; items: readonly (readonly Span[])[] }
  | { type: "quote"; spans: readonly Span[] }
  | {
      type: "figure";
      variant: string;
      path: string | null;
      alt: string;
      caption?: string;
      captionSub?: string;
      num?: string;
    }
  | { type: "figureGroup"; variant: string; figures: readonly ContentBlock[] }
  | { type: "note"; blocks: readonly ContentBlock[] }
  | { type: "group"; blocks: readonly ContentBlock[] }
  | { type: "duo"; columns: readonly ContentSection[] };

export type ContentSection = {
  id: string | null;
  variant?: string | null;
  blocks: readonly ContentBlock[];
};

export type TocEntry = { href: string; label: string };

export type ArticleHeroData = {
  category: string | null;
  date: string | null;
  readingTime: string | null;
  title: string | null;
  path: string | null;
  alt: string;
  scrollLabel: string;
};

type EditorialShared = {
  route?: string;
  metaTitle?: string;
  preloaderLabel: string | null;
  toc: readonly TocEntry[];
  sections: readonly ContentSection[];
};

/** A blog post or event write up: pinned photographic hero, sidebar, CTA. */
export type ArticlePageData = EditorialShared & {
  kind: "article";
  hero: ArticleHeroData;
  meta: {
    blocks: readonly { label: string; value: string }[];
    shareLabel: string | null;
  };
  cta: {
    title: string | null;
    lead: string | null;
    links: readonly CtaLink[];
  } | null;
  readNext: {
    title: string | null;
    cards: readonly {
      href: string | null;
      badge: string | null;
      path: string | null;
      alt: string;
      title: string | null;
      description: string | null;
    }[];
  } | null;
};

/** CGV, privacy and legal notice: the marquee hero and a long prose column. */
export type LegalPageData = EditorialShared & {
  kind: "legal";
  hero: HomePage["hero"];
  backLabel: string;
};

export type EditorialPage = ArticlePageData | LegalPageData;

export type FaqBlock = SectionHeading & { entries: readonly FaqEntry[] };

/** The five pages that share no template with any other. */
export type UniquePage = Record<string, unknown> & {
  metaTitle?: string;
  preloaderLabel: string | null;
};
