import { markFulfilled } from "@/lib/orders/admin";
import { formatEuros } from "@/lib/orders/money";
import type { Order, OrderStatus } from "@/lib/orders/order";

const STATUS: Record<OrderStatus, { label: string; tone: string }> = {
  paid: { label: "Payée", tone: "border-accent text-accent" },
  processing: { label: "En attente de la banque", tone: "border-edge text-muted" },
  pending: { label: "Paiement non terminé", tone: "border-edge text-muted" },
  failed: { label: "Paiement refusé", tone: "border-danger text-danger" },
  expired: { label: "Abandonnée", tone: "border-edge text-muted" },
};

const when = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-display text-[0.6rem] font-bold tracking-[1.5px] text-muted uppercase">{label}</span>
      <span className="text-sm text-ink">{children}</span>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const status = STATUS[order.status];
  const done = order.fulfilledAt !== null;
  return (
    <article className="tactile rounded-2xl px-6 py-5">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-edge px-2.5 py-0.5 font-display text-[0.55rem] font-bold tracking-[1px] text-ink uppercase">
          {order.kind === "gift" ? "Carte cadeau" : `Séance ${order.pageSlug}`}
        </span>
        <span className={`rounded-full border px-2.5 py-0.5 font-display text-[0.55rem] font-bold tracking-[1px] uppercase ${status.tone}`}>
          {status.label}
        </span>
        {done ? (
          <span className="rounded-full border border-ink px-2.5 py-0.5 font-display text-[0.55rem] font-bold tracking-[1px] text-ink uppercase">
            {order.kind === "gift" ? "Carte envoyée" : "Séance planifiée"}
          </span>
        ) : null}
        <span className="ml-auto text-xs text-muted">{when.format(new Date(order.createdAt))}</span>
      </div>

      <div className="grid grid-cols-3 gap-x-6 gap-y-4 max-md:grid-cols-2 max-sm:grid-cols-1">
        <Cell label={order.kind === "gift" ? "Formule" : "Séance"}>
          {order.itemTitle} · {formatEuros(order.amountTotal)}
        </Cell>
        {order.optionTitle ? <Cell label="Remise">{order.optionTitle}</Cell> : null}
        <Cell label={order.kind === "gift" ? "De la part de" : "Client"}>{order.customerName}</Cell>
        {order.recipient ? <Cell label="Pour">{order.recipient}</Cell> : null}
        <Cell label="Email">
          <a href={`mailto:${order.email}`} className="underline decoration-edge underline-offset-4 hover:text-accent">
            {order.email}
          </a>
        </Cell>
        {order.phone ? (
          <Cell label="Téléphone">
            <a href={`tel:${order.phone}`} className="underline decoration-edge underline-offset-4 hover:text-accent">
              {order.phone}
            </a>
          </Cell>
        ) : null}
        {order.address ? (
          <Cell label="Adresse du destinataire">
            {order.address}, {order.postal} {order.city}
          </Cell>
        ) : null}
        {order.message ? (
          <div className="col-span-full">
            <Cell label="Message">
              <span className="whitespace-pre-wrap">{order.message}</span>
            </Cell>
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-edge pt-4">
        <span className="font-mono text-[0.7rem] text-muted">{order.sessionId}</span>
        {order.status === "paid" ? (
          <form action={markFulfilled} className="ml-auto">
            <input type="hidden" name="id" value={order.id} />
            <input type="hidden" name="fulfilled" value={done ? "0" : "1"} />
            <button
              type="submit"
              className="rounded-full border border-edge px-4 py-1.5 font-display text-[0.62rem] font-bold tracking-[1px] uppercase transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              {done ? "Marquer à traiter" : order.kind === "gift" ? "Marquer comme envoyée" : "Marquer comme planifiée"}
            </button>
          </form>
        ) : null}
      </div>
    </article>
  );
}

/** Every checkout ever started, newest first. Paid ones are the work to do. */
export function OrdersTable({ orders }: { orders: readonly Order[] }) {
  if (orders.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-edge px-5 py-10 text-center text-sm text-muted">
        Aucune commande pour le moment.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
