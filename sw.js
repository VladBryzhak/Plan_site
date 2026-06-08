/* =====================
   sw.js — Service Worker
   Щоб оновити кеш на всіх пристроях після деплою —
   змінити тільки CACHE_VERSION нижче.
   ===================== */

const CACHE_VERSION  = 'v9';
const CACHE_NAME     = `fitness-plan-${CACHE_VERSION}`;

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
  './js/core/db.js',
  './js/core/storage.js',
  /* JS — utils */
  './js/utils/theme.js',
  './js/utils/ui.js',
  /* JS — features */
  './js/features/workout.js',
  './js/features/nutrition.js',
  './js/features/profile.js',
  './js/features/calendar.js',
  './js/features/streaks.js',
  /* JS — standalone */
  './js/timer.js',
  './js/notifications.js',
  './js/main.js',
];

const SKIP_CACHE = [
  'youtube.com', 'youtu.be', 'ytimg.com', 'yt3.ggpht.com',
  'fonts.googleapis.com', 'fonts.gstatic.com',
];

/* ---- Install: кешуємо всі файли ---- */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .catch(err => console.warn('[SW] install cache error:', err))
  );
  self.skipWaiting();
});

/* ---- Activate: видаляємо старі версії кешу ---- */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* ---- Fetch ---- */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.startsWith('chrome-extension://')) return;
  if (SKIP_CACHE.some(s => event.request.url.includes(s))) return;

  /* Навігаційні запити (HTML) — мережа без повторного кешування.
     HTML вже є в кеші з install; network-first просто дає свіжу версію. */
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  /* Всі інші ресурси (JS, CSS, іконки) — cache-first.
     Клонуємо response СИНХРОННО до будь-якого await/then,
     інакше браузер вже читає тіло і clone падає з "body is already used". */
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response?.ok) {
          const clone = response.clone();          /* ← clone одразу */
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, clone)); /* clone йде в кеш */
        }
        return response;                           /* оригінал — браузеру */
      }).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

/* ---- Notification click ---- */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) if ('focus' in c) return c.focus();
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});