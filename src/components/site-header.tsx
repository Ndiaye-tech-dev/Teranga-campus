import Link from "next/link";
import { Logo } from "@/components/logo";
import { hasSupabaseConfig } from "@/lib/env";
import { getNiveaux } from "@/lib/queries";

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
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <Logo className="h-10 w-10 transition-transform duration-200 group-hover:scale-[1.04]" />
          <span className="font-serif text-lg tracking-tight text-ink">
            Teranga Campus
          </span>
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto text-sm">
          <Link
            href="/"
            className="rounded-full px-3 py-1.5 text-muted transition-colors duration-200 hover:bg-white hover:text-ink"
          >
            Accueil
          </Link>
          {niveaux.map((niveau) => (
            <Link
              key={niveau.id}
              href={`/niveaux/${niveau.id}`}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-muted transition-colors duration-200 hover:bg-white hover:text-ink"
            >
              {niveau.nom}
            </Link>
          ))}
          <Link
            href="/a-propos"
            className="rounded-full px-3 py-1.5 text-muted transition-colors duration-200 hover:bg-white hover:text-ink"
          >
            À propos
          </Link>
        </nav>
      </div>
    </header>
  );
}
