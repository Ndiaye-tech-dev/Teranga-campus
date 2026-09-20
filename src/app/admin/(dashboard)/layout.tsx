import Link from "next/link";
import { ArrowLeft, ExternalLink, LogOut } from "lucide-react";
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
      <div className="card-pop !bg-ink !text-white flex flex-wrap items-center justify-between gap-4 px-6 py-5">
        <div>
          <p className="inline-block rounded-full border-2 border-sun bg-sun px-3 py-0.5 text-[11px] font-black uppercase tracking-widest text-ink">
            Admin
          </p>
          <h1 className="font-display mt-2 text-3xl">Gestion du contenu</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm font-black">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-white/40 px-4 py-2 transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" /> Niveaux
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-white/40 px-4 py-2 transition-colors hover:bg-white/10"
          >
            <ExternalLink className="h-4 w-4" /> Voir le site
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-candy bg-candy px-4 py-2 text-white transition-transform hover:-translate-y-0.5"
            >
              <LogOut className="h-4 w-4" /> Quitter
            </button>
          </form>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}
