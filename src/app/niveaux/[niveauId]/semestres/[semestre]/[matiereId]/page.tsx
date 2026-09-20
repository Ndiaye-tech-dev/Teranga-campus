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
import { matierePath, semestrePath } from "@/lib/site";
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
  const href = matierePath(niveau.id, parsed, matiere.id);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
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
      <p className="sticker bg-sun">{moduleRow.nom}</p>
      <h1 className="font-display mt-4 text-4xl sm:text-5xl">{matiere.nom}</h1>
      <p className="mt-3 max-w-xl font-medium text-muted">
        Tout est là : le cours pour comprendre, le TD pour t&apos;entraîner,
        les flashcards pour retenir. Clique sur un doc pour le lire, ou
        télécharge-le.
      </p>
      <div className="mt-8">
        <MatiereDocuments documents={documents} matiereHref={href} />
      </div>
    </div>
  );
}
