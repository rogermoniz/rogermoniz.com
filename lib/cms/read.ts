import "server-only";
import { TABLE_BY_NAME, type TableSpec } from "@/lib/cms/schema";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type Row = Record<string, unknown>;

function sortColumn(spec: TableSpec): string {
  const names = new Set(spec.fields.map((f) => f.name));
  for (const candidate of ["page_slug", "position", "sort_order", "group_key"]) {
    if (names.has(candidate)) return candidate;
  }
  return spec.primaryKey;
}

export async function listRows(table: string): Promise<Row[]> {
  const spec = TABLE_BY_NAME.get(table);
  if (!spec) throw new Error(`Unknown table ${table}`);
  const first = sortColumn(spec);
  const names = new Set(spec.fields.map((f) => f.name));

  let query = supabaseAdmin.from(table).select("*").order(first);
  if (first !== "position" && names.has("position")) query = query.order("position");
  const { data, error } = await query;
  if (error) throw new Error(`${table}: ${error.message}`);
  return (data ?? []) as Row[];
}

export async function getRow(table: string, id: string): Promise<Row | null> {
  const spec = TABLE_BY_NAME.get(table);
  if (!spec) throw new Error(`Unknown table ${table}`);
  const { data, error } = await supabaseAdmin
    .from(table)
    .select("*")
    .eq(spec.primaryKey, id)
    .maybeSingle();
  if (error) throw new Error(`${table}: ${error.message}`);
  return (data ?? null) as Row | null;
}

export async function countRows(table: string): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) return 0;
  return count ?? 0;
}

/** A short human label for a row, so lists are readable without opening each one. */
export function summarise(spec: TableSpec, row: Row): string {
  const preferred = ["title", "label", "question", "name", "heading", "value", "body", "quote", "slug"];
  for (const key of preferred) {
    const v = row[key];
    if (typeof v === "string" && v.trim()) return v.length > 80 ? `${v.slice(0, 80)}…` : v;
  }
  for (const field of spec.fields) {
    const v = row[field.name];
    if (field.kind !== "json" && typeof v === "string" && v.trim()) {
      return v.length > 80 ? `${v.slice(0, 80)}…` : v;
    }
  }
  return `#${String(row[spec.primaryKey] ?? "")}`;
}
