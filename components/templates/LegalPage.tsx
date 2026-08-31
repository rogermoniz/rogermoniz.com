import Link from "next/link";
import { Preloader } from "@/components/effects/Preloader";
import { ArticleSidebar } from "@/components/sections/editorial/ArticleSidebar";
import { ContentBlocks } from "@/components/sections/editorial/ContentBlocks";
import { HeroMarquee } from "@/components/sections/HeroMarquee";
import type { LegalPageData } from "@/lib/content/types";

function BackArrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-[18px] transition-transform duration-400 ease-out-expo group-hover:-translate-x-[5px]"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

/** CGV, privacy policy and legal notice all render through this. */
export function LegalPage({ data }: { data: LegalPageData }) {
  const hero = data.hero;

  return (
    <>

      <div className="fixed top-6 left-6 z-1001 max-md:hidden">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 font-display text-[0.875rem] font-bold tracking-[0.1em] text-ink uppercase transition-colors duration-300 hover:text-accent"
        >
          <BackArrow />
          {data.backLabel}
        </Link>
      </div>

      <HeroMarquee hero={hero} />

      <section className="relative z-10 bg-surface px-[var(--padding-x)] pt-[var(--band-tight)] pb-[var(--band-loose)]">
        <div className="mx-auto grid max-w-[1080px] grid-cols-[260px_minmax(0,1fr)] items-start gap-[clamp(2.5rem,5vw,5vw)] max-lg:grid-cols-1">
          <div className="sticky top-10 h-max self-start max-lg:static">
            <div className="tactile flex max-h-[calc(100vh-5rem)] flex-col gap-7 overflow-y-auto rounded-[20px] p-7 max-lg:max-h-none">
              <ArticleSidebar toc={data.toc} />
            </div>
          </div>
          <div className="flex max-w-[720px] flex-col">
            <ContentBlocks sections={data.sections} />
          </div>
        </div>
      </section>
      <Preloader label={data.preloaderLabel ?? "Roger Moniz"} />
    </>
  );
}
