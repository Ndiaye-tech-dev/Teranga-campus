"use client";

// Progression stockée dans le navigateur, sans compte.
// Un objet simple : { [docId]: { read, openedAt, title, href } }

export type ProgressEntry = {
  read: boolean;
  openedAt: number;
  title: string;
  href: string; // page matière + #doc-<id>, pour reprendre directement
};

const KEY = "tc-progress-v1";

function loadAll(): Record<string, ProgressEntry> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, ProgressEntry>;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function saveAll(data: Record<string, ProgressEntry>) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // stockage plein ou indisponible : on ne bloque pas la lecture
  }
}

export function getProgress(docId: string): ProgressEntry | null {
  return loadAll()[docId] ?? null;
}

export function isRead(docId: string): boolean {
  return loadAll()[docId]?.read === true;
}

/** Appelé quand on ouvre un doc : mémorise titre + lien pour "Reprendre". */
export function touchDocument(docId: string, title: string, href: string) {
  const all = loadAll();
  const prev = all[docId];
  all[docId] = {
    read: prev?.read ?? false,
    openedAt: Date.now(),
    title,
    href,
  };
  saveAll(all);
}

export function setRead(docId: string, read: boolean, title: string, href: string) {
  const all = loadAll();
  const prev = all[docId];
  all[docId] = { read, openedAt: prev?.openedAt ?? Date.now(), title, href };
  saveAll(all);
}

/** Les derniers docs ouverts, plus récents d'abord. */
export function recentDocuments(limit = 3): { id: string; entry: ProgressEntry }[] {
  return Object.entries(loadAll())
    .map(([id, entry]) => ({ id, entry }))
    .sort((a, b) => b.entry.openedAt - a.entry.openedAt)
    .slice(0, limit);
}

/** Part des docs lus dans une liste d'ids (0 à 100). */
export function progressPercent(docIds: string[]): number {
  if (docIds.length === 0) return 0;
  const all = loadAll();
  const done = docIds.filter((id) => all[id]?.read).length;
  return Math.round((done / docIds.length) * 100);
}
