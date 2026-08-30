"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { revalidateSite } from "@/lib/revalidate";

export async function createNiveau(formData: FormData) {
  const { supabase } = await requireAdmin();
  const nom = String(formData.get("nom") ?? "").trim();
  if (!nom) return;

  const { error } = await supabase.from("niveaux").insert({ nom });
  if (error) throw error;

  revalidateSite();
}

export async function updateNiveau(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const nom = String(formData.get("nom") ?? "").trim();
  if (!id || !nom) return;

  const { error } = await supabase.from("niveaux").update({ nom }).eq("id", id);
  if (error) throw error;

  revalidateSite();
}

export async function deleteNiveau(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { error } = await supabase.from("niveaux").delete().eq("id", id);
  if (error) throw error;

  revalidateSite();
  redirect("/admin");
}
