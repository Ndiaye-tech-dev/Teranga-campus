import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/ui";
import {
  getDocumentCounts,
  getMatieresByNiveau,
  getModulesByNiveau,
  getNiveau,
} from "@/lib/queries";
import { semestrePath } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ niveauId: string }>;
}): Promise<Metadata> {
  const { niveauId } = await params;
  const niveau = await getNiveau(niveauId);
  return { title: niveau?.nom ?? "Niveau" };
}

function plural(n: number, word: string) {
  return `${n} ${word}${n > 1 ? "s" : ""}`;
}

export default async function NiveauPage({
  params,
}: {
  params: Promise<{ niveauId: string }>;
}) {
  const { niveauId } = await params;
  const niveau = await getNiveau(niveauId);
  if (!niveau) notFound();

  const [modules, matieres] = await Promise.all([
    getModulesByNiveau(niveauId),
    getMatieresByNiveau(niveauId),
  ]);
  const docCounts = await getDocumentCounts(matieres.map((m) => m.id));

  const semestres = ([1, 2] as const).map((n) => {
    const mods = modules.filter((m) => m.semestre === n);
    const mats = matieres.filter((m) => mods.some((mod) => mod.id === m.module_id));
    const docs = mats.reduce((sum, m) => sum + (docCounts[m.id] ?? 0), 0);
    const infos = [
      mods.length > 0 ? plural(mods.length, "module") : null,
      mats.length > 0 ? plural(mats.length, "matière") : null,
      docs > 0 ? plural(docs, "doc") : null,
    ].filter(Boolean) as string[];
    return { n, bg: n === 1 ? "bg-sun" : "bg-mint", infos };
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Breadcrumb
        items={[{ href: "/", label: "Accueil" }, { label: niveau.nom }]}
      />
      <p className="sticker bg-white">{niveau.nom}</p>
      <h1 className="font-display mt-4 text-4xl sm:text-5xl">
        Quel semestre ?
      </h1>
      <p className="mt-3 max-w-lg font-medium text-muted">
        Choisis ton semestre, tu verras ensuite les modules et les matières.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {semestres.map((item) => (
          <Link
            key={item.n}
            href={semestrePath(niveau.id, item.n)}
            className="card-pop card-pop-hover -rotate-1 overflow-hidden"
          >
            <div className={`${item.bg} border-b-[2.5px] border-ink px-6 py-6`}>
              <p className="text-xs font-black uppercase tracking-widest">
                Semestre {item.n}
              </p>
              <p className="font-display mt-1 text-4xl">S{item.n}</p>
              {item.infos.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.infos.map((info) => (
                    <span
                      key={info}
                      className="rounded-full border-2 border-ink bg-white px-3 py-1 text-[11px] font-black uppercase tracking-widest"
                    >
                      {info}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 inline-block rounded-full border-2 border-ink bg-white px-3 py-1 text-[11px] font-black uppercase tracking-widest">
                  Bientôt disponible
                </p>
              )}
            </div>
            <div className="flex items-center justify-between bg-white px-6 py-4">
              <span className="text-sm font-bold text-muted">Voir les matières</span>
              <span className="btn-pop btn-primary px-4 py-2 text-sm">
                Voir <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
