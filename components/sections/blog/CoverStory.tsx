import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/effects/Reveal";
import { BubbleButton } from "@/components/primitives/BubbleButton";
import { cloudinary } from "@/lib/cloudinary";
import type { BlogCover } from "@/lib/content/types";

/**
 * The article held above the journal: a wide photograph with the standfirst on
 * a raised panel that rides up over its lower left corner.
 */
export function CoverStory({ cover }: { cover: BlogCover }) {
  return (
    <Reveal as="article" className="group relative">
      <Link
        href={cover.href}
        className="relative block aspect-video w-full overflow-hidden rounded-3xl bg-surface"
      >
        {cover.flag ? (
          <span className="absolute top-[1.4rem] left-[1.4rem] z-3 inline-flex items-center gap-[9px] rounded-full border border-white/15 bg-black/40 px-3 py-1.5 font-display text-[0.6rem] font-semibold tracking-[1.5px] text-white uppercase backdrop-blur-[14px]">
            <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-accent" />
            {cover.flag}
          </span>
        ) : null}
        <Image
          src={cloudinary(cover.path, { width: 1600 })}
          alt={cover.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1400px"
          className="size-full object-cover transition-transform duration-1600 ease-out-expo group-hover:scale-[1.04]"
        />
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.6)_0%,rgb(0_0_0/0.12)_42%,transparent_68%)]" />
      </Link>

      <div className="tactile relative z-4 mt-[clamp(-130px,-9vw,-70px)] ml-[clamp(1rem,5vw,4.5rem)] w-[min(620px,88%)] rounded-[20px] p-[clamp(1.6rem,3vw,2.6rem)]">
        <p className="mb-4 text-[0.7rem] font-semibold tracking-[0.1em] text-accent uppercase">
          {cover.meta}
        </p>
        {/* Two lines each, the same rule the cards below follow, so the panel
            keeps its shape whatever the article is called and however long its
            standfirst runs. The heights are stated alongside the clamps and
            agree with them exactly: two lines of each one's own leading. */}
        <h3 className="m-0 mb-4 line-clamp-2 max-h-[2.06em] font-display text-[clamp(1.8rem,3.2vw,2.9rem)] leading-[1.03] font-bold tracking-[-0.02em] text-ink">
          {cover.title}
        </h3>
        <p className="mb-7 line-clamp-2 max-h-[3.2em] max-w-[54ch] text-[clamp(1rem,1.15vw,1.1rem)] leading-[1.6] text-muted">
          {cover.excerpt}
        </p>
        <BubbleButton href={cover.href}>{cover.ctaLabel}</BubbleButton>
      </div>
    </Reveal>
  );
}
