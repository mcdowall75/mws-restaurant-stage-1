importScripts('/js/idb.js');
importScripts('/js/dbhelper.js');



var CACHE_NAME = 'mws-restaurant-stage-1-v4';
var urlsToCache = [
  './',
  '/css/styles.css',
  '/js/main.js',
  'restaurant.html',
  '/js/restaurant_info.js',
  '/js/dbhelper.js',
  '/js/idb.js',
  '/img/network_wifi.svg',
  '/img/no_wifi.svg',
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
 * Remove unused Cache Versions
 */

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('mws-restaurant-') &&
                 cacheName != CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

/**
 * Cache then Network
 */
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request, {ignoreSearch: true}).then(function (response) {
      return response || fetch(event.request).then(function (response) {
        // iF event request is a jpg clone and cache
        if (event.request.url.endsWith(".jpg") || event.request.url.endsWith(".webp") || event.request.url.endsWith(".png")) {
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

self.addEventListener('sync', function(event) {
  if (event.tag == 'processReviews') {
    event.waitUntil(
      DBHelper.processReviews()
    )
  };
});


/**
 * Log Service Worker Errors.
 */
self.onerror = function(message) {
  console.log(message);
};

