import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { requireAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-clay">Admin</p>
          <h1 className="font-serif text-3xl">Gestion du contenu</h1>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/" className="text-muted transition-colors hover:text-ink">
            Voir le site
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border border-line px-3 py-1.5 transition-colors hover:bg-card"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
