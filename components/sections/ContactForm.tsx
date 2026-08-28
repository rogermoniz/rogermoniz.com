"use client";

import { useState } from "react";
import { Field, FormRow, Select, TextArea, TextInput } from "@/components/primitives/FormField";
import { ArrowRightIcon } from "@/components/primitives/icons";
import { WEB3FORMS_ACCESS_KEY, WEB3FORMS_ENDPOINT, type SubmitState } from "@/lib/forms";

/**
 * The contact request. Submits over fetch so the reader stays on the page, and
 * the subject line is composed from the answers before sending.
 */
export function ContactForm({
  subjectOptions,
  successMessage,
}: {
  subjectOptions: readonly { value: string; label: string }[];
  successMessage: string;
}) {
  const [state, setState] = useState<SubmitState>("idle");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const who = `${data.get("fname") ?? ""} ${data.get("lname") ?? ""}`.trim();
    const prestation = String(data.get("prestation") ?? "");
    data.set(
      "subject",
      `Nouvelle demande de contact${who ? ` — ${who}` : ""}${prestation ? ` (${prestation})` : ""}`,
    );

    setState("sending");
    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const result: { success?: boolean } = await response.json();
      if (result.success) {
        setState("sent");
        form.reset();
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  const label =
    state === "sending"
      ? "Envoi en cours…"
      : state === "sent"
        ? "Demande envoyée ✓"
        : "Envoyer la demande";

  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
      <input type="hidden" name="from_name" value="Site Roger Moniz — Contact" />
      {/* Honeypot: a real person never sees or fills this. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <FormRow>
        <Field label="Prénom" htmlFor="fname">
          <TextInput id="fname" name="fname" type="text" placeholder="Votre prénom" required />
        </Field>
        <Field label="Nom" htmlFor="lname">
          <TextInput id="lname" name="lname" type="text" placeholder="Votre nom" required />
        </Field>
      </FormRow>

      <FormRow>
        <Field label="Adresse Email" htmlFor="email">
          <TextInput id="email" name="email" type="email" placeholder="nom@exemple.com" required />
        </Field>
        <Field label="Sujet de la demande" htmlFor="prestation">
          <Select id="prestation" name="prestation" required defaultValue="">
            <option value="" disabled>
              Sélectionnez une prestation
            </option>
            {subjectOptions
              .filter((option) => option.value)
              .map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </Select>
        </Field>
      </FormRow>

      <Field label="Détails de votre projet" htmlFor="message">
        <TextArea
          id="message"
          name="message"
          placeholder="Décrivez la date, le lieu, vos envies..."
          required
        />
      </Field>

      <button
        type="submit"
        disabled={state === "sending" || state === "sent"}
        className="tactile group mt-6 inline-flex w-fit items-center gap-4 rounded-[100px] px-6 py-3 disabled:opacity-70"
      >
        <span className="font-display text-xs font-bold tracking-[0.05em] uppercase">{label}</span>
        <span className="relative block size-5 overflow-hidden">
          <ArrowRightIcon className="absolute top-0 left-0 size-full transition-transform duration-600 ease-out-expo group-hover:translate-x-full" />
          <ArrowRightIcon className="absolute top-0 left-0 size-full -translate-x-full transition-transform duration-600 ease-out-expo group-hover:translate-x-0" />
        </span>
      </button>

      <p role="status" className="mt-6 font-body text-[0.95rem] leading-relaxed text-ink">
        {state === "sent" ? successMessage : null}
        {state === "error"
          ? "L’envoi a échoué. Réessayez, ou écrivez directement à contact@rogermoniz.com."
          : null}
      </p>
    </form>
  );
}
