"use client";

import { useEffect, useState } from "react";
import { Monitor, Smartphone } from "lucide-react";

const KEY = "tc-view-mode";

export type ViewMode = "mobile" | "desktop";

export function getViewMode(): ViewMode {
  if (typeof window === "undefined") return "mobile";
  try {
    return window.localStorage.getItem(KEY) === "desktop" ? "desktop" : "mobile";
  } catch {
    return "mobile";
  }
}

/** Bascule la largeur d'affichage : téléphone ou écran large. */
export function applyViewMode(mode: ViewMode) {
  const meta = document.querySelector('meta[name="viewport"]');
  if (!meta) return;
  meta.setAttribute(
    "content",
    mode === "desktop"
      ? "width=1280, initial-scale=1"
      : "width=device-width, initial-scale=1, viewport-fit=cover"
  );
}

/** Applique le choix mémorisé dès le chargement. */
export function ViewModeEffect() {
  useEffect(() => {
    applyViewMode(getViewMode());
  }, []);
  return null;
}

export function ViewModeSwitch() {
  const [mode, setMode] = useState<ViewMode>("mobile");

  useEffect(() => {
    setMode(getViewMode());
  }, []);

  function choose(next: ViewMode) {
    setMode(next);
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      // pas de stockage : on applique quand même pour cette visite
    }
    applyViewMode(next);
  }

  const btn = (active: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 text-xs font-black transition-colors ${
      active ? "border-sun bg-sun text-ink" : "border-white/30 text-white/70 hover:text-white"
    }`;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-white/50">Affichage :</span>
      <button type="button" onClick={() => choose("mobile")} className={btn(mode === "mobile")}>
        <Smartphone className="h-3.5 w-3.5" /> Mobile
      </button>
      <button type="button" onClick={() => choose("desktop")} className={btn(mode === "desktop")}>
        <Monitor className="h-3.5 w-3.5" /> Ordinateur
      </button>
    </div>
  );
}
