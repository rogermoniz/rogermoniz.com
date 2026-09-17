"use client";

import { useActionState, useState } from "react";
import { Field, FormRow, TextArea, TextInput } from "@/components/primitives/FormField";
import { ArrowRightIcon } from "@/components/primitives/icons";
import { startBookingCheckout, type CheckoutState } from "@/lib/orders/checkout";
import { formatEuros } from "@/lib/orders/money";

export type BookableCard = {
  id: string;
  title: string;
  description: string;
  price: string;
  amount: number;
  featured: boolean;
  features: readonly string[];
};

const RADIO = "peer sr-only";
const CARD =
  "flex flex-col items-start gap-2.5 rounded-2xl border border-edge bg-surface p-6 transition-all duration-400 ease-out-expo hover:border-accent peer-checked:border-accent peer-checked:bg-[var(--theme-btn-hover)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent";
const LEGEND =
  "tactile mb-6 inline-block rounded-[30px] px-3 py-[5px] font-body text-[0.45rem] tracking-[2.5px] uppercase";

/**
 * Books a priced prestation: pick the formula, say who you are, pay. The
 * formula opened from the pricing card comes preselected; the rest of the
 * page's formulas stay one click away so nobody has to go back to change.
 */
export function BookingBuilder({
  page,
  cards,
  preselected,
}: {
  page: string;
  cards: readonly BookableCard[];
  preselected: string | null;
}) {
  const initial = cards.find((c) => c.id === preselected) ?? cards.find((c) => c.featured) ?? cards[0];
  const [selected, setSelected] = useState(initial?.id ?? "");
  const [state, action, pending] = useActionState<CheckoutState, FormData>(startBookingCheckout, null);
  const active = cards.find((c) => c.id === selected) ?? initial;

  return (
    <form action={action} className="mx-auto flex w-full max-w-3xl flex-col gap-16">
      <input type="hidden" name="page" value={page} />

      <fieldset className="flex flex-col border-0 p-0">
        <legend className={LEGEND}>1. La formule</legend>
        <div className="grid gap-4">
          {cards.map((card) => (
            <label key={card.id} className="relative cursor-pointer">
              <input
                type="radio"
                name="formule"
                value={card.id}
                checked={selected === card.id}
                onChange={() => setSelected(card.id)}
                className={RADIO}
              />
              <span className={CARD}>
                <span className="flex w-full items-baseline justify-between gap-4">
                  <span className="font-display text-lg font-bold tracking-[-0.02em] text-ink uppercase">
                    {card.title}
                  </span>
                  <span className="font-display text-lg font-bold text-ink">{card.price}</span>
                </span>
                {card.description ? (
                  <span className="text-[0.875rem] leading-snug text-muted">{card.description}</span>
                ) : null}
                {card.features.length ? (
                  <span className="mt-1 text-[0.8rem] leading-relaxed text-muted">
                    {card.features.join(" · ")}
                  </span>
                ) : null}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col border-0 p-0">
        <legend className={LEGEND}>2. Vos coordonnées</legend>
        <FormRow>
          <Field label="Votre nom" htmlFor="bookingName">
            <TextInput id="bookingName" name="name" placeholder="Prénom et nom" autoComplete="name" required />
          </Field>
          <Field label="Téléphone" htmlFor="bookingPhone">
            <TextInput id="bookingPhone" name="phone" type="tel" placeholder="06 00 00 00 00" autoComplete="tel" required />
          </Field>
        </FormRow>
        <Field label="Email (reçu et confirmation)" htmlFor="bookingEmail">
          <TextInput id="bookingEmail" name="email" type="email" placeholder="nom@exemple.com" autoComplete="email" required />
        </Field>
        <Field label="Vos disponibilités et vos envies (facultatif)" htmlFor="bookingMessage">
          <TextArea id="bookingMessage" name="message" placeholder="Les dates qui vous conviennent, le lieu, l’ambiance que vous imaginez…" />
        </Field>
      </fieldset>

      <div>
        <p className="mb-6 flex items-baseline justify-between gap-6 border-t border-edge pt-6 font-body">
          <span className="text-[0.8rem] font-semibold tracking-[0.08em] text-muted uppercase">
            Total · {active?.title}
          </span>
          <span className="font-display text-2xl font-bold text-ink">{formatEuros(active?.amount ?? 0)}</span>
        </p>
        <button
          type="submit"
          disabled={pending}
          className="tactile group inline-flex w-fit items-center justify-center gap-4 rounded-[100px] px-6 py-3 disabled:opacity-70"
        >
          <span className="font-display text-xs font-bold tracking-[0.05em] uppercase">
            {pending ? "Redirection vers le paiement…" : "Payer et réserver"}
          </span>
          <span className="relative block size-5 overflow-hidden">
            <ArrowRightIcon className="absolute top-0 left-0 size-full transition-transform duration-600 ease-out-expo group-hover:translate-x-full" />
            <ArrowRightIcon className="absolute top-0 left-0 size-full -translate-x-full transition-transform duration-600 ease-out-expo group-hover:translate-x-0" />
          </span>
        </button>
        <p className="mt-5 font-body text-[0.85rem] leading-relaxed text-muted">
          Paiement sécurisé par Stripe. Carte bancaire, Apple Pay et Google Pay. La date de la séance est fixée ensemble après le paiement.
        </p>
        {state ? (
          <p role="alert" className="mt-3 font-body text-[0.95rem] leading-relaxed text-danger">
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
