"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Download, Expand, ExternalLink, X } from "lucide-react";
import { isRead, setRead, touchDocument } from "@/lib/progress";
import type { Document } from "@/lib/types";

export function CourseReader({
  doc,
  matiereHref,
  onReadChange,
}: {
  doc: Document;
  matiereHref: string;
  onReadChange?: () => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [full, setFull] = useState(false);
  const [read, setReadState] = useState(false);

  const viewUrl = `/api/documents/${doc.id}/view`;
  const downloadUrl = `/api/documents/${doc.id}/download`;
  const href = `${matiereHref}#doc-${doc.id}`;

  useEffect(() => {
    setReadState(isRead(doc.id));
    touchDocument(doc.id, doc.titre, href);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc.id]);

  function toggleRead() {
    const next = !read;
    setReadState(next);
    setRead(doc.id, next, doc.titre, href);
    onReadChange?.();
  }

  function toggleFull() {
    if (!full) {
      boxRef.current?.requestFullscreen?.().catch(() => setFull(true));
      setFull(true);
    } else {
      window.document.exitFullscreen?.().catch(() => {});
      setFull(false);
    }
  }

  useEffect(() => {
    function onChange() {
      if (!window.document.fullscreenElement) setFull(false);
    }
    window.document.addEventListener("fullscreenchange", onChange);
    return () => window.document.removeEventListener("fullscreenchange", onChange);
  }, []);

  return (
    <div
      ref={boxRef}
      className={`overflow-hidden rounded-3xl border-[2.5px] border-ink bg-white shadow-[6px_6px_0_var(--ink)] ${
        full ? "fixed inset-2 z-[60] flex flex-col bg-white" : ""
      }`}
    >
      {/* Barre d'outils */}
      <div className="flex flex-wrap items-center gap-2 border-b-[2.5px] border-ink bg-sun px-4 py-2.5">
        <p className="mr-auto min-w-0 flex-1 truncate text-sm font-black">
          {doc.titre}
        </p>
        <button
          type="button"
          onClick={toggleRead}
          className={`inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1.5 text-xs font-black transition-transform hover:-translate-y-0.5 ${
            read ? "bg-mint" : "bg-white"
          }`}
        >
          <Check className="h-3.5 w-3.5" />
          {read ? "Lu" : "Marquer lu"}
        </button>
        <a
          href={downloadUrl}
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-white px-3 py-1.5 text-xs font-black transition-transform hover:-translate-y-0.5"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Télécharger</span>
          <span className="sm:hidden">PDF</span>
        </a>
        <a
          href={viewUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-white px-3 py-1.5 text-xs font-black transition-transform hover:-translate-y-0.5"
          title="Ouvrir dans un nouvel onglet"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <button
          type="button"
          onClick={toggleFull}
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-ink px-3 py-1.5 text-xs font-black text-white transition-transform hover:-translate-y-0.5"
        >
          {full ? <X className="h-3.5 w-3.5" /> : <Expand className="h-3.5 w-3.5" />}
          {full ? "Quitter" : "Plein écran"}
        </button>
      </div>

      {/* Lecture : PDF natif du navigateur, rapide même sur téléphone */}
      <object
        data={viewUrl}
        type="application/pdf"
        className={`w-full bg-paper ${full ? "min-h-0 flex-1" : "h-[70vh] min-h-[420px]"}`}
      >
        <div className="px-6 py-12 text-center">
          <p className="font-display text-xl">L&apos;aperçu est bloqué par ton navigateur.</p>
          <p className="mx-auto mt-2 max-w-sm text-sm font-medium text-muted">
            Pas de panique : ouvre le doc dans un onglet ou télécharge-le.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a href={viewUrl} target="_blank" rel="noreferrer" className="btn-pop btn-grape px-5 py-2.5 text-sm">
              Ouvrir dans un onglet
            </a>
            <a href={downloadUrl} className="btn-pop bg-white px-5 py-2.5 text-sm">
              Télécharger le PDF
            </a>
          </div>
        </div>
      </object>
    </div>
  );
}
