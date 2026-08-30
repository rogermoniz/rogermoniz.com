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
      className="grid w-full gap-[3px]"
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

export function ImageLayoutPicker({ slug, current }: { slug: string; current: number | null }) {
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

      <div className="flex flex-wrap gap-3">
        {LAYOUTS.map(({ rows, columns }) => {
          const total = rows * columns;
          const active = current === total;
          return (
            <form key={`${rows}x${columns}`} action={applyImageLayout}>
              <input type="hidden" name="slug" value={slug} />
              <input type="hidden" name="rows" value={rows} />
              <input type="hidden" name="columns" value={columns} />
              <button
                type="submit"
                className={`flex w-[104px] flex-col items-center gap-2 rounded-xl border px-3 py-3 transition-colors duration-200 ${
                  active
                    ? "border-accent text-accent"
                    : "border-edge text-muted hover:border-accent hover:text-accent"
                }`}
              >
                <span className="flex h-12 w-full items-center">
                  <Diagram rows={rows} columns={columns} />
                </span>
                <span className="font-display text-[0.6rem] font-bold tracking-[1px] uppercase">
                  {columns} × {rows}
                </span>
                <span className="text-[0.65rem] text-muted">
                  {total} image{total > 1 ? "s" : ""}
                </span>
              </button>
            </form>
          );
        })}
      </div>
    </section>
  );
}
