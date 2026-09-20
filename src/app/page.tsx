import type { CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  ClipboardList,
  Flame,
  GraduationCap,
  Layers,
  Search,
  Smartphone,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { ContinueReading } from "@/components/continue-reading";
import { SetupBanner } from "@/components/ui";
import { hasSupabaseConfig } from "@/lib/env";
import {
  getDocumentCounts,
  getMatieresByNiveau,
  getModulesByNiveau,
  getNiveaux,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

const MARQUEE = [
  "Cours complets",
  "TD corrigés",
  "Flashcards",
  "100% gratuit",
  "Sans compte",
  "Sur téléphone",
  "L1 · L2 · L3",
];

const LEVEL_STYLES = [
  { bg: "bg-sun", iconBg: "bg-ink text-sun", icon: GraduationCap, tilt: "-rotate-1" },
  { bg: "bg-mint", iconBg: "bg-ink text-mint", icon: Flame, tilt: "rotate-1" },
  { bg: "bg-candy", iconBg: "bg-ink text-white", icon: Star, tilt: "-rotate-1" },
  { bg: "bg-sky", iconBg: "bg-ink text-white", icon: BookOpen, tilt: "rotate-1" },
];

function plural(n: number, word: string) {
  return `${n} ${word}${n > 1 ? "s" : ""}`;
}

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

  const hasLevels = niveaux.length > 0;
  const firstNiveauHref = hasLevels ? `/niveaux/${niveaux[0].id}` : "/#niveaux";

  // Contenu réel par niveau, pour l'afficher sur les cartes.
  const levelStats = await Promise.all(
    niveaux.map(async (niveau) => {
      try {
        const [modules, matieres] = await Promise.all([
          getModulesByNiveau(niveau.id),
          getMatieresByNiveau(niveau.id),
        ]);
        return { niveau, modules: modules.length, matiereIds: matieres.map((m) => m.id) };
      } catch {
        return { niveau, modules: 0, matiereIds: [] as string[] };
      }
    }),
  );
  let docCounts: Record<string, number> = {};
  try {
    docCounts = await getDocumentCounts(levelStats.flatMap((s) => s.matiereIds));
  } catch {
    docCounts = {};
  }
  const withDocs = levelStats.map((s) => ({
    niveau: s.niveau,
    modules: s.modules,
    matieres: s.matiereIds.length,
    docs: s.matiereIds.reduce((sum, id) => sum + (docCounts[id] ?? 0), 0),
  }));

  return (
    <>
      {!configured ? <SetupBanner /> : null}

      {/* ============ HERO ============ */}
      <section className="hero-glow relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-14 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:pt-16">
          <div>
            <p className="sticker pop-in bg-white">
              <Sparkles className="h-4 w-4 text-clay" />
              UAM · SEG · Diamniadio — L1 → L3
            </p>
            <h1 className="font-display pop-in mt-6 text-[13vw] sm:text-6xl lg:text-7xl">
              Tous tes cours SEG.
              <br />
              <span className="relative inline-block bg-ink px-3 py-1 text-sun -rotate-1">
                Zéro galère.
              </span>
            </h1>
            <p className="fade-up fade-up-delay-1 mt-6 max-w-lg text-lg leading-relaxed text-muted">
              Cours, TD, corrections et flashcards de la Licence 1 à la
              Licence 3, réunis au même endroit.{" "}
              <strong className="text-ink">Gratuit, sans compte</strong>,
              lisible sur ton téléphone. Fini la chasse au PDF dans 10 groupes
              WhatsApp.
            </p>
            <div className="fade-up fade-up-delay-2 mt-8 flex flex-wrap items-center gap-4">
              <a href="#niveaux" className="btn-pop btn-grape px-7 py-3.5 text-base">
                Trouver mon niveau
                <ArrowRight className="h-5 w-5" />
              </a>
              <Link
                href="/a-propos"
                className="btn-pop bg-white px-6 py-3.5 text-base"
              >
                C&apos;est quoi le projet ?
              </Link>
            </div>
            <div className="fade-up fade-up-delay-3 mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-bold">
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4 text-mint" /> Sans inscription
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Smartphone className="h-4 w-4 text-grape" /> 100% mobile
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-clay" /> Accès instantané
              </span>
            </div>
          </div>

          {/* Mockup téléphone */}
          <div className="relative mx-auto w-full max-w-sm pop-in">
            <div className="card-pop rotate-2 overflow-hidden">
              <div className="flex items-center justify-between border-b-[2.5px] border-ink bg-sun px-5 py-3">
                <p className="text-sm font-black uppercase tracking-wider">
                  Ce soir : Microéconomie
                </p>
                <span className="rounded-full border-2 border-ink bg-white px-2.5 py-0.5 text-xs font-black">
                  L2 · S3
                </span>
              </div>
              <div className="space-y-3 bg-white p-5">
                {[
                  { icon: BookOpen, label: "Cours complet — 42 pages", chip: "PDF", chipBg: "bg-grape text-white" },
                  { icon: ClipboardList, label: "TD n°3 + correction", chip: "Corrigé", chipBg: "bg-mint" },
                  { icon: Layers, label: "24 flashcards essentielles", chip: "Réviser", chipBg: "bg-candy text-white" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-paper px-4 py-3"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-white">
                      <row.icon className="h-5 w-5" />
                    </span>
                    <p className="flex-1 text-sm font-bold leading-tight">{row.label}</p>
                    <span className={`rounded-full border-2 border-ink px-2 py-0.5 text-[11px] font-black ${row.chipBg}`}>
                      {row.chip}
                    </span>
                  </div>
                ))}
                <Link
                  href={firstNiveauHref}
                  className="btn-pop btn-primary w-full px-4 py-3 text-sm"
                >
                  Voir les cours <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="animate-float absolute -left-4 top-8 rounded-2xl border-[2.5px] border-ink bg-candy px-3 py-2 text-xs font-black text-white shadow-[4px_4px_0_var(--ink)]" style={{ "--rot": "-6deg" } as CSSProperties}>
              Cours + TD + flashcards
            </div>
            <div className="animate-float absolute -right-3 bottom-16 rounded-2xl border-[2.5px] border-ink bg-white px-3 py-2 text-xs font-black shadow-[4px_4px_0_var(--ink)]" style={{ "--rot": "5deg", animationDelay: "1.2s" } as CSSProperties}>
              Sans compte, gratuit
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto max-w-6xl px-5 pb-12">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { value: "3 niveaux", label: "De la L1 à la L3" },
              { value: "3 / matière", label: "Cours · TD · Flashcards" },
              { value: "0 F", label: "Toujours gratuit" },
              { value: "0 compte", label: "Zéro inscription" },
            ].map((s, i) => (
              <div key={s.label} className={`card-pop px-5 py-4 text-center ${i % 2 ? "rotate-1" : "-rotate-1"}`}>
                <p className="font-display text-2xl sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContinueReading />

      {/* ============ MARQUEE ============ */}
      <div className="rotate-[-1.2deg] scale-[1.02] overflow-hidden border-y-[2.5px] border-ink bg-ink py-3">
        <div className="animate-marquee flex w-max items-center gap-6 pr-6">
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} className="flex items-center gap-6 text-sm font-black uppercase tracking-widest text-white">
              {item}
              <Star className={`h-4 w-4 ${i % 2 ? "fill-sun text-sun" : "fill-candy text-candy"}`} />
            </span>
          ))}
        </div>
      </div>

      {/* ============ NIVEAUX ============ */}
      <section id="niveaux" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="sticker bg-mint">Étape 1 — choisis ton année</p>
            <h2 className="font-display mt-4 text-4xl sm:text-5xl">
              T&apos;es en quelle{" "}
              <span className="font-serif-accent font-medium">licence ?</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm font-semibold leading-relaxed text-muted">
            Un clic sur ton année → ton semestre → ta matière. Pas de menu
            compliqué, pas de compte, pas d&apos;attente.
          </p>
        </div>

        {!hasLevels ? (
          <div className="card-pop mt-10 px-6 py-12 text-center">
            <p className="font-display text-2xl">Les niveaux arrivent.</p>
            <p className="mx-auto mt-2 max-w-md text-sm font-medium text-muted">
              La base de données n&apos;est pas encore branchée ou est vide.
              Utilise la recherche en haut ou reviens dans un moment.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {withDocs.map(({ niveau, matieres, docs }, index) => {
              const style = LEVEL_STYLES[index % LEVEL_STYLES.length];
              const Icon = style.icon;
              const infos = [
                matieres > 0 ? plural(matieres, "matière") : null,
                docs > 0 ? plural(docs, "document") : null,
              ].filter(Boolean);
              return (
                <Link
                  key={niveau.id}
                  href={`/niveaux/${niveau.id}`}
                  className={`card-pop card-pop-hover ${style.tilt} overflow-hidden`}
                >
                  <div className={`${style.bg} border-b-[2.5px] border-ink px-6 pb-6 pt-5`}>
                    <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border-[2.5px] border-ink ${style.iconBg}`}>
                      <Icon className="h-6 w-6" />
                    </span>
                    <p className="font-display mt-4 text-3xl">{niveau.nom}</p>
                    {infos.length > 0 ? (
                      <p className="mt-2 inline-block rounded-full border-2 border-ink bg-white px-3 py-1 text-[11px] font-black uppercase tracking-widest">
                        {infos.join(" · ")}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-between bg-white px-6 py-4">
                    <span className="text-sm font-bold text-muted">
                      Semestres · Matières
                    </span>
                    <span className="btn-pop btn-primary px-4 py-2 text-sm">
                      Entrer <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ============ COMMENT ÇA MARCHE ============ */}
      <section className="border-y-[2.5px] border-ink bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="sticker bg-sun">Simple comme un message WhatsApp</p>
          <h2 className="font-display mt-4 max-w-xl text-4xl sm:text-5xl">
            Ton cours en 3 clics, pas en 3 heures.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { n: "1", bg: "bg-grape text-white", icon: Search, title: "Choisis ton niveau", text: "Licence 1, 2 ou 3, puis ton semestre. La recherche en haut t'emmène direct à ta matière." },
              { n: "2", bg: "bg-sun", icon: Layers, title: "Ouvre ta matière", text: "Chaque matière range tout au même endroit : le cours, le TD, sa correction." },
              { n: "3", bg: "bg-mint", icon: BookOpen, title: "Lis ou télécharge", text: "Lis en ligne sur ton téléphone ou télécharge le PDF pour réviser hors connexion." },
            ].map((s, i) => (
              <div key={s.n} className={`card-pop p-6 ${i === 1 ? "rotate-1 md:-translate-y-2" : i === 0 ? "-rotate-1" : "rotate-1"}`}>
                <div className="flex items-center justify-between">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl border-[2.5px] border-ink font-display text-xl ${s.bg}`}>
                    {s.n}
                  </span>
                  <s.icon className="h-6 w-6 text-muted" />
                </div>
                <h3 className="font-display mt-5 text-2xl">{s.title}</h3>
                <p className="mt-2 text-[15px] font-medium leading-relaxed text-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINI LA GALÈRE ============ */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="sticker bg-candy text-white">Le constat — on l&apos;a tous vécu</p>
        <h2 className="font-display mt-4 max-w-2xl text-4xl sm:text-5xl">
          Fini les PDF perdus dans les groupes.
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {[
            { title: "« C&apos;est dans quel groupe déjà ? »", text: "Plus besoin de fouiller 10 conversations WhatsApp vieilles de 3 mois pour un seul TD.", bg: "bg-white" },
            { title: "« C&apos;est la bonne version ? »", text: "Chaque matière affiche la version de référence : cours, TD et correction assortie.", bg: "bg-sun" },
            { title: "« Je révise dans le bus »", text: "Tout se lit sur téléphone, tablette ou PC. Tu télécharges pour le hors-ligne, c'est tout.", bg: "bg-mint" },
            { title: "« Je suis nouveau, je commence où ? »", text: "L1 → semestre → matière. Le parcours est guidé dès la première visite, même à 2h du mat avant un partiel.", bg: "bg-white" },
          ].map((c, i) => (
            <div key={i} className={`card-pop p-6 sm:p-7 ${c.bg} ${i % 2 ? "rotate-1" : "-rotate-1"}`}>
              <h3 className="font-display text-2xl" dangerouslySetInnerHTML={{ __html: c.title }} />
              <p className="mt-2 font-medium leading-relaxed text-muted">{c.text}</p>
            </div>
          ))}
        </div>

        {/* Contenu par matière */}
        <div className="card-pop mt-8 overflow-hidden !bg-ink !text-white">
          <div className="grid items-center gap-6 p-7 sm:p-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="sticker bg-sun !text-ink">Le pack de chaque matière</p>
              <h3 className="font-display mt-4 text-3xl sm:text-4xl">
                3 essentiels.
                <br />
                Toujours ensemble.
              </h3>
              <p className="mt-3 font-medium text-white/70">
                Pas de pièce manquante le jour J : tout ce qu&apos;il faut pour
                comprendre, s&apos;entraîner et mémoriser.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: BookOpen, bg: "bg-grape", t: "Le cours", d: "Le support complet, lisible en ligne." },
                { icon: ClipboardList, bg: "bg-peach", t: "TD + corrigé", d: "S'entraîner avec la correction." },
                { icon: Zap, bg: "bg-sun", t: "Flashcards", d: "L'essentiel à mémoriser vite." },
              ].map((d) => (
                <div key={d.t} className="rounded-2xl border-2 border-white/90 bg-white/10 p-5 backdrop-blur">
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-white ${d.bg}`}>
                    <d.icon className="h-5 w-5 text-white" />
                  </span>
                  <p className="mt-3 text-lg font-black">{d.t}</p>
                  <p className="mt-1 text-sm font-medium text-white/70">{d.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="border-t-[2.5px] border-ink bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="sticker bg-white">Questions fréquentes</p>
            <h2 className="font-display mt-4 text-4xl sm:text-5xl">
              On te dit{" "}
              <span className="font-serif-accent font-medium">tout.</span>
            </h2>
            <p className="mt-4 font-medium leading-relaxed text-muted">
              Toujours un doute ? La page{" "}
              <Link href="/a-propos" className="font-black text-grape underline decoration-sun decoration-[3px] underline-offset-4">
                À propos
              </Link>{" "}
              raconte toute l&apos;histoire du projet — et comment contribuer.
            </p>
            <Link href="/a-propos" className="btn-pop btn-accent mt-6 px-6 py-3 text-sm">
              Poser une question <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { q: "C'est vraiment gratuit ?", a: "Oui, à 100%. Pas d'abonnement, pas de frais cachés, pas de compte premium. Le projet est fait par un étudiant, pour les étudiants." },
              { q: "Faut-il créer un compte ?", a: "Non. Tu arrives, tu cliques sur ton niveau, tu lis. C'est tout. Aucune inscription, aucun e-mail demandé pour consulter les cours." },
              { q: "Ça marche sur téléphone ?", a: "C'est même pensé d'abord pour le téléphone : lecture en ligne, téléchargement PDF pour le hors-ligne, navigation au pouce." },
              { q: "Quels niveaux sont couverts ?", a: "La Licence 1, la Licence 2 et la Licence 3 de SEG à l'UAM (Université Amadou Makhtar Mbow, Diamniadio), semestre par semestre." },
              { q: "Je peux aider / signaler une erreur ?", a: "Avec plaisir ! Via la page À propos tu peux proposer un document manquant, signaler une mauvaise version ou suggérer une amélioration." },
            ].map((f) => (
              <details key={f.q} className="card-pop group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black">
                  {f.q}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-sun font-black transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 font-medium leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="card-pop relative overflow-hidden !bg-grape p-8 text-center text-white sm:p-14">
          <div className="animate-wiggle absolute left-6 top-6 hidden rounded-2xl border-2 border-ink bg-sun px-3 py-1.5 text-xs font-black text-ink sm:block">
            GO L1 🚀
          </div>
          <div className="animate-wiggle absolute bottom-8 right-6 hidden rounded-2xl border-2 border-ink bg-mint px-3 py-1.5 text-xs font-black text-ink sm:block">
            TD validé ✅
          </div>
          <p className="sticker mx-auto bg-white !text-ink">Allez, c&apos;est parti</p>
          <h2 className="font-display mx-auto mt-5 max-w-2xl text-4xl sm:text-6xl">
            Tes cours, sans prise de tête.
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-medium text-white/80">
            Choisis ton niveau, ouvre ta matière, lis ou télécharge. C&apos;est tout.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="#niveaux" className="btn-pop bg-sun px-8 py-4 text-base text-ink">
              Choisir mon niveau <ArrowRight className="h-5 w-5" />
            </a>
            <Link href="/a-propos" className="btn-pop bg-white px-7 py-4 text-base text-ink">
              Découvrir le projet
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
