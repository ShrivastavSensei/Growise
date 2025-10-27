const CACHE_NAME = 'growise-cache-v1';
const urlsToCache = [
  'index.html',
  '/',
  'https://cdn.tailwindcss.com', // Cache Tailwind
  'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap', // Cache Font CSS
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js', // Cache Firebase Core
  // Add other critical resources here if needed
];

// Install event: Caches all essential assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing and caching shell assets.');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Failed to cache resources:', error);
        });
      })
  );
});

// Activate event: Cleans up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Cleaning old caches.');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: Serves content from cache first, falls back to network
self.addEventListener('fetch', event => {
  // Only handle GET requests for navigation and assets
  if (event.request.method === 'GET' && event.request.url.startsWith('http')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Cache hit - return response
          if (response) {
            return response;
          }
          // Not in cache - fetch from network
          return fetch(event.request);
        })
        .catch(error => {
          console.error('Fetch failed: ', error);
          // Optional: Return a simple offline page if needed
        })
    );
  }
});
