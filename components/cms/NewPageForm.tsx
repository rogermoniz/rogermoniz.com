"use client";

import { useActionState } from "react";
import { createPage, type ActionResult } from "@/lib/cms/actions";

const CONTROL =
  "w-full rounded-lg border border-edge bg-surface px-4 py-3 font-body text-[0.95rem] text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_4px_rgb(216_171_82_/_0.1)]";

export function NewPageForm({ kind }: { kind: string }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(createPage, null);

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="kind" value={kind} />

      <div className="flex flex-col gap-2">
        <label htmlFor="slug" className="text-sm font-semibold text-ink">
          Adresse de la page <span className="text-accent">*</span>
        </label>
        <p className="-mt-1 text-xs text-muted">
          Lettres minuscules et tirets. « noel » donne l'adresse /noel.
        </p>
        <input id="slug" name="slug" type="text" required className={`${CONTROL} font-mono text-sm`} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="meta_title" className="text-sm font-semibold text-ink">
          Titre pour Google <span className="text-accent">*</span>
        </label>
        <input id="meta_title" name="meta_title" type="text" required className={CONTROL} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="preloader_label" className="text-sm font-semibold text-ink">
          Texte du chargement
        </label>
        <p className="-mt-1 text-xs text-muted">Le mot affiché pendant que la page s'ouvre.</p>
        <input id="preloader_label" name="preloader_label" type="text" className={CONTROL} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="tactile rounded-[100px] px-6 py-3 font-display text-xs font-bold tracking-[0.05em] uppercase disabled:opacity-60"
        >
          {pending ? "Création…" : "Créer la page"}
        </button>
        {state && !state.ok ? (
          <span role="status" className="text-sm text-danger">
            {state.message}
          </span>
        ) : null}
      </div>
    </form>
  );
}
