"use client";

import { uploadDocument } from "@/app/actions/documents";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

  return (
    <form
      className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center"
      action={async (formData) => {
        setPending(true);
        setError(null);
        const result = await uploadDocument(formData);
        setPending(false);
        if (result.error) {
          setError(result.error);
          return;
        }
        router.refresh();
      }}
    >
      <input type="hidden" name="matiere_id" value={matiereId} />
      <input type="hidden" name="type" value={type} />
      {parentId ? <input type="hidden" name="parent_id" value={parentId} /> : null}
      {hideTitre ? (
        <input type="hidden" name="titre" value={defaultTitre ?? "Correction"} />
      ) : (
        <input
          name="titre"
          required
          placeholder={titrePlaceholder}
          className="flex-1 rounded-xl border border-line bg-white px-3 py-2 outline-none focus:shadow-[0_0_0_3px_rgba(30,58,138,0.12)]"
        />
      )}
      <input
        type="file"
        name="fichier"
        accept="application/pdf"
        required
        className="flex-1 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-pine file:px-3 file:py-1.5 file:text-paper"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-line px-4 py-2 text-sm transition-colors hover:bg-paper disabled:opacity-50"
      >
        {pending ? "Envoi…" : submitLabel}
      </button>
      {error ? <p className="text-sm text-clay sm:ml-2">{error}</p> : null}
    </form>
  );
}
