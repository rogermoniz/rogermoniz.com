"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkPassword, isSignedIn, SESSION_COOKIE, sessionToken } from "@/lib/cms/auth";
import { TABLE_BY_NAME } from "@/lib/cms/schema";
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

function coerce(table: string, form: FormData) {
  const spec = TABLE_BY_NAME.get(table);
  if (!spec) throw new Error(`Unknown table ${table}`);
  const row: Record<string, unknown> = {};

  for (const field of spec.fields) {
    if (field.readOnly) continue;
    if (!form.has(field.name)) continue;
    const raw = String(form.get(field.name) ?? "");

    if (field.kind === "boolean") {
      row[field.name] = raw === "on" || raw === "true";
    } else if (field.kind === "number") {
      row[field.name] = raw.trim() === "" ? null : Number(raw);
    } else if (field.kind === "json") {
      row[field.name] = raw.trim() === "" ? null : JSON.parse(raw);
    } else if (field.kind === "list") {
      row[field.name] = raw.trim() === ""
        ? []
        : raw.split("\n").map((v) => v.trim()).filter(Boolean);
    } else {
      row[field.name] = raw === "" && !field.required ? null : raw;
    }
  }
  // Checkboxes send nothing when unticked, so absent means false.
  for (const field of spec.fields) {
    if (field.kind === "boolean" && !field.readOnly && !form.has(field.name)) {
      row[field.name] = false;
    }
  }
  return { spec, row };
}

export async function saveRow(
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  await guard();
  const table = String(form.get("__table"));
  const id = String(form.get("__id") ?? "");
  const { spec, row } = coerce(table, form);

  try {
    if (id) {
      const { error } = await supabaseAdmin.from(table).update(row).eq(spec.primaryKey, id);
      if (error) return { ok: false, message: error.message };
    } else {
      const { error } = await supabaseAdmin.from(table).insert(row);
      if (error) return { ok: false, message: error.message };
    }
  } catch (cause) {
    return { ok: false, message: cause instanceof Error ? cause.message : "Enregistrement impossible." };
  }

  // The site is static with a 10 minute window; publishing pushes it live now.
  revalidatePath("/", "layout");
  return { ok: true, message: "Enregistré. Le site est à jour." };
}

export async function deleteRow(form: FormData) {
  await guard();
  const table = String(form.get("__table"));
  const id = String(form.get("__id"));
  const spec = TABLE_BY_NAME.get(table);
  if (!spec) throw new Error(`Unknown table ${table}`);

  await supabaseAdmin.from(table).delete().eq(spec.primaryKey, id);
  revalidatePath("/", "layout");
  redirect(`/admin/${table}`);
}

export async function republish(): Promise<ActionResult> {
  await guard();
  revalidatePath("/", "layout");
  return { ok: true, message: "Site republié." };
}
