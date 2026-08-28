import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminBar } from "@/components/cms/AdminBar";
import { listRows, summarise } from "@/lib/cms/read";
import { TABLE_BY_NAME } from "@/lib/cms/schema";

export const dynamic = "force-dynamic";

export default async function TablePage({ params }: { params: Promise<{ table: string }> }) {
  const { table } = await params;
  const spec = TABLE_BY_NAME.get(table);
  if (!spec) notFound();

  const rows = await listRows(table);
  const hasSlug = spec.fields.some((f) => f.name === "page_slug");

  return (
    <>
      <AdminBar title={spec.label} back={{ href: "/admin", label: "Tout le contenu" }} />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-sm text-muted">
            {rows.length} {rows.length === 1 ? "entrée" : "entrées"}
          </p>
          <Link
            href={`/admin/${table}/new`}
            className="tactile rounded-[100px] px-5 py-2.5 font-display text-[0.65rem] font-bold tracking-[1px] uppercase"
          >
            Ajouter
          </Link>
        </div>

        <ul className="flex flex-col gap-2">
          {rows.map((row) => {
            const id = String(row[spec.primaryKey]);
            return (
              <li key={id}>
                <Link
                  href={`/admin/${table}/${encodeURIComponent(id)}`}
                  className="tactile flex items-center gap-4 rounded-2xl px-5 py-4 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {hasSlug ? (
                    <span className="shrink-0 rounded-full bg-menu-subtle px-2.5 py-1 font-display text-[0.6rem] font-bold tracking-[1px] text-muted uppercase">
                      {String(row.page_slug ?? "")}
                    </span>
                  ) : null}
                  <span className="min-w-0 flex-1 truncate text-sm text-ink">
                    {summarise(spec, row)}
                  </span>
                  <span className="shrink-0 text-xs text-muted">modifier →</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {rows.length === 0 ? (
          <p className="py-12 text-center text-muted">Aucune entrée pour le moment.</p>
        ) : null}
      </div>
    </>
  );
}
