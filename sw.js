var CACHE_NAME = 'mws-restaurant-stage-1-v1';
var urlsToCache = [
  './',
  '/css/styles.css',
  '/js/main.js',
  'restaurant.html',
  '/js/restaurant_info.js',
  '/js/dbhelper.js',
  '/data/restaurants.json',
  'https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
  'https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2'
];

/**
 * Install Event
 */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

/**
 * Cache then Network
 */
this.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request, {ignoreSearch: true}).then(function (response) {
      return response || fetch(event.request).then(function (response) {
        // iF event request is a jpg clone and cache
        if (event.request.url.endsWith(".jpg")) {
          var responseToCache = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseToCache);
            return response
          })
        }
        return response
      });
    })
  );
});

/**
 * Log Service Worker Errors.
 */
self.onerror = function(message) {
  console.log(message);
};
