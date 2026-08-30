import Link from "next/link";
import { Logo } from "@/components/logo";
import { SetupBanner } from "@/components/ui";
import { hasSupabaseConfig } from "@/lib/env";
import { getNiveaux } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const configured = hasSupabaseConfig();
  let niveaux: Awaited<ReturnType<typeof getNiveaux>> = [];

  if (configured) {
    try {
      niveaux = await getNiveaux();
    } catch {
      niveaux = [];
    }
  }

  return (
    <>
      {!configured ? <SetupBanner /> : null}
      <section className="hero-glow">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-16">
          <div className="flex items-center gap-4">
            <Logo className="h-14 w-14 fade-up" />
            <p className="fade-up text-sm uppercase tracking-[0.22em] text-clay">
              UAM · SEG · Dakar
            </p>
          </div>
          <h1 className="fade-up fade-up-delay-1 mt-6 max-w-2xl font-serif text-5xl leading-[1.1] tracking-tight text-ink sm:text-6xl">
            Teranga Campus
          </h1>
          <p className="fade-up fade-up-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Les cours de Sciences Économiques et de Gestion, de la Licence 1 à
            la Licence 3, rassemblés au même endroit. Accès libre, sans compte.
          </p>
          <Link
            href="/a-propos"
            className="fade-up fade-up-delay-3 mt-8 inline-flex text-sm text-pine underline decoration-pine/30 underline-offset-4 transition-colors hover:decoration-pine"
          >
            À propos du projet
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Étape 1</p>
        <h2 className="mt-2 font-serif text-2xl text-ink">Choisir un niveau</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {niveaux.length === 0 ? (
            <div className="sm:col-span-3">
              <p className="rounded-2xl border border-dashed border-line bg-card/60 px-6 py-12 text-center text-muted">
                Les niveaux apparaîtront ici une fois Supabase connecté.
              </p>
            </div>
          ) : (
            niveaux.map((niveau, index) => (
              <Link
                key={niveau.id}
                href={`/niveaux/${niveau.id}`}
                className={`group rounded-2xl border border-line bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-pine/25 hover:shadow-[0_12px_40px_-24px_rgba(30,58,138,0.55)] fade-up fade-up-delay-${index + 1}`}
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted">
                  Niveau
                </p>
                <p className="mt-3 font-serif text-2xl text-pine">{niveau.nom}</p>
                <p className="mt-6 text-sm text-muted transition-colors group-hover:text-ink">
                  Choisir le semestre →
                </p>
              </Link>
            ))
          )}
        </div>
      </section>
    </>
  );
}
