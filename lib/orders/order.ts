/**
 * What a buyer tells us, read off a form once and typed from then on.
 * Validation lives here so the checkout actions and the order book agree on
 * what a complete order is.
 */
export type OrderKind = "gift" | "prestation";

export type OrderStatus = "pending" | "paid" | "processing" | "failed" | "expired";

const STATUSES: readonly OrderStatus[] = ["pending", "paid", "processing", "failed", "expired"];

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (STATUSES as readonly string[]).includes(value);
}

/** The gift card form: who gives, who receives, and where the card goes. */
export type GiftInput = {
  packageValue: string;
  deliveryValue: string;
  sender: string;
  recipient: string;
  email: string;
  address: string;
  postal: string;
  city: string;
  message: string;
};

/** The booking form: which formula, and how to reach the person. */
export type BookingInput = {
  cardId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

/** One row of `orders`, as the site reads it back. */
export type Order = {
  id: number;
  sessionId: string;
  kind: OrderKind;
  pageSlug: string;
  status: OrderStatus;
  itemValue: string;
  itemTitle: string;
  optionValue: string | null;
  optionTitle: string | null;
  amountTotal: number;
  currency: string;
  customerName: string;
  email: string;
  phone: string | null;
  recipient: string | null;
  address: string | null;
  postal: string | null;
  city: string | null;
  message: string;
  createdAt: string;
  paidAt: string | null;
  fulfilledAt: string | null;
};

const LIMITS = { short: 200, message: 1000 } as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const POSTAL = /^\d{5}$/;
const PHONE = /^\+?[\d\s().-]{6,20}$/;

export type Reading<T> = { ok: true; input: T } | { ok: false; message: string };

const MISSING = "Merci de remplir tous les champs du formulaire.";
const TOO_LONG = "Un des champs est trop long.";

function text(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function tooLong(values: readonly string[]): boolean {
  return values.some((v) => v.length > LIMITS.short);
}

/**
 * The browser already enforces `required`, so a failure here means the
 * request did not come through the form, and one plain message is enough.
 */
export function readGiftInput(form: FormData): Reading<GiftInput> {
  const input: GiftInput = {
    packageValue: text(form, "package"),
    deliveryValue: text(form, "delivery"),
    sender: text(form, "sender"),
    recipient: text(form, "recipient"),
    email: text(form, "email"),
    address: text(form, "address"),
    postal: text(form, "postal"),
    city: text(form, "city"),
    message: text(form, "message"),
  };
  if (Object.values(input).some((v) => v === "")) return { ok: false, message: MISSING };
  if (!EMAIL.test(input.email)) return { ok: false, message: "L’adresse email ne semble pas valide." };
  if (!POSTAL.test(input.postal)) return { ok: false, message: "Le code postal doit comporter cinq chiffres." };
  if (input.message.length > LIMITS.message) {
    return { ok: false, message: `Le message personnel est limité à ${LIMITS.message} caractères.` };
  }
  if (tooLong([input.sender, input.recipient, input.email, input.address, input.city])) {
    return { ok: false, message: TOO_LONG };
  }
  return { ok: true, input };
}

export function readBookingInput(form: FormData): Reading<BookingInput> {
  const input: BookingInput = {
    cardId: text(form, "formule"),
    name: text(form, "name"),
    email: text(form, "email"),
    phone: text(form, "phone"),
    message: text(form, "message"),
  };
  if (!input.cardId || !input.name || !input.email || !input.phone) return { ok: false, message: MISSING };
  if (!EMAIL.test(input.email)) return { ok: false, message: "L’adresse email ne semble pas valide." };
  if (!PHONE.test(input.phone)) return { ok: false, message: "Le numéro de téléphone ne semble pas valide." };
  if (input.message.length > LIMITS.message) {
    return { ok: false, message: `Le message est limité à ${LIMITS.message} caractères.` };
  }
  if (tooLong([input.name, input.email, input.phone])) return { ok: false, message: TOO_LONG };
  return { ok: true, input };
}
