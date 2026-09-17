/**
 * Web3Forms delivers the contact form. The access key is a public, per form
 * identifier by design; it authorises delivery to the owner's inbox and
 * carries no account privileges. It answers 403 to any call that does not
 * come from a browser, which is why the paid gift card order is not emailed
 * from the Stripe webhook: Stripe's own payment notification does that.
 */
export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
export const WEB3FORMS_ACCESS_KEY = "cd45ef9f-52a9-4848-839f-1fcaaea9bfc3";

export type SubmitState = "idle" | "sending" | "sent" | "error";
