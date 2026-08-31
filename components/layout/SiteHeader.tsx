"use client";

import Image from "next/image";
import { cloudinary } from "@/lib/cloudinary";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronDownIcon,
  CloseIcon,
  InstagramIcon,
  MenuIcon,
} from "@/components/primitives/icons";
import type { NavItem, SiteIdentity } from "@/lib/content/navigation";

/**
 * The floating glass pill navigation. The desktop spotlight follows the hovered
 * item by measuring it once per hover rather than animating a class, which is
 * what keeps the slide smooth without a layout pass per frame.
 */
export function SiteHeader({
  nav,
  identity,
}: {
  nav: readonly NavItem[];
  identity: SiteIdentity;
}) {
  const linksRef = useRef<HTMLUListElement>(null);
  const [spotlight, setSpotlight] = useState<{ left: number; width: number } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const mobileRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  const moveSpotlight = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const container = linksRef.current;
    if (!container) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const bounds = container.getBoundingClientRect();
    setSpotlight({ left: rect.left - bounds.left, width: rect.width });
  }, []);

  // Close the mobile sheet on an outside tap, matching the original.
  useEffect(() => {
    if (!mobileOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (mobileRef.current?.contains(target)) return;
      if (burgerRef.current?.contains(target)) return;
      setMobileOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  return (
    <div className="font-body">
      <header className="fixed top-6 left-1/2 z-1000 w-auto max-w-[95%] -translate-x-1/2">
        <nav
          aria-label="Navigation principale"
          className="relative flex items-center justify-between gap-5 backdrop-blur-[var(--menu-blur)] rounded-[50px] border border-menu-edge bg-menu-glass p-1.5 shadow-[0_15px_35px_var(--menu-shadow)] transition-[background,border-color,box-shadow] duration-600"
        >
          <Link
            href="/"
            aria-label="Roger Moniz, accueil"
            className="flex items-center gap-3 text-sm font-semibold tracking-[0.02em] whitespace-nowrap text-menu-ink transition-colors duration-600"
          >
            <Image
              src={cloudinary(identity.logo, { width: 80 })}
              alt="Roger Moniz"
              width={40}
              height={40}
              priority
              className="size-10 rounded-full border border-menu-edge object-cover [filter:var(--menu-logo-filter)] transition-[filter,border-color] duration-600"
            />
          </Link>

          <ul
            ref={linksRef}
            onMouseLeave={() => setSpotlight(null)}
            className="relative m-0 hidden items-center gap-0.5 rounded-[40px] bg-menu-pill p-1 transition-[background] duration-600 nav:flex"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1 left-0 z-1 h-[calc(100%_-_8px)] rounded-[30px] bg-menu-subtle transition-[transform,width,opacity,background] duration-300 ease-snappy"
              style={{
                width: spotlight ? `${spotlight.width}px` : 0,
                transform: `translateX(${spotlight?.left ?? 0}px)`,
                opacity: spotlight ? 1 : 0,
              }}
            />

            {nav.map((item) =>
              item.children ? (
                <li key={item.label} className="group relative flex items-center">
                  <button
                    type="button"
                    aria-haspopup="true"
                    onMouseEnter={moveSpotlight}
                    className="relative z-2 flex items-center justify-center gap-1.5 rounded-[30px] px-5 py-2.5 text-[0.8rem] leading-none font-medium text-menu-muted transition-colors duration-300 hover:text-menu-ink"
                  >
                    {item.label}
                    <ChevronDownIcon className="size-[0.6rem] opacity-50 transition-transform duration-300 ease-snappy group-hover:rotate-180 group-hover:opacity-100" />
                  </button>
                  <div
                    role="menu"
                    className="invisible absolute top-[calc(100%_+_15px)] left-1/2 z-1001 min-w-[180px] -translate-x-1/2 scale-90 rounded-2xl border border-menu-edge bg-menu-dropdown backdrop-blur-[var(--menu-blur)] p-2 opacity-0 shadow-[0_20px_50px_var(--menu-shadow)] transition-all duration-300 ease-snappy group-hover:visible group-hover:scale-100 group-hover:opacity-100"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        role="menuitem"
                        className="block rounded-lg px-4 py-2.5 text-left text-[0.8rem] text-menu-muted transition-all duration-200 hover:bg-menu-subtle hover:pl-5 hover:text-menu-ink"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </li>
              ) : (
                <li key={item.href} className="relative flex items-center">
                  <Link
                    href={item.href}
                    onMouseEnter={moveSpotlight}
                    className="relative z-2 flex items-center justify-center rounded-[30px] px-5 py-2.5 text-[0.8rem] leading-none font-medium text-menu-muted transition-colors duration-300 hover:text-menu-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>

          <div className="flex items-center gap-5">
            <a
              href={identity.instagram}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram"
              className="hidden size-10 items-center justify-center rounded-full border border-menu-edge bg-menu-subtle text-menu-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-menu-muted hover:bg-menu-strong nav:flex"
            >
              <InstagramIcon className="size-[18px]" />
            </a>
            <button
              ref={burgerRef}
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
              aria-controls="rm-mobile-menu"
              className="flex size-10 items-center justify-center rounded-full border border-menu-edge bg-menu-subtle text-menu-ink transition-all duration-300 hover:bg-menu-strong nav:hidden"
            >
              {mobileOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
            </button>
          </div>
        </nav>
      </header>

      <nav
        ref={mobileRef}
        id="rm-mobile-menu"
        aria-label="Navigation mobile"
        data-open={mobileOpen ? "true" : undefined}
        className="fixed top-[95px] left-1/2 z-999 max-h-[75vh] w-[92%] max-w-[400px] -translate-x-1/2 scale-95 -translate-y-5 overflow-y-auto rounded-[30px] border border-menu-edge bg-menu-dropdown backdrop-blur-[var(--menu-blur)] p-5 opacity-0 shadow-[0_20px_80px_var(--menu-shadow)] transition-[transform,opacity,visibility] duration-400 ease-snappy [visibility:hidden] data-[open]:translate-y-0 data-[open]:scale-100 data-[open]:opacity-100 data-[open]:[visibility:visible] nav:hidden"
      >
        <ul>
          {nav.map((item, index) => {
            const isLast = index === nav.length - 1;
            const edge = isLast ? "" : "mb-4 border-b border-menu-edge pb-4";
            if (!item.children) {
              return (
                <li key={item.href} className={edge}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center justify-between px-1.5 text-[1.05rem] font-medium text-menu-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }
            const isOpen = openSection === item.label;
            return (
              <li key={item.label} className={edge}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenSection(isOpen ? null : item.label)}
                  className="flex w-full items-center justify-between px-1.5 text-[1.05rem] font-medium text-menu-ink"
                >
                  {item.label}
                  <ChevronDownIcon
                    className={`size-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`grid overflow-hidden rounded-2xl bg-menu-pill transition-all duration-400 ease-snappy ${
                    isOpen
                      ? "mt-4 grid-rows-[1fr] border border-menu-edge p-2 opacity-100"
                      : "grid-rows-[0fr] border border-transparent opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="mb-0.5 block rounded-[10px] px-4 py-3 text-[0.95rem] text-menu-muted transition-all duration-200 last:mb-0 hover:bg-menu-subtle hover:pl-5 hover:text-menu-ink"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
