// BioSemafor – fonctionnement hors ligne.
// Après chaque modification de l'application, augmentez le numéro de version ci-dessous.
const VERSION = "biosemafor-v3";
const FILES = [
  "./", "index.html", "manifest.webmanifest",
  "favicon.svg", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png",
   "atkinson-hyperlegible-latin-400-italic.woff2",  "atkinson-hyperlegible-latin-400-normal.woff2",  "atkinson-hyperlegible-latin-700-normal.woff2",  "atkinson-hyperlegible-latin-ext-400-italic.woff2",  "atkinson-hyperlegible-latin-ext-400-normal.woff2",  "atkinson-hyperlegible-latin-ext-700-normal.woff2",  "bricolage-grotesque-latin-500-normal.woff2",  "bricolage-grotesque-latin-700-normal.woff2",  "bricolage-grotesque-latin-800-normal.woff2",  "bricolage-grotesque-latin-ext-500-normal.woff2",  "bricolage-grotesque-latin-ext-700-normal.woff2",  "bricolage-grotesque-latin-ext-800-normal.woff2",  "fonts.css"
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
