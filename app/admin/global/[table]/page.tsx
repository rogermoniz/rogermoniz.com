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

  const [loaded, library] = await Promise.all([loadGlobalPanel(entry.table, entry.form), knownImages()]);
  const panel = loaded.form === "rows" ? { ...loaded, title: entry.label, noun: entry.noun } : loaded;

  return (
    <>
      <AdminBar title={entry.label} back={{ href: "/admin", label: "Le site" }} />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Panel panel={panel} library={library} canUpload={uploadEnabled()} />
      </div>
    </>
  );
}
