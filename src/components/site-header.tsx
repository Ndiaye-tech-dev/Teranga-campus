import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";
import { SearchBar } from "@/components/search-bar";
import { hasSupabaseConfig } from "@/lib/env";
import { getNiveaux } from "@/lib/queries";
import { shortNiveau } from "@/lib/site";

export async function SiteHeader() {
  let niveaux: Awaited<ReturnType<typeof getNiveaux>> = [];
  if (hasSupabaseConfig()) {
    try {
      niveaux = await getNiveaux();
    } catch {
      niveaux = [];
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 rounded-3xl border-[2.5px] border-ink bg-white/95 px-3 py-2 shadow-[5px_5px_0_var(--ink)] backdrop-blur sm:gap-3 sm:rounded-full sm:px-5">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border-2 border-ink bg-sun">
            <Logo className="h-7 w-7 object-contain transition-transform duration-200 group-hover:rotate-6 group-hover:scale-110" />
          </span>
          <span className="leading-none">
            <span className="block text-[17px] font-black tracking-tight">
              Teranga Campus
            </span>
            <span className="mt-0.5 hidden items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-muted sm:flex">
              <Sparkles className="h-3 w-3 text-clay" />
              UAM · SEG · Diamniadio
            </span>
          </span>
        </Link>

        <div className="order-3 w-full sm:order-2 sm:w-auto sm:flex-1 sm:px-2">
          <SearchBar />
        </div>

        <nav className="order-2 ml-auto flex items-center gap-1 text-sm font-bold sm:order-3 sm:ml-0">
          {niveaux.map((niveau) => (
            <Link
              key={niveau.id}
              href={`/niveaux/${niveau.id}`}
              title={niveau.nom}
              className="hidden whitespace-nowrap rounded-full border-2 border-transparent px-3 py-1.5 transition-all hover:-translate-y-0.5 hover:border-ink hover:bg-sun md:block"
            >
              {shortNiveau(niveau.nom)}
            </Link>
          ))}
          <Link
            href="/a-propos"
            className="hidden rounded-full border-2 border-transparent px-3 py-1.5 transition-all hover:-translate-y-0.5 hover:border-ink hover:bg-sun sm:block"
          >
            À propos
          </Link>
          <Link
            href="/#niveaux"
            className="btn-pop btn-primary px-4 py-2 text-[13px]"
          >
            Commencer
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
