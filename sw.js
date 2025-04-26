const CACHE_NAME = 'travel-website-v1';

// Fix paths by removing leading slashes
const urlsToCache = [
  './', // Cache the current directory
  'index.html',
  'assets/css/styles.css',
  'assets/js/main.js',
  'assets/js/scrollreveal.min.js',
  'assets/js/swiper-bundle.min.js',
  'assets/css/swiper-bundle.min.css',
  'assets/img/favicon.png',
  'manifest.json',
  'offline.html', // Fallback page for offline mode
  // External resources - these won't be cached properly in development due to CORS
  'https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css'
];

// Offline fallback page
const OFFLINE_URL = 'offline.html';

// Install event - cache essential resources
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  
  // Force waiting service worker to become active
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('[ServiceWorker] Cache install error:', error);
      })
  );
});

// Activate event - clean up old caches and take control immediately
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  
  // Take control of all clients as soon as the service worker activates
  event.waitUntil(clients.claim());
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('[ServiceWorker] Removing old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Fetch event - improved caching strategy
self.addEventListener('fetch', event => {
  console.log('[ServiceWorker] Fetch', event.request.url);
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.startsWith('https://images.unsplash.com') &&
      !event.request.url.startsWith('https://cdn.jsdelivr.net')) {
    console.log('[ServiceWorker] Skipping non-cacheable request:', event.request.url);
    return;
  }
  
  // For HTML requests - use a network-first strategy
  if (event.request.mode === 'navigate' || 
      (event.request.method === 'GET' && 
       event.request.headers.get('accept').includes('text/html'))) {
    
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If we got a valid response, clone it and cache it
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Otherwise, show the offline page
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }
  
  // For all other requests - use a cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // If found in cache, return the cached version
          return cachedResponse;
        }
        
        // Otherwise, go to the network
        return fetch(event.request)
          .then(response => {
            // If response is invalid, just return it
            if (!response || response.status !== 200) {
              return response;
            }
            
            // Clone the response since it's a stream
            const responseClone = response.clone();
            
            // Open the cache to save the response
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
            
            return response;
          })
          .catch(error => {
            console.error('[ServiceWorker] Fetch error:', error);
            
            // For image requests, return a placeholder if available
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
              return caches.match('assets/img/placeholder.png');
            }
            
            // Return the error
            throw error;
          });
      })
  );
});
