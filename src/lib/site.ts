import { getContactEmail, getContactLinkedin, getContactPhone } from "@/lib/env";

export const SITE = {
  name: "Teranga Campus",
  developer: "Ablaye Ndiaye",
  role: "Étudiant en Licence 2 — Sciences Économiques et de Gestion",
  university: "Université Amadou Makhtar Mbow",
  department: "Sciences Économiques et de Gestion (SEG)",
  city: "Dakar, Sénégal",
  tagline:
    "Les cours de Sciences Économiques et de Gestion, de la Licence 1 à la Licence 3, rassemblés au même endroit.",
};

export function getSiteContact() {
  return {
    email: getContactEmail(),
    phone: getContactPhone(),
    linkedin: getContactLinkedin(),
  };
}

export function matierePath(
  niveauId: string,
  semestre: 1 | 2,
  matiereId: string,
) {
  return `/niveaux/${niveauId}/semestres/${semestre}/${matiereId}`;
}

export function semestrePath(niveauId: string, semestre: 1 | 2) {
  return `/niveaux/${niveauId}/semestres/${semestre}`;
}
