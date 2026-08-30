"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { revalidateSite } from "@/lib/revalidate";

export async function createMatiere(formData: FormData) {
  const { supabase } = await requireAdmin();
  const nom = String(formData.get("nom") ?? "").trim();
  const niveauId = String(formData.get("niveau_id") ?? "");
  const moduleId = String(formData.get("module_id") ?? "");
  if (!nom || !niveauId || !moduleId) return;

  const { error } = await supabase.from("matieres").insert({
    nom,
    niveau_id: niveauId,
    module_id: moduleId,
  });
  if (error) throw error;

  revalidateSite();
}

export async function updateMatiere(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const nom = String(formData.get("nom") ?? "").trim();
  const moduleId = String(formData.get("module_id") ?? "");
  if (!id || !nom || !moduleId) return;

  const { data: moduleRow } = await supabase
    .from("modules")
    .select("niveau_id")
    .eq("id", moduleId)
    .maybeSingle();

  const { error } = await supabase
    .from("matieres")
    .update({
      nom,
      module_id: moduleId,
      niveau_id: moduleRow?.niveau_id,
    })
    .eq("id", id);
  if (error) throw error;

  revalidateSite();
}

export async function deleteMatiere(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const niveauId = String(formData.get("niveau_id") ?? "");
  if (!id) return;

  const { error } = await supabase.from("matieres").delete().eq("id", id);
  if (error) throw error;

  revalidateSite();
  if (niveauId) {
    redirect(`/admin/niveaux/${niveauId}`);
  }
  redirect("/admin");
}
