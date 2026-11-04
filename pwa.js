const CACHE_NAME = 'auto-cache-v1';
const OFFLINE_PAGE = '/index.html';

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      const ressources = performance.getEntriesByType('resource')
        .filter(r => r.name.startsWith(self.location.origin))
        .map(r => r.name);
      const essentiels = ['/', '/index.html'];
      return cache.addAll([...essentiels, ...ressources]);
    }).catch(() => {
      return caches.open(CACHE_NAME).then(cache =>
        cache.addAll(['/', '/index.html'])
      );
    })
  );
});

self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      const cachedResponse = await cache.match(event.request);
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(() => cachedResponse || caches.match(OFFLINE_PAGE));
      return cachedResponse || fetchPromise;
    })
  );
});
