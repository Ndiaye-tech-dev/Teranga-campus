"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, History } from "lucide-react";
import { recentDocuments } from "@/lib/progress";
import type { ProgressEntry } from "@/lib/progress";

export function ContinueReading() {
  const [items, setItems] = useState<{ id: string; entry: ProgressEntry }[]>([]);

  useEffect(() => {
    setItems(recentDocuments(3));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 pt-10">
      <div className="card-pop !bg-ink !text-white px-6 py-5">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-sun">
          <History className="h-4 w-4" />
          Reprendre où tu t&apos;es arrêté
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {items.map(({ id, entry }) => (
            <li key={id}>
              <Link
                href={entry.href}
                className="group flex items-center gap-3 rounded-2xl border-2 border-white/25 bg-white/10 px-4 py-3 transition-colors hover:bg-white/20"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-white/40 ${
                    entry.read ? "bg-mint text-ink" : "bg-sun text-ink"
                  }`}
                >
                  {entry.read ? <Check className="h-4 w-4" /> : <History className="h-4 w-4" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-black">{entry.title}</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">
                    {entry.read ? "Relire" : "Continuer"}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
