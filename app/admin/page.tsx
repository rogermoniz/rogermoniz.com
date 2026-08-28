import Link from "next/link";
import { countRows } from "@/lib/cms/read";
import { GROUPS, TABLES } from "@/lib/cms/schema";
import { AdminBar } from "@/components/cms/AdminBar";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const counts = Object.fromEntries(
    await Promise.all(TABLES.map(async (t) => [t.name, await countRows(t.name)] as const)),
  );

  return (
    <>
      <AdminBar title="Contenu du site" />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <p className="mb-12 max-w-prose text-muted">
          Modifiez le contenu ici : chaque enregistrement est écrit dans la base et le
          site se met à jour immédiatement.
        </p>

        {GROUPS.map((group) => (
          <section key={group} className="mb-12">
            <h2 className="mb-5 font-display text-[0.7rem] font-semibold tracking-[2px] text-muted uppercase">
              {group}
            </h2>
            <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
              {TABLES.filter((t) => t.group === group).map((t) => (
                <Link
                  key={t.name}
                  href={`/admin/${t.name}`}
                  className="tactile flex items-center justify-between rounded-2xl px-5 py-4 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <span className="text-sm font-medium text-ink">{t.label}</span>
                  <span className="ml-3 shrink-0 text-xs text-muted">{counts[t.name]}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
