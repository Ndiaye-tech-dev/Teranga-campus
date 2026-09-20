"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { shortNiveau } from "@/lib/site";

/** Boutons + panneaux repliables pour mobile. Sur desktop : caché. */
export function HeaderNav({ niveaux }: { niveaux: { id: string; nom: string }[] }) {
  const [open, setOpen] = useState<"none" | "search" | "menu">("none");

  function toggle(which: "search" | "menu") {
    setOpen((cur) => (cur === which ? "none" : which));
  }

  function close() {
    setOpen("none");
  }

  return (
    <>
      <div className="ml-auto flex shrink-0 items-center gap-2 sm:hidden">
        <button
          type="button"
          onClick={() => toggle("search")}
          aria-label="Rechercher"
          className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink transition-colors ${
            open === "search" ? "bg-sun" : "bg-white"
          }`}
        >
          {open === "search" ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
        </button>
        <button
          type="button"
          onClick={() => toggle("menu")}
          aria-label="Menu"
          className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink transition-colors ${
            open === "menu" ? "bg-sun" : "bg-white"
          }`}
        >
          {open === "menu" ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open === "search" ? (
        <div className="absolute inset-x-0 top-full mt-2 rounded-2xl border-[2.5px] border-ink bg-white p-2 shadow-[5px_5px_0_var(--ink)] sm:hidden">
          <SearchBar />
        </div>
      ) : null}

      {open === "menu" ? (
        <nav className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-2xl border-[2.5px] border-ink bg-white shadow-[5px_5px_0_var(--ink)] sm:hidden">
          <Link
            href="/"
            onClick={close}
            className="block border-b-2 border-ink/10 px-5 py-3.5 font-black active:bg-sun/40"
          >
            Accueil
          </Link>
          {niveaux.map((niveau) => (
            <Link
              key={niveau.id}
              href={`/niveaux/${niveau.id}`}
              onClick={close}
              title={niveau.nom}
              className="block border-b-2 border-ink/10 px-5 py-3.5 font-black active:bg-sun/40"
            >
              {shortNiveau(niveau.nom)}
              <span className="ml-2 text-xs font-bold text-muted">{niveau.nom}</span>
            </Link>
          ))}
          <Link
            href="/a-propos"
            onClick={close}
            className="block px-5 py-3.5 font-black active:bg-sun/40"
          >
            À propos
          </Link>
        </nav>
      ) : null}
    </>
  );
}
