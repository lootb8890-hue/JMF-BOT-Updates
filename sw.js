const CACHE_NAME = 'jmf-user-' + Date.now(); // Unique name every time to bust cache
const ASSETS = [
  '.',
  'index.html',
  'manifest.json',
  'icon.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force the waiting service worker to become the active service worker
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // ⚡ NETWORK FIRST: Always try to get the fresh file from GitHub/Server
  event.respondWith(
    fetch(event.request).then(response => {
      // If it's a valid response, maybe update cache
      return response;
    }).catch(() => {
      // Offline fallback
      return caches.match(event.request);
    })
  );
});
