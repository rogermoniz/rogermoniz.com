import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/effects/Reveal";
import { BubbleButton } from "@/components/primitives/BubbleButton";
import { cloudinary } from "@/lib/cloudinary";
import type { BlogCover } from "@/lib/content/types";

/**
 * The article held above the grid: one picture, one standfirst, one way in.
 */
export function FeaturedArticle({ cover }: { cover: BlogCover }) {
  return (
    <Reveal className="grid grid-cols-2 gap-12 max-lg:grid-cols-1">
      <Link
        href={cover.href}
        className="group relative aspect-4/3 overflow-hidden rounded-3xl bg-surface"
      >
        {cover.flag ? (
          <span className="absolute top-5 left-5 z-2 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 font-display text-[0.6rem] font-semibold tracking-[1.5px] text-white uppercase backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-accent" />
            {cover.flag}
          </span>
        ) : null}
        <Image
          src={cloudinary(cover.path, { width: 1400 })}
          alt={cover.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="size-full object-cover transition-transform duration-1600 ease-out-expo group-hover:scale-[1.04]"
        />
        <span className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.5),transparent_50%)]" />
      </Link>

      <div className="flex flex-col justify-center">
        <span className="mb-4 font-display text-[0.7rem] font-semibold tracking-[2px] text-accent uppercase">
          {cover.meta}
        </span>
        <h3 className="mb-6 font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.1] font-bold tracking-[-0.03em] text-ink uppercase">
          {cover.title}
        </h3>
        <p className="mb-10 text-[1.05rem] leading-relaxed text-muted">{cover.excerpt}</p>
        <BubbleButton href={cover.href}>{cover.ctaLabel}</BubbleButton>
      </div>
    </Reveal>
  );
}
