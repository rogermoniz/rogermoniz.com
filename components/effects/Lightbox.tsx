"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cloudinary } from "@/lib/cloudinary";
import type { CloudinaryImage } from "@/lib/content/types";

const MIN_SCALE = 0.6;
const MAX_SCALE = 4;
const STEP = 0.5;
const SWIPE_THRESHOLD = 60;

type Point = { x: number; y: number };

function IconButton({
  label,
  onClick,
  children,
  className = "",
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={className}
    >
      {children}
    </button>
  );
}

const strokeProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * Full screen image viewer. Zoom and pan are held in state and written as a
 * single transform, and every control is a real button so the whole thing is
 * reachable from the keyboard.
 */
export function Lightbox({
  images,
  openIndex,
  onClose,
}: {
  images: readonly CloudinaryImage[];
  openIndex: number | null;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const dragStart = useRef<Point | null>(null);
  const pointerStart = useRef<Point | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const isOpen = openIndex !== null;

  const reset = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (openIndex === null) return;
    setIndex(openIndex);
    reset();
  }, [openIndex, reset]);

  const go = useCallback(
    (delta: number) => {
      setIndex((current) => (current + delta + images.length) % images.length);
      reset();
    },
    [images.length, reset],
  );

  const zoom = useCallback((delta: number) => {
    setScale((current) => {
      const next = Number((current + delta).toFixed(2));
      return next < MIN_SCALE || next > MAX_SCALE ? current : next;
    });
  }, []);

  // Lock the page behind the overlay and wire the keyboard while it is open.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          go(1);
          break;
        case "ArrowLeft":
          go(-1);
          break;
        case "+":
        case "=":
          zoom(STEP);
          break;
        case "-":
          zoom(-STEP);
          break;
        case "0":
          reset();
          break;
        default:
          return;
      }
      event.preventDefault();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, go, zoom, reset, onClose]);

  if (!isOpen) return null;

  const current = images[index];
  if (!current) return null;

  const onPointerDown = (event: React.PointerEvent) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
    if (scale > 1) {
      dragStart.current = { x: event.clientX - offset.x, y: event.clientY - offset.y };
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragStart.current) return;
    setOffset({
      x: event.clientX - dragStart.current.x,
      y: event.clientY - dragStart.current.y,
    });
  };

  const onPointerUp = (event: React.PointerEvent) => {
    const start = pointerStart.current;
    dragStart.current = null;
    pointerStart.current = null;
    // At rest, a horizontal drag pages through the gallery instead of panning.
    if (scale === 1 && start) {
      const travel = event.clientX - start.x;
      if (Math.abs(travel) > SWIPE_THRESHOLD) go(travel < 0 ? 1 : -1);
    }
  };

  const toggleFullscreen = () => {
    const node = dialogRef.current;
    if (!node) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {});
    } else {
      void node.requestFullscreen?.().catch(() => {});
    }
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Galerie photo"
      tabIndex={-1}
      onClick={onClose}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-[10px]"
    >
      <IconButton
        label="Fermer"
        onClick={onClose}
        className="absolute top-5 right-5 z-[100001] flex size-11 items-center justify-center rounded-full border border-white/15 bg-[rgb(30_30_30/0.7)] text-white/90 transition-colors duration-200 hover:bg-[rgb(45_45_45/0.85)] hover:text-danger"
      >
        <svg {...strokeProps} aria-hidden="true" className="size-[22px]">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </IconButton>

      <IconButton
        label="Photo précédente"
        onClick={() => go(-1)}
        className="absolute top-1/2 left-6 z-[100000] flex size-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white backdrop-blur-[4px] transition duration-300 ease-out-expo hover:border-accent hover:bg-black/45 hover:text-accent max-md:hidden"
      >
        <svg {...strokeProps} aria-hidden="true" className="size-6">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </IconButton>

      <div
        className="relative size-full touch-none overflow-hidden"
        style={{ cursor: scale > 1 ? "grab" : "default" }}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="flex size-full items-center justify-center px-5 py-12">
          <Image
            key={current.path}
            src={cloudinary(current.path, { width: 1600 })}
            alt={current.alt}
            width={1600}
            height={2000}
            priority
            sizes="100vw"
            draggable={false}
            style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
            className="max-h-[85vh] w-auto max-w-[95%] object-contain shadow-[0_0_100px_rgb(0_0_0/0.8)] transition-transform duration-100 select-none max-md:max-h-[80vh] max-md:max-w-full"
          />
        </div>
      </div>

      <IconButton
        label="Photo suivante"
        onClick={() => go(1)}
        className="absolute top-1/2 right-6 z-[100000] flex size-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white backdrop-blur-[4px] transition duration-300 ease-out-expo hover:border-accent hover:bg-black/45 hover:text-accent max-md:hidden"
      >
        <svg {...strokeProps} aria-hidden="true" className="size-6">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </IconButton>

      <div
        onClick={(event) => event.stopPropagation()}
        className="absolute bottom-10 left-1/2 z-[100000] flex -translate-x-1/2 items-center justify-center gap-3.5 rounded-[100px] border border-white/15 bg-[rgb(20_20_20/0.75)] px-5 py-3 shadow-[0_20px_40px_rgb(0_0_0/0.45)] backdrop-blur-[24px] max-md:bottom-[22px] max-md:gap-1.5 max-md:px-3.5 max-md:py-2.5"
      >
        <IconButton label="Dézoomer" onClick={() => zoom(-STEP)} className={controlClass}>
          <svg {...strokeProps} aria-hidden="true" className="size-5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </IconButton>
        <IconButton
          label="Réinitialiser le zoom"
          onClick={reset}
          className={`${controlClass} text-[10px] font-bold tracking-[1px] text-white`}
        >
          RESET
        </IconButton>
        <IconButton label="Zoomer" onClick={() => zoom(STEP)} className={controlClass}>
          <svg {...strokeProps} aria-hidden="true" className="size-5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </IconButton>
        <span aria-hidden="true" className="h-5 w-px bg-white/20 max-md:hidden" />
        <IconButton
          label="Plein écran"
          onClick={toggleFullscreen}
          className={`${controlClass} max-md:hidden`}
        >
          <svg {...strokeProps} aria-hidden="true" className="size-5">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </IconButton>
      </div>
    </div>
  );
}

const controlClass =
  "inline-flex items-center justify-center p-1.5 text-white/85 transition duration-200 hover:-translate-y-0.5 hover:text-accent";
