const CACHE = "cge-tuner-v2"; // bump this when you change files
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-192.png",
  "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./logo.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});
{
  "name": "Ceol Gan Eagla — Tuner",
  "short_name": "CGE Tuner",
  "start_url": "/Chords-and-lyrics-/",
  "scope": "/Chords-and-lyrics-/",
  "display": "standalone",
  "background_color": "#0b121a",
  "theme_color": "#0b121a",
  "icons": [
    {"src": "icon-32.png",  "sizes": "32x32",  "type": "image/png"},
    {"src": "icon-192.png", "sizes": "192x192","type": "image/png"},
    {"src": "icon-512.png", "sizes": "512x512","type": "image/png"}
  ]
}

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;

  // Always try the network for navigations (so index.html updates fast).
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put("./", copy)).catch(()=>{});
        return res;
      }).catch(() => caches.match("./"))
    );
    return;
  }

  // Cache-first for static assets
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
      return res;
    }))
  );
});
