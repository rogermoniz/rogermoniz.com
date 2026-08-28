"use client";

import { useState } from "react";
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
            className="flex w-full items-center justify-between border-b border-edge pb-4 font-display text-[0.7rem] font-semibold tracking-[2px] text-ink uppercase lg:pointer-events-none"
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
              <ul className="pt-4">
                {toc.map((entry) => (
                  <li key={entry.href}>
                    <a
                      href={entry.href}
                      className="block py-2 text-[0.9rem] leading-snug text-muted transition-colors duration-300 hover:text-ink"
                    >
                      {entry.label}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      ) : null}

      {meta ? (
        <div className="flex flex-col gap-6">
          {meta.blocks.map((block) => (
            <div key={block.label} className="flex flex-col gap-1">
              <span className="font-display text-[0.65rem] font-semibold tracking-[2px] text-muted uppercase">
                {block.label}
              </span>
              <span className="text-[0.95rem] text-ink">{block.value}</span>
            </div>
          ))}
          {meta.shareLabel ? (
            <div className="flex flex-col gap-3">
              <span className="font-display text-[0.65rem] font-semibold tracking-[2px] text-muted uppercase">
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
