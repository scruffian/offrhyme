const CACHE_NAME = "offrhyme-v132";
const urlsToCache = [
  "./",
  "./index.html",
  "./spoons.html",
  "./styles.css",
  "./manifest.json",
  "./logo.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./words.js",
  "./rhymes.js",
  "./phoneticRhymes.js",
  "./rhyme-table.js",
  "./wordFrequency.js",
];

// Install service worker and cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Fetch from cache first, then network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// Clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});
