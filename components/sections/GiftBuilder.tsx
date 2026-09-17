"use client";

import { useActionState, useState } from "react";
import { Field, FormRow, TextArea, TextInput } from "@/components/primitives/FormField";
import { BubbleButton } from "@/components/primitives/BubbleButton";
import { ArrowRightIcon } from "@/components/primitives/icons";
import { CONTACT_PATH } from "@/lib/orders/launch";
import { startGiftCheckout, type CheckoutState } from "@/lib/orders/checkout";
import { formatEuros } from "@/lib/orders/money";

type Package = {
  value: string;
  price: string;
  amount: number;
  checked: boolean;
  title: string;
  description: string;
};

type Delivery = {
  value: string;
  checked: boolean;
  title: string;
  description: string;
  price: string;
  amount: number;
};

function SmartChip() {
  return (
    <svg viewBox="0 0 50 40" fill="none" aria-hidden="true" className="mb-4 w-[45px]">
      <rect width="50" height="40" rx="5" fill="url(#chipGrad)" stroke="#000" strokeOpacity="0.3" strokeWidth="0.5" />
      <path d="M0 12h16v16H0M50 12H34v16h16M16 0v40M34 0v40" stroke="#000" strokeOpacity="0.2" strokeWidth="1" />
      <rect x="21" y="14" width="8" height="12" rx="2" stroke="#000" strokeOpacity="0.2" strokeWidth="1" />
      <defs>
        <linearGradient id="chipGrad" x1="0" y1="0" x2="50" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#E5C158" />
          <stop offset="0.5" stopColor="#FCEBAF" />
          <stop offset="1" stopColor="#C29B38" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * The gift card builder. The chosen formula drives a live preview of the card,
 * so the reader sees what they are buying while they fill the form in, and
 * the form itself hands over to Stripe Checkout: the site never sees a card
 * number, only the order that comes back paid.
 */
export function GiftBuilder({
  steps,
  packages,
  deliveries,
  submitLabel,
  cardLabels,
  open,
}: {
  steps: readonly string[];
  packages: readonly Package[];
  deliveries: readonly Delivery[];
  submitLabel: string;
  cardLabels: { brand: string; caption: string };
  /** Whether online payment is open; until then the form points at the contact page. */
  open: boolean;
}) {
  const initialPackage = packages.find((p) => p.checked) ?? packages[0];
  const initialDelivery = deliveries.find((d) => d.checked) ?? deliveries[0];
  const [selected, setSelected] = useState(initialPackage?.value ?? "");
  const [delivery, setDelivery] = useState(initialDelivery?.value ?? "");
  const [state, action, pending] = useActionState<CheckoutState, FormData>(startGiftCheckout, null);

  const active = packages.find((p) => p.value === selected) ?? initialPackage;
  const chosenDelivery = deliveries.find((d) => d.value === delivery) ?? initialDelivery;
  const total = (active?.amount ?? 0) + (chosenDelivery?.amount ?? 0);

  const radio =
    "peer sr-only";
  const card =
    "flex flex-col items-start gap-2.5 rounded-2xl border border-edge bg-surface p-6 transition-all duration-400 ease-out-expo hover:border-accent peer-checked:border-accent peer-checked:bg-[var(--theme-btn-hover)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent";

  return (
    <div className="grid grid-cols-[1fr_1.2fr] items-start gap-[6vw] max-lg:grid-cols-1 max-lg:gap-12">
      <div className="sticky top-[15vh] flex flex-col items-center max-lg:static">
        <div className="relative aspect-[1.586/1] w-full max-w-[450px]">
          <div className="flex size-full flex-col rounded-[20px] border border-[var(--giftcard-edge)] bg-[image:var(--giftcard-surface)] p-10 text-[var(--giftcard-ink)] shadow-[var(--giftcard-shadow)]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
            >
              <span className="absolute top-0 left-[-100%] h-full w-1/2 -skew-x-[20deg] animate-card-shine bg-[image:var(--giftcard-shine)]" />
            </span>

            <div className="relative z-5 text-right">
              <div className="font-display text-xl font-bold tracking-[-0.02em] uppercase">
                {cardLabels.brand}
              </div>
            </div>
            <div className="relative z-5 flex grow flex-col justify-center">
              <SmartChip />
              <div className="font-body text-3xl font-light italic">{active?.value}</div>
            </div>
            <div className="relative z-5 flex items-end justify-between font-body text-[0.75rem] font-semibold tracking-[0.1em] uppercase">
              <div>{cardLabels.caption}</div>
              <div className="font-display text-2xl font-bold">{active?.price}</div>
            </div>
          </div>
        </div>
      </div>

      <form action={action} className="flex flex-col gap-16">

        <fieldset className="flex flex-col border-0 p-0">
          <legend className="tactile mb-6 inline-block rounded-[30px] px-3 py-[5px] font-body text-[0.45rem] tracking-[2.5px] uppercase">
            {steps[0]}
          </legend>
          <div className="grid gap-4">
            {packages.map((option) => (
              <label key={option.value} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="package"
                  value={option.value}
                  checked={selected === option.value}
                  onChange={() => setSelected(option.value)}
                  className={radio}
                />
                <span className={card}>
                  <span className="font-display text-lg font-bold tracking-[-0.02em] text-ink uppercase">
                    {option.title}
                  </span>
                  <span className="text-[0.875rem] leading-snug text-muted">
                    {option.description}
                  </span>
                  <span className="font-display text-lg font-bold text-ink">{option.price}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="flex flex-col border-0 p-0">
          <legend className="tactile mb-6 inline-block rounded-[30px] px-3 py-[5px] font-body text-[0.45rem] tracking-[2.5px] uppercase">
            {steps[1]}
          </legend>
          <FormRow>
            <Field label="De la part de (votre nom)" htmlFor="sender">
              <TextInput id="sender" name="sender" placeholder="Votre prénom et nom" required />
            </Field>
            <Field label="Pour (nom du destinataire)" htmlFor="recipient">
              <TextInput id="recipient" name="recipient" placeholder="Nom du destinataire" required />
            </Field>
          </FormRow>
          <Field label="Votre email (facturation et envoi)" htmlFor="giftEmail">
            <TextInput id="giftEmail" name="email" type="email" placeholder="nom@exemple.com" required />
          </Field>
          <Field label="Adresse (du destinataire)" htmlFor="address">
            <TextInput id="address" name="address" placeholder="N° et nom de rue" required />
          </Field>
          <FormRow>
            <Field label="Code postal" htmlFor="postal">
              <TextInput
                id="postal"
                name="postal"
                placeholder="06000"
                inputMode="numeric"
                pattern="[0-9]{5}"
                required
              />
            </Field>
            <Field label="Ville" htmlFor="city">
              <TextInput id="city" name="city" placeholder="Nice" required />
            </Field>
          </FormRow>
          <Field
            label="Message personnel (rajouté sur la carte cadeau digitale ou imprimée)"
            htmlFor="giftMessage"
          >
            <TextArea
              id="giftMessage"
              name="message"
              placeholder="Quelques mots à joindre à votre cadeau..."
              required
            />
          </Field>
        </fieldset>

        <fieldset className="flex flex-col border-0 p-0">
          <legend className="tactile mb-6 inline-block rounded-[30px] px-3 py-[5px] font-body text-[0.45rem] tracking-[2.5px] uppercase">
            {steps[2]}
          </legend>
          <div className="grid gap-4">
            {deliveries.map((option) => (
              <label key={option.value} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="delivery"
                  value={option.value}
                  checked={delivery === option.value}
                  onChange={() => setDelivery(option.value)}
                  className={radio}
                />
                <span className={card}>
                  <span className="font-display text-lg font-bold tracking-[-0.02em] text-ink uppercase">
                    {option.title}
                  </span>
                  <span className="text-[0.875rem] leading-snug text-muted">
                    {option.description}
                  </span>
                  <span className="font-display text-lg font-bold text-ink">{option.price}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <p className="mb-6 flex items-baseline justify-between gap-6 border-t border-edge pt-6 font-body">
            <span className="text-[0.8rem] font-semibold tracking-[0.08em] text-muted uppercase">Total</span>
            <span className="font-display text-2xl font-bold text-ink">{formatEuros(total)}</span>
          </p>
          {open ? (
            <button
              type="submit"
              disabled={pending}
              className="tactile group inline-flex w-fit items-center justify-center gap-4 rounded-[100px] px-6 py-3 disabled:opacity-70"
            >
              <span className="font-display text-xs font-bold tracking-[0.05em] uppercase">
                {pending ? "Redirection vers le paiement…" : submitLabel}
              </span>
              <span className="relative block size-5 overflow-hidden">
                <ArrowRightIcon className="absolute top-0 left-0 size-full transition-transform duration-600 ease-out-expo group-hover:translate-x-full" />
                <ArrowRightIcon className="absolute top-0 left-0 size-full -translate-x-full transition-transform duration-600 ease-out-expo group-hover:translate-x-0" />
              </span>
            </button>
          ) : (
            <BubbleButton href={CONTACT_PATH} variant="solid">
              Me contacter pour commander
            </BubbleButton>
          )}
          <p className="mt-5 font-body text-[0.85rem] leading-relaxed text-muted">
            {open
              ? "Paiement sécurisé par Stripe. Carte bancaire, Apple Pay et Google Pay."
              : "Le paiement en ligne ouvre très bientôt. En attendant, je prends votre commande par email."}
          </p>
          {state ? (
            <p role="alert" className="mt-3 font-body text-[0.95rem] leading-relaxed text-danger">
              {state.message}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
