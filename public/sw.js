// Small service worker: makes the site open fast on repeat visits and
// still show something on a weak connection. Saree data is also kept in
// localStorage by the app.
const CACHE = 'as-v1';
const SHELL = ['/', '/manifest.webmanifest', '/images/banner-portrait.webp', '/icons/icon-192.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // Google Sheet, fonts: let the browser handle them

  // Pages and data files: try the network first so changes show up.
  if (request.mode === 'navigate' || url.pathname.startsWith('/data/')) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request.mode === 'navigate' ? '/' : request, copy));
          return res;
        })
        .catch(() => caches.match(request.mode === 'navigate' ? '/' : request)),
    );
    return;
  }

  // Images, scripts, styles: serve from cache, refresh in the background.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
