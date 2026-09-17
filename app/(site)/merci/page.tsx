import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderReceipt, type PaymentOutcome } from "@/components/sections/OrderReceipt";
import { getBookingPage, getGiftPage } from "@/lib/content/source";
import { getOrder } from "@/lib/orders/orders";
import { stripe } from "@/lib/stripe/server";

/**
 * Where Stripe sends every buyer once they have paid. Stripe is asked what
 * happened rather than the order book, because the buyer can land here a
 * moment before the webhook does; the book says what was bought and which
 * shop's words to use.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Merci | Roger Moniz Photographe à Nice",
  robots: { index: false, follow: false },
};

const SESSION_ID = /^cs_(live|test)_[A-Za-z0-9]+$/;

function outcomeOf(status: string | null, paymentStatus: string): PaymentOutcome {
  if (paymentStatus === "paid") return "paid";
  if (status === "complete") return "processing";
  return "unpaid";
}

export default async function MerciRoute({
  searchParams,
}: {
  searchParams: Promise<{ session?: string | string[] }>;
}) {
  const { session: id } = await searchParams;
  if (typeof id !== "string" || !SESSION_ID.test(id)) notFound();

  // The order book is asked first: an id it does not know is a 404, not a
  // question for Stripe.
  const order = await getOrder(id);
  if (!order) notFound();
  const session = await stripe().checkout.sessions.retrieve(id);
  const outcome = outcomeOf(session.status, session.payment_status);

  if (order.kind === "gift") {
    const page = await getGiftPage();
    return (
      <OrderReceipt
        heading={page.thanks}
        lead={page.formSuccess}
        order={order}
        outcome={outcome}
        retryHref="/carte-cadeau/#builder"
      />
    );
  }

  const page = await getBookingPage(order.pageSlug);
  return (
    <OrderReceipt
      heading={page?.thanks ?? { eyebrow: "Séance réservée", title: "Merci !", subtitle: null }}
      lead={null}
      order={order}
      outcome={outcome}
      retryHref={`/reserver/${order.pageSlug}/?formule=${order.itemValue}`}
    />
  );
}
