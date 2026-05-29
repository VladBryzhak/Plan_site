/* =====================
   sw.js — Service Worker
   Відповідає за: офлайн-кеш, PWA
   ===================== */

const CACHE_NAME = 'fitness-plan-v2';

/* Всі файли, які треба закешувати при першому відкритті */
const FILES_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/data.js',
  './js/app.js',
  './manifest.json',
  './icons/main-icon-192.png',
  '/icons/icon-512.png',
  /* Шрифти Google Fonts кешуються автоматично при першому завантаженні */
];

/* ---- Install: кешуємо всі файли ---- */
self.addEventListener('install', event => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Кешую файли...');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  /* Активуємо новий SW одразу, не чекаючи закриття вкладки */
  self.skipWaiting();
});

/* ---- Activate: видаляємо старий кеш ---- */
self.addEventListener('activate', event => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Видаляю старий кеш:', key);
            return caches.delete(key);
          })
      )
    )
  );
  /* Беремо контроль над всіма вкладками одразу */
  self.clients.claim();
});

/* ---- Fetch: стратегія Cache First ----
   1. Спочатку шукаємо в кеші
   2. Якщо є — віддаємо з кешу (швидко, офлайн ✓)
   3. Якщо немає — йдемо в мережу і зберігаємо в кеш
*/
self.addEventListener('fetch', event => {
  /* Пропускаємо не-GET запити і chrome-extension */
  if (event.request.method !== 'GET') return;
  if (event.request.url.startsWith('chrome-extension://')) return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        /* Знайдено в кеші — повертаємо */
        return cachedResponse;
      }

      /* Не знайдено — йдемо в мережу */
      return fetch(event.request).then(networkResponse => {
        /* Зберігаємо відповідь у кеш для наступного разу */
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        /* Мережа недоступна і файл не в кеші */
        /* Для HTML-сторінок повертаємо головну сторінку */
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
