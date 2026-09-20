"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  ClipboardList,
  Download,
  Eye,
  Zap,
} from "lucide-react";
import { CourseReader } from "@/components/course-reader";
import { isRead, progressPercent, setRead } from "@/lib/progress";
import type { Document } from "@/lib/types";

type Tab = "cours" | "td" | "flashcards";

const TABS: { id: Tab; label: string; icon: typeof BookOpen }[] = [
  { id: "cours", label: "Cours", icon: BookOpen },
  { id: "td", label: "TD & corrections", icon: ClipboardList },
  { id: "flashcards", label: "Flashcards", icon: Zap },
];

export function MatiereDocuments({
  documents,
  matiereHref,
}: {
  documents: Document[];
  matiereHref: string;
}) {
  const cours = documents.filter((d) => d.type === "cours");
  const tds = documents.filter((d) => d.type === "td");
  const corrections = documents.filter((d) => d.type === "correction");
  const flashcards = documents.filter((d) => d.type === "flashcards");

  const counts: Record<Tab, number> = {
    cours: cours.length,
    td: tds.length,
    flashcards: flashcards.length,
  };

  const [tab, setTab] = useState<Tab>(
    cours.length > 0 ? "cours" : tds.length > 0 ? "td" : "flashcards",
  );
  const [openId, setOpenId] = useState<string | null>(null);
  const [tick, setTick] = useState(0); // force le recalcul de la progression

  // Lien direct #doc-<id> : ouvre le bon onglet + le lecteur
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/^#doc-(.+)$/);
    if (!match) return;
    const id = match[1];
    const found = documents.find((d) => d.id === id);
    if (!found) return;
    if (found.type === "td" || found.type === "correction") {
      setTab("td");
      setOpenId(found.type === "correction" ? found.parent_id : found.id);
    } else if (found.type === "cours" || found.type === "flashcards") {
      setTab(found.type);
      setOpenId(found.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const percent = useMemo(
    () => progressPercent(documents.map((d) => d.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [documents, tick],
  );

  if (documents.length === 0) {
    return (
      <div className="card-pop px-6 py-12 text-center">
        <p className="font-display text-2xl">Rien ici pour l&apos;instant.</p>
        <p className="mx-auto mt-2 max-w-sm text-sm font-medium text-muted">
          Les documents de cette matière n&apos;ont pas encore été ajoutés.
          Repasse dans quelques jours.
        </p>
      </div>
    );
  }

  function toggleOpen(id: string) {
    setOpenId((cur) => {
      const next = cur === id ? null : id;
      if (next) {
        history.replaceState(null, "", `#doc-${next}`);
      } else {
        history.replaceState(null, "", window.location.pathname);
      }
      return next;
    });
  }

  function refresh() {
    setTick((t) => t + 1);
  }

  return (
    <div>
      {/* Progression */}
      <div className="card-pop flex flex-wrap items-center gap-4 px-5 py-4">
        <div className="min-w-40 flex-1">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider">
            <span>Ta progression</span>
            <span>{percent} %</span>
          </div>
          <div className="mt-2 h-3.5 overflow-hidden rounded-full border-2 border-ink bg-paper">
            <div
              className="h-full rounded-full bg-mint transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <p className="text-xs font-bold text-muted">
          {percent === 100
            ? "Matière bouclée, beau travail."
            : "Coche « lu » sur chaque doc pour suivre où tu en es."}
        </p>
      </div>

      {/* Onglets */}
      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTab(t.id);
              setOpenId(null);
            }}
            className={`inline-flex items-center gap-2 rounded-full border-[2.5px] border-ink px-5 py-2.5 text-sm font-black transition-all hover:-translate-y-0.5 ${
              tab === t.id
                ? "bg-ink text-white shadow-[4px_4px_0_rgba(26,18,51,0.25)]"
                : "bg-white shadow-[3px_3px_0_var(--ink)]"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
            <span
              className={`rounded-full border-2 px-2 py-0.5 text-[11px] ${
                tab === t.id ? "border-white/60 bg-white/15" : "border-ink bg-sun"
              }`}
            >
              {counts[t.id]}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "cours" && (
          <DocList
            items={cours}
            matiereHref={matiereHref}
            openId={openId}
            onToggle={toggleOpen}
            onReadChange={refresh}
            empty="Pas de cours pour l'instant."
          />
        )}
        {tab === "td" && (
          <TdList
            tds={tds}
            corrections={corrections}
            matiereHref={matiereHref}
            openId={openId}
            onToggle={toggleOpen}
            onReadChange={refresh}
          />
        )}
        {tab === "flashcards" && (
          <DocList
            items={flashcards}
            matiereHref={matiereHref}
            openId={openId}
            onToggle={toggleOpen}
            onReadChange={refresh}
            empty="Pas de flashcards pour l'instant."
          />
        )}
      </div>
    </div>
  );
}

function DocList({
  items,
  matiereHref,
  openId,
  onToggle,
  onReadChange,
  empty,
}: {
  items: Document[];
  matiereHref: string;
  openId: string | null;
  onToggle: (id: string) => void;
  onReadChange: () => void;
  empty: string;
}) {
  if (items.length === 0) {
    return (
      <p className="card-pop px-6 py-10 text-center text-sm font-bold text-muted">
        {empty}
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <DocRow
          key={item.id}
          item={item}
          matiereHref={matiereHref}
          open={openId === item.id}
          onToggle={() => onToggle(item.id)}
          onReadChange={onReadChange}
        />
      ))}
    </ul>
  );
}

function TdList({
  tds,
  corrections,
  matiereHref,
  openId,
  onToggle,
  onReadChange,
}: {
  tds: Document[];
  corrections: Document[];
  matiereHref: string;
  openId: string | null;
  onToggle: (id: string) => void;
  onReadChange: () => void;
}) {
  const pairs = useMemo(
    () =>
      tds.map((td) => ({
        td,
        correction:
          corrections.find((c) => c.parent_id === td.id) ?? null,
      })),
    [tds, corrections],
  );

  if (pairs.length === 0) {
    return (
      <p className="card-pop px-6 py-10 text-center text-sm font-bold text-muted">
        Pas de TD pour l&apos;instant.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {pairs.map(({ td, correction }) => (
        <li
          key={td.id}
          className="card-pop overflow-hidden"
        >
          <div className="border-b-2 border-ink/10 bg-paper px-5 py-4">
            <p className="font-black">{td.titre}</p>
            <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-muted">
              {correction ? "TD + correction dispo" : "TD seul pour l'instant"}
            </p>
          </div>
          <div className="space-y-3 px-4 py-4 sm:px-5">
            <DocRow
              item={td}
              matiereHref={matiereHref}
              open={openId === td.id}
              onToggle={() => onToggle(td.id)}
              onReadChange={onReadChange}
              compact
              asLi={false}
            />
            {correction ? (
              <DocRow
                item={correction}
                matiereHref={matiereHref}
                open={openId === correction.id}
                onToggle={() => onToggle(correction.id)}
                onReadChange={onReadChange}
                compact
                badge="Correction"
                asLi={false}
              />
            ) : (
              <p className="rounded-2xl border-2 border-dashed border-ink/25 px-4 py-3 text-xs font-bold text-muted">
                La correction n&apos;a pas encore été ajoutée.
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function DocRow({
  item,
  matiereHref,
  open,
  onToggle,
  onReadChange,
  compact = false,
  badge,
  asLi = true,
}: {
  item: Document;
  matiereHref: string;
  open: boolean;
  onToggle: () => void;
  onReadChange: () => void;
  compact?: boolean;
  badge?: string;
  asLi?: boolean;
}) {
  const [read, setReadState] = useState(false);
  const Tag = asLi ? "li" : "div";

  useEffect(() => {
    setReadState(isRead(item.id));
  }, [item.id]);

  function quickToggle(e: React.MouseEvent) {
    e.stopPropagation();
    const next = !read;
    setReadState(next);
    setRead(item.id, next, item.titre, `${matiereHref}#doc-${item.id}`);
    onReadChange();
  }

  return (
    <Tag id={`doc-${item.id}`} className="scroll-mt-32 list-none">
      <div
        className={`rounded-2xl border-2 border-ink bg-white transition-all ${
          open ? "shadow-[5px_5px_0_var(--ink)]" : "shadow-[3px_3px_0_var(--ink)]"
        }`}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={onToggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggle();
            }
          }}
          className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left"
        >
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink ${
              read ? "bg-mint" : "bg-sun"
            }`}
          >
            {read ? <Check className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </span>
          <span className="min-w-0 flex-1">
            <span className={`block truncate font-black ${compact ? "text-[15px]" : ""}`}>
              {item.titre}
            </span>
            <span className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-wider text-muted">
              {badge ? (
                <span className="rounded-full bg-mint px-2 py-0.5 text-ink">{badge}</span>
              ) : null}
              <span>{read ? "Lu" : "Non lu"}</span>
            </span>
          </span>
          <button
            type="button"
            onClick={quickToggle}
            title={read ? "Marquer non lu" : "Marquer lu"}
            className={`hidden shrink-0 rounded-full border-2 border-ink px-3 py-1.5 text-xs font-black sm:block ${
              read ? "bg-mint" : "bg-white hover:bg-sun"
            }`}
          >
            {read ? "Lu ✓" : "Lu ?"}
          </button>
          <a
            href={`/api/documents/${item.id}/download`}
            onClick={(e) => e.stopPropagation()}
            title="Télécharger le PDF"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-white transition-transform hover:-translate-y-0.5 hover:bg-sun"
          >
            <Download className="h-4 w-4" />
          </a>
          <ChevronDown
            className={`h-5 w-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </div>
      {open && (
        <div className="mt-3">
          <CourseReader doc={item} matiereHref={matiereHref} onReadChange={() => { setReadState(isRead(item.id)); onReadChange(); }} />
        </div>
      )}
    </Tag>
  );
}

