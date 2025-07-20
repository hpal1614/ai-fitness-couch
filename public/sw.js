// Workbox service worker for VoiceFit
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  clients.claim();
});

// Cache static assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin === location.origin) {
    // Cache-first for static assets
    event.respondWith(
      caches.open('voicefit-static-v1').then(cache =>
        cache.match(event.request).then(response =>
          response || fetch(event.request).then(networkResponse => {
            if (event.request.method === 'GET' && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
        )
      )
    );
  } else {
    // Network-first for API calls
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/offline.html'))
    );
  }
}); 