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

      <section className="mx-auto max-w-4xl px-5 py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-clay">
          À l'origine du projet
        </p>
        <h2 className="mt-2 font-serif text-3xl text-ink">
          Ablaye Ndiaye, étudiant passionné de technologie
        </h2>
        <p className="mt-6 leading-relaxed text-muted">
          Je m'appelle Ablaye Ndiaye, étudiant en Licence 2 Sciences Économiques
          et de Gestion à l'Université Amadou Makhtar Mbow. Au-delà de mes
          études, la technologie est une véritable passion : je m'intéresse au
          développement web, à l'automatisation et aux outils numériques qui
          simplifient la vie de tous les jours.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          Teranga Campus est né de cette envie de mettre la technologie au
          service de a communauté étudiante, en combinant  :
          l'économie/gestion et le numérique.
        </p>
      </section>

      <section className="border-y border-line bg-card/40">
        <div className="mx-auto max-w-4xl px-5 py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-clay">
            Le constat
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink">
            Un problème partagé par tous les étudiants SEG
          </h2>
          <p className="mt-6 leading-relaxed text-muted">
            Que l'on soit nouvel arrivant en Licence 1, étudiant actuel en
            L2/L3, ou même ancien diplômé, un même problème revient : les cours
            sont dispersés.
          </p>
          <ul className="mt-6 space-y-3 text-muted">
            <li className="flex gap-3">
              <span className="text-pine">—</span>
              Les nouveaux étudiants ne savent pas où trouver les supports de
              leurs premières matières
            </li>
            <li className="flex gap-3">
              <span className="text-pine">—</span>
              Les étudiants actuels perdent du temps à chercher un cours dans
              dix groupes WhatsApp différents
            </li>
            <li className="flex gap-3">
              <span className="text-pine">—</span>
              Les documents circulent de main en main, se perdent, ou
              deviennent introuvables
            </li>
            <li className="flex gap-3">
              <span className="text-pine">—</span>
              Réviser efficacement devient difficile sans être sûr d'avoir la
              bonne version d'un document
            </li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-clay">
          La solution
        </p>
        <h2 className="mt-2 font-serif text-3xl text-ink">
          Un accès simple, organisé et permanent
        </h2>
        <p className="mt-6 leading-relaxed text-muted">
          Teranga Campus centralise tous les cours de la filière, de la
          Licence 1 à la Licence 3, organisés clairement par niveau, semestre
          et matière. Pour chaque cours, des documents essentiels sont
          réunis au même endroit : le cours,le TD, la Correction des TD, et les flashcardsde révision.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          Plus besoin de chercher dans des dizaines de conversations : tout est
          accessible en ligne, gratuitement, sans création de compte,
          directement depuis un téléphone, une tablette ou un ordinateur — où
          que vous soyez, dès que vous avez une connexion internet.
        </p>
      </section>

      <section className="border-y border-line bg-card/40">
        <div className="mx-auto max-w-4xl px-5 py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-clay">
            Et la suite ?
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink">
            Un projet qui ne fait que commencer
          </h2>
          <p className="mt-6 leading-relaxed text-muted">
            Teranga Campus est encore en phase de test, mais l'ambition est
            grande : enrichir progressivement le contenu disponible, améliorer
            l'expérience de navigation, et ajouter de nouvelles fonctionnalités
            au fil du temps (recherche de cours, espace de contribution,
            statistiques d'usage, et bien plus encore).
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Ce projet est pensé pour grandir avec vous. Toute suggestion,
            contribution ou collaboration est la bienvenue pour faire de
            Teranga Campus un véritable outil de référence pour la filière.
          </p>
        </div>
      </section>
    </>
  );
}