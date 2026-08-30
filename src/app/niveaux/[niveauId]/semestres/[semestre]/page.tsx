import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, EmptyState } from "@/components/ui";
import {
  getMatieresByModule,
  getModulesByNiveauSemestre,
  getNiveau,
} from "@/lib/queries";
import { matierePath } from "@/lib/site";
import { parseSemestre, semestreLabel } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ niveauId: string; semestre: string }>;
}): Promise<Metadata> {
  const { niveauId, semestre } = await params;
  const parsed = parseSemestre(semestre);
  const niveau = await getNiveau(niveauId);
  if (!niveau || !parsed) return { title: "Semestre" };
  return { title: `${niveau.nom} · ${semestreLabel(parsed)}` };
}

export default async function SemestrePage({
  params,
}: {
  params: Promise<{ niveauId: string; semestre: string }>;
}) {
  const { niveauId, semestre } = await params;
  const parsed = parseSemestre(semestre);
  const niveau = await getNiveau(niveauId);
  if (!niveau || !parsed) notFound();

  const modules = await getModulesByNiveauSemestre(niveauId, parsed);
  const grouped = await Promise.all(
    modules.map(async (mod) => ({
      module: mod,
      matieres: await getMatieresByModule(mod.id),
    })),
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <Breadcrumb
        items={[
          { href: "/", label: "Accueil" },
          { href: `/niveaux/${niveau.id}`, label: niveau.nom },
          { label: semestreLabel(parsed) },
        ]}
      />
      <p className="text-xs uppercase tracking-[0.2em] text-muted">Étape 3</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight">
        {niveau.nom} · {semestreLabel(parsed)}
      </h1>
      <p className="mt-3 text-muted">Matières organisées par module</p>

      <div className="mt-10 space-y-8">
        {grouped.length === 0 ? (
          <EmptyState
            title="Aucun module pour ce semestre"
            hint="Dans l’admin, créez des modules (ex. Module Économie 1) puis les matières. Si la page est vide alors que la base existait déjà, exécutez supabase/migration-v2.sql dans le SQL Editor de Supabase."
          />
        ) : (
          grouped.map(({ module, matieres }) => (
            <section
              key={module.id}
              className="rounded-3xl border border-line bg-card p-6 sm:p-8"
            >
              <h2 className="font-serif text-2xl text-pine">{module.nom}</h2>
              {matieres.length === 0 ? (
                <p className="mt-4 text-sm text-muted">
                  Aucune matière dans ce module pour l’instant.
                </p>
              ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {matieres.map((matiere) => (
                    <Link
                      key={matiere.id}
                      href={matierePath(niveau.id, parsed, matiere.id)}
                      className="rounded-2xl border border-line bg-paper/70 px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-pine/30 hover:bg-white"
                    >
                      <p className="text-lg text-ink">{matiere.nom}</p>
                      <p className="mt-1 text-sm text-muted">Cours, TD, flashcards →</p>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          ))
        )}
      </div>
    </div>
  );
}
