/* =====================
   sw.js — Service Worker v6
   ===================== */

const CACHE_NAME = 'fitness-plan-v6';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  /* CSS — base */
  './css/base/variables.css',
  './css/base/reset.css',
  './css/base/layout.css',
  /* CSS — components */
  './css/components/stats.css',
  './css/components/workout.css',
  './css/components/cards.css',
  './css/components/nutrition.css',
  './css/components/modals.css',
  './css/components/accordion.css',
  './css/components/profile.css',
  './css/components/timer.css',
  './css/components/forms.css',
  /* CSS — utils */
  './css/utils/responsive.css',
  /* JS — data */
  './js/data/profile.js',
  './js/data/workouts.js',
  './js/data/nutrition.js',
  /* JS — core */
  './js/core/state.js',
  './js/core/calc.js',
  './js/core/storage.js',
  /* JS — utils */
  './js/utils/theme.js',
  './js/utils/ui.js',
  /* JS — features */
  './js/features/workout.js',
  './js/features/nutrition.js',
  './js/features/profile.js',
  './js/features/calendar.js',
  /* JS — standalone */
  './js/timer.js',
  './js/notifications.js',
  './js/main.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.startsWith('chrome-extension://')) return;

  const skip = ['youtube.com', 'youtu.be', 'ytimg.com', 'yt3.ggpht.com',
                'fonts.googleapis.com', 'fonts.gstatic.com'];
  if (skip.some(s => event.request.url.includes(s))) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response?.status === 200) {
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, response.clone()));
        }
        return response;
      }).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) if ('focus' in c) return c.focus();
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
