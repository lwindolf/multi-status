// vim: set ts=4 sw=4:
/*jshint esversion: 8 */

var cachePrefix = 'saas-multi-status';
var cacheVersion = 4;
var cacheName = cachePrefix + '-' + cacheVersion;
var filesToCache = [
  '/multi-status/',
  '/multi-status/index.html',
  '/multi-status/about.html',
  '/multi-status/settings.html',
  '/multi-status/css/style.css',
  '/multi-status/js/main.js',
  '/multi-status/js/MultiStatus.js',
  '/multi-status/js/MultiStatusCloud.js',
  '/multi-status/js/MultiStatusSettings.js',
  '/multi-status/js/settings.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache).then(() => {
        /* Cleanup deprecated cache versions */
        caches.keys().then((keyList) => {
          let k;
          for(k of keyList) {
            if(0 == k.indexOf(cachePrefix) && k !== cacheName) {
              console.log(`Dropping cache version ${k}`);
              caches.delete(k);
            }
          }
        });
      });
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
