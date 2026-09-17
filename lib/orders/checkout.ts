"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type Stripe from "stripe";
import { SITE_ORIGIN } from "@/lib/canonical";
import { getBookingPage, getGiftPage } from "@/lib/content/source";
import { stripe } from "@/lib/stripe/server";
import { readBookingInput, readGiftInput } from "./order";
import { recordOrder, type NewOrder } from "./orders";

export type CheckoutState = { message: string } | null;

const FAILED =
  "Le paiement n’a pas pu démarrer. Réessayez dans un instant, ou écrivez directement à contact@rogermoniz.com.";

/** Stripe caps a metadata value at 500 characters; the full text is in the order book. */
const clip = (text: string) => (text.length > 500 ? `${text.slice(0, 497)}…` : text);

/**
 * Where Stripe sends the buyer back. Production is the one public address;
 * anywhere else (a laptop, a preview) is whatever host the form was served
 * from, so a rehearsal returns to the rehearsal.
 */
async function origin(): Promise<string> {
  if (process.env.VERCEL_ENV === "production") return SITE_ORIGIN;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return SITE_ORIGIN;
  return `${h.get("x-forwarded-proto") ?? "http"}://${host}`;
}

type LineItem = { name: string; description: string; amount: number };

/**
 * One checkout for both shops. Creates the Stripe session, records the order
 * against it, and only then hands the URL back: a session nobody could find
 * again is expired on the spot rather than left open for payment.
 */
async function openCheckout(
  cancelPath: string,
  lines: readonly LineItem[],
  description: string,
  metadata: Record<string, string>,
  order: Omit<NewOrder, "sessionId">,
): Promise<string> {
  const base = await origin();
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = lines
    .filter((line) => line.amount > 0)
    .map((line) => ({
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: line.amount,
        product_data: { name: line.name, ...(line.description ? { description: line.description } : {}) },
      },
    }));

  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    locale: "fr",
    customer_email: order.email,
    customer_creation: "always",
    allow_promotion_codes: true,
    line_items,
    payment_intent_data: { description },
    metadata,
    success_url: `${base}/merci/?session={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}${cancelPath}`,
  });
  if (!session.url) throw new Error("Stripe returned a session without a URL.");

  try {
    await recordOrder({ ...order, sessionId: session.id });
  } catch (error) {
    await stripe().checkout.sessions.expire(session.id);
    throw error;
  }
  return session.url;
}

/**
 * The gift card. Amounts are read from the same rows the page rendered, never
 * from the form, so nothing the browser sends can change a price.
 */
export async function startGiftCheckout(_prev: CheckoutState, form: FormData): Promise<CheckoutState> {
  const reading = readGiftInput(form);
  if (!reading.ok) return { message: reading.message };
  const { input } = reading;

  const page = await getGiftPage();
  const pkg = page.packages.find((p) => p.value === input.packageValue);
  const delivery = page.deliveries.find((d) => d.value === input.deliveryValue);
  if (!pkg || !delivery) return { message: "La formule choisie n’existe plus. Rechargez la page." };

  let url: string;
  try {
    url = await openCheckout(
      "/carte-cadeau/#builder",
      [
        { name: `Carte cadeau ${pkg.title}`, description: pkg.description, amount: pkg.amount },
        { name: delivery.title, description: delivery.description, amount: delivery.amount },
      ],
      `Carte cadeau ${pkg.title} pour ${input.recipient}, de la part de ${input.sender}`,
      {
        kind: "gift",
        package: pkg.value,
        delivery: delivery.value,
        sender: clip(input.sender),
        recipient: clip(input.recipient),
        address: clip(`${input.address}, ${input.postal} ${input.city}`),
        message: clip(input.message),
      },
      {
        kind: "gift",
        pageSlug: "carte-cadeau",
        itemValue: pkg.value,
        itemTitle: pkg.title,
        option: { value: delivery.value, title: delivery.title },
        amountTotal: pkg.amount + delivery.amount,
        customerName: input.sender,
        email: input.email,
        shipping: { recipient: input.recipient, address: input.address, postal: input.postal, city: input.city },
        message: input.message,
      },
    );
  } catch (error) {
    console.error("Gift checkout failed:", error);
    return { message: FAILED };
  }
  redirect(url);
}

/** A session on a priced prestation, paid in full up front. */
export async function startBookingCheckout(_prev: CheckoutState, form: FormData): Promise<CheckoutState> {
  const reading = readBookingInput(form);
  if (!reading.ok) return { message: reading.message };
  const { input } = reading;

  const slug = String(form.get("page") ?? "");
  const page = await getBookingPage(slug);
  const card = page?.cards.find((c) => c.id === input.cardId);
  if (!page || !card) return { message: "La formule choisie n’existe plus. Rechargez la page." };

  let url: string;
  try {
    url = await openCheckout(
      `/reserver/${slug}/?formule=${card.id}`,
      [{ name: `Séance ${page.name} · ${card.title}`, description: card.description, amount: card.amount }],
      `Séance ${page.name} ${card.title} pour ${input.name}`,
      {
        kind: "prestation",
        page: slug,
        formule: card.title,
        name: clip(input.name),
        phone: clip(input.phone),
        message: clip(input.message),
      },
      {
        kind: "prestation",
        pageSlug: slug,
        itemValue: card.id,
        itemTitle: card.title,
        amountTotal: card.amount,
        customerName: input.name,
        email: input.email,
        phone: input.phone,
        message: input.message,
      },
    );
  } catch (error) {
    console.error("Booking checkout failed:", error);
    return { message: FAILED };
  }
  redirect(url);
}
