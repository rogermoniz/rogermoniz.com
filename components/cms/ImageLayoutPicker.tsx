import { applyImageLayout } from "@/lib/cms/actions";

/**
 * The shapes an article's pictures can take, drawn rather than described: the
 * author picks the arrangement they can see, and every part of the article is
 * given exactly that many image fields, so nobody has to work out how many
 * photographs a layout needs.
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

export type CurrentLayout = { rows: number; columns: number } | "mixed" | null;

export function ImageLayoutPicker({ slug, current }: { slug: string; current: CurrentLayout }) {
  const mixed = current === "mixed";
  const chosen = mixed ? null : current;
  return (
    <section className="mb-12 rounded-2xl border border-edge px-6 py-6">
      <h3 className="font-display text-[0.65rem] font-bold tracking-[1.5px] text-muted uppercase">
        Les images de l&apos;article
      </h3>
      <p className="mt-2 mb-6 max-w-prose text-sm text-muted">
        Choisissez la disposition des photos qui suivent chaque partie. Les emplacements
        apparaissent aussitôt dans « Le contenu », vides et prêts à remplir, autant qu&apos;il en
        faut. Une photo déjà en place n&apos;est jamais retirée.
      </p>

      {mixed ? (
        <p className="mb-6 -mt-3 text-sm text-muted">
          Les parties de cet article n&apos;ont pas toutes la même disposition. En choisir une
          ci-dessous les alignera toutes.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {LAYOUTS.map(({ rows, columns }) => {
          const total = rows * columns;
          const active = chosen?.rows === rows && chosen?.columns === columns;
          return (
            <form key={`${rows}x${columns}`} action={applyImageLayout}>
              <input type="hidden" name="slug" value={slug} />
              <input type="hidden" name="rows" value={rows} />
              <input type="hidden" name="columns" value={columns} />
              <button
                type="submit"
                aria-pressed={active}
                className={`flex w-[104px] flex-col items-center gap-2 rounded-xl border px-3 py-3 transition-colors duration-200 ${
                  active
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-edge text-muted hover:border-accent hover:text-accent"
                }`}
              >
                <span className="flex h-14 w-full items-center justify-center">
                  <Diagram rows={rows} columns={columns} />
                </span>
                <span className="font-display text-[0.6rem] font-bold tracking-[1px] uppercase">
                  {columns} × {rows}
                </span>
                <span className={`text-[0.65rem] ${active ? "text-accent" : "text-muted"}`}>
                  {active ? "Utilisée" : `${total} image${total > 1 ? "s" : ""}`}
                </span>
              </button>
            </form>
          );
        })}
      </div>
    </section>
  );
}
