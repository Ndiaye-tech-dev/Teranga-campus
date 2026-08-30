import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MatiereDocuments } from "@/components/matiere-documents";
import { Breadcrumb } from "@/components/ui";
import {
  getDocumentsByMatiere,
  getMatiere,
  getModule,
  getNiveau,
} from "@/lib/queries";
import { semestrePath } from "@/lib/site";
import { parseSemestre, semestreLabel } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ matiereId: string }>;
}): Promise<Metadata> {
  const { matiereId } = await params;
  const matiere = await getMatiere(matiereId);
  return { title: matiere?.nom ?? "Matière" };
}

export default async function MatierePage({
  params,
}: {
  params: Promise<{ niveauId: string; semestre: string; matiereId: string }>;
}) {
  const { niveauId, semestre, matiereId } = await params;
  const parsed = parseSemestre(semestre);
  const [niveau, matiere] = await Promise.all([
    getNiveau(niveauId),
    getMatiere(matiereId),
  ]);

  if (!niveau || !matiere || !parsed || matiere.niveau_id !== niveau.id) {
    notFound();
  }

  const moduleRow = await getModule(matiere.module_id);
  if (!moduleRow || moduleRow.semestre !== parsed) notFound();

  const documents = await getDocumentsByMatiere(matiereId);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <Breadcrumb
        items={[
          { href: "/", label: "Accueil" },
          { href: `/niveaux/${niveau.id}`, label: niveau.nom },
          {
            href: semestrePath(niveau.id, parsed),
            label: semestreLabel(parsed),
          },
          { label: matiere.nom },
        ]}
      />
      <p className="text-sm text-muted">{moduleRow.nom}</p>
      <h1 className="mt-1 font-serif text-4xl tracking-tight">{matiere.nom}</h1>
      <p className="mt-3 text-muted">
        Cours, travaux dirigés (avec correction) et flashcards
      </p>
      <div className="mt-10">
        <MatiereDocuments documents={documents} />
      </div>
    </div>
  );
}
