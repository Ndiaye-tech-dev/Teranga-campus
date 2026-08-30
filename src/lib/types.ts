export type DocumentType = "cours" | "td" | "flashcards" | "correction";

export type Semestre = 1 | 2;

export type Niveau = {
  id: string;
  nom: string;
  created_at: string;
};

export type Module = {
  id: string;
  nom: string;
  niveau_id: string;
  semestre: Semestre;
  created_at: string;
};

export type Matiere = {
  id: string;
  nom: string;
  niveau_id: string;
  module_id: string;
  created_at: string;
};

export type Document = {
  id: string;
  matiere_id: string;
  titre: string;
  type: DocumentType;
  fichier_url: string;
  parent_id: string | null;
  created_at: string;
};

export const DOCUMENT_TYPES: { type: Exclude<DocumentType, "correction">; label: string }[] =
  [
    { type: "cours", label: "Cours" },
    { type: "td", label: "TD" },
    { type: "flashcards", label: "Flashcards" },
  ];

export function parseSemestre(value: string): Semestre | null {
  if (value === "1" || value === "2") return Number(value) as Semestre;
  return null;
}

export function semestreLabel(semestre: Semestre) {
  return `Semestre ${semestre}`;
}
