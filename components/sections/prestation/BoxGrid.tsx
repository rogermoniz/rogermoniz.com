import type { BoxGrid as BoxGridData } from "@/lib/content/types";

/**
 * The montage preview on an In The Box card: one cell per case in the final
 * composite, with a few 2x2 cells so the grid reads as a real layout rather
 * than a uniform swatch. Decorative, so it is hidden from assistive tech —
 * the case count is already stated in the card's feature list.
 */
export function BoxGrid({ grid }: { grid: BoxGridData }) {
  const large = new Set(grid.large);

  return (
    <div
      aria-hidden="true"
      className="mx-auto mb-10 grid w-full max-w-[600px] [grid-auto-flow:dense]"
      style={{
        gridTemplateColumns: `repeat(${grid.columns}, 1fr)`,
        // The densest layout tightens its gutter, as the original does.
        gap: grid.columns >= 6 ? "4px" : "6px",
      }}
    >
      {Array.from({ length: grid.cells }, (_, index) => (
        <div
          key={index}
          className={`w-full rounded-[var(--tile-radius)] border border-[var(--tile-border)] bg-[var(--tile-bg)] transition-all duration-300 hover:scale-[0.98] hover:bg-[var(--tile-hover)] ${
            large.has(index) ? "col-span-2 row-span-2 aspect-auto" : "aspect-square"
          }`}
        />
      ))}
    </div>
  );
}
