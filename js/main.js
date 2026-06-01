/* =====================
   main.js — точка входу додатку
   Імпортує всі модулі, ініціалізує і прокидає глобальні функції
   для HTML onclick-хендлерів
   ===================== */

import { loadProfile, saveProfile }  from './core/storage.js';
import { state }                     from './core/state.js';
import { initTheme, toggleTheme }    from './utils/theme.js';
import { showToast, initOfflineBanner, registerServiceWorker, switchTab } from './utils/ui.js';
import { calcTargetCal, calcMacros } from './core/calc.js';
import { GOALS }                     from './data/profile.js';
import { notifySchedule }            from './notifications.js';

import { renderStats, editStat, showApplyButton,
         openSettings, closeSettings, closeSettingsOverlay,
         renderGoalCards, selectGoal,
         saveSettings, onNotifyToggle, updateNotifyUI, testNotification }
  from './features/profile.js';

import { renderWorkout, renderSched, selectDay,
         toggleDone, updateDoneCount, getTodayIndex,
         toggleExercise, reloadVideo, startRestTimer }
  from './features/workout.js';

import { renderNutrition, renderMacroBar, showWeek } from './features/nutrition.js';

import { openCalModal, closeCalModal, closeIfOverlay, generateICS } from './features/calendar.js';

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
  updateDoneCount();

  if (state.profile.notifyEnabled && state.profile.notifyTime) {
    notifySchedule(state.profile.notifyTime);
  }
});

/* =====================
   APPLY CHANGES
   Координує перерахунок після змін профілю
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

  const cal = calcTargetCal(state.profile);
  const m   = calcMacros(state.profile);
  const g   = GOALS[state.profile.goal];
  showToast(`✓ Оновлено · ${g.icon} ${g.label} · ${cal} ккал · Б ${m.protein}г`);
}

/* =====================
   ГЛОБАЛЬНІ ФУНКЦІЇ
   Прокидаємо до window для HTML onclick-атрибутів
   ===================== */
Object.assign(window, {
  /* Тема */
  toggleTheme,

  /* Вкладки */
  switchTab,

  /* Профіль і статистика */
  editStat,
  applyChanges,
  openSettings,
  closeSettings,
  closeSettingsOverlay,
  selectGoal,
  saveSettings,
  onNotifyToggle,
  testNotification,

  /* Тренування */
  selectDay,
  toggleDone,
  toggleExercise,
  reloadVideo,
  startRestTimer,

  /* Харчування */
  showWeek,

  /* Календар */
  openCalModal,
  closeCalModal,
  closeIfOverlay,
  generateICS,

  /* Таймер */
  RestTimer: { togglePause: timerTogglePause, addTime: timerAddTime, reset: timerReset, close: timerClose },
});