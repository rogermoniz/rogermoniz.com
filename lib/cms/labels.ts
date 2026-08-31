/**
 * Human labels for the editor.
 *
 * The database column name is an implementation detail; nobody editing the site
 * should have to read `date_label` and infer what it fills. Labels are keyed by
 * column, with a `table.column` override where one word means two things.
 */

export type ControlKind =
  | "text"
  | "longtext"
  | "number"
  | "boolean"
  | "image"
  | "url"
  | "choice"
  | "spans"
  | "blocks"
  | "list"
  | "json";

/** Columns the editor manages itself: order, keys and foreign keys. */
export const HIDDEN_COLUMNS = new Set([
  "id",
  "position",
  "page_slug",
  "card_id",
  "section_key",
]);

const BY_COLUMN: Record<string, string> = {
  alt: "Texte alternatif",
  anchor: "Ancre",
  answer: "Réponse",
  avatar_alt: "Texte alternatif de la photo",
  avatar_path: "Photo de profil",
  badge: "Pastille",
  blocks: "Contenu",
  body: "Texte",
  box_grid_cells: "Grille : nombre de cases",
  box_grid_columns: "Grille : colonnes",
  box_grid_large: "Grille : grandes cases",
  card_brand: "Nom sur la carte",
  columns: "Images par ligne",
  card_caption: "Légende de la carte",
  category: "Catégorie",
  cta_href: "Lien du bouton",
  cta_label: "Texte du bouton",
  date_label: "Date affichée",
  published_at: "Date de publication",
  description: "Description",
  email: "Adresse email",
  excerpt: "Accroche",
  eyebrow: "Surtitre",
  featured: "Mise en avant",
  flag: "Étiquette",
  focal: "Cadrage",
  group_key: "Emplacement",
  heading: "Titre",
  href: "Lien",
  image_alt: "Texte alternatif de l'image",
  image_aspect: "Format des images",
  image_focal: "Cadrage de l'image",
  image_path: "Image",
  index_label: "Numéro",
  instagram: "Instagram",
  is_default: "Sélectionné par défaut",
  kind: "Variante",
  label: "Intitulé",
  lead: "Chapeau",
  location: "Ville",
  logo_path: "Logo",
  meta: "Informations",
  meta_title: "Titre pour Google",
  name: "Nom",
  note: "Précision",
  num: "Numéro",
  parent_label: "Rattaché à",
  path: "Image",
  phone: "Téléphone (composé)",
  phone_display: "Téléphone (affiché)",
  placement: "Emplacement",
  preloader_label: "Texte du chargement",
  price: "Prix",
  question: "Question",
  quote: "Citation",
  reading_time: "Temps de lecture",
  route: "Adresse de la page",
  scroll_label: "Texte du défilement",
  share_label: "Texte du partage",
  slug: "Identifiant",
  sort_order: "Ordre dans la liste",
  template: "Mise en page",
  span: "Taille dans la mosaïque",
  spans: "Texte enrichi",
  speed: "Colonne",
  stars: "Nombre d'étoiles",
  submit_label: "Texte du bouton d'envoi",
  subtitle: "Texte sous le titre",
  success_message: "Message de confirmation",
  tag: "Mention",
  theme: "Thème",
  title: "Titre",
  title_lines: "Titre (une ligne par entrée)",
  value: "Valeur",
  variant: "Style",
};

const BY_TABLE_COLUMN: Record<string, string> = {
  "about_close.name": "Signature",
  "about_figures.label": "Ce que le chiffre désigne",
  "about_figures.value": "Chiffre",
  "about_hero.tag": "Mention sous le titre",
  "article_meta.label": "Intitulé",
  "article_meta.value": "Contenu",
  "blog_cover.meta": "Date et durée de lecture",
  "blog_filters.label": "Texte du filtre",
  "blog_filters.value": "Catégorie filtrée",
  "contact_info.value": "Contenu affiché",
  "contact_subject_options.label": "Texte affiché",
  "contact_subject_options.value": "Valeur envoyée",
  "event_featured_stats.label": "Intitulé",
  "event_featured_stats.value": "Contenu",
  "gift_deliveries.value": "Identifiant de l'option",
  "gift_packages.value": "Identifiant de la formule",
  "nav_items.label": "Texte du menu",
  "pages.kind": "Type de page",
  "pricing_blocks.kind": "Présentation des tarifs",
  "reviews.name": "Nom du client",
  "reviews.quote": "Avis",
  "site_settings.name": "Nom du studio",
  "vision_blocks.kind": "Mise en page",
};

const HINTS: Record<string, string> = {
  "about_hero_backgrounds.theme": "clair ou sombre",
  "blog_cover.flag": "petite étiquette au dessus de l'image",
  "gallery_items.span": "laisser vide pour une case standard",
  "hero_marquee.image_aspect": "3 / 4 partout, 1 / 1 sur In The Box",
  "hero_marquee_images.speed": "détermine dans quelle colonne l'image défile",
  "pages.route": "commence par une barre oblique, par exemple /portrait",
  "pages.slug": "sert d'identifiant interne, sans barre oblique au début",
  "pricing_cards.box_grid_large": "indices des cases doublées, séparés par des virgules",
  "pricing_notes.placement": "au dessus ou en dessous des formules",
  "rich_sections.blocks": "structure du contenu de l'article, à modifier avec précaution",
  "pages.sort_order": "position de la page dans cet écran, pas sur le site",
  "pages.published_at":
    "Au format 2026-08-31. Elle décide de l'ordre des articles sur le blog et sur les events, du plus récent au plus ancien, et de celui qui est mis en avant tout en haut.",
  "pages.template": "standard pour un article de lecture, feature pour un dossier illustré",
  "site_settings.phone": "format international, utilisé par le lien d'appel",
};

const CHOICES: Record<string, readonly string[]> = {
  "about_hero_backgrounds.theme": ["light", "dark"],
  "cta_links.variant": ["outline", "solid"],
  "gallery_items.kind": ["bento", "trio"],
  "gallery_items.span": ["span-1x1", "span-1x2", "span-2x1", "span-2x2"],
  "hero_marquee_images.speed": ["up", "down", "up-slow", "down-slow"],
  "nav_items.group_key": ["primary", "secondary", "footer"],
  "pages.kind": ["home", "prestation", "article", "legal", "standalone"],
  "pages.template": ["standard", "feature"],
  "pricing_blocks.kind": ["cards", "quote"],
  "pricing_notes.placement": ["intro", "footnote"],
  "vision_blocks.kind": ["split", "stacked"],
};

/** Where the generic rule would give a field the wrong control. */
const CONTROL_OVERRIDES: Record<string, ControlKind> = {
  "pricing_features.body": "text",
  "gift_steps.label": "text",
  "pricing_notes.body": "longtext",
};

const IMAGE_COLUMNS = new Set(["path", "image_path", "avatar_path", "logo_path"]);
const URL_COLUMNS = new Set(["href", "cta_href"]);
const LONG_COLUMNS = new Set(["answer", "body", "description", "quote", "excerpt", "note", "lead"]);

/**
 * Fields that matter to the layout but not to the person writing the page.
 * They stay editable, just folded away so the common case reads cleanly.
 */
const ADVANCED = new Set([
  "anchor",
  "box_grid_cells",
  "box_grid_columns",
  "box_grid_large",
  "focal",
  "image_aspect",
  "image_focal",
  "scroll_label",
  "share_label",
  "sort_order",
  "span",
  "speed",
  "theme",
  "variant",
]);

export function isAdvanced(column: string): boolean {
  return ADVANCED.has(column);
}

export function fieldLabel(table: string, column: string): string {
  return BY_TABLE_COLUMN[`${table}.${column}`] ?? BY_COLUMN[column] ?? column.replace(/_/g, " ");
}

export function fieldHint(table: string, column: string): string | null {
  return HINTS[`${table}.${column}`] ?? null;
}

export function fieldChoices(table: string, column: string): readonly string[] | null {
  return CHOICES[`${table}.${column}`] ?? null;
}

/** Refines the generated kind into something the editor can render properly. */
export function controlKind(
  table: string,
  column: string,
  generated: "text" | "longtext" | "number" | "boolean" | "json" | "list",
): ControlKind {
  const override = CONTROL_OVERRIDES[`${table}.${column}`];
  if (override) return override;
  if (fieldChoices(table, column)) return "choice";
  if (IMAGE_COLUMNS.has(column)) return "image";
  if (URL_COLUMNS.has(column)) return "url";
  if (column === "blocks") return "blocks";
  if (column === "spans" || (column === "lead" && generated === "json")) return "spans";
  if (generated === "json") return "json";
  if (generated === "list") return "list";
  if (generated === "text" && LONG_COLUMNS.has(column)) return "longtext";
  return generated;
}
