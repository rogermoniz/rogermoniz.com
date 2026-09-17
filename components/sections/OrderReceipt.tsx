import { BubbleButton } from "@/components/primitives/BubbleButton";
import { Container, DisplayHeading, Eyebrow, HeadingSub } from "@/components/primitives/Typography";
import { formatEuros } from "@/lib/orders/money";
import type { Order } from "@/lib/orders/order";

export type PaymentOutcome = "paid" | "processing" | "unpaid";

const OUTCOME: Record<PaymentOutcome, string> = {
  paid: "Paiement reçu",
  processing: "Paiement en cours de confirmation",
  unpaid: "Paiement non abouti",
};

const UNPAID =
  "Le paiement n’a pas été validé. Rien n’a été débité : vous pouvez reprendre votre commande quand vous le souhaitez.";
const PROCESSING =
  "Votre banque confirme le paiement sous quelques jours. Vous recevrez un email dès que c’est fait.";

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-t border-edge py-4 text-left first:border-t-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
      <dt className="font-body text-[0.8rem] font-semibold tracking-[0.08em] text-muted uppercase">{label}</dt>
      <dd className="m-0 font-body text-base text-ink sm:text-right">{value}</dd>
    </div>
  );
}

/**
 * What the buyer sees back from Stripe: the heading the editor wrote for
 * this shop, and the order as it was placed. Stripe's answer decides the
 * tone; the order book only fills in what was bought.
 */
export function OrderReceipt({
  heading,
  lead,
  order,
  outcome,
  retryHref,
}: {
  heading: { eyebrow: string | null; title: string; subtitle: string | null };
  lead: string | null;
  order: Order;
  outcome: PaymentOutcome;
  retryHref: string;
}) {
  const paid = outcome === "paid";
  const message = paid ? lead : outcome === "processing" ? PROCESSING : UNPAID;

  return (
    <Container
      as="section"
      className="flex min-h-svh flex-col items-center justify-center bg-surface py-[var(--band-hero)] text-center"
    >
      <Eyebrow>{paid && heading.eyebrow ? heading.eyebrow : OUTCOME[outcome]}</Eyebrow>
      <DisplayHeading as="h1">{paid ? heading.title : OUTCOME[outcome]}</DisplayHeading>
      {paid && heading.subtitle ? <HeadingSub>{heading.subtitle}</HeadingSub> : null}

      {message ? (
        <p className="mx-auto mt-10 max-w-[56ch] font-body text-[clamp(1.05rem,1.5vw,1.3rem)] leading-[1.7] text-muted">
          {message}
        </p>
      ) : null}

      <dl className="tactile mx-auto mt-14 w-full max-w-xl rounded-[20px] px-8 py-4">
        <Line
          label={order.kind === "gift" ? "Formule" : "Séance"}
          value={`${order.itemTitle} · ${formatEuros(order.amountTotal)}`}
        />
        {order.optionTitle ? <Line label="Remise" value={order.optionTitle} /> : null}
        <Line label={order.kind === "gift" ? "De la part de" : "Réservée par"} value={order.customerName} />
        {order.recipient ? <Line label="Pour" value={order.recipient} /> : null}
        <Line label="Email" value={order.email} />
        {order.phone ? <Line label="Téléphone" value={order.phone} /> : null}
        <Line label="Statut" value={OUTCOME[outcome]} />
      </dl>

      <div className="mt-12 flex flex-wrap justify-center gap-4">
        {outcome === "unpaid" ? (
          <BubbleButton href={retryHref} variant="solid">
            Reprendre ma commande
          </BubbleButton>
        ) : null}
        <BubbleButton href="/">Retour à l’accueil</BubbleButton>
      </div>
    </Container>
  );
}
