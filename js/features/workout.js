/* =====================
   features/workout.js — рендер тренувань, акордеон, відмітки
   ===================== */

import { WORKOUTS, DAYS_META } from '../data/workouts.js';
import { calcSets, getRestSeconds } from '../core/calc.js';
import { isDone, toggleDoneStorage } from '../core/storage.js';
import { state } from '../core/state.js';
import { showToast } from '../utils/ui.js';
import { timerStart } from '../timer.js';

/* ---- Поточний день тижня (Пн=0 … Нд=6) ---- */
export function getTodayIndex() {
  const dow = new Date().getDay();
  return dow === 0 ? 6 : dow - 1;
}

/* ---- Лічильник виконаних тренувань за тиждень ---- */
export function updateDoneCount() {
  let count = 0;
  for (let i = 0; i < 7; i++) if (isDone(i)) count++;
  const el = document.getElementById('stat-done-val');
  if (el) el.textContent = count;
}

/* ---- Тижневий розклад ---- */
export function renderSched() {
  const container = document.getElementById('week-sched');
  if (!container) return;
  container.innerHTML = DAYS_META.map((d, i) => {
    const cls = ['day-pill', i === state.activeDay ? 'active' : '', isDone(i) ? 'done' : '']
      .filter(Boolean).join(' ');
    return `<div class="${cls}" data-action="select-day" data-day="${i}">
      <div class="dp-label">${d.label}</div>
      <div class="dp-dot dot-${d.type}"></div>
      <div class="dp-short">${d.short}</div>
    </div>`;
  }).join('');
}

/* ---- Вибір дня ---- */
export function selectDay(index) {
  if (state.activeDay !== index) state.openAccordion = null;
  state.activeDay = index;
  renderSched();
  renderWorkout();
}

/* ---- Відмітка тренування ---- */
export function toggleDone(dayIndex) {
  const isNowDone = toggleDoneStorage(dayIndex);
  renderSched();
  renderWorkout();
  updateDoneCount();
  showToast(isNowDone ? '✓ Тренування виконано!' : 'Відмітку знято');
}

/* ---- Запуск таймера відпочинку ---- */
export function startRestTimer() {
  timerStart(getRestSeconds(state.profile));
}

/* ---- YouTube акордеон ---- */
function pickRandomVideo(videos) {
  return videos[Math.floor(Math.random() * videos.length)];
}

export function toggleExercise(exIndex) {
  const ex = WORKOUTS[state.activeDay].exercises[exIndex];
  if (!ex.videos?.length) return;
  const same = state.openAccordion?.day === state.activeDay
            && state.openAccordion?.ex  === exIndex;
  state.openAccordion = same ? null : { day: state.activeDay, ex: exIndex };
  renderWorkout();
  if (state.openAccordion) {
    setTimeout(() => {
      document.getElementById(`acc-${exIndex}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }
}

export function reloadVideo(exIndex) {
  renderWorkout();
  setTimeout(() => {
    document.getElementById(`acc-${exIndex}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 50);
}

/* ---- Головний рендер тренування ---- */
export function renderWorkout() {
  const container = document.getElementById('workout-content');
  if (!container) return;

  const w        = WORKOUTS[state.activeDay];
  const done     = isDone(state.activeDay);
  const isRest   = w.type === 'gray';
  const setsInfo = calcSets(state.profile);
  const restSec  = getRestSeconds(state.profile);

  const iconMap = { teal: 'icon-teal', blue: 'icon-blue', coral: 'icon-coral', gray: 'icon-gray' };

  const modeRow = (!isRest && !w.cardio) ? `
    <div class="workout-mode">
      ${w.type === 'teal' ? '🏋' : '🦵'} ${setsInfo.sets} × ${setsInfo.reps} · відпочинок ${setsInfo.rest}
    </div>` : '';

  const hint = w.exercises.some(e => e.videos) ?
    '<p class="video-hint">Натисни на вправу ▾ щоб переглянути відео техніки</p>' : '';

  const exHTML = w.exercises.map((e, i) => {
    const hasVideo = e.videos?.length > 0;
    const isOpen   = state.openAccordion?.day === state.activeDay
                  && state.openAccordion?.ex  === i;
    const rowCls   = ['ex-row', hasVideo ? 'has-video' : '', isOpen ? 'active' : '']
      .filter(Boolean).join(' ');
    const setsText = e.fixedSets ?? `${setsInfo.sets} × ${setsInfo.reps}`;
    const videoId  = isOpen && hasVideo ? pickRandomVideo(e.videos) : null;

    /* data-action замість inline onclick */
    const rowAction = hasVideo
      ? `data-action="toggle-exercise" data-ex="${i}"`
      : '';

    const acc = isOpen && videoId ? `
      <div class="ex-accordion open" id="acc-${i}">
        <div class="yt-wrap">
          <iframe src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1"
            title="Техніка: ${e.name}" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen loading="lazy"></iframe>
        </div>
        ${e.tip ? `<p class="ex-tip"><span class="ex-tip-icon">💡</span>${e.tip}</p>` : ''}
        <div class="ex-acc-actions">
          <button class="ex-reload-btn" data-action="reload-video" data-ex="${i}">↻ Інше відео</button>
          <button class="ex-timer-btn"  data-action="start-timer">⏱ Старт таймер</button>
        </div>
      </div>` : `<div class="ex-accordion" id="acc-${i}"></div>`;

    return `
      <div class="${rowCls}" ${rowAction}>
        <span class="ex-name">${e.name}</span>
        <div class="ex-right">
          <span class="ex-sets">${setsText}</span>
          ${hasVideo ? '<span class="ex-arrow">▾</span>' : ''}
        </div>
      </div>${acc}`;
  }).join('');

  const timerBtn = (!isRest && !w.cardio) ? `
    <button class="rest-start-btn" data-action="start-timer">
      ⏱ Таймер відпочинку (${restSec} сек)
    </button>` : '';

  const doneBtn = isRest ? '' : `
    <button class="done-btn ${done ? 'marked' : ''}" data-action="toggle-done" data-day="${state.activeDay}">
      ${done ? '<span>✓</span> Виконано — натисни щоб скасувати' : '<span>○</span> Відмітити як виконане'}
    </button>`;

  container.innerHTML = `
    <div class="${done ? 'card done-card' : 'card'}">
      <div class="card-header">
        <div class="card-icon ${iconMap[w.type]}">${w.icon}</div>
        <div>
          <div class="card-title">${w.title}</div>
          <div class="card-sub">${w.sub}</div>
        </div>
      </div>
      ${modeRow}${hint}${exHTML}${timerBtn}${doneBtn}
    </div>`;
}