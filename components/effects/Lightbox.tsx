"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cloudinary } from "@/lib/cloudinary";
import type { CloudinaryImage } from "@/lib/content/types";

const MIN_SCALE = 0.6;
const MAX_SCALE = 4;
const STEP = 0.5;
const SWIPE_THRESHOLD = 60;

/** The strip glides to its neighbour, then recentres with no transition. */
const SLIDE_MS = 320;
const SLIDE_EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";

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
  poster = null,
}: {
  images: readonly CloudinaryImage[];
  openIndex: number | null;
  onClose: () => void;
  /** The exact file the clicked thumbnail is showing, already in cache. */
  poster?: string | null;
}) {
  const [index, setIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  /** How far the strip has been dragged or glided from centre, in pixels. */
  const [shift, setShift] = useState(0);
  const [sliding, setSliding] = useState(false);
  const dragStart = useRef<Point | null>(null);
  const pointerStart = useRef<Point | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const slideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  /**
   * Zoomed in, paging swaps the photo outright: sliding a magnified image
   * sideways reads as a glitch rather than as navigation.
   */
  const go = useCallback(
    (delta: number) => {
      if (scale > 1.02) {
        setIndex((current) => (current + delta + images.length) % images.length);
        reset();
        return;
      }
      if (slideTimer.current) return;

      setSliding(true);
      setShift(delta > 0 ? -window.innerWidth : window.innerWidth);
      slideTimer.current = setTimeout(() => {
        setIndex((current) => (current + delta + images.length) % images.length);
        reset();
        setSliding(false);
        setShift(0);
        slideTimer.current = null;
      }, SLIDE_MS);
    },
    [images.length, reset, scale],
  );

  useEffect(() => () => {
    if (slideTimer.current) clearTimeout(slideTimer.current);
  }, []);

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

  const at = (delta: number) => images[(index + delta + images.length) % images.length] ?? current;
  const neighbours = [at(-1), current, at(1)];
  /** One step beyond the strip, fetched but never painted. */
  const warm = [at(-2), at(2)].filter((image) => !neighbours.includes(image));

  const onPointerDown = (event: React.PointerEvent) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
    if (scale > 1) {
      dragStart.current = { x: event.clientX - offset.x, y: event.clientY - offset.y };
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (dragStart.current) {
      setOffset({
        x: event.clientX - dragStart.current.x,
        y: event.clientY - dragStart.current.y,
      });
      return;
    }
    // At rest the strip follows the finger, so a swipe feels connected to it.
    if (pointerStart.current && scale === 1 && !sliding) {
      setShift(event.clientX - pointerStart.current.x);
    }
  };

  const onPointerUp = (event: React.PointerEvent) => {
    const start = pointerStart.current;
    dragStart.current = null;
    pointerStart.current = null;
    if (scale !== 1 || !start) return;

    // At rest, a horizontal drag pages through the gallery instead of panning.
    const travel = event.clientX - start.x;
    if (Math.abs(travel) > SWIPE_THRESHOLD) {
      setShift(0);
      go(travel < 0 ? 1 : -1);
      return;
    }
    // Too short to count as a swipe, so the strip springs back to centre.
    setSliding(true);
    setShift(0);
    window.setTimeout(() => setSliding(false), SLIDE_MS);
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

  return createPortal(
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
        {/*
          Three slides wide, parked on the middle one. Paging glides the strip
          to a neighbour that is already decoded, which is what makes the move
          read as a slide rather than as a photo being replaced.
        */}
        <div
          className="absolute inset-0 flex h-full w-[300%]"
          style={{
            transform: `translateX(calc(-33.3333% + ${shift}px))`,
            transition: sliding ? `transform ${SLIDE_MS}ms ${SLIDE_EASE}` : "none",
          }}
        >
          {neighbours.map((image, position) => (
            <div
              key={image.path}
              className="flex h-full basis-1/3 items-center justify-center px-5 py-12"
            >
              <Slide
                image={image}
                isCurrent={position === 1}
                poster={position === 1 && index === openIndex ? poster : null}
                transform={`translate(${offset.x}px, ${offset.y}px) scale(${scale})`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Decoding the next pair now is what makes a second page instant. */}
      <div aria-hidden="true" className="pointer-events-none absolute size-px overflow-hidden opacity-0">
        {warm.map((image) => (
          <Image
            key={image.path}
            src={cloudinary(image.path, { width: 1600 })}
            alt=""
            width={16}
            height={20}
            loading="eager"
            sizes="(max-width: 768px) 100vw, 65vh"
          />
        ))}
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
    </div>,
    document.body,
  );
}

const controlClass =
  "inline-flex items-center justify-center p-1.5 text-white/85 transition duration-200 hover:-translate-y-0.5 hover:text-accent";

/**
 * One photo on the strip. It fades in once decoded rather than popping, and
 * only the middle slide carries the zoom and pan transform.
 */
function Slide({
  image,
  isCurrent,
  poster,
  transform,
}: {
  image: CloudinaryImage;
  isCurrent: boolean;
  poster: string | null;
  transform: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // A cached photo is already complete before React can attach onLoad, so the
  // load event never fires and the fade would leave it invisible forever.
  useEffect(() => {
    if (imageRef.current?.complete) setLoaded(true);
  }, [image.path]);

  return (
    <span className="relative flex max-h-[85vh] max-w-[95%] items-center justify-center max-md:max-h-[80vh] max-md:max-w-full">
      {poster && !loaded ? (
        /* The thumbnail is already decoded, so the viewer never opens empty.
           eslint-disable-next-line @next/next/no-img-element */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{ transform: isCurrent ? transform : undefined }}
          className="max-h-[85vh] w-auto max-w-full object-contain shadow-[0_0_100px_rgb(0_0_0/0.8)] select-none max-md:max-h-[80vh]"
        />
      ) : null}
      <Image
      src={cloudinary(image.path, { width: 1600 })}
      alt={isCurrent ? image.alt : ""}
      width={1600}
      height={2000}
      priority={isCurrent}
      loading="eager"
      /* Height bound, not width bound: the photo is capped at 85vh, so a
         portrait is roughly 65vh wide. Asking for 80vw fetched a 3840px file
         for a 380px box, which is what made the viewer slow to open. */
      sizes="(max-width: 768px) 100vw, 65vh"
      draggable={false}
      ref={imageRef}
      onLoad={() => setLoaded(true)}
      style={{
        transform: isCurrent ? transform : undefined,
        // Without a poster there is nothing underneath, so never hide it.
        opacity: poster && !loaded ? 0 : 1,
        transition: "transform 0.1s linear, opacity 0.3s ease",
      }}
      className={`max-h-[85vh] w-auto max-w-[95%] object-contain shadow-[0_0_100px_rgb(0_0_0/0.8)] select-none max-md:max-h-[80vh] max-md:max-w-full ${
        poster && !loaded ? "absolute inset-0 m-auto" : ""
      }`}
      />
    </span>
  );
}
