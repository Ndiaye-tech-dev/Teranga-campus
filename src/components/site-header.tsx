import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { HeaderNav } from "@/components/header-nav";
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
      <div className="relative mx-auto flex max-w-6xl items-center gap-2 rounded-2xl border-[2.5px] border-ink bg-white/95 px-3 py-1.5 shadow-[5px_5px_0_var(--ink)] backdrop-blur sm:gap-3 sm:rounded-full sm:px-5 sm:py-2">
        <Link href="/" className="group flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border-2 border-ink bg-sun sm:h-10 sm:w-10">
            <Logo className="h-6 w-6 object-contain transition-transform duration-200 group-hover:rotate-6 group-hover:scale-110 sm:h-7 sm:w-7" />
          </span>
          <span className="leading-none">
            <span className="block text-[15px] font-black tracking-tight sm:text-[17px]">
              Teranga Campus
            </span>
            <span className="mt-0.5 hidden items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-muted sm:flex">
              <Sparkles className="h-3 w-3 text-clay" />
              UAM · SEG · Diamniadio
            </span>
          </span>
        </Link>

        {/* Desktop : recherche + navigation sur une ligne */}
        <div className="hidden min-w-0 flex-1 px-2 sm:block">
          <SearchBar />
        </div>

        <nav className="hidden items-center gap-1 text-sm font-bold sm:flex">
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
            className="rounded-full border-2 border-transparent px-3 py-1.5 transition-all hover:-translate-y-0.5 hover:border-ink hover:bg-sun"
          >
            À propos
          </Link>
          <Link
            href="/#niveaux"
            className="btn-pop btn-primary hidden px-4 py-2 text-[13px] lg:inline-flex"
          >
            Commencer
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </nav>

        {/* Mobile : loupe + burger */}
        <HeaderNav niveaux={niveaux.map((n) => ({ id: n.id, nom: n.nom }))} />
      </div>
    </header>
  );
}
