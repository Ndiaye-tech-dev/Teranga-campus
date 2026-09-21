"use client";

import { uploadDocument } from "@/app/actions/documents";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Upload } from "lucide-react";
import type { DocumentType } from "@/lib/types";

export function DocumentUpload({
  matiereId,
  type,
  parentId,
  titrePlaceholder,
  submitLabel = "Ajouter",
  hideTitre = false,
  defaultTitre,
}: {
  matiereId: string;
  type: DocumentType;
  parentId?: string;
  titrePlaceholder: string;
  submitLabel?: string;
  hideTitre?: boolean;
  defaultTitre?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <form
      className="mt-3 rounded-2xl border-2 border-dashed border-ink/30 bg-paper/60 p-3"
      action={async (formData) => {
        setPending(true);
        setError(null);
        const result = await uploadDocument(formData);
        setPending(false);
        if (result.error) {
          setError(result.error);
          return;
        }
        setFileName(null);
        router.refresh();
      }}
    >
      <input type="hidden" name="matiere_id" value={matiereId} />
      <input type="hidden" name="type" value={type} />
      {parentId ? <input type="hidden" name="parent_id" value={parentId} /> : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {hideTitre ? (
          <input type="hidden" name="titre" value={defaultTitre ?? "Correction"} />
        ) : (
          <input
            name="titre"
            required
            placeholder={titrePlaceholder}
            className="flex-1 rounded-xl border-2 border-ink bg-white px-3 py-2 text-sm font-semibold outline-none placeholder:font-medium placeholder:text-muted/60"
          />
        )}
        <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border-2 border-ink bg-white px-3 py-2 text-sm font-bold transition-colors hover:bg-sun/40">
          <Upload className="h-4 w-4 shrink-0" />
          <span className="truncate">{fileName ?? "Choisir un PDF…"}</span>
          <input
            type="file"
            name="fichier"
            accept="application/pdf"
            required
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="btn-pop btn-primary shrink-0 px-4 py-2 text-sm disabled:opacity-50"
        >
          {pending ? "Envoi…" : submitLabel}
        </button>
      </div>
      {error ? <p className="mt-2 text-sm font-bold text-danger">{error}</p> : null}
    </form>
  );
}
