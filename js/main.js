/* =====================
   main.js — точка входу додатку
   Імпортує всі модулі, ініціалізує додаток,
   підключає всі слухачі подій через addEventListener.
   Жодних window.* і onclick у HTML.
   ===================== */

import { loadProfile, saveProfile }  from './core/storage.js';
import { state }                     from './core/state.js';
import { initTheme, toggleTheme }    from './utils/theme.js';
import { showToast, initOfflineBanner, registerServiceWorker, switchTab } from './utils/ui.js';
import { calcTargetCal, calcMacros } from './core/calc.js';
import { GOALS }                     from './data/profile.js';
import { notifySchedule }            from './notifications.js';

import { renderStats, editStat, showApplyButton,
         openSettings, closeSettings,
         renderGoalCards, selectGoal,
         saveSettings, onNotifyToggle, updateNotifyUI, testNotification,
         exportData, importData }
  from './features/profile.js';

import { renderWorkout, renderSched, selectDay,
         toggleDone, updateDoneCount, getTodayIndex,
         toggleExercise, reloadVideo, startRestTimer }
  from './features/workout.js';

import { renderStreakStat } from './features/streaks.js';

import { renderNutrition, renderMacroBar, showWeek } from './features/nutrition.js';

import { openCalModal, closeCalModal, generateICS } from './features/calendar.js';

import { renderTips } from './features/tips.js';

import { timerTogglePause, timerAddTime, timerReset, timerClose } from './timer.js';

/* =====================
   ІНІЦІАЛІЗАЦІЯ
   ===================== */
document.addEventListener('DOMContentLoaded', () => {
  state.profile = loadProfile();

  initTheme();
  initOfflineBanner();
  registerServiceWorker();

  renderStats();
  renderSched();
  selectDay(getTodayIndex());
  renderMacroBar();
  renderNutrition(1);
  renderStreakStat();
  renderTips();

  if (state.profile.notifyEnabled && state.profile.notifyTime) {
    notifySchedule(state.profile.notifyTime);
  }

  initEventListeners();
});

/* =====================
   APPLY CHANGES
   ===================== */
function applyChanges() {
  saveProfile(state.profile);
  state.pendingChanges = false;
  document.getElementById('apply-btn-wrap')?.classList.remove('show');

  renderStats();
  renderSched();
  renderWorkout();
  renderMacroBar();

  const wk = document.getElementById('btn-w2')?.classList.contains('active') ? 2 : 1;
  renderNutrition(wk);
  renderTips();

  const cal = calcTargetCal(state.profile);
  const m   = calcMacros(state.profile);
  const g   = GOALS[state.profile.goal];
  showToast(`✓ Оновлено · ${g.icon} ${g.label} · ${cal} ккал · Б ${m.protein}г`);
}

/* =====================
   СЛУХАЧІ ПОДІЙ
   Усі обробники подій в одному місці.
   Статичні елементи — прямі listener'и.
   Динамічний контент — делегування на контейнер.
   ===================== */
function initEventListeners() {

  /* ---- Хедер ---- */
  document.getElementById('btn-settings')
    ?.addEventListener('click', openSettings);

  document.getElementById('theme-toggle')
    ?.addEventListener('click', toggleTheme);

  document.getElementById('btn-cal')
    ?.addEventListener('click', openCalModal);

  /* ---- Вкладки: делегування на <nav class="tabs"> ---- */
  document.getElementById('tabs-nav')
    ?.addEventListener('click', e => {
      const btn = e.target.closest('[data-tab]');
      if (btn) switchTab(btn.dataset.tab);
    });

  /* ---- Статистика: делегування на .stats ---- */
  document.getElementById('stats-bar')
    ?.addEventListener('click', e => {
      const el = e.target.closest('[data-action]');
      if (!el) return;
      if (el.dataset.action === 'edit-stat')    editStat(el.dataset.stat);
      if (el.dataset.action === 'open-settings') openSettings();
    });

  /* ---- Кнопка «Застосувати» ---- */
  document.getElementById('btn-apply')
    ?.addEventListener('click', applyChanges);

  /* ---- Модалка налаштувань ---- */
  document.getElementById('settings-modal')
    ?.addEventListener('click', e => {
      if (e.target === e.currentTarget) closeSettings();
    });

  document.getElementById('notify-toggle')
    ?.addEventListener('change', onNotifyToggle);

  document.getElementById('btn-close-settings')
    ?.addEventListener('click', closeSettings);

  document.getElementById('btn-save-settings')
    ?.addEventListener('click', async () => { await saveSettings(); renderTips(); });

  document.getElementById('btn-test-notify')
    ?.addEventListener('click', testNotification);

  /* ---- Модалка календаря ---- */
  document.getElementById('cal-modal')
    ?.addEventListener('click', e => {
      if (e.target === e.currentTarget) closeCalModal();
    });

  document.getElementById('btn-close-cal')
    ?.addEventListener('click', closeCalModal);

  document.getElementById('btn-generate-ics')
    ?.addEventListener('click', generateICS);

  /* ---- Харчування: тижні ---- */
  document.getElementById('btn-w1')
    ?.addEventListener('click', () => showWeek(1));

  document.getElementById('btn-w2')
    ?.addEventListener('click', () => showWeek(2));

  /* ---- Таймер: делегування на #rest-timer ---- */
  document.getElementById('rest-timer')
    ?.addEventListener('click', e => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      switch (btn.dataset.action) {
        case 'timer-pause': timerTogglePause();                   break;
        case 'timer-add':   timerAddTime(Number(btn.dataset.sec)); break;
        case 'timer-reset': timerReset();                         break;
        case 'timer-close': timerClose();                         break;
      }
    });

  /* ---- Розклад тижня: делегування на #week-sched ---- */
  document.getElementById('week-sched')
    ?.addEventListener('click', e => {
      const pill = e.target.closest('[data-action="select-day"]');
      if (pill) selectDay(Number(pill.dataset.day));
    });

  /* ---- Контент тренування: делегування на #workout-content ---- */
  document.getElementById('workout-content')
    ?.addEventListener('click', e => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      switch (btn.dataset.action) {
        case 'toggle-exercise': toggleExercise(Number(btn.dataset.ex)); break;
        case 'reload-video':    reloadVideo(Number(btn.dataset.ex));    break;
        case 'start-timer':     startRestTimer();                       break;
        case 'toggle-done':
          toggleDone(Number(btn.dataset.day));
          renderStreakStat();
          break;
      }
    });

  /* ---- Картки цілей: делегування на #goal-cards ---- */
  document.getElementById('goal-cards')
    ?.addEventListener('click', e => {
      const card = e.target.closest('[data-action="select-goal"]');
      if (card) selectGoal(card.dataset.goal);
    });

  /* ---- Експорт / Імпорт даних ---- */
  document.getElementById('btn-export-json')
    ?.addEventListener('click', exportData);

  document.getElementById('input-import-json')
    ?.addEventListener('change', e => importData(e.target.files[0]));
}