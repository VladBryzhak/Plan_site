/* =====================
   notifications.js — нагадування про тренування
   Надсилаються за 20 хв до заданого часу тренування
   ===================== */

const Notifications = (() => {
  let scheduledTimeouts = [];

  /* Дні з тренуваннями (індекси: Пн=0 … Нд=6) */
  const TRAINING_DAYS = [0, 1, 3, 5, 6]; /* Пн, Вт, Чт, Сб, Нд */
  const LEAD_MINUTES = 20; /* за скільки хв нагадувати */

  /* ---- Перевірка підтримки ---- */
  function isSupported() {
    return 'Notification' in window;
  }

  /* ---- Запит дозволу ---- */
  async function requestPermission() {
    if (!isSupported()) return 'unsupported';
    if (Notification.permission === 'granted') return 'granted';
    if (Notification.permission === 'denied') return 'denied';
    const result = await Notification.requestPermission();
    return result;
  }

  /* ---- Показати нагадування ---- */
  function show() {
    if (Notification.permission !== 'granted') return;

    const today = new Date().getDay();
    const dayIdx = today === 0 ? 6 : today - 1;
    const workout = (typeof WORKOUTS !== 'undefined') ? WORKOUTS[dayIdx] : null;
    const title = '🏋 Час тренування!';
    const body = workout && workout.type !== 'gray'
      ? `Сьогодні: ${workout.title.split('—')[1]?.trim() || 'тренування'}. Готуйся!`
      : 'Час рухатись — твоє тренування скоро починається';

    /* Через Service Worker (працює надійніше у PWA) */
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(title, {
          body,
          icon: 'icons/icon-192.png',
          badge: 'icons/icon-192.png',
          tag: 'workout-reminder',
          vibrate: [200, 100, 200],
        });
      });
    } else {
      new Notification(title, { body, icon: 'icons/icon-192.png' });
    }
  }

  /* ---- Планування нагадувань ----
     Розраховує наступні нагадування на найближчі 7 днів
     і ставить setTimeout для кожного (працює поки вкладка активна).
  */
  function schedule(timeStr) {
    /* Очищаємо попередні */
    scheduledTimeouts.forEach(id => clearTimeout(id));
    scheduledTimeouts = [];

    if (!timeStr || Notification.permission !== 'granted') return;

    const [hours, minutes] = timeStr.split(':').map(Number);
    const now = new Date();

    /* Проходимо наступні 7 днів */
    for (let offset = 0; offset < 7; offset++) {
      const date = new Date(now);
      date.setDate(now.getDate() + offset);
      const dayIdx = date.getDay() === 0 ? 6 : date.getDay() - 1;

      /* Тільки дні тренувань */
      if (!TRAINING_DAYS.includes(dayIdx)) continue;

      /* Час тренування мінус lead */
      const notifyTime = new Date(date);
      notifyTime.setHours(hours, minutes - LEAD_MINUTES, 0, 0);

      const delay = notifyTime.getTime() - now.getTime();

      /* Тільки майбутні, в межах 7 днів (setTimeout limit ~24.8 днів) */
      if (delay > 0) {
        const id = setTimeout(() => {
          show();
          /* Перепланувати на наступний тиждень */
          schedule(timeStr);
        }, delay);
        scheduledTimeouts.push(id);
      }
    }
  }

  /* ---- Тестове нагадування (одразу) ---- */
  function test() {
    if (Notification.permission === 'granted') {
      show();
      return true;
    }
    return false;
  }

  function cancel() {
    scheduledTimeouts.forEach(id => clearTimeout(id));
    scheduledTimeouts = [];
  }

  return { isSupported, requestPermission, schedule, test, cancel, permission: () => isSupported() ? Notification.permission : 'unsupported' };
})();
