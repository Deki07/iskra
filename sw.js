const CACHE = 'iskra-v4';
const APP_URL = '/iskra/iskra_iphone.html';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll([APP_URL]))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.pathname.includes('iskra_iphone.html')) {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(APP_URL).then(cached => {
          const fresh = fetch(e.request).then(res => {
            if (res.ok) cache.put(APP_URL, res.clone());
            return res;
          }).catch(() => cached);
          return cached || fresh;
        })
      )
    );
  }
});
