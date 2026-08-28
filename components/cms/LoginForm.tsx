"use client";

import { useActionState } from "react";
import { signIn, type ActionResult } from "@/lib/cms/actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(signIn, null);

  return (
    <form action={action} className="tactile w-full max-w-sm rounded-[20px] p-10">
      <h1 className="mb-2 font-display text-2xl font-bold tracking-[-0.02em] text-ink uppercase">
        Administration
      </h1>
      <p className="mb-8 text-sm text-muted">Roger Moniz Photographe</p>

      <input type="hidden" name="next" value={next} />

      <label htmlFor="password" className="mb-2 block text-sm font-semibold text-ink">
        Mot de passe
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        className="w-full rounded-lg border border-edge bg-surface px-4 py-3 text-base text-ink outline-none focus:border-accent focus:shadow-[0_0_0_4px_rgb(216_171_82_/_0.1)]"
      />

      {state && !state.ok ? (
        <p role="alert" className="mt-4 text-sm text-danger">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="tactile mt-8 w-full rounded-[100px] px-6 py-3 font-display text-xs font-bold tracking-[0.05em] uppercase disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
