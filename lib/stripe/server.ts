import "server-only";
import Stripe from "stripe";

/**
 * The one Stripe client. Built on first use rather than at import, so a page
 * that merely links to the gift card never needs the key to render, while a
 * checkout or a webhook fails loudly the moment it is asked to run without one.
 */
let client: Stripe | undefined;

export function stripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe is not configured: set STRIPE_SECRET_KEY.");
  client ??= new Stripe(key, { appInfo: { name: "rogermoniz.com" } });
  return client;
}

/** Whether the key in use is a live one, which decides what a test looks like. */
export function stripeIsLive(): boolean {
  return (process.env.STRIPE_SECRET_KEY ?? "").startsWith("sk_live_");
}
