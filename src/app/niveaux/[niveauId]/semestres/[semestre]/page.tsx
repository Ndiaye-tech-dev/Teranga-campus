import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Breadcrumb, EmptyState } from "@/components/ui";
import {
  getDocumentCounts,
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

const MODULE_COLORS = ["bg-sun", "bg-mint", "bg-candy", "bg-sky", "bg-white"];

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
  const docCounts = await getDocumentCounts(
    grouped.flatMap((g) => g.matieres.map((m) => m.id)),
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Breadcrumb
        items={[
          { href: "/", label: "Accueil" },
          { href: `/niveaux/${niveau.id}`, label: niveau.nom },
          { label: semestreLabel(parsed) },
        ]}
      />
      <p className="sticker bg-white">
        {niveau.nom} · {semestreLabel(parsed)}
      </p>
      <h1 className="font-display mt-4 text-4xl sm:text-5xl">Tes matières</h1>
      <p className="mt-3 max-w-lg font-medium text-muted">
        Rangées par module. Clique sur ta matière pour voir les cours, TD et
        flashcards.
      </p>

      <div className="mt-10 space-y-6">
        {grouped.length === 0 ? (
          <EmptyState
            title="Rien ici pour l'instant"
            hint="Les modules de ce semestre n'ont pas encore été ajoutés."
          />
        ) : (
          grouped.map(({ module, matieres }, mi) => (
            <section
              key={module.id}
              className="card-pop overflow-hidden"
            >
              <div
                className={`${MODULE_COLORS[mi % MODULE_COLORS.length]} flex flex-wrap items-center justify-between gap-2 border-b-[2.5px] border-ink px-6 py-4`}
              >
                <h2 className="font-display text-2xl">{module.nom}</h2>
                <span className="rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-black">
                  {matieres.length} matière{matieres.length > 1 ? "s" : ""}
                </span>
              </div>
              {matieres.length === 0 ? (
                <p className="bg-white px-6 py-5 text-sm font-bold text-muted">
                  Pas encore de matière dans ce module.
                </p>
              ) : (
                <div className="grid gap-3 bg-white p-4 sm:grid-cols-2 sm:p-5">
                  {matieres.map((matiere) => {
                    const n = docCounts[matiere.id] ?? 0;
                    return (
                      <Link
                        key={matiere.id}
                        href={matierePath(niveau.id, parsed, matiere.id)}
                        className="group flex items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-paper px-5 py-4 shadow-[3px_3px_0_var(--ink)] transition-all hover:-translate-y-0.5 hover:bg-sun/40"
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-black">{matiere.nom}</span>
                          <span className="mt-0.5 block text-xs font-bold text-muted">
                            {n > 0
                              ? `${n} document${n > 1 ? "s" : ""}`
                              : "Pas encore de documents"}
                          </span>
                        </span>
                        <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          ))
        )}
      </div>
    </div>
  );
}
