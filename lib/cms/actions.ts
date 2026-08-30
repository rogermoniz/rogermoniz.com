"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkPassword, isSignedIn, SESSION_COOKIE, sessionToken } from "@/lib/cms/auth";
import { TABLE_BY_NAME } from "@/lib/cms/schema";
import { hasColumn, idColumn, orderColumns } from "@/lib/cms/read";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type ActionResult = { ok: boolean; message: string };

export async function signIn(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const password = String(form.get("password") ?? "");
  if (!(await checkPassword(password))) {
    return { ok: false, message: "Mot de passe incorrect." };
  }
  const jar = await cookies();
  jar.set(SESSION_COOKIE, await sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  redirect(String(form.get("next") || "/admin"));
}

export async function signOut() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/** Every write goes through here, and every write checks the session first. */
async function guard() {
  if (!(await isSignedIn())) throw new Error("Not signed in.");
}

/** Publishing is what makes an edit visible: the site is static between saves. */
function publish() {
  revalidatePath("/", "layout");
}

function parseJsonField(name: string, raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`Le champ « ${name} » n'est pas au bon format.`);
  }
}

function coerce(table: string, form: FormData): Record<string, unknown> {
  const spec = TABLE_BY_NAME.get(table);
  if (!spec) throw new Error(`Unknown table ${table}`);
  const row: Record<string, unknown> = {};

  for (const field of spec.fields) {
    if (field.readOnly) continue;
    if (!form.has(field.name)) {
      // An unticked checkbox sends nothing, so absent means false.
      if (field.kind === "boolean") row[field.name] = false;
      continue;
    }
    const raw = String(form.get(field.name) ?? "");

    if (field.kind === "boolean") {
      row[field.name] = raw === "on" || raw === "true";
    } else if (field.kind === "number") {
      row[field.name] = raw.trim() === "" ? null : Number(raw);
    } else if (field.kind === "json") {
      row[field.name] = raw.trim() === "" ? null : parseJsonField(field.name, raw);
    } else if (field.kind === "list") {
      row[field.name] = raw
        .split(/[\n,]/)
        .map((v) => v.trim())
        .filter(Boolean);
    } else {
      row[field.name] = raw === "" && !field.required ? null : raw;
    }
  }
  return row;
}

function readMatch(form: FormData): Record<string, string> {
  const raw = String(form.get("__match") ?? "");
  if (!raw) return {};
  return JSON.parse(raw) as Record<string, string>;
}

function readFilters(form: FormData): Record<string, string> {
  const raw = String(form.get("__filters") ?? "");
  if (!raw) return {};
  return JSON.parse(raw) as Record<string, string>;
}

function scoped(table: string, match: Record<string, string>) {
  let query = supabaseAdmin.from(table).select("*");
  for (const [column, value] of Object.entries(match)) query = query.eq(column, value);
  return query;
}

async function nextPosition(table: string, filters: Record<string, string>): Promise<number> {
  if (!hasColumn(table, "position")) return 0;
  const { data } = await scoped(table, filters).order("position", { ascending: false }).limit(1);
  const top = (data ?? [])[0] as Record<string, unknown> | undefined;
  return typeof top?.position === "number" ? top.position + 1 : 0;
}

/* -------------------------------------------------------------------------- */

/**
 * Saves one row. A row with no match is new, which is what lets the same form
 * serve a singleton that does not exist yet and an entry being added to a list.
 */
export async function saveRow(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  await guard();
  const table = String(form.get("__table"));
  const match = readMatch(form);
  const filters = readFilters(form);

  try {
    const row = { ...coerce(table, form), ...filters };
    if (Object.keys(match).length) {
      let query = supabaseAdmin.from(table).update(row);
      for (const [column, value] of Object.entries(match)) query = query.eq(column, value);
      const { error } = await query;
      if (error) return { ok: false, message: error.message };
    } else {
      if (hasColumn(table, "position") && row.position === undefined) {
        row.position = await nextPosition(table, filters);
      }
      const { error } = await supabaseAdmin.from(table).insert(row);
      if (error) return { ok: false, message: error.message };
    }
  } catch (cause) {
    return { ok: false, message: cause instanceof Error ? cause.message : "Enregistrement impossible." };
  }

  publish();
  return { ok: true, message: "Enregistré. Le site est à jour." };
}

/** Adds an empty entry to a list, so the editor never types a row from nothing. */
export async function addRow(form: FormData) {
  await guard();
  const table = String(form.get("__table"));
  const filters = readFilters(form);
  const spec = TABLE_BY_NAME.get(table);
  if (!spec) throw new Error(`Unknown table ${table}`);

  const row: Record<string, unknown> = { ...filters };
  if (hasColumn(table, "position")) row.position = await nextPosition(table, filters);

  // Fill in whatever the database insists on, so the insert cannot fail.
  for (const field of spec.fields) {
    if (field.readOnly || row[field.name] !== undefined || !field.required) continue;
    if (field.kind === "number") row[field.name] = 0;
    else if (field.kind === "boolean") row[field.name] = false;
    else if (field.kind === "json") row[field.name] = [];
    else if (field.kind === "list") row[field.name] = [];
    else row[field.name] = DEFAULT_TEXT[`${table}.${field.name}`] ?? "";
  }

  const { error } = await supabaseAdmin.from(table).insert(row);
  if (error) throw new Error(`${table}: ${error.message}`);
  publish();
}

/** Values a check constraint will not let us leave blank. */
const DEFAULT_TEXT: Record<string, string> = {
  "gallery_items.kind": "bento",
  "vision_blocks.kind": "split",
  "pricing_blocks.kind": "cards",
  "cta_links.variant": "outline",
  "hero_marquee_images.speed": "up",
  "about_hero_backgrounds.theme": "light",
  "pricing_notes.placement": "footnote",
  "nav_items.group_key": "primary",
};

export async function deleteRowAction(form: FormData) {
  await guard();
  const table = String(form.get("__table"));
  const match = readMatch(form);
  if (!Object.keys(match).length) throw new Error("Nothing to delete.");

  let query = supabaseAdmin.from(table).delete();
  for (const [column, value] of Object.entries(match)) query = query.eq(column, value);
  const { error } = await query;
  if (error) throw new Error(`${table}: ${error.message}`);
  publish();
}

/** Swaps a row with its neighbour, which is all reordering needs to be. */
export async function moveRow(form: FormData) {
  await guard();
  const table = String(form.get("__table"));
  const direction = String(form.get("__direction")) === "up" ? -1 : 1;
  const match = readMatch(form);
  const filters = readFilters(form);
  const key = idColumn(table);

  // The same total order the editor is reading, so index arithmetic here and
  // the list on screen can never disagree.
  let query = scoped(table, filters);
  for (const column of orderColumns(table)) query = query.order(column);
  const { data, error } = await query;
  if (error) throw new Error(`${table}: ${error.message}`);
  const rows = (data ?? []) as Record<string, unknown>[];

  const index = rows.findIndex((r) => String(r[key]) === String(match[key]));
  const a = rows[index];
  const b = rows[index + direction];
  if (!a || !b) return;

  if (a.position === b.position) {
    // Equal positions make a swap a no-op, so renumber the whole list from the
    // order on screen with the two entries exchanged.
    const ordered = [...rows];
    ordered[index] = b;
    ordered[index + direction] = a;
    for (const [at, row] of ordered.entries()) {
      await supabaseAdmin.from(table).update({ position: at }).eq(key, String(row[key]));
    }
  } else {
    await supabaseAdmin.from(table).update({ position: b.position }).eq(key, String(a[key]));
    await supabaseAdmin.from(table).update({ position: a.position }).eq(key, String(b[key]));
  }
  publish();
}

/* -------------------------------------------------------------------------- */

const SCAFFOLD: Record<string, (slug: string) => { table: string; row: Record<string, unknown> }[]> = {
  prestation: (slug) => [
    { table: "hero_marquee", row: { page_slug: slug, title: "", image_aspect: "3 / 4" } },
    { table: "vision_blocks", row: { page_slug: slug, kind: "split" } },
    { table: "pricing_blocks", row: { page_slug: slug, kind: "cards" } },
    { table: "section_headings", row: { page_slug: slug, section_key: "process" } },
    { table: "section_headings", row: { page_slug: slug, section_key: "pricing" } },
    { table: "section_headings", row: { page_slug: slug, section_key: "portfolio" } },
    { table: "cta_blocks", row: { page_slug: slug } },
  ],
  article: (slug) => [
    { table: "article_hero", row: { page_slug: slug } },
    {
      table: "rich_sections",
      row: {
        page_slug: slug,
        position: 0,
        blocks: [
          { type: "heading", level: 2, text: "" },
          { type: "paragraph", spans: [""] },
        ],
      },
    },
    { table: "section_headings", row: { page_slug: slug, section_key: "read_next" } },
    { table: "section_headings", row: { page_slug: slug, section_key: "related" } },
    { table: "cta_blocks", row: { page_slug: slug } },
  ],
  legal: (slug) => [{ table: "hero_marquee", row: { page_slug: slug, title: "", image_aspect: "3 / 4" } }],
};

const SLUG_PATTERN = /^[a-z0-9]+(?:[-/][a-z0-9]+)*$/;

export async function createPage(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  await guard();
  const kind = String(form.get("kind") ?? "");
  const slug = String(form.get("slug") ?? "").trim().toLowerCase();
  const title = String(form.get("meta_title") ?? "").trim();

  if (!SCAFFOLD[kind]) return { ok: false, message: "Ce type de page ne peut pas être créé ici." };
  if (!SLUG_PATTERN.test(slug)) {
    return { ok: false, message: "L'identifiant ne peut contenir que des lettres minuscules, des chiffres et des tirets." };
  }
  if (!title) return { ok: false, message: "Le titre pour Google est obligatoire." };

  const route = `/${slug}`;
  const { data: existing } = await supabaseAdmin
    .from("pages")
    .select("slug")
    .or(`slug.eq.${slug},route.eq.${route}`)
    .limit(1);
  if ((existing ?? []).length) return { ok: false, message: "Une page utilise déjà cette adresse." };

  const { data: last } = await supabaseAdmin
    .from("pages")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  const sortOrder = (((last ?? [])[0] as { sort_order?: number } | undefined)?.sort_order ?? 0) + 1;

  const { error } = await supabaseAdmin.from("pages").insert({
    slug,
    route,
    kind,
    meta_title: title,
    preloader_label: String(form.get("preloader_label") ?? "").trim() || null,
    sort_order: sortOrder,
    // Nothing goes live by being created. The editor publishes it when it is ready.
    status: "draft",
  });
  if (error) return { ok: false, message: error.message };

  for (const { table, row } of SCAFFOLD[kind](slug)) {
    const { error: scaffoldError } = await supabaseAdmin.from(table).insert(row);
    if (scaffoldError) return { ok: false, message: `${table}: ${scaffoldError.message}` };
  }

  publish();
  redirect(`/admin/pages/${slug.split("/").map(encodeURIComponent).join("/")}`);
}

/**
 * Deleting a page removes its content too, because every content table
 * references `pages (slug) on delete cascade`.
 */
export async function deletePage(form: FormData) {
  await guard();
  const slug = String(form.get("slug"));
  const { data } = await supabaseAdmin.from("pages").select("kind").eq("slug", slug).maybeSingle();
  const kind = (data as { kind?: string } | null)?.kind;
  if (kind === "home" || kind === "standalone") {
    throw new Error("Cette page fait partie de la structure du site et ne peut pas être supprimée.");
  }
  const { error } = await supabaseAdmin.from("pages").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
  publish();
  redirect("/admin");
}

/**
 * Publishing is a separate act from saving, so work in progress can be written
 * down, looked at and left alone until it is ready.
 */
export async function setPageStatus(form: FormData) {
  await guard();
  const slug = String(form.get("slug"));
  const status = String(form.get("status"));
  if (status !== "draft" && status !== "published") throw new Error("Statut inconnu.");

  const { error } = await supabaseAdmin.from("pages").update({ status }).eq("slug", slug);
  if (error) throw new Error(error.message);
  publish();
}

export async function republish(): Promise<ActionResult> {
  await guard();
  publish();
  return { ok: true, message: "Site republié." };
}
