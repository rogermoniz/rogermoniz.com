/**
 * Whether online payment is open. It is the presence of the Stripe key and
 * nothing else: until the live account is verified and its key deployed, the
 * site behaves as it did before, with every "Réserver" leading to the contact
 * page and the gift card form pointing there too. Read at build time on the
 * prerendered pages, so a change needs a deploy, as any env change does.
 */
export const CONTACT_PATH = "/contact/";

export function paymentsOpen(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
