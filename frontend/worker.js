// vim: set ts=4 sw=4:
/*jshint esversion: 8 */

var cacheName = 'saas-multi-status';
var filesToCache = [
  '/multi-status/',
  '/multi-status/index.html',
  '/multi-status/about.html',
  '/multi-status/filter.html',
  '/multi-status/css/style.css',
  '/multi-status/js/main.js',
  '/multi-status/js/filter.js',
  '/multi-status/js/settings.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  if(e.request.url.match(/\.(html|js|css)$/)) {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  } else {
    return;
  }
});
