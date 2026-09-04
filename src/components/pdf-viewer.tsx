"use client";

import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfViewer({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [width, setWidth] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [searchText, setSearchText] = useState("");

  const containerRef = useCallback((el: HTMLDivElement | null) => {
    if (el && width === 0) setWidth(el.clientWidth);
  }, [width]);

  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 2.5));
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));
  const resetZoom = () => setScale(1);

  const goPrev = () => setPageNumber((p) => Math.max(p - 1, 1));
  const goNext = () => setPageNumber((p) => Math.min(p + 1, numPages));

  return (
    <div className="space-y-3">
      {/* Barre d'outils */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-card px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={zoomOut}
            className="rounded-full border border-line px-3 py-1 text-sm text-ink transition-colors hover:border-pine/40"
          >
            −
          </button>
          <button
            type="button"
            onClick={resetZoom}
            className="text-xs text-muted hover:text-ink"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            type="button"
            onClick={zoomIn}
            className="rounded-full border border-line px-3 py-1 text-sm text-ink transition-colors hover:border-pine/40"
          >
            +
          </button>
        </div>

        <div className="flex-1 min-w-[140px]">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Rechercher dans le document…"
            className="w-full rounded-full border border-line bg-paper px-4 py-1.5 text-sm text-ink placeholder:text-muted/60 focus:border-pine/40 focus:outline-none"
          />
        </div>
      </div>

      {/* Document : une seule page affichée */}
      <div ref={containerRef} className="w-full overflow-x-auto">
        <Document
          file={url}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={
            <p className="py-12 text-center text-muted">Chargement du document…</p>
          }
          error={
            <p className="py-12 text-center text-muted">
              Impossible d'afficher ce document.
            </p>
          }
        >
          <div className="flex justify-center">
            <Page
              pageNumber={pageNumber}
              width={width ? width * scale : undefined}
              customTextRenderer={
                searchText
                  ? ({ str }) => highlightMatch(str, searchText)
                  : undefined
              }
            />
          </div>
        </Document>
      </div>

      {/* Navigation Précédent / Suivant */}
      {numPages > 0 && (
        <div className="flex items-center justify-center gap-4 rounded-xl border border-line bg-card px-4 py-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={pageNumber <= 1}
            className="rounded-full border border-line px-4 py-1.5 text-sm text-ink transition-colors hover:border-pine/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Précédent
          </button>
          <span className="text-sm text-muted">
            Page {pageNumber} / {numPages}
          </span>
          <button
            type="button"
            onClick={goNext}
            disabled={pageNumber >= numPages}
            className="rounded-full border border-line px-4 py-1.5 text-sm text-ink transition-colors hover:border-pine/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}