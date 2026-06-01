/* =====================
   core/storage.js — робота з localStorage
   ===================== */

import { DEFAULT_PROFILE } from '../data/profile.js';

const PROFILE_KEY   = 'user_profile';
const DONE_KEY_PREFIX = 'done_';

/* ---- Профіль ---- */
export function loadProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE_KEY));
    return { ...DEFAULT_PROFILE, ...(saved || {}) };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

/* ---- Відмітки виконаних тренувань ---- */
export function getDoneKey(dayIndex) {
  const today  = new Date();
  const dow    = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - dow);
  monday.setHours(0, 0, 0, 0);
  const target = new Date(monday);
  target.setDate(monday.getDate() + dayIndex);
  const yyyy = target.getFullYear();
  const mm   = String(target.getMonth() + 1).padStart(2, '0');
  const dd   = String(target.getDate()).padStart(2, '0');
  return `${DONE_KEY_PREFIX}${yyyy}-${mm}-${dd}_${dayIndex}`;
}

export function isDone(dayIndex) {
  return localStorage.getItem(getDoneKey(dayIndex)) === 'true';
}

export function toggleDoneStorage(dayIndex) {
  const key = getDoneKey(dayIndex);
  const cur = localStorage.getItem(key) === 'true';
  localStorage.setItem(key, String(!cur));
  return !cur; /* повертає новий стан */
}