import { notFound } from "next/navigation";
import { AdminBar } from "@/components/cms/AdminBar";
import { RowForm } from "@/components/cms/RowForm";
import { getRow } from "@/lib/cms/read";
import { TABLE_BY_NAME } from "@/lib/cms/schema";

export const dynamic = "force-dynamic";

export default async function RowPage({
  params,
}: {
  params: Promise<{ table: string; id: string }>;
}) {
  const { table, id } = await params;
  const spec = TABLE_BY_NAME.get(table);
  if (!spec) notFound();

  const creating = id === "new";
  const row = creating ? null : await getRow(table, decodeURIComponent(id));
  if (!creating && !row) notFound();

  return (
    <>
      <AdminBar
        title={creating ? `Nouvelle entrée · ${spec.label}` : spec.label}
        back={{ href: `/admin/${table}`, label: spec.label }}
      />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <RowForm spec={spec} row={row} id={creating ? null : decodeURIComponent(id)} />
      </div>
    </>
  );
}
