"use client";

import { useState } from "react";
import { ImageField } from "@/components/cms/ImageField";

/**
 * An article body is a list of typed blocks. Most are plain prose, so those
 * are edited as text; anything carrying links, emphasis or a nested layout
 * keeps its exact structure and is edited as data, never silently flattened.
 */

type Block = Record<string, unknown> & { type?: string };

const CONTROL =
  "w-full rounded-lg border border-edge bg-surface px-4 py-3 font-body text-[0.95rem] text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_4px_rgb(216_171_82_/_0.1)]";

const CHIP =
  "rounded-full border border-edge px-3 py-1 font-display text-[0.6rem] font-bold tracking-[1px] uppercase transition-colors duration-200 hover:border-accent hover:text-accent disabled:opacity-40";

const NAMES: Record<string, string> = {
  heading: "Titre",
  paragraph: "Paragraphe",
  quote: "Citation",
  list: "Liste",
  figure: "Image",
  figureGroup: "Groupe d'images",
  note: "Encadré",
  group: "Groupe",
  duo: "Deux colonnes",
};

function isPlain(spans: unknown): spans is string[] {
  return Array.isArray(spans) && spans.every((s) => typeof s === "string");
}

function plainList(items: unknown): items is string[][] {
  return Array.isArray(items) && items.every(isPlain);
}

function parse(value: string): Block[] {
  try {
    const parsed: unknown = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? (parsed as Block[]) : [];
  } catch {
    return [];
  }
}

function label(block: Block, index: number): string {
  const name = NAMES[String(block.type)] ?? String(block.type ?? "bloc");
  return `${String(index + 1).padStart(2, "0")} · ${name}`;
}

export function BlocksField({
  name,
  defaultValue,
  library,
  canUpload,
}: {
  name: string;
  defaultValue: string;
  library: readonly string[];
  canUpload: boolean;
}) {
  const [blocks, setBlocks] = useState<Block[]>(() => parse(defaultValue));
  const [raw, setRaw] = useState(false);
  const [text, setText] = useState(defaultValue);

  function update(index: number, patch: Block) {
    setBlocks((current) => current.map((block, i) => (i === index ? { ...block, ...patch } : block)));
  }

  /** The code editor hands back a whole block, so stale keys cannot linger. */
  function replace(index: number, block: Block) {
    setBlocks((current) => current.map((existing, i) => (i === index ? block : existing)));
  }

  function move(index: number, delta: number) {
    setBlocks((current) => {
      const next = [...current];
      const target = index + delta;
      const a = next[index];
      const b = next[target];
      if (!a || !b) return current;
      next[index] = b;
      next[target] = a;
      return next;
    });
  }

  function remove(index: number) {
    setBlocks((current) => current.filter((_, i) => i !== index));
  }

  function append(block: Block) {
    setBlocks((current) => [...current, block]);
  }

  const serialised = raw ? text : JSON.stringify(blocks, null, 2);

  return (
    <div className="flex flex-col gap-4">
      <input type="hidden" name={name} value={serialised} />

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={CHIP} onClick={() => append({ type: "heading", level: 2, text: "" })}>
          Ajouter un titre
        </button>
        <button type="button" className={CHIP} onClick={() => append({ type: "paragraph", spans: [""] })}>
          Ajouter un paragraphe
        </button>
        <button
          type="button"
          className={CHIP}
          onClick={() => append({ type: "figure", variant: "", path: "", alt: "" })}
        >
          Ajouter une image
        </button>
        <button type="button" className={CHIP} onClick={() => append({ type: "list", ordered: false, items: [[""]] })}>
          Ajouter une liste
        </button>
        <button
          type="button"
          className={`${CHIP} ml-auto`}
          onClick={() => {
            if (!raw) setText(JSON.stringify(blocks, null, 2));
            else setBlocks(parse(text));
            setRaw((open) => !open);
          }}
        >
          {raw ? "Revenir à l'édition" : "Voir le code"}
        </button>
      </div>

      {raw ? (
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={24}
          spellCheck={false}
          className={`${CONTROL} resize-y font-mono text-xs`}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {blocks.map((block, index) => (
            <li key={index} className="rounded-xl border border-edge px-4 py-4">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="mr-auto font-display text-[0.6rem] font-bold tracking-[1px] text-muted uppercase">
                  {label(block, index)}
                </span>
                <button type="button" className={CHIP} disabled={index === 0} onClick={() => move(index, -1)}>
                  Monter
                </button>
                <button
                  type="button"
                  className={CHIP}
                  disabled={index === blocks.length - 1}
                  onClick={() => move(index, 1)}
                >
                  Descendre
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-xs text-muted transition-colors duration-200 hover:text-danger"
                >
                  Supprimer
                </button>
              </div>
              <BlockBody
                block={block}
                onChange={(patch) => update(index, patch)}
                onReplace={(next) => replace(index, next)}
                library={library}
                canUpload={canUpload}
              />
            </li>
          ))}
        </ul>
      )}

      {!raw && blocks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-edge px-5 py-8 text-center text-sm text-muted">
          Aucun bloc. Ajoutez un titre ou un paragraphe pour commencer.
        </p>
      ) : null}
    </div>
  );
}

function Field({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="mb-3 flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-ink">{title}</span>
      {children}
    </div>
  );
}

function BlockBody({
  block,
  onChange,
  onReplace,
  library,
  canUpload,
}: {
  block: Block;
  onChange: (patch: Block) => void;
  onReplace: (block: Block) => void;
  library: readonly string[];
  canUpload: boolean;
}) {
  if (block.type === "heading") {
    return (
      <>
        <Field title="Texte">
          <input
            type="text"
            value={String(block.text ?? "")}
            onChange={(event) => onChange({ text: event.target.value })}
            className={CONTROL}
          />
        </Field>
        <Field title="Niveau">
          <select
            value={String(block.level ?? 2)}
            onChange={(event) => onChange({ level: Number(event.target.value) })}
            className={CONTROL}
          >
            {[2, 3, 4].map((level) => (
              <option key={level} value={level}>
                Titre {level - 1}
              </option>
            ))}
          </select>
        </Field>
      </>
    );
  }

  if ((block.type === "paragraph" || block.type === "quote") && isPlain(block.spans)) {
    return (
      <Field title="Texte">
        <textarea
          value={block.spans.join("")}
          onChange={(event) => onChange({ spans: [event.target.value] })}
          rows={5}
          className={`${CONTROL} resize-y`}
        />
      </Field>
    );
  }

  if (block.type === "list" && plainList(block.items)) {
    return (
      <Field title="Une ligne par entrée">
        <textarea
          value={block.items.map((item) => item.join("")).join("\n")}
          onChange={(event) =>
            onChange({
              items: event.target.value
                .split("\n")
                .filter((line) => line.trim())
                .map((line) => [line]),
            })
          }
          rows={5}
          className={`${CONTROL} resize-y`}
        />
      </Field>
    );
  }

  if (block.type === "figure") {
    return (
      <>
        <Field title="Image">
          <ImageField
            name=""
            defaultValue={String(block.path ?? "")}
            required={false}
            library={library}
            canUpload={canUpload}
            onChange={(path) => onChange({ path })}
          />
        </Field>
        <Field title="Texte alternatif">
          <input
            type="text"
            value={String(block.alt ?? "")}
            onChange={(event) => onChange({ alt: event.target.value })}
            className={CONTROL}
          />
        </Field>
        <Field title="Légende">
          <input
            type="text"
            value={String(block.caption ?? "")}
            onChange={(event) => onChange({ caption: event.target.value })}
            className={CONTROL}
          />
        </Field>
      </>
    );
  }

  return <AdvancedBlock block={block} onReplace={onReplace} />;
}

/** Links, emphasis and nested layouts survive untouched as their own data. */
function AdvancedBlock({ block, onReplace }: { block: Block; onReplace: (block: Block) => void }) {
  const [text, setText] = useState(() => JSON.stringify(block, null, 2));
  const [error, setError] = useState<string | null>(null);

  return (
    <Field title="Ce bloc contient une mise en forme, il se modifie sous forme de code">
      <textarea
        value={text}
        rows={10}
        spellCheck={false}
        onChange={(event) => {
          setText(event.target.value);
          try {
            onReplace(JSON.parse(event.target.value) as Block);
            setError(null);
          } catch {
            setError("Format invalide, la dernière version correcte est conservée.");
          }
        }}
        className={`${CONTROL} resize-y font-mono text-xs`}
      />
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </Field>
  );
}
