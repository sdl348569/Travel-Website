const CACHE_NAME = 'travel-website-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/styles.css',
  '/assets/js/main.js',
  '/assets/js/scrollreveal.min.js',
  '/assets/js/swiper-bundle.min.js',
  '/assets/css/swiper-bundle.min.css',
  '/assets/img/home1.jpg',
  'https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css',
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21',
  'https://images.unsplash.com/photo-1519046904884-53103b34b206',
  'https://images.unsplash.com/photo-1520483601560-389dff434fdf',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
  'https://images.unsplash.com/photo-1542259009477-d625272157b7',
  'https://images.unsplash.com/photo-1583830379747-235f6d3f7145',
  'https://images.unsplash.com/photo-1593536877742-f1398137db7e'
];

// Install event - cache essential resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
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

// Fetch event - serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          response => {
            // Check if response is valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response because it's a one-time use stream
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                // Only cache same-origin requests
                if (event.request.url.startsWith(self.location.origin)) {
                  cache.put(event.request, responseToCache);
                }
              });
              
            return response;
          }
        );
      })
  );
});
