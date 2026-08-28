import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/effects/Reveal";
import { Container, SectionHeading2 } from "@/components/primitives/Typography";
import { cloudinary } from "@/lib/cloudinary";
import type { ArticlePageData } from "@/lib/content/types";

type ReadNextData = NonNullable<ArticlePageData["readNext"]>;

/**
 * Cards are only links when the source gave them a destination; the originals
 * ship some with href="#", which would be a trap for keyboard users.
 */
export function ReadNext({ data }: { data: ReadNextData }) {
  return (
    <section className="bg-surface py-[clamp(64px,7vw,100px)]">
      <Container>
        <Reveal variant="text">
          <SectionHeading2 className="mb-12">{data.title}</SectionHeading2>
        </Reveal>
        <div className="grid grid-cols-2 gap-8 max-md:grid-cols-1">
          {data.cards.map((card, index) => {
            const body = (
              <>
                <div className="relative aspect-video overflow-hidden bg-surface">
                  {card.badge ? (
                    <span className="absolute top-4 left-4 z-2 rounded-full bg-black/60 px-3 py-1 font-display text-[0.6rem] font-semibold tracking-[1.5px] text-white uppercase backdrop-blur-sm">
                      {card.badge}
                    </span>
                  ) : null}
                  {card.path ? (
                    <Image
                      src={cloudinary(card.path, { width: 1000 })}
                      alt={card.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="size-full object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105"
                    />
                  ) : null}
                </div>
                <div className="p-6">
                  <h3 className="mb-3 font-display text-[clamp(1.1rem,1.8vw,1.4rem)] font-bold tracking-[-0.02em] text-ink uppercase">
                    {card.title}
                  </h3>
                  <p className="text-[0.95rem] leading-relaxed text-muted">{card.description}</p>
                </div>
              </>
            );

            return card.href ? (
              <Reveal key={index}>
                <Link
                  href={card.href}
                  className="tactile group flex h-full flex-col overflow-hidden rounded-[18px] transition-transform duration-600 ease-out-expo hover:-translate-y-1.5"
                >
                  {body}
                </Link>
              </Reveal>
            ) : (
              <Reveal key={index} className="tactile group flex h-full flex-col overflow-hidden rounded-[18px]">
                {body}
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
