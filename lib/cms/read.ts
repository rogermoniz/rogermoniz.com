import "server-only";
import { TABLE_BY_NAME, type Field, type TableSpec } from "@/lib/cms/schema";
import { HIDDEN_COLUMNS, controlKind, isAdvanced, type ControlKind } from "@/lib/cms/labels";
import { blueprintFor, type Panel, type Section } from "@/lib/cms/blueprint";
import { normalisePath } from "@/lib/cms/cloudinary";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type Row = Record<string, unknown>;

/** section_headings is the one table keyed by a pair rather than an id. */
const KEY_COLUMNS: Record<string, readonly string[]> = {
  section_headings: ["page_slug", "section_key"],
};

export function keyColumns(table: string): readonly string[] {
  const spec = TABLE_BY_NAME.get(table);
  if (!spec) throw new Error(`Unknown table ${table}`);
  return KEY_COLUMNS[table] ?? [spec.primaryKey];
}

/** The column a row is addressed by; composite keys still lead with this one. */
export function idColumn(table: string): string {
  const [first] = keyColumns(table);
  if (!first) throw new Error(`No key column for ${table}`);
  return first;
}

export function hasColumn(table: string, column: string): boolean {
  return TABLE_BY_NAME.get(table)?.fields.some((f) => f.name === column) ?? false;
}

/** A table without page_slug holds content for the whole site, not one page. */
export function isPageScoped(table: string): boolean {
  return hasColumn(table, "page_slug");
}

export type EditableField = Field & { control: ControlKind; advanced: boolean };

export function editableFields(table: string, extraHidden: readonly string[] = []): EditableField[] {
  const spec = TABLE_BY_NAME.get(table);
  if (!spec) throw new Error(`Unknown table ${table}`);
  const hidden = new Set([...HIDDEN_COLUMNS, ...extraHidden]);
  return spec.fields
    .filter((f) => !f.readOnly && !hidden.has(f.name))
    .map((f) => ({ ...f, control: controlKind(table, f.name, f.kind), advanced: isAdvanced(f.name) }));
}

/* -------------------------------------------------------------------------- */

/**
 * The order a list is read in, as a total order.
 *
 * `position` is only unique inside a group, so a table split across groups
 * (hero images per column, nav links per menu) ties on it. Postgres is free to
 * break a tie however it likes, and an UPDATE moves the row it rewrote to the
 * end of the heap, which is why editing an entry used to make it jump down the
 * list. Ending on the key columns makes the order total, so it never moves.
 */
export function orderColumns(table: string): string[] {
  const lead = hasColumn(table, "position")
    ? "position"
    : hasColumn(table, "sort_order")
      ? "sort_order"
      : null;
  return [...(lead ? [lead] : []), ...keyColumns(table)];
}

async function select(table: string, filters: Record<string, string>): Promise<Row[]> {
  let query = supabaseAdmin.from(table).select("*");
  for (const [column, value] of Object.entries(filters)) query = query.eq(column, value);
  for (const column of orderColumns(table)) query = query.order(column);
  const { data, error } = await query;
  if (error) throw new Error(`${table}: ${error.message}`);
  return (data ?? []) as Row[];
}

export type LoadedPanel =
  | {
      form: "single";
      table: string;
      title: string;
      row: Row | null;
      filters: Record<string, string>;
      omit: readonly string[];
    }
  | {
      form: "rows";
      table: string;
      title: string;
      noun: string;
      rows: Row[];
      filters: Record<string, string>;
      child: ChildRows | null;
    };

type ChildRows = {
  table: string;
  foreignKey: string;
  title: string;
  noun: string;
  rowsById: Record<string, Row[]>;
};

export type LoadedSection = { key: string; label: string; hint: string | null; panels: LoadedPanel[] };

function filtersFor(panel: Panel, slug: string): Record<string, string> {
  const filters: Record<string, string> = {};
  if (isPageScoped(panel.table)) filters.page_slug = slug;
  if (panel.form === "single" && panel.sectionKey) filters.section_key = panel.sectionKey;
  if (panel.form === "rows" && panel.where) filters[panel.where.column] = panel.where.value;
  return filters;
}

async function loadPanel(panel: Panel, slug: string): Promise<LoadedPanel> {
  const filters = filtersFor(panel, slug);
  const rows = await select(panel.table, filters);

  if (panel.form === "single") {
    return {
      form: "single",
      table: panel.table,
      title: panel.title ?? "",
      row: rows[0] ?? null,
      filters,
      omit: panel.omit ?? [],
    };
  }

  let child: ChildRows | null = null;
  if (panel.child) {
    const ids = rows.map((r) => String(r[idColumn(panel.table)]));
    const { data, error } = await supabaseAdmin
      .from(panel.child.table)
      .select("*")
      .in(panel.child.foreignKey, ids)
      .order("position");
    if (error) throw new Error(`${panel.child.table}: ${error.message}`);
    const rowsById: Record<string, Row[]> = Object.fromEntries(ids.map((id) => [id, []]));
    for (const row of (data ?? []) as Row[]) {
      const key = String(row[panel.child.foreignKey]);
      const bucket = (rowsById[key] ??= []);
      bucket.push(row);
    }
    child = { ...panel.child, rowsById };
  }

  return { form: "rows", table: panel.table, title: panel.title, noun: panel.noun, rows, filters, child };
}

export async function loadSections(slug: string, sections: readonly Section[]): Promise<LoadedSection[]> {
  return Promise.all(
    sections.map(async (section) => ({
      key: section.key,
      label: section.label,
      hint: section.hint ?? null,
      panels: await Promise.all(section.panels.map((panel) => loadPanel(panel, slug))),
    })),
  );
}

export type PageRow = {
  slug: string;
  route: string;
  kind: string;
  /** "draft" until it is published; older rows predate the column. */
  status?: string;
  meta_title: string;
  preloader_label: string | null;
  sort_order: number;
};

/** Titles are written for Google, so the studio suffix is noise in a list. */
export function pageName(page: { meta_title: string; slug: string }): string {
  const [head] = page.meta_title.split("|");
  return (head ?? "").trim() || page.slug;
}

export async function listPages(): Promise<PageRow[]> {
  const { data, error } = await supabaseAdmin.from("pages").select("*").order("sort_order");
  if (error) throw new Error(`pages: ${error.message}`);
  return (data ?? []) as PageRow[];
}

export async function getPage(slug: string): Promise<PageRow | null> {
  const { data, error } = await supabaseAdmin.from("pages").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`pages: ${error.message}`);
  return (data ?? null) as PageRow | null;
}

export async function loadPage(slug: string) {
  const page = await getPage(slug);
  if (!page) return null;
  const blueprint = blueprintFor(slug, page.kind);
  return { page, sections: await loadSections(slug, blueprint.sections) };
}

/** Global content: one panel per table, with no page filter. */
export async function loadGlobalPanel(
  table: string,
  form: "single" | "rows",
  filters: Record<string, string> = {},
): Promise<LoadedPanel> {
  const rows = await select(table, filters);
  if (form === "single") return { form: "single", table, title: "", row: rows[0] ?? null, filters, omit: [] };
  return { form: "rows", table, title: "", noun: "élément", rows, filters, child: null };
}

/**
 * Every Cloudinary path already used on the site, so images can be reused.
 *
 * Reduced to the stored form and deduplicated: some rows were written as a
 * full delivery link and some as the bare path, and offering both meant the
 * same photograph appeared twice in the picker, once in a form that would not
 * render where it was being placed.
 */
export async function knownImages(): Promise<string[]> {
  const columns: [string, string][] = [
    ["footer_images", "path"], ["hero_marquee_images", "path"], ["gallery_items", "path"],
    ["vision_images", "path"], ["prestation_teasers", "path"], ["about_strip", "path"],
    ["about_hero_backgrounds", "path"], ["article_cards", "path"],
    ["blog_cover", "path"], ["event_featured", "path"], ["reviews", "avatar_path"],
    ["home_welcome", "image_path"], ["about_story", "image_path"], ["article_hero", "image_path"],
    ["site_settings", "logo_path"],
  ];
  const found = await Promise.all(
    columns.map(async ([table, column]) => {
      const { data } = await supabaseAdmin.from(table).select(column);
      return ((data ?? []) as unknown as Row[])
        .map((r) => r[column])
        .filter((v): v is string => typeof v === "string" && v !== "");
    }),
  );
  return [...new Set(found.flat().map(normalisePath))].sort();
}

/** A short human label for a row, so a collapsed list stays readable. */
export function summarise(spec: TableSpec, row: Row): string {
  const preferred = ["title", "label", "question", "name", "heading", "value", "body", "quote", "alt", "href"];
  for (const key of preferred) {
    const v = row[key];
    if (typeof v === "string" && v.trim()) return v.length > 70 ? `${v.slice(0, 70)}…` : v;
  }
  for (const field of spec.fields) {
    if (HIDDEN_COLUMNS.has(field.name)) continue;
    const v = row[field.name];
    if (field.kind === "text" && typeof v === "string" && v.trim()) {
      return v.length > 70 ? `${v.slice(0, 70)}…` : v;
    }
  }
  return "À compléter";
}
