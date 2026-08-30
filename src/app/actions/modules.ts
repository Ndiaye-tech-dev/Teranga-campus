"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { revalidateSite } from "@/lib/revalidate";
import { isMissingSchema } from "@/lib/queries";

function throwModuleError(error: { code?: string; message?: string }) {
  if (isMissingSchema(error)) {
    throw new Error(
      "La table « modules » n'existe pas dans Supabase. Dans SQL Editor, exécutez supabase/migration-v2.sql (projet déjà initialisé) ou supabase/schema.sql (nouveau projet), puis rechargez la page.",
    );
  }
  if (error.code === "23505") {
    throw new Error("Un module avec ce nom existe déjà pour ce semestre.");
  }
  throw new Error(error.message || "Impossible d'enregistrer le module.");
}

export async function createModule(formData: FormData) {
  const { supabase } = await requireAdmin();
  const nom = String(formData.get("nom") ?? "").trim();
  const niveauId = String(formData.get("niveau_id") ?? "");
  const semestre = Number(formData.get("semestre"));
  if (!nom || !niveauId || (semestre !== 1 && semestre !== 2)) return;

  const { error } = await supabase.from("modules").insert({
    nom,
    niveau_id: niveauId,
    semestre,
  });
  if (error) throwModuleError(error);

  revalidateSite();
}

export async function updateModule(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const nom = String(formData.get("nom") ?? "").trim();
  const semestre = Number(formData.get("semestre"));
  if (!id || !nom || (semestre !== 1 && semestre !== 2)) return;

  const { error } = await supabase
    .from("modules")
    .update({ nom, semestre })
    .eq("id", id);
  if (error) throwModuleError(error);

  revalidateSite();
}

export async function deleteModule(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const niveauId = String(formData.get("niveau_id") ?? "");
  if (!id) return;

  const { error } = await supabase.from("modules").delete().eq("id", id);
  if (error) throwModuleError(error);

  revalidateSite();
  if (niveauId) {
    redirect(`/admin/niveaux/${niveauId}`);
  }
  redirect("/admin");
}
