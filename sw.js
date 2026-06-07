/* ========================
   sw.js — Сервісний працівник
   Щоб оновити кеш на всіх пристроях після деплою —
   змініть тільки CACHE_VERSION нижче.
   ======================= */

const CACHE_VERSION = 'v7';
const CACHE_NAME = `фітнес-план-${CACHE_VERSION}`;

const ФАЙЛИ_У_КЕШ = [
  './',
  './index.html',
  './manifest.json',
  './іконки/іконка-192.png',
  './іконки/іконка-512.png',
  /* CSS — база */
  './css/base/variables.css',
  './css/base/reset.css',
  './css/base/layout.css',
  /* CSS — компоненти */
  './css/components/stats.css',
  './css/components/workout.css',
  './css/components/cards.css',
  './css/components/nutrition.css',
  './css/components/modals.css',
  './css/components/accordion.css',
  './css/компоненти/профіль.css',
  './css/components/timer.css',
  './css/components/forms.css',
  /* CSS — утиліти */
  './css/utils/responsive.css',
  /* JS — дані */
  './js/data/profile.js',
  './js/data/workouts.js',
  './js/data/nutrition.js',
  /* JS — ядро ​​*/
  './js/core/state.js',
  './js/core/calc.js',
  './js/core/storage.js',
  /* JS — утиліти */
  './js/utils/theme.js',
  './js/utils/ui.js',
  /* JS — функції */
  './js/features/workout.js',
  './js/features/nutrition.js',
  './js/features/profile.js',
  './js/features/calendar.js',
  /* JS — автономний */
  './js/timer.js',
  './js/notifications.js',
  './js/main.js',
];

const SKIP_CACHE = [
  «youtube.com», «youtu.be», «ytimg.com», «yt3.ggpht.com»,
  'fonts.googleapis.com', 'fonts.gstatic.com',
];

/* ---- Встановити: кешуємо всі файли ---- */
self.addEventListener('встановити', подія => {
  подія.waitUntil(
    caches.open(ІМ'Я_КЕША)
      .then(кеш => кеш.addAll(ФАЙЛИ_ТО_КЕШ))
      .catch(err => console.warn('Помилка кешу встановлення [SW]:', err))
  );
  self.skipWaiting();
});

/* ---- Активація: видаляємо старі версії кешу ---- */
self.addEventListener('активувати', подія => {
  подія.waitUntil(
    кеші.ключі().тоді(ключі =>
      Promise.all(keys.filter(k => k !== ІМ'Я_КЕША).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* ---- Отримати ---- */
self.addEventListener('fetch', подія => {
  якщо (event.request.method !== 'GET') повернути;
  якщо (event.request.url.startsWith('розширення chrome://')) повернути;
  якщо (SKIP_CACHE.some(s => event.request.url.includes(s))) повернути;

  /* Навігаційні запити (HTML) — спочатку мережа для оновлення
     деплою відразу доходили до користувача без ручного бампу */
  якщо (event.request.mode === 'навігація') {
    подія.respondWith(
      fetch(подія.запит)
        .then(відповідь => {
          якщо (відповідь?.статус === 200) {
            caches.open(ІМ'Я_КЕША)
              .then(кеш => кеш.пут(подія.запит, відповідь.клон()));
          }
          відповідь на зворотній зв'язок;
        })
        .catch(() => caches.match('./index.html'))
    );
    повернення;
  }

  /* Усі інші ресурси (JS, CSS, іконки) — спочатку кеш */
  подія.respondWith(
    caches.match(event.request).then(кешований => {
      якщо (кешовано) повернути кешовано;
      повернути fetch(event.request).then(response => {
        якщо (відповідь?.статус === 200) {
          caches.open(ІМ'Я_КЕША)
            .then(кеш => кеш.пут(подія.запит, відповідь.клон()));
        }
        відповідь на зворотній зв'язок;
      }).catch(() => {
        якщо (event.request.destination === 'документ') {
          повернути кеші.match('./index.html');
        }
      });
    })
  );
});

/* ---- Клік сповіщення ---- */
self.addEventListener('сповіщення про клік', подія => {
  подія.сповіщення.закрити();
  подія.waitUntil(
    clients.matchAll({ type: 'window', includeUncontroled: true }).then(список => {
      for (const c зі списку) if ('focus' in c) return c.focus();
      якщо (клієнти.openWindow) повернути клієнти.openWindow('./');
    })
  );
});