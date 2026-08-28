"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/effects/Reveal";
import { ArrowRightIcon } from "@/components/primitives/icons";
import { cloudinary } from "@/lib/cloudinary";

export type ArticleCard = {
  href: string;
  /** Events carry a date and place line; blog posts do not. */
  date?: string | null;
  badge: string | null;
  path: string | null;
  alt: string;
  title: string | null;
  description: string | null;
  ctaLabel: string;
  category?: string;
};

export function Card({ card }: { card: ArticleCard }) {
  return (
    <Link
      href={card.href}
      className="tactile group flex h-full flex-col overflow-hidden rounded-[18px] transition-transform duration-600 ease-out-expo hover:-translate-y-1.5"
    >
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
            sizes="(max-width: 768px) 100vw, 33vw"
            className="size-full object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="flex grow flex-col p-6">
        {card.date ? (
          <span className="mb-2 font-body text-[0.7rem] font-semibold tracking-[1.5px] text-accent uppercase">
            {card.date}
          </span>
        ) : null}
        <h3 className="mb-3 font-display text-[clamp(1.1rem,1.8vw,1.4rem)] font-bold tracking-[-0.02em] text-ink uppercase">
          {card.title}
        </h3>
        <p className="mb-6 grow text-[0.95rem] leading-relaxed text-muted">{card.description}</p>
        <span className="tactile inline-flex w-fit items-center gap-3 rounded-[100px] px-5 py-2.5">
          <span className="font-display text-[0.7rem] font-bold tracking-[0.05em] uppercase">
            {card.ctaLabel}
          </span>
          <ArrowRightIcon className="size-4" />
        </span>
      </div>
    </Link>
  );
}

/**
 * The filterable article grid. Filtering is React state, so hidden cards leave
 * the accessibility tree entirely rather than being visually hidden.
 */
export function ArticleGrid({
  cards,
  filters,
  filterHead,
}: {
  cards: readonly ArticleCard[];
  filters?: readonly { value: string; label: string }[];
  filterHead?: string;
}) {
  const [active, setActive] = useState("all");
  const visible = active === "all" ? cards : cards.filter((c) => c.category === active);

  return (
    <>
      {filters?.length ? (
        <div className="mb-12">
          {filterHead ? (
            <Reveal className="mb-6 font-display text-[0.7rem] font-semibold tracking-[2px] text-muted uppercase">
              {filterHead}
            </Reveal>
          ) : null}
          <Reveal className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                aria-pressed={active === filter.value}
                onClick={() => setActive(filter.value)}
                className={`tactile rounded-[100px] px-5 py-2.5 font-display text-[0.7rem] font-bold tracking-[1px] uppercase transition-colors ${
                  active === filter.value ? "!text-accent" : ""
                }`}
              >
                {filter.label}
              </button>
            ))}
          </Reveal>
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-10 max-lg:grid-cols-2 max-md:grid-cols-1">
        {visible.map((card) => (
          <Reveal key={card.href + (card.title ?? "")}>
            <Card card={card} />
          </Reveal>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-12 text-center text-muted">Aucun article dans cette catégorie.</p>
      ) : null}
    </>
  );
}
