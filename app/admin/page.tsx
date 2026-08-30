import Link from "next/link";
import { AdminBar } from "@/components/cms/AdminBar";
import { CATEGORIES, GLOBAL_PANELS } from "@/lib/cms/blueprint";
import { listPages, pageName } from "@/lib/cms/read";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const pages = await listPages();

  return (
    <>
      <AdminBar title="Le site" />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <p className="mb-14 max-w-prose text-muted">
          Choisissez une page pour la modifier. Chaque page s'ouvre section par section,
          dans l'ordre où le visiteur les découvre. Tout enregistrement est écrit dans la
          base et mis en ligne aussitôt.
        </p>

        {CATEGORIES.map((category) => {
          const rows = pages.filter((page) => category.kinds.includes(page.kind));
          return (
            <section key={category.key} className="mb-14">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="font-display text-[0.7rem] font-semibold tracking-[2px] text-muted uppercase">
                  {category.label}
                </h2>
                {category.addable ? (
                  <Link
                    href={`/admin/pages/new?kind=${category.kinds[0]}`}
                    className="rounded-full border border-edge px-4 py-1.5 font-display text-[0.62rem] font-bold tracking-[1px] uppercase transition-colors duration-200 hover:border-accent hover:text-accent"
                  >
                    Ajouter une page
                  </Link>
                ) : null}
              </div>
              <p className="mb-5 text-sm text-muted">{category.hint}</p>

              <div className="grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1">
                {rows.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/admin/pages/${page.slug.split("/").map(encodeURIComponent).join("/")}`}
                    className="tactile flex flex-col gap-1 rounded-2xl px-5 py-4 transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-ink">
                      {pageName(page)}
                      {page.status === "draft" ? (
                        <span className="rounded-full border border-accent px-2 py-0.5 font-display text-[0.55rem] font-bold tracking-[1px] text-accent uppercase">
                          Brouillon
                        </span>
                      ) : null}
                    </span>
                    <span className="font-mono text-xs text-muted">{page.route}</span>
                  </Link>
                ))}
              </div>

              {rows.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-edge px-5 py-8 text-center text-sm text-muted">
                  Aucune page dans cette catégorie.
                </p>
              ) : null}
            </section>
          );
        })}

        <section className="mb-8 border-t border-edge pt-12">
          <h2 className="mb-2 font-display text-[0.7rem] font-semibold tracking-[2px] text-muted uppercase">
            Tout le site
          </h2>
          <p className="mb-5 text-sm text-muted">
            Ce qui apparaît sur chaque page : les coordonnées, le menu et le pied de page.
          </p>
          <div className="grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1">
            {GLOBAL_PANELS.map((panel) => (
              <Link
                key={panel.table}
                href={`/admin/global/${panel.table}`}
                className="tactile rounded-2xl px-5 py-4 text-sm font-medium text-ink transition-transform duration-300 hover:-translate-y-0.5"
              >
                {panel.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
