import { notFound, redirect } from "next/navigation";
import { getMatiere, getModule, getNiveau } from "@/lib/queries";
import { matierePath } from "@/lib/site";

export default async function LegacyMatiereRedirect({
  params,
}: {
  params: Promise<{ niveauId: string; matiereId: string }>;
}) {
  const { niveauId, matiereId } = await params;
  const [niveau, matiere] = await Promise.all([
    getNiveau(niveauId),
    getMatiere(matiereId),
  ]);
  if (!niveau || !matiere || matiere.niveau_id !== niveau.id) notFound();

  const moduleRow = await getModule(matiere.module_id);
  if (!moduleRow) notFound();

  redirect(matierePath(niveau.id, moduleRow.semestre, matiere.id));
}
