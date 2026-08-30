"use server";

import { requireAdmin } from "@/lib/supabase/admin";
import { revalidateSite } from "@/lib/revalidate";
import type { DocumentType } from "@/lib/types";

const ALLOWED: DocumentType[] = ["cours", "td", "flashcards", "correction"];

function storagePathFromUrl(url: string) {
  const marker = "/object/public/documents/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

async function uploadPdf(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  file: File,
  folder: string,
) {
  const path = `${folder}/${crypto.randomUUID()}.pdf`;
  const { error } = await supabase.storage
    .from("documents")
    .upload(path, file, { upsert: false, contentType: "application/pdf" });
  if (error) return { error: error.message, publicUrl: null as string | null };

  const {
    data: { publicUrl },
  } = supabase.storage.from("documents").getPublicUrl(path);

  return { error: null as string | null, publicUrl };
}

export async function uploadDocument(formData: FormData) {
  const { supabase } = await requireAdmin();
  const matiereId = String(formData.get("matiere_id") ?? "");
  const type = String(formData.get("type") ?? "") as DocumentType;
  const titre = String(formData.get("titre") ?? "").trim();
  const parentId = String(formData.get("parent_id") ?? "") || null;
  const file = formData.get("fichier");

  if (
    !matiereId ||
    !ALLOWED.includes(type) ||
    !titre ||
    !(file instanceof File) ||
    file.size === 0
  ) {
    return { error: "Titre et fichier PDF requis." };
  }

  if (file.type !== "application/pdf") {
    return { error: "Seuls les fichiers PDF sont acceptés." };
  }

  if (type === "correction" && !parentId) {
    return { error: "La correction doit être liée à un TD." };
  }

  const uploaded = await uploadPdf(supabase, file, matiereId);
  if (uploaded.error || !uploaded.publicUrl) {
    return { error: uploaded.error ?? "Échec de l’envoi." };
  }

  const { error } = await supabase.from("documents").insert({
    matiere_id: matiereId,
    type,
    titre,
    fichier_url: uploaded.publicUrl,
    parent_id: type === "correction" ? parentId : null,
  });

  if (error) return { error: error.message };

  revalidateSite();
  return { error: null };
}

export async function deleteDocument(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { data: doc } = await supabase
    .from("documents")
    .select("id, fichier_url")
    .eq("id", id)
    .maybeSingle();

  const { data: children } = await supabase
    .from("documents")
    .select("fichier_url")
    .eq("parent_id", id);

  await supabase.from("documents").delete().eq("id", id);

  const paths = [doc?.fichier_url, ...(children ?? []).map((c) => c.fichier_url)]
    .filter(Boolean)
    .map((url) => storagePathFromUrl(url as string))
    .filter(Boolean) as string[];

  if (paths.length) {
    await supabase.storage.from("documents").remove(paths);
  }

  revalidateSite();
}
