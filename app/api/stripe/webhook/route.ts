import type Stripe from "stripe";
import { markPaid, setOrderStatus } from "@/lib/orders/orders";
import { stripe } from "@/lib/stripe/server";

/**
 * Stripe tells this route what happened to a checkout. The signature proves
 * the call is Stripe's; the order book decides what is new. Anything that
 * goes wrong on our side answers 500 so Stripe delivers the event again,
 * because an acknowledged event is never resent and a lost one is a paid
 * card nobody knows about.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return Response.json({ error: "Webhook not configured." }, { status: 503 });

  const signature = request.headers.get("stripe-signature");
  if (!signature) return Response.json({ error: "Missing signature." }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch (error) {
    console.error("Stripe webhook rejected:", error);
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        if (session.payment_status === "paid") await markPaid(session);
        else await setOrderStatus(session.id, "processing");
        break;
      }
      case "checkout.session.async_payment_failed":
        await setOrderStatus(event.data.object.id, "failed");
        break;
      case "checkout.session.expired":
        await setOrderStatus(event.data.object.id, "expired");
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(`Stripe webhook ${event.type} failed:`, error);
    return Response.json({ error: "Not processed." }, { status: 500 });
  }

  return Response.json({ received: true });
}
