// BioSemafor – fonctionnement hors ligne.
// Après chaque modification de l'application, augmentez le numéro de version ci-dessous.
const VERSION = "biosemafor-v1";
const FILES = [
  "./", "index.html", "manifest.webmanifest",
  "icons/favicon.svg", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png",
   "fonts/atkinson-hyperlegible-latin-400-italic.woff2",  "fonts/atkinson-hyperlegible-latin-400-normal.woff2",  "fonts/atkinson-hyperlegible-latin-700-normal.woff2",  "fonts/atkinson-hyperlegible-latin-ext-400-italic.woff2",  "fonts/atkinson-hyperlegible-latin-ext-400-normal.woff2",  "fonts/atkinson-hyperlegible-latin-ext-700-normal.woff2",  "fonts/bricolage-grotesque-latin-500-normal.woff2",  "fonts/bricolage-grotesque-latin-700-normal.woff2",  "fonts/bricolage-grotesque-latin-800-normal.woff2",  "fonts/bricolage-grotesque-latin-ext-500-normal.woff2",  "fonts/bricolage-grotesque-latin-ext-700-normal.woff2",  "fonts/bricolage-grotesque-latin-ext-800-normal.woff2",  "fonts/fonts.css"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // Page : réseau d'abord (pour recevoir les mises à jour), cache si hors ligne.
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put("index.html", copy)); return r; })
      .catch(() => caches.match("index.html")));
    return;
  }
  // Autres fichiers : cache d'abord.
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
