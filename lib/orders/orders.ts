import "server-only";
import type Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isOrderStatus, type Order, type OrderKind, type OrderStatus } from "./order";

/* ==========================================================================
   The order book. Every read and write of `orders` goes through here, with
   the secret key: the table has no public policy, so the publishable key the
   site renders with can never list who bought what.
   ========================================================================== */

type OrderRow = Record<string, unknown>;

const str = (v: unknown): string => (typeof v === "string" ? v : "");
const nullable = (v: unknown): string | null => (typeof v === "string" ? v : null);

function fromRow(row: OrderRow): Order {
  return {
    id: Number(row.id),
    sessionId: str(row.session_id),
    kind: row.kind === "prestation" ? "prestation" : "gift",
    pageSlug: str(row.page_slug),
    status: isOrderStatus(row.status) ? row.status : "pending",
    itemValue: str(row.item_value),
    itemTitle: str(row.item_title),
    optionValue: nullable(row.option_value),
    optionTitle: nullable(row.option_title),
    amountTotal: Number(row.amount_total),
    currency: str(row.currency),
    customerName: str(row.customer_name),
    email: str(row.email),
    phone: nullable(row.phone),
    recipient: nullable(row.recipient),
    address: nullable(row.address),
    postal: nullable(row.postal),
    city: nullable(row.city),
    message: str(row.message),
    createdAt: str(row.created_at),
    paidAt: nullable(row.paid_at),
    fulfilledAt: nullable(row.fulfilled_at),
  };
}

export type NewOrder = {
  sessionId: string;
  kind: OrderKind;
  pageSlug: string;
  itemValue: string;
  itemTitle: string;
  option?: { value: string; title: string };
  amountTotal: number;
  customerName: string;
  email: string;
  phone?: string;
  shipping?: { recipient: string; address: string; postal: string; city: string };
  message: string;
};

export async function recordOrder(order: NewOrder): Promise<void> {
  const { error } = await supabaseAdmin.from("orders").insert({
    session_id: order.sessionId,
    kind: order.kind,
    page_slug: order.pageSlug,
    status: "pending",
    item_value: order.itemValue,
    item_title: order.itemTitle,
    option_value: order.option?.value ?? null,
    option_title: order.option?.title ?? null,
    amount_total: order.amountTotal,
    currency: "eur",
    customer_name: order.customerName,
    email: order.email,
    phone: order.phone ?? null,
    recipient: order.shipping?.recipient ?? null,
    address: order.shipping?.address ?? null,
    postal: order.shipping?.postal ?? null,
    city: order.shipping?.city ?? null,
    message: order.message,
  });
  if (error) throw new Error(`Recording the order: ${error.message}`);
}

export async function getOrder(sessionId: string): Promise<Order | null> {
  const { data, error } = await supabaseAdmin.from("orders").select("*").eq("session_id", sessionId).maybeSingle();
  if (error) throw new Error(`Reading the order: ${error.message}`);
  return data ? fromRow(data as OrderRow) : null;
}

export async function listOrders(): Promise<Order[]> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(`Listing the orders: ${error.message}`);
  return ((data ?? []) as OrderRow[]).map(fromRow);
}

export async function setOrderStatus(sessionId: string, status: OrderStatus): Promise<void> {
  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("session_id", sessionId)
    .neq("status", "paid");
  if (error) throw new Error(`Updating the order: ${error.message}`);
}

export async function setFulfilled(id: number, fulfilled: boolean): Promise<void> {
  const { error } = await supabaseAdmin
    .from("orders")
    .update({ fulfilled_at: fulfilled ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw new Error(`Updating the order: ${error.message}`);
}

/**
 * A payment landed. The row is marked once, whatever Stripe redelivers: the
 * status guard makes a second delivery a no-op rather than a second paid_at.
 * Telling the owner is Stripe's job (its "successful payment" notification),
 * because the form's email service refuses calls that do not come from a
 * browser; the order itself is on /admin/commandes.
 */
export async function markPaid(session: Stripe.Checkout.Session): Promise<void> {
  const paymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : null;
  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status: "paid", paid_at: new Date().toISOString(), payment_intent: paymentIntent })
    .eq("session_id", session.id)
    .neq("status", "paid");
  if (error) throw new Error(`Marking the order paid: ${error.message}`);
}
