/**
 * What each page is made of, in the order a visitor scrolls through it.
 *
 * The editor is organised around this, not around the database, so the person
 * writing the site moves down the same sections they see on screen.
 */

export type ChildPanel = {
  table: string;
  /** Column on the child holding the parent row id. */
  foreignKey: string;
  title: string;
  noun: string;
};

export type Panel =
  /** Exactly one row belongs to the page. */
  | {
      form: "single";
      table: string;
      sectionKey?: string;
      title?: string;
      /** Columns of a shared table that this page kind does not render. */
      omit?: readonly string[];
    }
  /** An ordered list the editor can add to, reorder and trim. */
  | {
      form: "rows";
      table: string;
      title: string;
      noun: string;
      child?: ChildPanel;
      /** Rows of one shared table split across sections, e.g. hero columns. */
      where?: { column: string; value: string };
    };

export type Section = { key: string; label: string; hint?: string; panels: Panel[] };
export type Blueprint = { sections: Section[] };

const heading = (sectionKey: string, title = "Titre de la section"): Panel => ({
  form: "single",
  table: "section_headings",
  sectionKey,
  title,
});

/**
 * The four marquee columns, left to right on the page.
 *
 * They live in one table separated by `speed`, so listing them together
 * interleaved four columns into a single numbered list where "image 2" meant
 * nothing. One panel per column matches what the visitor sees, and it scopes
 * adding, reordering and renumbering to the column being edited.
 */
const MARQUEE_COLUMNS = [
  { speed: "up", title: "Colonne 1" },
  { speed: "down", title: "Colonne 2" },
  { speed: "up-slow", title: "Colonne 3" },
  { speed: "down-slow", title: "Colonne 4" },
] as const;

const HERO: Section = {
  key: "hero",
  label: "Bandeau d'accueil",
  hint: "Le grand titre et les colonnes d'images qui défilent en haut de la page.",
  panels: [
    { form: "single", table: "hero_marquee", title: "Titres" },
    ...MARQUEE_COLUMNS.map(
      (column): Panel => ({
        form: "rows",
        table: "hero_marquee_images",
        title: `Images qui défilent : ${column.title}`,
        noun: "image",
        where: { column: "speed", value: column.speed },
      }),
    ),
  ],
};

/**
 * Shared by prestations and articles, which do not render the same fields:
 * an article draws its lead from cta_lead_paragraphs and ignores the
 * subtitle, so offering that column there loses whatever is typed into it.
 */
const CTA = (omit: readonly string[] = []): Section => ({
  key: "cta",
  label: "Appel à l'action",
  hint: "Le bloc de fin de page qui invite à prendre contact.",
  panels: [
    { form: "single", table: "cta_blocks", title: "Titre", omit },
    { form: "rows", table: "cta_lead_paragraphs", title: "Paragraphes", noun: "paragraphe" },
    { form: "rows", table: "cta_links", title: "Boutons", noun: "bouton" },
  ],
});

const FAQ = (): Section => ({
  key: "faq",
  label: "Questions fréquentes",
  panels: [heading("faq"), { form: "rows", table: "faq_entries", title: "Questions", noun: "question" }],
});

const HOME: Blueprint = {
  sections: [
    HERO,
    {
      key: "welcome",
      label: "Bienvenue",
      panels: [
        heading("welcome"),
        { form: "single", table: "home_welcome", title: "Image" },
        { form: "rows", table: "home_welcome_paragraphs", title: "Paragraphes", noun: "paragraphe" },
      ],
    },
    {
      key: "prestations",
      label: "Les prestations",
      hint: "Le carrousel qui présente chaque prestation.",
      panels: [
        heading("prestations"),
        { form: "rows", table: "prestation_teasers", title: "Prestations", noun: "prestation" },
      ],
    },
    {
      key: "reviews",
      label: "Avis clients",
      panels: [heading("reviews"), { form: "rows", table: "reviews", title: "Avis", noun: "avis" }],
    },
    FAQ(),
    { key: "cta", label: "Appel à l'action", panels: [{ form: "rows", table: "cta_links", title: "Boutons", noun: "bouton" }] },
  ],
};

const PRESTATION: Blueprint = {
  sections: [
    HERO,
    {
      key: "vision",
      label: "La vision",
      hint: "Le texte de présentation et ses images.",
      panels: [
        { form: "single", table: "vision_blocks", title: "Réglages" },
        { form: "rows", table: "vision_paragraphs", title: "Paragraphes", noun: "paragraphe" },
        { form: "rows", table: "vision_images", title: "Images", noun: "image" },
      ],
    },
    {
      key: "process",
      label: "Le déroulé",
      panels: [heading("process"), { form: "rows", table: "process_steps", title: "Étapes", noun: "étape" }],
    },
    {
      key: "pricing",
      label: "Les tarifs",
      hint: "Chaque formule porte sa propre liste de prestations incluses.",
      panels: [
        heading("pricing"),
        { form: "single", table: "pricing_blocks", title: "Réglages" },
        {
          form: "rows",
          table: "pricing_cards",
          title: "Formules",
          noun: "formule",
          child: { table: "pricing_features", foreignKey: "card_id", title: "Inclus dans la formule", noun: "ligne" },
        },
        { form: "rows", table: "pricing_notes", title: "Textes autour des formules", noun: "texte" },
      ],
    },
    {
      key: "portfolio",
      label: "La galerie",
      panels: [heading("portfolio"), { form: "rows", table: "gallery_items", title: "Photos", noun: "photo" }],
    },
    CTA(),
  ],
};

const ARTICLE: Blueprint = {
  sections: [
    {
      key: "hero",
      label: "Bandeau d'accueil",
      panels: [{ form: "single", table: "article_hero", title: "Titre et image" }],
    },
    {
      key: "meta",
      label: "Informations de l'article",
      panels: [{ form: "rows", table: "article_meta", title: "Informations", noun: "information" }],
    },
    { key: "toc", label: "Sommaire", panels: [{ form: "rows", table: "toc_entries", title: "Entrées", noun: "entrée" }] },
    {
      key: "content",
      label: "Le contenu",
      hint: "Chaque bloc est une partie de l'article. Le champ Contenu décrit sa structure.",
      panels: [{ form: "rows", table: "rich_sections", title: "Parties", noun: "partie" }],
    },
    CTA(["subtitle"]),
    {
      key: "read_next",
      label: "À lire aussi",
      panels: [heading("read_next"), { form: "rows", table: "read_next_cards", title: "Cartes", noun: "carte" }],
    },
  ],
};

const LEGAL: Blueprint = {
  sections: [
    HERO,
    {
      key: "content",
      label: "Le contenu",
      panels: [{ form: "rows", table: "rich_sections", title: "Parties", noun: "partie" }],
    },
  ],
};

const CONTACT: Blueprint = {
  sections: [
    HERO,
    {
      key: "info",
      label: "Coordonnées",
      panels: [{ form: "rows", table: "contact_info", title: "Blocs", noun: "bloc" }],
    },
    {
      key: "form",
      label: "Formulaire",
      panels: [
        heading("form"),
        { form: "single", table: "contact_form", title: "Réglages" },
        { form: "rows", table: "contact_subject_options", title: "Sujets proposés", noun: "sujet" },
      ],
    },
    FAQ(),
  ],
};

const BLOG: Blueprint = {
  sections: [
    HERO,
    {
      key: "featured",
      label: "Article à la une",
      panels: [heading("featured"), { form: "single", table: "blog_cover", title: "L'article mis en avant" }],
    },
    {
      key: "articles",
      label: "Tous les articles",
      panels: [
        heading("articles"),
        { form: "rows", table: "article_cards", title: "Cartes", noun: "carte" },
      ],
    },
    {
      key: "filters",
      label: "Filtres",
      panels: [heading("filters"), { form: "rows", table: "blog_filters", title: "Filtres", noun: "filtre" }],
    },
  ],
};

const EVENTS: Blueprint = {
  sections: [
    HERO,
    {
      key: "featured",
      label: "Événement à la une",
      panels: [
        heading("featured"),
        { form: "single", table: "event_featured", title: "L'événement mis en avant" },
        { form: "rows", table: "event_featured_paragraphs", title: "Paragraphes", noun: "paragraphe" },
        { form: "rows", table: "event_featured_stats", title: "Informations", noun: "information" },
      ],
    },
    {
      key: "list",
      label: "Tous les événements",
      panels: [heading("list"), { form: "rows", table: "article_cards", title: "Cartes", noun: "carte" }],
    },
    FAQ(),
  ],
};

const ABOUT: Blueprint = {
  sections: [
    {
      key: "hero",
      label: "Bandeau d'accueil",
      panels: [
        { form: "single", table: "about_hero", title: "Titre" },
        { form: "rows", table: "about_hero_backgrounds", title: "Images de fond", noun: "image" },
      ],
    },
    {
      key: "story",
      label: "Le récit",
      panels: [
        heading("story"),
        { form: "single", table: "about_story", title: "Image" },
        { form: "rows", table: "about_story_paragraphs", title: "Paragraphes", noun: "paragraphe" },
      ],
    },
    { key: "figures", label: "Les chiffres", panels: [{ form: "rows", table: "about_figures", title: "Chiffres", noun: "chiffre" }] },
    {
      key: "process",
      label: "Le déroulé",
      panels: [heading("process"), { form: "rows", table: "process_steps", title: "Étapes", noun: "étape" }],
    },
    { key: "strip", label: "Le bandeau d'images", panels: [{ form: "rows", table: "about_strip", title: "Images", noun: "image" }] },
    { key: "close", label: "La citation de fin", panels: [{ form: "single", table: "about_close", title: "Citation" }] },
    { key: "cta", label: "Appel à l'action", panels: [{ form: "rows", table: "cta_links", title: "Boutons", noun: "bouton" }] },
  ],
};

const GIFT: Blueprint = {
  sections: [
    HERO,
    {
      key: "intro",
      label: "Introduction",
      panels: [heading("intro"), { form: "single", table: "gift_intro", title: "Chapeau" }],
    },
    {
      key: "builder",
      label: "Le configurateur",
      hint: "Les formules, les modes de remise et les textes du formulaire.",
      panels: [
        { form: "rows", table: "gift_steps", title: "Étapes affichées", noun: "étape" },
        { form: "rows", table: "gift_packages", title: "Formules", noun: "formule" },
        { form: "rows", table: "gift_deliveries", title: "Remise du cadeau", noun: "option" },
        { form: "single", table: "gift_form", title: "Textes du formulaire" },
      ],
    },
    FAQ(),
  ],
};

const BY_SLUG: Record<string, Blueprint> = {
  contact: CONTACT,
  blog: BLOG,
  events: EVENTS,
  "a-propos": ABOUT,
  "carte-cadeau": GIFT,
};

const BY_KIND: Record<string, Blueprint> = {
  home: HOME,
  prestation: PRESTATION,
  article: ARTICLE,
  legal: LEGAL,
  standalone: CONTACT,
};

export function blueprintFor(slug: string, kind: string): Blueprint {
  return BY_SLUG[slug] ?? BY_KIND[kind] ?? { sections: [] };
}

/* -------------------------------------------------------------------------- */

export type Category = {
  key: string;
  label: string;
  hint: string;
  kinds: readonly string[];
  /** Only these kinds can gain a new page from the editor. */
  addable: boolean;
};

export const CATEGORIES: readonly Category[] = [
  { key: "home", label: "Accueil", hint: "La page d'ouverture du site.", kinds: ["home"], addable: false },
  {
    key: "prestation",
    label: "Prestations",
    hint: "Une page par type de séance, toutes bâties sur le même modèle.",
    kinds: ["prestation"],
    addable: true,
  },
  {
    key: "article",
    label: "Articles et événements",
    hint: "Le blog et les événements, même modèle de lecture.",
    kinds: ["article"],
    addable: true,
  },
  {
    key: "standalone",
    label: "Pages du site",
    hint: "Contact, blog, événements, à propos et carte cadeau.",
    kinds: ["standalone"],
    addable: false,
  },
  { key: "legal", label: "Pages légales", hint: "Mentions, conditions et confidentialité.", kinds: ["legal"], addable: true },
];

/** Global content that belongs to the whole site rather than to one page. */
export type GlobalPanel = {
  table: string;
  label: string;
  noun: string;
  form: "single" | "rows";
  /** A table holding several independent lists, one panel each. */
  groups?: readonly { title: string; where: { column: string; value: string } }[];
};

export const GLOBAL_PANELS: readonly GlobalPanel[] = [
  { table: "site_settings", label: "Coordonnées du studio", noun: "réglage", form: "single" },
  {
    table: "nav_items",
    label: "Menu de navigation",
    noun: "lien",
    form: "rows",
    groups: [
      { title: "Menu principal", where: { column: "group_key", value: "primary" } },
      { title: "Prestations", where: { column: "group_key", value: "prestations" } },
      { title: "Mentions légales", where: { column: "group_key", value: "legal" } },
    ],
  },
  { table: "footer_images", label: "Images du pied de page", noun: "image", form: "rows" },
];
