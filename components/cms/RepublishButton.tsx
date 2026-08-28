"use client";

import { useActionState } from "react";
import { republish, type ActionResult } from "@/lib/cms/actions";

/** Forces the static site to rebuild now rather than waiting for the window. */
export function RepublishButton() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    () => republish(),
    null,
  );

  return (
    <form action={action} className="flex items-center gap-3">
      <button
        type="submit"
        disabled={pending}
        className="tactile rounded-[100px] px-4 py-2 font-display text-[0.65rem] font-bold tracking-[1px] uppercase disabled:opacity-60"
      >
        {pending ? "…" : "Republier"}
      </button>
      {state?.ok ? <span className="text-xs text-muted">{state.message}</span> : null}
    </form>
  );
}
