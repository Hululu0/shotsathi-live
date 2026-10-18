// Cache the app shell, plus the MediaPipe runtime and models after first use, so the app opens offline.
// Own files are always revalidated with the server, so a new deploy shows up on the next open.
const CACHE = "shotsathi-v5";
const SHELL = ["./", "index.html", "app.js", "poses.js", "onboard.js", "manifest.webmanifest", "icon.svg", "icon-192.png", "icon-512.png"];
const CDN = ["cdn.jsdelivr.net", "storage.googleapis.com", "fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: "reload" })))));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(e.request.url, { cache: "no-cache", credentials: "same-origin" })
        .then((r) => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, cp)); } return r; })
        .catch(() => caches.match(e.request, { ignoreSearch: true }))
    );
  } else if (CDN.includes(url.hostname)) {
    e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((r) => { if (r.ok || r.type === "opaque") { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, cp)); } return r; })));
  }
});
