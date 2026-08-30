import { notFound, redirect } from "next/navigation";
import { getCours, getMatiere } from "@/lib/queries";

export default async function AdminCoursRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cours = await getCours(id);
  if (cours) {
    redirect(`/admin/matieres/${cours.matiere_id}`);
  }

  const matiere = await getMatiere(id);
  if (matiere) {
    redirect(`/admin/matieres/${matiere.id}`);
  }

  notFound();
}
