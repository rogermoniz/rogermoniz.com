import { notFound } from "next/navigation";
import { AdminBar } from "@/components/cms/AdminBar";
import { Panel } from "@/components/cms/Panel";
import { GLOBAL_PANELS } from "@/lib/cms/blueprint";
import { uploadEnabled } from "@/lib/cms/cloudinary";
import { knownImages, loadGlobalPanel } from "@/lib/cms/read";

export const dynamic = "force-dynamic";

export default async function GlobalEditor({ params }: { params: Promise<{ table: string }> }) {
  const { table } = await params;
  const entry = GLOBAL_PANELS.find((p) => p.table === table);
  if (!entry) notFound();

  type Group = { title: string; where: { column: string; value: string } | null };
  const groups: readonly Group[] = entry.groups ?? [{ title: entry.label, where: null }];
  const [panels, library] = await Promise.all([
    Promise.all(
      groups.map(async (group) => {
        const filters = group.where ? { [group.where.column]: group.where.value } : {};
        const loaded = await loadGlobalPanel(entry.table, entry.form, filters);
        return loaded.form === "rows" ? { ...loaded, title: group.title, noun: entry.noun } : loaded;
      }),
    ),
    knownImages(),
  ]);

  return (
    <>
      <AdminBar title={entry.label} back={{ href: "/admin", label: "Le site" }} />
      <div className="mx-auto max-w-4xl px-6 py-10">
        {panels.map((panel, index) => (
          <Panel key={index} panel={panel} library={library} canUpload={uploadEnabled()} />
        ))}
      </div>
    </>
  );
}
