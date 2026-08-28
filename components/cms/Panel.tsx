import { TABLE_BY_NAME } from "@/lib/cms/schema";
import { addRow, deleteRowAction, moveRow } from "@/lib/cms/actions";
import { editableFields, idColumn, keyColumns, summarise, type LoadedPanel, type Row } from "@/lib/cms/read";
import { previewUrl } from "@/lib/cms/cloudinary";
import { RowForm } from "@/components/cms/RowForm";

const IMAGE_COLUMNS = ["path", "image_path", "avatar_path"] as const;

/** Several rows can share one alt text, so the file name disambiguates them. */
function fileNameOf(path: string): string {
  const last = path.split("/").pop() ?? path;
  return last.replace(/\.[a-z0-9]+$/i, "");
}

/** A picture identifies an image row far faster than its alt text does. */
function thumbnailOf(row: Row): string | null {
  for (const column of IMAGE_COLUMNS) {
    const value = row[column];
    if (typeof value === "string" && value) return value;
  }
  return null;
}

const ICON =
  "rounded-full border border-edge px-3 py-1 font-display text-[0.6rem] font-bold tracking-[1px] uppercase transition-colors duration-200 hover:border-accent hover:text-accent";

function matchFor(table: string, row: Row): Record<string, string> {
  return Object.fromEntries(keyColumns(table).map((column) => [column, String(row[column])]));
}

function RowActions({
  table,
  row,
  filters,
  first,
  last,
}: {
  table: string;
  row: Row;
  filters: Record<string, string>;
  first: boolean;
  last: boolean;
}) {
  const match = JSON.stringify(matchFor(table, row));
  const scope = JSON.stringify(filters);

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <form action={moveRow}>
        <input type="hidden" name="__table" value={table} />
        <input type="hidden" name="__match" value={match} />
        <input type="hidden" name="__filters" value={scope} />
        <input type="hidden" name="__direction" value="up" />
        <button type="submit" disabled={first} className={`${ICON} disabled:opacity-40`}>
          Monter
        </button>
      </form>
      <form action={moveRow}>
        <input type="hidden" name="__table" value={table} />
        <input type="hidden" name="__match" value={match} />
        <input type="hidden" name="__filters" value={scope} />
        <input type="hidden" name="__direction" value="down" />
        <button type="submit" disabled={last} className={`${ICON} disabled:opacity-40`}>
          Descendre
        </button>
      </form>
      <form action={deleteRowAction} className="ml-auto">
        <input type="hidden" name="__table" value={table} />
        <input type="hidden" name="__match" value={match} />
        <button type="submit" className="text-xs text-muted transition-colors duration-200 hover:text-danger">
          Supprimer
        </button>
      </form>
    </div>
  );
}

export function Panel({
  panel,
  library,
  canUpload,
}: {
  panel: LoadedPanel;
  library: readonly string[];
  canUpload: boolean;
}) {
  const spec = TABLE_BY_NAME.get(panel.table);
  if (!spec) return null;

  if (panel.form === "single") {
    const fields = editableFields(panel.table);
    return (
      <div className="mb-8">
        {panel.title ? (
          <h4 className="mb-4 font-display text-[0.65rem] font-bold tracking-[1.5px] text-muted uppercase">
            {panel.title}
          </h4>
        ) : null}
        <RowForm
          table={panel.table}
          fields={fields}
          row={panel.row}
          match={panel.row ? matchFor(panel.table, panel.row) : {}}
          filters={panel.filters}
          library={library}
          canUpload={canUpload}
          columns={fields.length > 3 ? 2 : 1}
        />
      </div>
    );
  }

  const fields = editableFields(panel.table);
  const child = panel.child;

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h4 className="font-display text-[0.65rem] font-bold tracking-[1.5px] text-muted uppercase">
          {panel.title}
          <span className="ml-2 font-normal normal-case tracking-normal">{panel.rows.length}</span>
        </h4>
        <form action={addRow}>
          <input type="hidden" name="__table" value={panel.table} />
          <input type="hidden" name="__filters" value={JSON.stringify(panel.filters)} />
          <button type="submit" className={ICON}>
            Ajouter {panel.noun}
          </button>
        </form>
      </div>

      <ul className="flex flex-col gap-2">
        {panel.rows.map((row, index) => {
          const id = String(row[idColumn(panel.table)]);
          const childRows = child ? (child.rowsById[id] ?? []) : [];
          const thumbnail = thumbnailOf(row);
          return (
            <li key={id} className="overflow-hidden rounded-xl border border-edge">
              <details>
                <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-3 text-sm text-ink transition-colors duration-200 hover:text-accent [&::-webkit-details-marker]:hidden">
                  <span className="font-display text-[0.6rem] font-bold tracking-[1px] text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {thumbnail ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={previewUrl(thumbnail, 96)}
                      alt=""
                      loading="lazy"
                      className="size-9 shrink-0 rounded-md object-cover"
                    />
                  ) : null}
                  <span className="min-w-0 flex-1 truncate">
                    {summarise(spec, row)}
                    {thumbnail ? (
                      <span className="ml-2 font-mono text-xs text-muted">{fileNameOf(thumbnail)}</span>
                    ) : null}
                  </span>
                </summary>
                <div className="border-t border-edge px-5 py-6">
                  <RowActions
                    table={panel.table}
                    row={row}
                    filters={panel.filters}
                    first={index === 0}
                    last={index === panel.rows.length - 1}
                  />
                  <RowForm
                    table={panel.table}
                    fields={fields}
                    row={row}
                    match={matchFor(panel.table, row)}
                    filters={panel.filters}
                    library={library}
                    canUpload={canUpload}
                    columns={fields.length > 3 ? 2 : 1}
                  />
                  {child ? (
                    <ChildList
                      child={child}
                      parentId={id}
                      rows={childRows}
                      library={library}
                      canUpload={canUpload}
                    />
                  ) : null}
                </div>
              </details>
            </li>
          );
        })}
      </ul>

      {panel.rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-edge px-5 py-8 text-center text-sm text-muted">
          Rien pour le moment.
        </p>
      ) : null}
    </div>
  );
}

function ChildList({
  child,
  parentId,
  rows,
  library,
  canUpload,
}: {
  child: NonNullable<Extract<LoadedPanel, { form: "rows" }>["child"]>;
  parentId: string;
  rows: readonly Row[];
  library: readonly string[];
  canUpload: boolean;
}) {
  const spec = TABLE_BY_NAME.get(child.table);
  if (!spec) return null;
  const fields = editableFields(child.table);
  const filters = { [child.foreignKey]: parentId };

  return (
    <div className="mt-8 border-t border-edge pt-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h5 className="font-display text-[0.62rem] font-bold tracking-[1.5px] text-muted uppercase">
          {child.title}
        </h5>
        <form action={addRow}>
          <input type="hidden" name="__table" value={child.table} />
          <input type="hidden" name="__filters" value={JSON.stringify(filters)} />
          <button type="submit" className={ICON}>
            Ajouter {child.noun}
          </button>
        </form>
      </div>

      <ul className="flex flex-col gap-3">
        {rows.map((row, index) => (
          <li key={String(row[idColumn(child.table)])} className="rounded-lg bg-menu-subtle px-4 py-4">
            <RowActions
              table={child.table}
              row={row}
              filters={filters}
              first={index === 0}
              last={index === rows.length - 1}
            />
            <RowForm
              table={child.table}
              fields={fields}
              row={row}
              match={matchFor(child.table, row)}
              filters={filters}
              library={library}
              canUpload={canUpload}
              submitLabel="Enregistrer la ligne"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
