import { AdminBar } from "@/components/cms/AdminBar";
import { OrdersTable } from "@/components/cms/OrdersTable";
import { listOrders } from "@/lib/orders/orders";
import { stripeIsLive } from "@/lib/stripe/server";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await listOrders();
  const paid = orders.filter((o) => o.status === "paid");
  const toSend = paid.filter((o) => o.fulfilledAt === null);

  return (
    <>
      <AdminBar title="Commandes" back={{ href: "/admin", label: "Le site" }} />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <p className="mb-2 max-w-prose text-muted">
          Chaque paiement reçu sur le site, carte cadeau ou séance, apparaît ici avec ce que l’acheteur a rempli.
          Stripe vous prévient aussi par email à chaque paiement.
        </p>
        <p className="mb-10 text-sm text-muted">
          {paid.length} commande{paid.length > 1 ? "s" : ""} payée{paid.length > 1 ? "s" : ""},{" "}
          {toSend.length} à traiter.
          {stripeIsLive() ? null : " Stripe est en mode test : aucun vrai paiement."}
        </p>
        <OrdersTable orders={orders} />
      </div>
    </>
  );
}
