"use client";

type Block = Record<string, unknown> & { type?: string };

/**
 * The arrangements a part's pictures can take, drawn rather than described.
 * What is chosen here is what the page renders: the grid is laid out on this
 * many columns and no cleverness is applied on top, so the diagram and the
 * article agree.
 */
const LAYOUTS: readonly { rows: number; columns: number }[] = [
  { rows: 1, columns: 1 },
  { rows: 1, columns: 2 },
  { rows: 1, columns: 3 },
  { rows: 2, columns: 2 },
  { rows: 2, columns: 3 },
  { rows: 3, columns: 3 },
  { rows: 2, columns: 4 },
];

const blankFigure = (): Block => ({ type: "figure", variant: "", path: "", alt: "" });
const isFilled = (figure: Block) => String(figure.path ?? "").trim() !== "";

function Diagram({ rows, columns }: { rows: number; columns: number }) {
  return (
    <span
      aria-hidden="true"
      // Sized by its height, so a tall arrangement stays inside its tile
      // instead of growing over the label underneath it.
      className="grid h-full w-auto max-w-full gap-[3px]"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        aspectRatio: `${columns} / ${rows}`,
      }}
    >
      {Array.from({ length: rows * columns }, (_, i) => (
        <span key={i} className="rounded-[2px] bg-current opacity-30" />
      ))}
    </span>
  );
}

/**
 * What this part's pictures do today, so the picker opens on the answer.
 *
 * "inherited" is a grid written before this control existed: its shape comes
 * from a variant and the page draws it with a flourish of its own, so no tile
 * here is the truth about it. Saying nothing is better than highlighting a
 * shape the article does not actually have; choosing one settles it.
 */
type Layout = { rows: number; columns: number } | "inherited" | null;

function currentLayout(blocks: Block[]): Layout {
  const group = blocks.find((b) => b.type === "figureGroup");

  if (group) {
    const figures = (group.figures as Block[] | undefined) ?? [];
    if (!figures.length) return null;
    if (group.columns === undefined) return "inherited";
    const columns = Number(group.columns) || 1;
    return { rows: Math.ceil(figures.length / columns), columns };
  }

  // Loose pictures stack full width, which is one per row and unambiguous.
  const loose = blocks.filter((b) => b.type === "figure");
  return loose.length ? { rows: loose.length, columns: 1 } : null;
}

export function SectionImageLayout({
  blocks,
  onApply,
}: {
  blocks: Block[];
  onApply: (blocks: Block[]) => void;
}) {
  const layout = currentLayout(blocks);
  const inherited = layout === "inherited";
  const current = inherited ? null : layout;

  /**
   * Applying a layout keeps every photograph already chosen and tops the grid
   * up with empty slots, so the fields say how many pictures the arrangement
   * wants. The grid stays where the pictures already were: an existing one is
   * rewritten in place and loose pictures become a grid at the first of them,
   * so the prose around them never moves.
   */
  const apply = (rows: number, columns: number) => {
    const wanted = rows * columns;
    const at = blocks.findIndex((b) => b.type === "figureGroup");
    const loose = blocks.filter((b) => b.type === "figure");
    const existing =
      at === -1 ? loose : ((blocks[at]?.figures as Block[] | undefined) ?? []);

    const figures = existing.filter(isFilled);
    while (figures.length < wanted) figures.push(blankFigure());

    const group: Block = {
      ...(at === -1 ? { type: "figureGroup", variant: "" } : blocks[at]),
      type: "figureGroup",
      columns,
      figures,
    };

    if (at !== -1) {
      onApply(blocks.map((b, i) => (i === at ? group : b)));
      return;
    }
    if (loose.length) {
      const first = blocks.findIndex((b) => b.type === "figure");
      onApply(
        blocks.filter((b, i) => b.type !== "figure" || i === first).map((b) => (b.type === "figure" ? group : b)),
      );
      return;
    }
    onApply([...blocks, group]);
  };

  return (
    <div className="mb-5 rounded-xl border border-edge px-5 py-4">
      <h5 className="font-display text-[0.6rem] font-bold tracking-[1px] text-muted uppercase">
        Les images de cette partie
      </h5>
      <p className="mt-1.5 mb-4 max-w-prose text-xs text-muted">
        La disposition choisie est celle de la page. Les emplacements apparaissent aussitôt
        ci-dessous, vides et prêts à remplir. Une photo déjà en place n&apos;est jamais retirée.
      </p>

      {inherited ? (
        <p className="mb-4 -mt-2 text-xs text-accent">
          Cette partie utilise une ancienne disposition, que la page dessine à sa façon.
          Choisissez-en une ci-dessous pour que la page corresponde exactement.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {LAYOUTS.map(({ rows, columns }) => {
          const total = rows * columns;
          const active = current?.rows === rows && current?.columns === columns;
          return (
            <button
              key={`${rows}x${columns}`}
              type="button"
              aria-pressed={active}
              onClick={() => apply(rows, columns)}
              className={`flex w-[84px] flex-col items-center gap-1.5 rounded-lg border px-2 py-2 transition-colors duration-200 ${
                active
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-edge text-muted hover:border-accent hover:text-accent"
              }`}
            >
              <span className="flex h-9 w-full items-center justify-center">
                <Diagram rows={rows} columns={columns} />
              </span>
              <span className="font-display text-[0.55rem] font-bold tracking-[1px] uppercase">
                {columns} × {rows}
              </span>
              <span className={`text-[0.6rem] ${active ? "text-accent" : "text-muted"}`}>
                {active ? "Utilisée" : `${total} image${total > 1 ? "s" : ""}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
