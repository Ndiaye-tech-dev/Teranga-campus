import {
  getContactEmail,
  getContactLinkedin,
  getContactPhone,
  getTiktokUrl,
  getWhatsAppUrl,
} from "@/lib/env";

export const SITE = {
  name: "Teranga Campus",
  developer: "Ablaye Ndiaye",
  pseudo: "NdiayeTech",
  role: "Étudiant à l'UFR SEG — Licence 2",
  university: "Université Amadou Makhtar Mbow",
  department: "UFR Sciences Économiques et de Gestion",
  city: "Diamniadio, Sénégal",
  tagline:
    "Les cours de l'UFR Sciences Économiques et de Gestion, de la Licence 1 à la Licence 3, rassemblés au même endroit.",
};

export function getSiteContact() {
  return {
    email: getContactEmail(),
    phone: getContactPhone(),
    linkedin: getContactLinkedin(),
  };
}

export function getSiteSocial() {
  return {
    whatsapp: getWhatsAppUrl(),
    tiktok: getTiktokUrl(),
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

/** Nom court pour la barre de navigation : "Licence 3 - Economie" -> "L3 · Éco". */
export function shortNiveau(nom: string) {
  let s = nom
    .replace(/^Licence\s*1/i, "L1")
    .replace(/^Licence\s*2/i, "L2")
    .replace(/^Licence\s*3/i, "L3");
  s = s
    .replace(/\s*-\s*Economie\b/i, " · Éco")
    .replace(/\s*-\s*Économie\b/i, " · Éco")
    .replace(/\s*-\s*Gestion\b/i, " · Gestion")
    .replace(/\s*-\s*/g, " · ");
  return s;
}

/** "3 niveaux" : la L3 a deux options mais ça reste un seul niveau. */
export const NIVEAUX_LABEL = "3 niveaux";
