import { Reveal } from "@/components/effects/Reveal";
import type { FigureColumns } from "@/lib/content/types";

/**
 * A row of pictures. The slot count is data, so a section can hold one image
 * or four without a new component, and each count keeps a sensible ladder down
 * to a phone.
 */
const GRID: Record<FigureColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2 max-[560px]:grid-cols-1",
  3: "grid-cols-3 max-md:grid-cols-2 max-[560px]:grid-cols-1",
  4: "grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-[560px]:grid-cols-1",
};

/** Older content names a variant instead of a count; both mean a column count. */
const BY_VARIANT: Record<string, FigureColumns> = {
  "or-steps": 4,
  "or-stats": 4,
};

export function figureColumns(variant: string, columns?: FigureColumns): FigureColumns {
  return columns ?? BY_VARIANT[variant] ?? 3;
}

export function FigureGroup({
  variant,
  columns,
  children,
}: {
  variant: string;
  columns?: FigureColumns;
  children: React.ReactNode;
}) {
  return (
    <Reveal
      className={`mt-[clamp(1.6rem,3vw,2.4rem)] mb-[clamp(1.6rem,3vw,2.4rem)] grid gap-[clamp(1rem,1.6vw,1.4rem)] last:mb-0 ${GRID[figureColumns(variant, columns)]}`}
    >
      <div className="contents [&_figure]:mb-0">{children}</div>
    </Reveal>
  );
}
