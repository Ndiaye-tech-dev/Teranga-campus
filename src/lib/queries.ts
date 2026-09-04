import { matierePath } from "@/lib/site";
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



export type SearchResult = {
  kind: "matiere" | "document";
  title: string;
  subtitle: string;
  href: string;
};

export async function searchContent(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  const supabase = await createClient();
  const like = `%${query}%`;

  const [{ data: matieres }, { data: documents }] = await Promise.all([
    supabase.from("matieres").select("id, nom, niveau_id, module_id").ilike("nom", like).limit(10),
    supabase.from("documents").select("id, titre, type, matiere_id").ilike("titre", like).limit(10),
  ]);

  const matiereIds = new Set<string>();
  (matieres ?? []).forEach((m) => matiereIds.add(m.id));
  (documents ?? []).forEach((d) => matiereIds.add(d.matiere_id));

  if (matiereIds.size === 0) return [];

  const { data: allMatieres } = await supabase
    .from("matieres")
    .select("id, nom, niveau_id, module_id")
    .in("id", Array.from(matiereIds));

  const moduleIds = Array.from(new Set((allMatieres ?? []).map((m) => m.module_id)));
  const { data: modules } = await supabase.from("modules").select("id, semestre").in("id", moduleIds);
  const { data: niveaux } = await supabase.from("niveaux").select("id, nom");

  const matiereMap = new Map((allMatieres ?? []).map((m) => [m.id, m]));
  const moduleMap = new Map((modules ?? []).map((m) => [m.id, m]));
  const niveauMap = new Map((niveaux ?? []).map((n) => [n.id, n.nom]));

  const results: SearchResult[] = [];

  for (const m of matieres ?? []) {
    const mod = moduleMap.get(m.module_id);
    if (!mod) continue;
    results.push({
      kind: "matiere",
      title: m.nom,
      subtitle: niveauMap.get(m.niveau_id) ?? "",
      href: matierePath(m.niveau_id, mod.semestre as 1 | 2, m.id),
    });
  }

  for (const d of documents ?? []) {
    const m = matiereMap.get(d.matiere_id);
    if (!m) continue;
    const mod = moduleMap.get(m.module_id);
    if (!mod) continue;
    results.push({
      kind: "document",
      title: d.titre,
      subtitle: m.nom,
      href: matierePath(m.niveau_id, mod.semestre as 1 | 2, m.id),
    });
  }

  return results.slice(0, 12);
}