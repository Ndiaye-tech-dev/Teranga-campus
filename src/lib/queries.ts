import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Document, Matiere, Module, Niveau, Semestre } from "@/lib/types";

export function isMissingSchema(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  const message = (error.message ?? "").toLowerCase();
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    error.code === "42703" ||
    message.includes("does not exist") ||
    message.includes("could not find the table") ||
    message.includes("schema cache")
  );
}

export const getNiveaux = cache(async (): Promise<Niveau[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("niveaux").select("*").order("nom");

  if (error) throw error;
  return data ?? [];
});

export const getNiveau = cache(async (id: string): Promise<Niveau | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("niveaux")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
});

export const getModule = cache(async (id: string): Promise<Module | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("modules")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (isMissingSchema(error)) return null;
    throw error;
  }
  return data as Module | null;
});

export const getModulesByNiveauSemestre = cache(
  async (niveauId: string, semestre: Semestre): Promise<Module[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .eq("niveau_id", niveauId)
      .eq("semestre", semestre)
      .order("nom");

    if (error) {
      if (isMissingSchema(error)) return [];
      throw error;
    }
    return (data ?? []) as Module[];
  },
);

export const isModulesTableMissing = cache(async (): Promise<boolean> => {
  const supabase = await createClient();
  const { error } = await supabase.from("modules").select("id").limit(1);
  return isMissingSchema(error);
});

export const getModulesByNiveau = cache(async (niveauId: string): Promise<Module[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("modules")
    .select("*")
    .eq("niveau_id", niveauId)
    .order("semestre")
    .order("nom");

  if (error) {
    if (isMissingSchema(error)) return [];
    throw error;
  }
  return (data ?? []) as Module[];
});

export const getMatieresByNiveau = cache(async (niveauId: string): Promise<Matiere[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matieres")
    .select("*")
    .eq("niveau_id", niveauId)
    .order("nom");

  if (error) throw error;
  return data ?? [];
});

export const getMatieresByModule = cache(async (moduleId: string): Promise<Matiere[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matieres")
    .select("*")
    .eq("module_id", moduleId)
    .order("nom");

  if (error) {
    if (isMissingSchema(error)) return [];
    throw error;
  }
  return data ?? [];
});

export const getMatiere = cache(async (id: string): Promise<Matiere | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matieres")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
});

export const getCours = cache(async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cours")
    .select("id, titre, matiere_id")
    .eq("id", id)
    .maybeSingle();

  if (error) return null;
  return data;
});

export const getDocumentsByMatiere = cache(async (matiereId: string): Promise<Document[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("matiere_id", matiereId)
    .order("created_at");

  if (error) {
    if (isMissingSchema(error)) return [];
    throw error;
  }
  return (data ?? []) as Document[];
});
