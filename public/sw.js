const CACHE_VERSION = 'v2';
const CACHE_NAME = `wonamp-cache-${CACHE_VERSION}`;

// Only cache essential static assets
const STATIC_ASSETS = [
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/splash.png'
];

// Clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith('wonamp-cache-') && cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Skip YouTube requests
  if (event.request.url.includes('youtube.com')) return;

  // Skip API requests
  if (event.request.url.includes('/api/')) return;

  // Network-first strategy for HTML and JavaScript files
  if (event.request.url.endsWith('.js') || event.request.url.endsWith('.html') || event.request.url === self.location.origin + '/') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first strategy only for static assets
  if (STATIC_ASSETS.some(asset => event.request.url.endsWith(asset))) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => response || fetch(event.request))
    );
    return;
  }

  // Network-first for everything else
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
}); 