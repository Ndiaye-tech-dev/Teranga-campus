/* Teranga Campus — service worker.
 * - Pages : réseau d'abord, repli sur la version visitée, puis page hors-ligne.
 * - PDF déjà ouverts : relisibles sans connexion.
 * - Fichiers statiques : cache d'abord.
 * - /admin : jamais caché (toujours réseau).
 */

const VERSION = "tc-v1";
const PAGES = `tc-pages-${VERSION}`;
const STATIC = `tc-static-${VERSION}`;
const PDFS = `tc-pdfs-${VERSION}`;

const PRECACHE = [
  "/",
  "/hors-ligne",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/logo.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGES)
      .then((cache) => cache.addAll(PRECACHE))
      .catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("tc-") && ![PAGES, STATIC, PDFS].includes(k))
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Admin : toujours le réseau, jamais de cache.
  if (url.pathname.startsWith("/admin")) return;

  // PDF : ceux déjà ouverts restent lisibles hors-ligne.
  if (url.pathname.startsWith("/api/documents/")) {
    event.respondWith(
      caches.open(PDFS).then((cache) =>
        cache.match(request).then(
          (hit) =>
            hit ||
            fetch(request).then((res) => {
              if (res.ok) cache.put(request, res.clone());
              return res;
            })
        )
      )
    );
    return;
  }

  // Statiques : cache d'abord.
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/logo.png" ||
    url.pathname === "/og-image.png" ||
    url.pathname === "/ablaye.jpg" ||
    url.pathname === "/manifest.webmanifest"
  ) {
    event.respondWith(
      caches.open(STATIC).then((cache) =>
        cache.match(request).then(
          (hit) =>
            hit ||
            fetch(request).then((res) => {
              if (res.ok) cache.put(request, res.clone());
              return res;
            })
        )
      )
    );
    return;
  }

  // Pages : réseau d'abord, sinon page visitée, sinon page hors-ligne.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(PAGES).then((cache) => cache.put(request, copy));
          }
          return res;
        })
        .catch(() =>
          caches.match(request).then((hit) => hit || caches.match("/hors-ligne"))
        )
    );
  }
});
