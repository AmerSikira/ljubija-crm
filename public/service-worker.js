// public/service-worker.js

const CACHE_NAME = 'myapp-cache-v1';
const OFFLINE_URLS = [
    '/',              // homepage
    '/offline',       // optional offline page if you create it
    '/build/manifest.json',
    '/build/app.js',
    '/build/app.css',
];

// Install: cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
    );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    );
});

// Fetch: Network-first, then cache
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const copy = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, copy);
                });
                return response;
            })
            .catch(() =>
                caches.match(event.request).then((cached) => {
                    if (cached) return cached;
                    // fallback to offline page if available
                    return caches.match('/offline');
                })
            )
    );
});
