import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminBar } from "@/components/cms/AdminBar";
import { ImageLayoutPicker } from "@/components/cms/ImageLayoutPicker";
import { figureColumns } from "@/components/sections/editorial/FigureGroup";
import { Panel } from "@/components/cms/Panel";
import { RowForm } from "@/components/cms/RowForm";
import { deletePage, setPageStatus } from "@/lib/cms/actions";
import { uploadEnabled } from "@/lib/cms/cloudinary";
import { editableFields, knownImages, loadPage, pageName } from "@/lib/cms/read";

export const dynamic = "force-dynamic";

/** Article slugs carry a slash (blog/…), so the route matches every segment. */
export default async function PageEditor({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: segments } = await params;
  const slug = segments.map(decodeURIComponent).join("/");
  const [loaded, library] = await Promise.all([loadPage(slug), knownImages()]);
  if (!loaded) notFound();

  const { page, sections } = loaded;
  const canUpload = uploadEnabled();
  const removable = page.kind !== "home" && page.kind !== "standalone";
  const draft = page.status === "draft";

  /**
   * What the parts already do, so the picker opens on the answer. A part with
   * no grid is a stack of loose pictures, which is one per row. Parts holding
   * no picture at all say nothing either way, and if the ones that do disagree
   * the picker highlights nothing rather than a shape that is only half true.
   */
  const imageLayout = (() => {
    const shapes: { rows: number; columns: number }[] = [];

    for (const section of sections) {
      for (const panel of section.panels) {
        if (panel.form !== "rows" || panel.table !== "rich_sections") continue;
        for (const row of panel.rows) {
          const blocks = Array.isArray(row.blocks)
            ? (row.blocks as { type?: string; variant?: string; columns?: number; figures?: unknown[] }[])
            : [];
          const group = blocks.find((b) => b.type === "figureGroup");
          const count = group
            ? (group.figures ?? []).length
            : blocks.filter((b) => b.type === "figure").length;
          if (!count) continue;
          const columns = group ? figureColumns(String(group.variant ?? ""), group.columns as never) : 1;
          shapes.push({ rows: Math.ceil(count / columns), columns });
        }
      }
    }

    const first = shapes[0];
    if (!first) return null;
    const same = shapes.every((s) => s.rows === first.rows && s.columns === first.columns);
    return same ? first : "mixed";
  })();
  // The URL is pages.slug, and pages.route only mirrors it for the sitemap.
  // Neither is authored here: editing route moved nothing while looking like
  // it renamed the page, and moving a slug is a migration (every content
  // table keys off it with no on update cascade). The route is shown as the
  // badge above instead.
  const settingsFields = editableFields("pages", ["slug", "route"]);

  return (
    <>
      <AdminBar title={pageName(page)} back={{ href: "/admin", label: "Le site" }} />

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-10 flex flex-wrap items-center gap-4">
          <span className="rounded-full bg-menu-subtle px-3 py-1 font-mono text-xs text-muted">
            {page.route}
          </span>
          {draft ? (
            <span className="rounded-full border border-accent px-3 py-1 font-display text-[0.6rem] font-bold tracking-[1px] text-accent uppercase">
              Brouillon
            </span>
          ) : null}
          <Link
            href={draft ? `/apercu/${page.slug.split("/").map(encodeURIComponent).join("/")}` : page.route}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted transition-colors duration-200 hover:text-accent"
          >
            {draft ? "Aperçu ↗" : "Voir la page ↗"}
          </Link>

          {/* Publishing is its own act, so a page can be written and looked at
              for as long as it takes before anybody else can reach it. */}
          <form action={setPageStatus} className="ml-auto">
            <input type="hidden" name="slug" value={page.slug} />
            <input type="hidden" name="status" value={draft ? "published" : "draft"} />
            <button
              type="submit"
              className={`rounded-full px-4 py-1.5 font-display text-[0.62rem] font-bold tracking-[1px] uppercase transition-colors duration-200 ${
                draft
                  ? "border border-accent bg-accent text-surface"
                  : "border border-edge text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {draft ? "Publier le brouillon" : "Repasser en brouillon"}
            </button>
          </form>
        </div>

        {draft ? (
          <p className="mb-10 rounded-xl border border-dashed border-accent px-5 py-4 text-sm text-muted">
            Cette page n&apos;est pas en ligne. Elle n&apos;apparaît ni dans le blog, ni dans le
            plan du site, et son adresse publique répond 404.
            Ouvrez l&apos;aperçu pour la voir telle qu&apos;elle sera.
          </p>
        ) : null}

        {page.kind === "article" ? <ImageLayoutPicker slug={page.slug} current={imageLayout} /> : null}

        <nav className="mb-12 flex flex-wrap gap-2">
          {sections.map((section) => (
            <a
              key={section.key}
              href={`#${section.key}`}
              className="rounded-full border border-edge px-4 py-1.5 font-display text-[0.62rem] font-bold tracking-[1px] uppercase transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              {section.label}
            </a>
          ))}
        </nav>

        {sections.map((section, index) => (
          <section
            key={section.key}
            id={section.key}
            className="mb-16 scroll-mt-24 border-t border-edge pt-10"
          >
            <h3 className="flex items-baseline gap-3 text-xl font-medium text-ink">
              <span className="font-display text-[0.65rem] font-bold tracking-[1.5px] text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              {section.label}
            </h3>
            {section.hint ? <p className="mt-2 mb-8 max-w-prose text-sm text-muted">{section.hint}</p> : <div className="mb-8" />}

            {section.panels.map((panel, panelIndex) => (
              <Panel
                key={`${panel.table}-${panelIndex}`}
                panel={panel}
                library={library}
                canUpload={canUpload}
              />
            ))}
          </section>
        ))}

        <section id="reglages" className="mb-16 scroll-mt-24 border-t border-edge pt-10">
          <h3 className="mb-2 text-xl font-medium text-ink">Réglages de la page</h3>
          <p className="mb-8 max-w-prose text-sm text-muted">
            L'adresse, le titre affiché par Google et le texte du chargement.
          </p>
          <RowForm
            table="pages"
            fields={settingsFields}
            row={page as unknown as Record<string, unknown>}
            match={{ slug: page.slug }}
            filters={{}}
            library={library}
            canUpload={canUpload}
            columns={2}
          />
        </section>

        {removable ? (
          <form action={deletePage} className="border-t border-edge pt-6">
            <input type="hidden" name="slug" value={page.slug} />
            <button
              type="submit"
              className="text-xs text-muted transition-colors duration-200 hover:text-danger"
            >
              Supprimer cette page et tout son contenu
            </button>
          </form>
        ) : null}
      </div>
    </>
  );
}
