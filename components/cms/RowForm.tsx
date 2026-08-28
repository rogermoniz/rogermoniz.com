"use client";

import Link from "next/link";
import { useActionState } from "react";
import { deleteRow, saveRow, type ActionResult } from "@/lib/cms/actions";
import type { Field, TableSpec } from "@/lib/cms/schema";

const CONTROL =
  "w-full rounded-lg border border-edge bg-surface px-4 py-3 font-body text-[0.95rem] text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_4px_rgb(216_171_82_/_0.1)]";

/** Turns a column name into something readable: date_label → Date label. */
function humanise(name: string): string {
  const words = name.replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function initial(field: Field, row: Record<string, unknown> | null): string {
  const value = row?.[field.name];
  if (value === null || value === undefined) return "";
  if (field.kind === "json") return JSON.stringify(value, null, 2);
  if (field.kind === "list") return Array.isArray(value) ? value.join("\n") : String(value);
  return String(value);
}

export function RowForm({
  spec,
  row,
  id,
}: {
  spec: TableSpec;
  row: Record<string, unknown> | null;
  id: string | null;
}) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(saveRow, null);

  return (
    <>
      <form action={action} className="flex flex-col gap-6">
        <input type="hidden" name="__table" value={spec.name} />
        <input type="hidden" name="__id" value={id ?? ""} />

        {spec.fields.map((field) => {
          const value = initial(field, row);
          const locked = field.readOnly || (id !== null && field.name === spec.primaryKey);

          if (locked) {
            return value ? (
              <div key={field.name} className="flex items-baseline gap-3 text-xs text-muted">
                <span className="font-semibold">{humanise(field.name)}</span>
                <span className="truncate">{value}</span>
              </div>
            ) : null;
          }

          return (
            <div key={field.name} className="flex flex-col gap-2">
              <label htmlFor={field.name} className="text-sm font-semibold text-ink">
                {humanise(field.name)}
                {field.required ? <span className="ml-1 text-accent">*</span> : null}
                {field.kind === "list" ? (
                  <span className="ml-2 font-normal text-muted">une valeur par ligne</span>
                ) : null}
              </label>

              {field.kind === "boolean" ? (
                <input
                  id={field.name}
                  name={field.name}
                  type="checkbox"
                  defaultChecked={value === "true"}
                  className="size-5 accent-[var(--theme-accent)]"
                />
              ) : field.kind === "number" ? (
                <input
                  id={field.name}
                  name={field.name}
                  type="number"
                  defaultValue={value}
                  required={field.required}
                  className={CONTROL}
                />
              ) : field.kind === "longtext" || field.kind === "json" || field.kind === "list" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  defaultValue={value}
                  required={field.required}
                  rows={field.kind === "json" ? 14 : 5}
                  spellCheck={field.kind !== "json"}
                  className={`${CONTROL} resize-y ${field.kind === "json" ? "font-mono text-xs" : ""}`}
                />
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  defaultValue={value}
                  required={field.required}
                  className={CONTROL}
                />
              )}
            </div>
          );
        })}

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="tactile rounded-[100px] px-6 py-3 font-display text-xs font-bold tracking-[0.05em] uppercase disabled:opacity-60"
          >
            {pending ? "Enregistrement…" : "Enregistrer"}
          </button>
          <Link href={`/admin/${spec.name}`} className="text-sm text-muted hover:text-accent">
            Annuler
          </Link>

          {state ? (
            <span
              role="status"
              className={`text-sm ${state.ok ? "text-muted" : "text-danger"}`}
            >
              {state.message}
            </span>
          ) : null}
        </div>
      </form>

      {id ? (
        <form action={deleteRow} className="mt-12 border-t border-edge pt-6">
          <input type="hidden" name="__table" value={spec.name} />
          <input type="hidden" name="__id" value={id} />
          <button type="submit" className="text-xs text-muted transition-colors hover:text-danger">
            Supprimer cette entrée
          </button>
        </form>
      ) : null}
    </>
  );
}
