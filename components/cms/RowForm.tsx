"use client";

import { useActionState } from "react";
import { saveRow, type ActionResult } from "@/lib/cms/actions";
import { fieldChoices, fieldHint, fieldLabel } from "@/lib/cms/labels";
import type { EditableField } from "@/lib/cms/read";
import { BlocksField } from "@/components/cms/BlocksField";
import { ImageField } from "@/components/cms/ImageField";

const CONTROL =
  "w-full rounded-lg border border-edge bg-surface px-4 py-3 font-body text-[0.95rem] text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_4px_rgb(216_171_82_/_0.1)]";

function initial(
  field: EditableField,
  row: Record<string, unknown> | null,
): string {
  const value = row?.[field.name];
  if (value === null || value === undefined) return "";
  if (
    field.control === "spans" ||
    field.control === "blocks" ||
    field.control === "json"
  ) {
    return JSON.stringify(value, null, 2);
  }
  if (field.kind === "list")
    return Array.isArray(value) ? value.join("\n") : String(value);
  return String(value);
}

export function RowForm({
  table,
  fields,
  row,
  match,
  filters,
  library,
  canUpload,
  submitLabel = "Enregistrer",
  columns = 1,
}: {
  table: string;
  fields: readonly EditableField[];
  row: Record<string, unknown> | null;
  /** Empty for a new row; the editor then inserts instead of updating. */
  match: Record<string, string>;
  /** Columns forced onto the row, so a new entry lands on the right page. */
  filters: Record<string, string>;
  library: readonly string[];
  canUpload: boolean;
  submitLabel?: string;
  columns?: 1 | 2;
}) {
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(saveRow, null);
  const main = fields.filter((field) => !field.advanced);
  const advanced = fields.filter((field) => field.advanced);

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="__table" value={table} />
      <input type="hidden" name="__match" value={JSON.stringify(match)} />
      <input type="hidden" name="__filters" value={JSON.stringify(filters)} />

      <FieldGrid
        table={table}
        fields={main}
        row={row}
        library={library}
        canUpload={canUpload}
        columns={columns}
      />

      {advanced.length ? (
        <details className="rounded-xl border border-edge px-5 py-4">
          <summary className="cursor-pointer list-none font-display text-[0.62rem] font-bold tracking-[1px] text-muted uppercase transition-colors duration-200 hover:text-accent [&::-webkit-details-marker]:hidden">
            Options avancées
          </summary>
          <div className="pt-5">
            <FieldGrid
              table={table}
              fields={advanced}
              row={row}
              library={library}
              canUpload={canUpload}
              columns={columns}
            />
          </div>
        </details>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="tactile rounded-[100px] px-6 py-2.5 font-display text-[0.65rem] font-bold tracking-[1px] uppercase disabled:opacity-60"
        >
          {pending ? "Enregistrement…" : submitLabel}
        </button>
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
  );
}

function FieldGrid({
  table,
  fields,
  row,
  library,
  canUpload,
  columns,
}: {
  table: string;
  fields: readonly EditableField[];
  row: Record<string, unknown> | null;
  library: readonly string[];
  canUpload: boolean;
  columns: 1 | 2;
}) {
  return (
    <div
      className={
        columns === 2
          ? "grid grid-cols-2 gap-5 max-md:grid-cols-1"
          : "flex flex-col gap-5"
      }
    >
      {fields.map((field) => {
        const value = initial(field, row);
        const label = fieldLabel(table, field.name);
        const hint = fieldHint(table, field.name);
        const choices = fieldChoices(table, field.name);
        const wide =
          field.control === "longtext" ||
          field.control === "blocks" ||
          field.control === "spans" ||
          field.control === "json" ||
          field.control === "image";

        return (
          <div
            key={field.name}
            className={`flex flex-col gap-2 ${columns === 2 && wide ? "col-span-2 max-md:col-span-1" : ""}`}
          >
            <label
              htmlFor={`${table}-${field.name}`}
              className="text-sm font-semibold text-ink"
            >
              {label}
              {field.required ? (
                <span className="ml-1 text-accent">*</span>
              ) : null}
            </label>
            {hint ? <p className="-mt-1 text-xs text-muted">{hint}</p> : null}

            {field.control === "blocks" ? (
              <BlocksField
                name={field.name}
                defaultValue={value}
                library={library}
                canUpload={canUpload}
              />
            ) : field.control === "image" ? (
              <ImageField
                name={field.name}
                defaultValue={value}
                required={field.required}
                library={library}
                canUpload={canUpload}
              />
            ) : field.control === "boolean" ? (
              <input
                id={`${table}-${field.name}`}
                name={field.name}
                type="checkbox"
                defaultChecked={value === "true"}
                className="size-5 accent-[var(--theme-accent)]"
              />
            ) : field.control === "choice" ? (
              <select
                id={`${table}-${field.name}`}
                name={field.name}
                defaultValue={value}
                required={field.required}
                className={CONTROL}
              >
                {field.required ? null : <option value="">Aucun</option>}
                {(choices ?? []).map((choice) => (
                  <option key={choice} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
            ) : field.control === "number" ? (
              <input
                id={`${table}-${field.name}`}
                name={field.name}
                type="number"
                defaultValue={value}
                required={field.required}
                className={CONTROL}
              />
            ) : field.control === "url" ? (
              <input
                id={`${table}-${field.name}`}
                name={field.name}
                type="text"
                defaultValue={value}
                required={field.required}
                placeholder="/contact"
                className={CONTROL}
              />
            ) : field.control === "longtext" || field.control === "list" ? (
              <textarea
                id={`${table}-${field.name}`}
                name={field.name}
                defaultValue={value}
                required={field.required}
                rows={field.control === "list" ? 3 : 5}
                className={`${CONTROL} resize-y`}
              />
            ) : field.control === "spans" || field.control === "json" ? (
              <textarea
                id={`${table}-${field.name}`}
                name={field.name}
                defaultValue={value}
                required={field.required}
                rows={6}
                spellCheck={false}
                className={`${CONTROL} resize-y font-mono text-xs`}
              />
            ) : (
              <input
                id={`${table}-${field.name}`}
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
    </div>
  );
}
