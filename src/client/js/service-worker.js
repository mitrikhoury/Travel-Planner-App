import { precacheAndRoute } from 'workbox-precaching';

// Ensure proper caching
precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener('install', (event) => {
  console.log('Service Worker Installed');
  event.waitUntil(
    caches.open('travel-planner-cache').then((cache) => {
      return cache.addAll([
        './',              
        './index.html',      
        './styles/style.css',
        './main.js'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
