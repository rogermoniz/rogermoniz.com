import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/effects/Reveal";
import { Container, Eyebrow, HeadingSub, SectionHeading2 } from "@/components/primitives/Typography";
import { BookingBuilder } from "@/components/sections/BookingBuilder";
import { getBookingPage } from "@/lib/content/source";

/**
 * The booking page of a priced prestation. It exists only for pages whose
 * formulas carry a readable price: a page that invites a quote has none. It
 * reads the chosen formula off the query string, so it renders per request.
 */

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getBookingPage(slug);
  if (!page) return {};
  return { title: `Réserver · ${page.name} | Roger Moniz`, robots: { index: false, follow: false } };
}

export default async function BookingRoute({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ formule?: string | string[] }>;
}) {
  const [{ slug }, { formule }] = await Promise.all([params, searchParams]);
  const page = await getBookingPage(slug);
  if (!page) notFound();

  return (
    <Container as="section" className="bg-surface pt-[var(--band-hero)] pb-[var(--band-loose)] text-center">
      <Eyebrow>{page.heading.eyebrow ?? "Réservation"}</Eyebrow>
      <Reveal variant="text">
        <SectionHeading2 className="mb-7">
          {page.heading.title || page.name}
          <HeadingSub>{page.heading.subtitle ?? page.name}</HeadingSub>
        </SectionHeading2>
      </Reveal>
      <div className="mt-[var(--band)] text-left">
        <BookingBuilder page={slug} cards={page.cards} preselected={typeof formule === "string" ? formule : null} />
      </div>
    </Container>
  );
}
