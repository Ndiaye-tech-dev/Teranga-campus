"use client";

import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfViewer({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [searchText, setSearchText] = useState("");

  const containerRef = useCallback((el: HTMLDivElement | null) => {
    if (el && width === 0) setWidth(el.clientWidth);
  }, [width]);

  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 2.5));
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));
  const resetZoom = () => setScale(1);

  return (
    <div className="space-y-3">
      {/* Barre d'outils */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-card px-4 py-2 shadow-sm">
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

        {numPages > 0 && (
          <span className="whitespace-nowrap text-xs text-muted">
            {numPages} page{numPages > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Document : toutes les pages empilées, défilement continu */}
      <div
        ref={containerRef}
        className="max-h-[80vh] w-full overflow-y-auto overflow-x-hidden rounded-2xl bg-[#525659] p-3"
      >
        <Document
          file={url}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={
            <p className="py-12 text-center text-white/80">
              Chargement du document…
            </p>
          }
          error={
            <p className="py-12 text-center text-white/80">
              Impossible d&apos;afficher ce document.
            </p>
          }
        >
          <div className="flex flex-col items-center gap-3">
            {Array.from({ length: numPages }, (_, i) => (
              <Page
                key={i}
                pageNumber={i + 1}
                width={width ? width * scale : undefined}
                className="shadow-md"
                customTextRenderer={
                  searchText
                    ? ({ str }) => highlightMatch(str, searchText)
                    : undefined
                }
              />
            ))}
          </div>
        </Document>
      </div>
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
