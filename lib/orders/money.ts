/**
 * Prices are written by hand in the editor, as they are shown: "200€",
 * "+ 15€", "Inclus". Stripe wants an integer number of cents, so the text is
 * read strictly here and an unreadable price stops the build rather than
 * charging a guess.
 */
const FREE = new Set(["", "0", "0€", "inclus", "incluse", "offert", "offerte", "gratuit", "gratuite"]);

export function parseEuros(text: string): number {
  const compact = text.replace(/[\s  ]/g, "").replace(/^\+/, "").toLowerCase();
  if (FREE.has(compact)) return 0;
  const match = /^€?(\d+)(?:[.,](\d{1,2}))?(?:€|eur|euros?)?$/.exec(compact);
  if (!match) throw new Error(`Prix illisible : « ${text} »`);
  const euros = Number(match[1]);
  const cents = Number((match[2] ?? "").padEnd(2, "0"));
  return euros * 100 + cents;
}

export function formatEuros(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

/** The same reading, for a price that may legitimately be prose ("Sur devis"). */
export function tryParseEuros(text: string): number | null {
  try {
    return parseEuros(text);
  } catch {
    return null;
  }
}
