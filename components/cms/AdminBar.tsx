import Link from "next/link";
import { signOut } from "@/lib/cms/actions";
import { RepublishButton } from "@/components/cms/RepublishButton";

export function AdminBar({ title, back }: { title: string; back?: { href: string; label: string } }) {
  return (
    <header className="sticky top-0 z-50 border-b border-edge bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-6 py-5">
        <div className="mr-auto min-w-0">
          {back ? (
            <Link href={back.href} className="text-xs text-muted transition-colors hover:text-accent">
              ← {back.label}
            </Link>
          ) : (
            <Link href="/admin" className="text-xs text-muted transition-colors hover:text-accent">
              Roger Moniz · administration
            </Link>
          )}
          <h1 className="truncate font-display text-xl font-bold tracking-[-0.02em] text-ink uppercase">
            {title}
          </h1>
        </div>

        <RepublishButton />

        <form action={signOut}>
          <button
            type="submit"
            className="text-xs text-muted transition-colors hover:text-accent"
          >
            Déconnexion
          </button>
        </form>
      </div>
    </header>
  );
}
