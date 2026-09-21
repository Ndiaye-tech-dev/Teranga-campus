"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

type Result = { kind: "matiere" | "document"; title: string; subtitle: string; href: string };

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full sm:max-w-xs">
      <div className="flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-4 py-2 shadow-[3px_3px_0_var(--ink)] transition-shadow focus-within:shadow-[4px_4px_0_var(--ink)]">
        <Search className="h-4 w-4 shrink-0 text-ink" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Cherche ta matière… (ex: compta)"
          className="w-full bg-transparent text-sm font-semibold text-ink placeholder:font-medium placeholder:text-muted/70 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-sun"
            aria-label="Effacer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-hidden overflow-y-auto rounded-3xl border-[2.5px] border-ink bg-white shadow-[6px_6px_0_var(--ink)]">
          {loading ? (
            <p className="px-5 py-4 text-sm font-bold text-muted">Recherche…</p>
          ) : results.length === 0 ? (
            <p className="px-5 py-4 text-sm font-bold text-muted">
              Rien trouvé… essaie « compta », « micro », « maths ».
            </p>
          ) : (
            <ul className="divide-y-2 divide-ink/10">
              {results.map((r, i) => (
                <li key={i}>
                  <Link
                    href={r.href}
                    onClick={() => setOpen(false)}
                    className="block px-5 py-3 transition-colors hover:bg-sun/30"
                  >
                    <p className="text-sm font-black text-ink">{r.title}</p>
                    <p className="text-xs font-semibold text-muted">{r.subtitle}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
