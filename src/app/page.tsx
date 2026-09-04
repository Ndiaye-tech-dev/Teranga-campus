import Link from "next/link";
import {
  BookOpen,
  ClipboardList,
  Layers,
  Search,
  FileText,
  Clock,
  FileWarning,
  HelpCircle,
  GraduationCap,
  Wifi,
  Lock,
  Sparkles,
} from "lucide-react";
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

      {/* HERO */}
      <section className="hero-glow">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-16">
          <div className="flex items-center gap-4">
          <Logo className="h-14 max-w-[180px] fade-up" />
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
          <div className="fade-up fade-up-delay-3 mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#niveaux"
              className="inline-flex items-center rounded-full bg-pine px-6 py-3 text-sm font-medium text-paper transition-transform duration-200 hover:-translate-y-0.5"
            >
              Découvrir les cours
            </a>
            <Link
              href="/a-propos"
              className="text-sm text-pine underline decoration-pine/30 underline-offset-4 transition-colors hover:decoration-pine"
            >
              À propos du projet
            </Link>
          </div>
        </div>
      </section>

      {/* BARRE DE CONFIANCE */}
      <section className="border-y border-line bg-card/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-10 sm:grid-cols-4">
          <Stat icon={<GraduationCap className="h-5 w-5" />} value="3" label="Niveaux" />
          <Stat icon={<Wifi className="h-5 w-5" />} value="100%" label="En ligne" />
          <Stat icon={<Lock className="h-5 w-5" />} value="0" label="Compte requis" />
          <Stat icon={<Sparkles className="h-5 w-5" />} value="Gratuit" label="Toujours" />
        </div>
      </section>

      {/* CHOISIR UN NIVEAU */}
      <section id="niveaux" className="mx-auto max-w-6xl px-5 py-24 scroll-mt-8">
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

      {/* COMMENT ÇA MARCHE */}
      <section className="border-y border-line bg-card/40">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <p className="text-xs uppercase tracking-[0.2em] text-clay">
            Simple et rapide
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink">Comment ça marche</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <Step
              number={1}
              icon={<Search className="h-5 w-5" />}
              title="Choisissez votre niveau"
              description="Licence 1, 2 ou 3 — sélectionnez votre année et votre semestre."
            />
            <Step
              number={2}
              icon={<Layers className="h-5 w-5" />}
              title="Trouvez votre matière"
              description="Chaque semestre est organisé par module et par matière."
            />
            <Step
              number={3}
              icon={<FileText className="h-5 w-5" />}
              title="Consultez vos documents"
              description="Cours, TD, corrections et flashcards, en ligne ou téléchargés."
            />
          </div>
        </div>
      </section>

      {/* LE CONSTAT */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <p className="text-xs uppercase tracking-[0.2em] text-clay">Le constat</p>
        <h2 className="mt-2 font-serif text-3xl text-ink">
          Un problème partagé par tous les étudiants SEG
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted">
          Que l&apos;on soit nouvel arrivant, étudiant actuel ou ancien
          diplômé, un même problème revient : les cours sont dispersés.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ProblemCard
            icon={<Search className="h-5 w-5" />}
            text="Les nouveaux étudiants ne savent pas où trouver leurs premiers supports"
          />
          <ProblemCard
            icon={<Clock className="h-5 w-5" />}
            text="Du temps perdu à chercher un cours dans dix groupes WhatsApp"
          />
          <ProblemCard
            icon={<FileWarning className="h-5 w-5" />}
            text="Des documents qui circulent, se perdent ou deviennent introuvables"
          />
          <ProblemCard
            icon={<HelpCircle className="h-5 w-5" />}
            text="Jamais sûr d'avoir la bonne version d'un cours ou d'un TD"
          />
        </div>
      </section>

      {/* LA SOLUTION */}
      <section className="border-y border-line bg-card/40">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <p className="text-xs uppercase tracking-[0.2em] text-clay">
            La solution
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink">
            Un accès simple, organisé et permanent
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">
            Pour chaque cours, trois documents essentiels réunis au même
            endroit, accessibles depuis un téléphone, une tablette ou un
            ordinateur.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <DocCard
              icon={<BookOpen className="h-6 w-6" />}
              title="Le cours"
              description="Le support complet de la matière, consultable en ligne."
            />
            <DocCard
              icon={<ClipboardList className="h-6 w-6" />}
              title="Le TD"
              description="Les exercices, avec leur correction associée."
            />
            <DocCard
              icon={<Layers className="h-6 w-6" />}
              title="Les flashcards"
              description="Pour réviser l'essentiel, rapidement."
            />
          </div>
        </div>
      </section>

      {/* À PROPOS (VERSION COURTE) */}
      <section className="mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-clay">
          À l&apos;origine du projet
        </p>
        <h2 className="mt-2 font-serif text-3xl text-ink">
          Un projet né d&apos;une passion pour la tech
        </h2>
        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted">
          Je m&apos;appelle Ablaye Ndiaye, étudiant en L2 SEG à l&apos;UAM et
          passionné de technologie. Teranga Campus est né de l&apos;envie de
          mettre le numérique au service de ma communauté étudiante.
        </p>
        <Link
          href="/a-propos"
          className="mt-6 inline-flex items-center text-sm text-pine underline decoration-pine/30 underline-offset-4 transition-colors hover:decoration-pine"
        >
          Lire l&apos;histoire complète du projet →
        </Link>
      </section>

      {/* AMBITION */}
      <section className="border-y border-line bg-card/40">
        <div className="mx-auto max-w-3xl px-5 py-24 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-clay">
            Et la suite ?
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink">
            Un projet qui ne fait que commencer
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted">
            Teranga Campus est encore en phase de test. L&apos;ambition est
            grande : enrichir le contenu, améliorer l&apos;expérience, et
            ajouter de nouvelles fonctionnalités au fil du temps.
          </p>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
            Toute suggestion, contribution ou collaboration est la bienvenue.
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h2 className="font-serif text-3xl text-ink">Prêt à commencer ?</h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#niveaux"
            className="inline-flex items-center rounded-full bg-pine px-6 py-3 text-sm font-medium text-paper transition-transform duration-200 hover:-translate-y-0.5"
          >
            Voir les niveaux
          </a>
          <Link
            href="/a-propos"
            className="text-sm text-pine underline decoration-pine/30 underline-offset-4 transition-colors hover:decoration-pine"
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="text-pine">{icon}</span>
      <span className="font-serif text-2xl text-ink">{value}</span>
      <span className="text-xs uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
    </div>
  );
}

function Step({
  number,
  icon,
  title,
  description,
}: {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pine text-sm font-medium text-paper">
          {number}
        </span>
        <span className="text-pine">{icon}</span>
      </div>
      <h3 className="mt-4 font-serif text-lg text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}

function ProblemCard({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <span className="text-clay">{icon}</span>
      <p className="mt-3 text-sm leading-relaxed text-muted">{text}</p>
    </div>
  );
}

function DocCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-6 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pine/10 text-pine">
        {icon}
      </span>
      <h3 className="mt-4 font-serif text-lg text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}
