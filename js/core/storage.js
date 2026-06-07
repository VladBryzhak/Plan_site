/* =====================
   core/storage.js — адаптер для зворотної сумісності
   Делегує до db.js. Публічне API незмінне —
   решта модулів чіпати не треба.
   ===================== */

import { DEFAULT_PROFILE }                    from '../data/profile.js';
import { loadDB, saveDB, setProfile, getProfile,
         isWorkoutDone, toggleWorkout,
         dayIndexToDate }                      from './db.js';

/* ---- Профіль ---- */
export function loadProfile() {
  return getProfile();
}

export function saveProfile(profile) {
  setProfile(profile);
}

/* ---- Відмітки виконаних тренувань ---- */
export function isDone(dayIndex) {
  return isWorkoutDone(dayIndexToDate(dayIndex));
}

export function toggleDoneStorage(dayIndex) {
  const date = dayIndexToDate(dayIndex);
  return toggleWorkout(date, dayIndex);
}

/* getDoneKey залишаємо для сумісності, але він більше не використовується
   всередині — тільки якщо хтось імпортував ззовні */
export function getDoneKey(dayIndex) {
  const date = dayIndexToDate(dayIndex);
  return `done_${date}_${dayIndex}`;
}