"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

/** Enregistre le service worker + propose de recharger quand une maj est prête. */
export function SwRegister() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    let reloaded = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!reloaded) {
        reloaded = true;
        window.location.reload();
      }
    });

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        if (reg.waiting) setWaiting(reg.waiting);
        reg.addEventListener("updatefound", () => {
          const worker = reg.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              setWaiting(worker);
            }
          });
        });
      })
      .catch(() => {});
  }, []);

  if (!waiting) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[70] sm:inset-x-auto sm:right-5 sm:w-96">
      <div className="card-pop flex items-center gap-3 !bg-ink px-5 py-4 !text-white">
        <p className="flex-1 text-sm font-bold">
          Une nouvelle version est prête.
        </p>
        <button
          type="button"
          onClick={() => waiting.postMessage("SKIP_WAITING")}
          className="btn-pop bg-sun inline-flex shrink-0 items-center gap-1.5 px-4 py-2 text-xs text-ink"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Recharger
        </button>
      </div>
    </div>
  );
}
