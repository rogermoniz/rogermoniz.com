"use client";

import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@/components/primitives/icons";
import { InstagramOutlineIcon, MailIcon } from "@/components/primitives/SocialIcons";
import type { ArticlePageData, TocEntry } from "@/lib/content/types";

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

/**
 * Table of contents plus article metadata. The list collapses on narrow
 * screens, where it would otherwise push the article itself below the fold.
 */
export function ArticleSidebar({
  toc,
  meta,
  tocLabel = "Sommaire",
}: {
  toc: readonly TocEntry[];
  meta?: ArticlePageData["meta"];
  tocLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  /**
   * Scroll spy. The reader's place in the article is marked by the dot on the
   * rail, so the list says where you are rather than only where you can go.
   */
  useEffect(() => {
    const ids = toc.map((entry) => entry.href.replace(/^#/, "")).filter(Boolean);
    if (!ids.length || !("IntersectionObserver" in window)) return;

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);
    if (!sections.length) return;

    const seen = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) seen.set(entry.target.id, entry.intersectionRatio);
        let best: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of seen) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        if (best) setActive(`#${best}`);
      },
      { threshold: [0, 0.15, 0.4, 0.75, 1], rootMargin: "-15% 0px -55% 0px" },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [toc]);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ url, title: document.title });
      else await navigator.clipboard.writeText(url);
    } catch {
      // The reader dismissed the sheet, or the clipboard is unavailable.
    }
  };

  return (
    <aside className="sticky top-32 flex flex-col gap-10 max-lg:static">
      {toc.length > 0 ? (
        <nav aria-label={tocLabel}>
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="mb-5 flex w-full items-center justify-between gap-3 text-left text-[0.7rem] font-semibold tracking-[0.14em] text-accent uppercase lg:pointer-events-none lg:cursor-default"
          >
            <span>{tocLabel}</span>
            <ChevronDownIcon
              className={`size-4 transition-transform duration-300 lg:hidden ${open ? "rotate-180" : ""}`}
            />
          </button>
          <ul
            className={`grid transition-[grid-template-rows] duration-400 ease-snappy lg:grid-rows-[1fr] ${
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <li className="overflow-hidden">
              <ul className="relative flex flex-col gap-[0.85rem] lg:before:absolute lg:before:top-[5px] lg:before:bottom-[5px] lg:before:left-0 lg:before:w-px lg:before:bg-edge lg:before:content-['']">
                {toc.map((entry) => {
                  const isActive = entry.href === active;
                  return (
                    <li key={entry.href} className="relative lg:pl-5">
                      <span
                        aria-hidden="true"
                        className={`absolute top-[0.6em] -left-[2px] hidden size-1.5 -translate-y-1/2 rounded-full bg-accent transition-transform duration-300 ease-out-expo lg:block ${
                          isActive ? "scale-100" : "scale-0"
                        }`}
                      />
                      <a
                        href={entry.href}
                        aria-current={isActive ? "location" : undefined}
                        className={`inline-block text-[0.92rem] leading-[1.35] font-medium transition-colors duration-300 hover:text-ink ${
                          isActive ? "text-ink" : "text-muted"
                        }`}
                      >
                        {entry.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      ) : null}

      {meta ? (
        <div className="flex flex-col gap-6">
          {meta.blocks.map((block) => (
            <div key={block.label} className="flex flex-col gap-1">
              <span className="text-[0.66rem] font-semibold tracking-[0.1em] text-muted uppercase">
                {block.label}
              </span>
              <span className="text-[0.95rem] font-semibold text-ink">{block.value}</span>
            </div>
          ))}
          {meta.shareLabel ? (
            <div className="flex flex-col gap-3">
              <span className="text-[0.66rem] font-semibold tracking-[0.1em] text-muted uppercase">
                {meta.shareLabel}
              </span>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/roger.moniz.photographe/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Instagram"
                  className="tactile flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:text-accent"
                >
                  <InstagramOutlineIcon className="size-4" />
                </a>
                <a
                  href="mailto:contact@rogermoniz.com"
                  aria-label="Partager par email"
                  className="tactile flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:text-accent"
                >
                  <MailIcon className="size-4" />
                </a>
                <button
                  type="button"
                  onClick={share}
                  aria-label="Copier le lien"
                  className="tactile flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:text-accent"
                >
                  <LinkIcon />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
