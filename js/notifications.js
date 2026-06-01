/* =====================
   notifications.js — нагадування про тренування
   ===================== */

import { WORKOUTS } from './data/workouts.js';

const TRAINING_DAYS  = [0, 1, 3, 5, 6];
const LEAD_MINUTES   = 20;
let scheduledTimeouts = [];

export function notifyIsSupported() {
  return 'Notification' in window;
}

export function notifyPermission() {
  return notifyIsSupported() ? Notification.permission : 'unsupported';
}

export async function notifyRequestPermission() {
  if (!notifyIsSupported()) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied')  return 'denied';
  return await Notification.requestPermission();
}

function notifyShow() {
  if (Notification.permission !== 'granted') return;
  const today  = new Date().getDay();
  const dayIdx = today === 0 ? 6 : today - 1;
  const workout = WORKOUTS[dayIdx];
  const title  = '🏋 Час тренування!';
  const body   = workout && workout.type !== 'gray'
    ? `Сьогодні: ${workout.title.split('—')[1]?.trim() || 'тренування'}. Готуйся!`
    : 'Час рухатись — твоє тренування скоро починається';

  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then(reg =>
      reg.showNotification(title, {
        body, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png',
        tag: 'workout-reminder', vibrate: [200, 100, 200],
      })
    );
  } else {
    new Notification(title, { body, icon: 'icons/icon-192.png' });
  }
}

export function notifySchedule(timeStr) {
  scheduledTimeouts.forEach(id => clearTimeout(id));
  scheduledTimeouts = [];
  if (!timeStr || Notification.permission !== 'granted') return;

  const [hours, minutes] = timeStr.split(':').map(Number);
  const now = new Date();

  for (let offset = 0; offset < 7; offset++) {
    const date   = new Date(now);
    date.setDate(now.getDate() + offset);
    const dayIdx = date.getDay() === 0 ? 6 : date.getDay() - 1;
    if (!TRAINING_DAYS.includes(dayIdx)) continue;

    const notifyTime = new Date(date);
    notifyTime.setHours(hours, minutes - LEAD_MINUTES, 0, 0);
    const delay = notifyTime.getTime() - now.getTime();
    if (delay > 0) {
      const id = setTimeout(() => {
        notifyShow();
        notifySchedule(timeStr);
      }, delay);
      scheduledTimeouts.push(id);
    }
  }
}

export function notifyTest() {
  if (Notification.permission === 'granted') { notifyShow(); return true; }
  return false;
}

export function notifyCancel() {
  scheduledTimeouts.forEach(id => clearTimeout(id));
  scheduledTimeouts = [];
}
