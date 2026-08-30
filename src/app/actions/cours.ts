"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { revalidateSite } from "@/lib/revalidate";

export async function createCours(formData: FormData) {
  const { supabase } = await requireAdmin();
  const titre = String(formData.get("titre") ?? "").trim();
  const matiereId = String(formData.get("matiere_id") ?? "");
  if (!titre || !matiereId) return;

  const { error } = await supabase.from("cours").insert({
    titre,
    matiere_id: matiereId,
  });
  if (error) throw error;

  revalidateSite();
}

export async function updateCours(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const titre = String(formData.get("titre") ?? "").trim();
  if (!id || !titre) return;

  const { error } = await supabase.from("cours").update({ titre }).eq("id", id);
  if (error) throw error;

  revalidateSite();
}

export async function deleteCours(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const matiereId = String(formData.get("matiere_id") ?? "");
  if (!id) return;

  const { data: docs } = await supabase
    .from("documents")
    .select("fichier_url")
    .eq("cours_id", id);

  await supabase.from("cours").delete().eq("id", id);

  const paths = (docs ?? [])
    .map((doc) => storagePathFromUrl(doc.fichier_url))
    .filter(Boolean) as string[];

  if (paths.length) {
    await supabase.storage.from("documents").remove(paths);
  }

  revalidateSite();
  if (matiereId) {
    redirect(`/admin/matieres/${matiereId}`);
  }
  redirect("/admin");
}

function storagePathFromUrl(url: string) {
  const marker = "/object/public/documents/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}
