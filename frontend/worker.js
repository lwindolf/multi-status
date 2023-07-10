
var cacheName = 'saas-multi-status';
var filesToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/filter.html',
  '/css/style.css',
  '/js/main.js',
  '/js/filter.js',
  '/js/settings.js'
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