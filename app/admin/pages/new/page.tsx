import { notFound } from "next/navigation";
import { AdminBar } from "@/components/cms/AdminBar";
import { NewPageForm } from "@/components/cms/NewPageForm";
import { CATEGORIES } from "@/lib/cms/blueprint";

export const dynamic = "force-dynamic";

export default async function NewPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const { kind = "prestation" } = await searchParams;
  const category = CATEGORIES.find((c) => c.addable && c.kinds.includes(kind));
  if (!category) notFound();

  return (
    <>
      <AdminBar title={`Nouvelle page · ${category.label}`} back={{ href: "/admin", label: "Le site" }} />
      <div className="mx-auto max-w-2xl px-6 py-12">
        <p className="mb-10 text-muted">
          La page est créée avec toutes ses sections vides, prêtes à être remplies.
        </p>
        <NewPageForm kind={kind} />
      </div>
    </>
  );
}
