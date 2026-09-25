// Minimal offline cache for Surokkha BD.
// Precaches the app shell and caches hazard/contacts/plan pages as they are visited
// (stale-while-revalidate), so they keep working with no connection.
const CACHE = "surokkha-v1";
const APP_SHELL = ["/", "/bn", "/contacts", "/bn/contacts", "/plan", "/bn/plan", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

function isCacheable(url) {
  return (
    url.origin === self.location.origin &&
    (url.pathname === "/" ||
      url.pathname.startsWith("/hazards") ||
      url.pathname.startsWith("/bn/hazards") ||
      url.pathname.startsWith("/contacts") ||
      url.pathname.startsWith("/bn/contacts") ||
      url.pathname.startsWith("/plan") ||
      url.pathname.startsWith("/bn/plan") ||
      url.pathname.startsWith("/_next/static") ||
      url.pathname.startsWith("/icons"))
  );
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (!isCacheable(url)) return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req);
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
