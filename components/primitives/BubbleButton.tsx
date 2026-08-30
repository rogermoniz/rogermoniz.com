import Link from "next/link";
import type { SVGProps } from "react";

function DiagonalArrow(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" {...props}>
      <line x1="5" y1="19" x2="19" y2="5" />
      <polyline points="9 5 19 5 19 15" />
    </svg>
  );
}

function Label({ children }: { children: string }) {
  return (
    <>
      <span className="z-2 font-display text-[length:var(--button-label-size)] tracking-[0.05em] uppercase [font-weight:var(--button-label-weight)]">
        {children}
      </span>
      <span className="relative z-2 block size-5 overflow-hidden">
        <DiagonalArrow className="absolute top-0 left-0 size-full transition-transform duration-600 ease-out-expo group-hover:translate-x-full group-hover:-translate-y-full" />
        <DiagonalArrow className="absolute top-0 left-0 size-full -translate-x-full translate-y-full transition-transform duration-600 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0" />
      </span>
    </>
  );
}

/**
 * The primary call to action. Two arrows share one clipped box: the first
 * leaves to the top right on hover while the second arrives from the bottom
 * left, which is what makes the glyph appear to travel through the button.
 *
 * It goes somewhere or it does something, never both: given `onClick` and no
 * `href` it is a real button, so an action on the page is this same control
 * rather than a link pretending to be one.
 */
export function BubbleButton({
  href,
  onClick,
  children,
  variant = "outline",
  fullWidth = false,
  className = "",
}: {
  href?: string;
  onClick?: () => void;
  children: string;
  variant?: "outline" | "solid";
  fullWidth?: boolean;
  className?: string;
}) {
  const surface = variant === "solid" ? "border border-edge bg-ink text-surface" : "tactile";
  const shell = `group inline-flex items-center gap-4 rounded-[100px] px-6 py-3 ${surface} ${
    fullWidth ? "w-full justify-center" : ""
  } ${className}`;

  if (href === undefined) {
    return (
      <button type="button" onClick={onClick} className={shell}>
        <Label>{children}</Label>
      </button>
    );
  }

  return (
    <Link href={href} className={shell}>
      <Label>{children}</Label>
    </Link>
  );
}
