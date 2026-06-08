/* =====================
   features/streaks.js — підрахунок і відображення серії тренувань
   =====================

   Правила:
   - Тільки тренувальні дні (Пн Вт Чт Сб Нд) впливають на серію
   - Дні відпочинку (Ср Пт) повністю ігноруються
   - Сьогоднішній невиконаний тренувальний день не перериває серію
   - streak ≥ 1 → показуємо «N 🔥 днів поспіль»
   - streak = 0 → підказка «ще N тренувань до серії»
*/

import { getWorkoutLog } from '../core/db.js';
import { DAYS_META }     from '../data/workouts.js';

/* Тренувальні dayIndex (де type !== 'gray') */
const TRAINING_DAYS = new Set(
  DAYS_META.map((d, i) => d.type !== 'gray' ? i : -1).filter(i => i >= 0)
);

/* ---- Утиліти дат ---- */
/* Локальна дата у форматі YYYY-MM-DD (не UTC, щоб уникнути зсуву по таймзоні) */
function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDayIndex(dateStr) {
  const dow = new Date(dateStr + 'T00:00:00').getDay();
  return dow === 0 ? 6 : dow - 1;
}

/* ---- Підрахунок серії ---- */
export function calcStreak() {
  const completed = new Set(getWorkoutLog().map(e => e.date));
  const today     = toDateStr(new Date());
  let   streak    = 0;

  /* Курсор на 12:00 дня — щоб перехід на літній/зимовий час
     не зміщував дату при вніченні дня */
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);

  for (let i = 0; i < 366; i++) {
    if (i > 0) cursor.setDate(cursor.getDate() - 1);
    const date    = toDateStr(cursor);
    const dayIdx  = getDayIndex(date);
    const isToday = date === today;

    if (!TRAINING_DAYS.has(dayIdx)) continue;       /* день відпочинку */
    if (isToday && !completed.has(date)) continue;  /* ще є час сьогодні */

    if (completed.has(date)) streak++;
    else break;
  }

  return streak;
}

/* ---- Виконано цього тижня ---- */
function calcWeekCount() {
  const log = getWorkoutLog();
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dow = now.getDay() === 0 ? 6 : now.getDay() - 1;
  now.setDate(now.getDate() - dow);
  const monday     = toDateStr(now);
  const nm         = new Date(now);
  nm.setDate(nm.getDate() + 7);
  const nextMonday = toDateStr(nm);
  return log.filter(e => e.date >= monday && e.date < nextMonday).length;
}

/* ---- Правильний відмінок слова ---- */
function dayWord(n) {
  if (n === 1)           return 'день';
  if (n >= 2 && n <= 4) return 'дні';
  return 'днів';
}

/* ---- Рендер блоку #stat-done ----
   Повністю керує блоком — updateDoneCount більше не потрібен.  */
export function renderStreakStat() {
  const el = document.getElementById('stat-done');
  if (!el) return;

  const streak    = calcStreak();
  const weekCount = calcWeekCount();

  if (streak > 0) {
    /* є серія: «5 🔥 днів поспіль» */
    el.innerHTML = `
      <div class="stat-val streak-val">${streak} 🔥</div>
      <div class="stat-lbl">${dayWord(streak)} поспіль</div>`;
  } else {
    /* серії нема: кількість за тиждень + заохочення */
    el.innerHTML = `
      <div class="stat-val" id="stat-done-val">${weekCount}</div>
      <div class="stat-lbl">Виконано</div>
      <div class="streak-hint">3 поспіль — і буде 🔥</div>`;
  }
}