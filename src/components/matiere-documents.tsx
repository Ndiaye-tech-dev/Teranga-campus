"use client";

import { PdfViewer } from "@/components/pdf-viewer";
import { DOCUMENT_TYPES, type Document, type DocumentType } from "@/lib/types";
import { useMemo, useState } from "react";

function byType(documents: Document[], type: DocumentType) {
  return documents.filter((doc) => doc.type === type);
}

export function MatiereDocuments({ documents }: { documents: Document[] }) {
  const cours = byType(documents, "cours");
  const tds = byType(documents, "td");
  const flashcards = byType(documents, "flashcards");
  const corrections = byType(documents, "correction");

  if (documents.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-line px-6 py-12 text-center text-muted">
        Aucun document pour cette matière pour le moment.
      </p>
    );
  }

  return (
    <div className="space-y-12">
      <ResourceGroup title="Cours" items={cours} empty="Aucun cours ajouté." />
      <TdGroup tds={tds} corrections={corrections} />
      <ResourceGroup
        title="Flashcards"
        items={flashcards}
        empty="Aucune flashcard ajoutée."
      />
    </div>
  );
}

function ResourceGroup({
  title,
  items,
  empty,
}: {
  title: string;
  items: Document[];
  empty: string;
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const current = items.find((item) => item.id === activeId) ?? items[0];

  return (
    <section>
      <h2 className="font-serif text-2xl text-ink">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-line px-5 py-8 text-sm text-muted">
          {empty}
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveId(item.id)}
                className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${
                  current?.id === item.id
                    ? "bg-pine text-paper"
                    : "border border-line bg-card text-ink hover:-translate-y-0.5 hover:border-pine/30"
                }`}
              >
                {item.titre}
              </button>
            ))}
          </div>
          {current ? <PdfFrame document={current} /> : null}
        </div>
      )}
    </section>
  );
}

function TdGroup({
  tds,
  corrections,
}: {
  tds: Document[];
  corrections: Document[];
}) {
  const pairs = useMemo(
    () =>
      tds.map((td) => ({
        td,
        correction: corrections.find((item) => item.parent_id === td.id) ?? null,
      })),
    [tds, corrections],
  );

  const [active, setActive] = useState<{ id: string; kind: "td" | "correction" } | null>(
    pairs[0] ? { id: pairs[0].td.id, kind: "td" } : null,
  );

  const current = pairs.find((pair) => pair.td.id === active?.id);
  const shown =
    active?.kind === "correction" && current?.correction
      ? current.correction
      : current?.td;

  return (
    <section>
      <h2 className="font-serif text-2xl text-ink">TD</h2>
      {pairs.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-line px-5 py-8 text-sm text-muted">
          Aucun TD ajouté.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          <ul className="space-y-3">
            {pairs.map((pair) => {
              const isRow = active?.id === pair.td.id;
              return (
                <li
                  key={pair.td.id}
                  className="rounded-2xl border border-line bg-card p-4"
                >
                  <p className="font-medium text-ink">{pair.td.titre}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setActive({ id: pair.td.id, kind: "td" })}
                      className={`rounded-full px-4 py-2 text-sm transition-all ${
                        isRow && active?.kind === "td"
                          ? "bg-pine text-paper"
                          : "border border-line hover:border-pine/30"
                      }`}
                    >
                      TD
                    </button>
                    <button
                      type="button"
                      disabled={!pair.correction}
                      onClick={() =>
                        pair.correction &&
                        setActive({ id: pair.td.id, kind: "correction" })
                      }
                      className={`rounded-full px-4 py-2 text-sm transition-all ${
                        isRow && active?.kind === "correction"
                          ? "bg-clay text-white"
                          : pair.correction
                            ? "border border-line hover:border-clay/40"
                            : "cursor-not-allowed border border-dashed border-line text-muted/60"
                      }`}
                    >
                      Correction
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          {shown ? <PdfFrame document={shown} /> : null}
        </div>
      )}
    </section>
  );
}

function PdfFrame({ document }: { document: Document }) {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-line bg-card p-3">
        <PdfViewer url={`/api/documents/${document.id}/view`} />
      </div>
      <a href={`/api/documents/${document.id}/download`} className="inline-flex items-center rounded-full bg-clay px-5 py-2.5 text-sm text-white transition-transform duration-200 hover:-translate-y-0.5">
        Télécharger — {document.titre}
      </a>
    </div>
  );
}

export { DOCUMENT_TYPES };
