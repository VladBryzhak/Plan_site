/* =====================
   core/db.js — єдиний шар зберігання даних (v1)

   Схема:
   {
     _version: 1,
     profile:    { ...DEFAULT_PROFILE },
     weights:    [{ date: 'YYYY-MM-DD', value: 90 }],
     workoutLog: [{ date: 'YYYY-MM-DD', dayIndex: 0 }],
   }

   Тема зберігається окремим ключем 'theme' — це UI-налаштування,
   а не дані користувача, тому в export не входить.
   ===================== */

import { DEFAULT_PROFILE } from '../data/profile.js';

const DB_KEY        = 'fitness_db';
const SCHEMA_VERSION = 1;

const DEFAULT_DB = {
  _version:   SCHEMA_VERSION,
  profile:    { ...DEFAULT_PROFILE },
  weights:    [],   /* [{ date: 'YYYY-MM-DD', value: Number }] */
  workoutLog: [],   /* [{ date: 'YYYY-MM-DD', dayIndex: Number }] */
};

/* =====================
   ВНУТРІШНІ УТИЛІТИ
   ===================== */

/** Перетворює dayIndex поточного тижня у рядок 'YYYY-MM-DD' */
export function dayIndexToDate(dayIndex) {
  const today  = new Date();
  const dow    = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - dow);
  monday.setHours(0, 0, 0, 0);
  const target = new Date(monday);
  target.setDate(monday.getDate() + dayIndex);
  return target.toISOString().slice(0, 10);
}

/** Мігрує старі ключі (user_profile + done_*) у нову схему */
function migrateFromLegacy() {
  const oldProfile = localStorage.getItem('user_profile');
  const hasDoneKeys = Object.keys(localStorage).some(k => k.startsWith('done_'));
  if (!oldProfile && !hasDoneKeys) return null;

  const db = structuredClone(DEFAULT_DB);

  if (oldProfile) {
    try { db.profile = { ...DEFAULT_PROFILE, ...JSON.parse(oldProfile) }; } catch {}
  }

  /* done_YYYY-MM-DD_N → workoutLog */
  for (const key of Object.keys(localStorage)) {
    if (!key.startsWith('done_')) continue;
    if (localStorage.getItem(key) !== 'true') continue;
    const m = key.match(/^done_(\d{4}-\d{2}-\d{2})_(\d)$/);
    if (m) db.workoutLog.push({ date: m[1], dayIndex: Number(m[2]) });
  }

  return db;
}

function cleanupLegacy() {
  localStorage.removeItem('user_profile');
  Object.keys(localStorage)
    .filter(k => k.startsWith('done_'))
    .forEach(k => localStorage.removeItem(k));
}

/* =====================
   ЗАВАНТАЖЕННЯ / ЗБЕРЕЖЕННЯ
   ===================== */

export function loadDB() {
  /* 1. Спробуємо нову схему */
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const db = JSON.parse(raw);
      if (db._version === SCHEMA_VERSION) {
        /* Забезпечуємо наявність усіх полів (для майбутніх версій) */
        return {
          ...structuredClone(DEFAULT_DB),
          ...db,
          profile: { ...DEFAULT_PROFILE, ...db.profile },
        };
      }
    }
  } catch {}

  /* 2. Міграція зі старого формату */
  const migrated = migrateFromLegacy();
  if (migrated) {
    saveDB(migrated);
    cleanupLegacy();
    return migrated;
  }

  /* 3. Перший запуск */
  return structuredClone(DEFAULT_DB);
}

export function saveDB(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.error('[DB] saveDB failed:', e);
  }
}

/* =====================
   ПРОФІЛЬ
   ===================== */

export function getProfile() {
  return loadDB().profile;
}

export function setProfile(profile) {
  const db = loadDB();
  db.profile = profile;
  saveDB(db);
}

/* =====================
   ЖУРНАЛ ТРЕНУВАНЬ
   ===================== */

export function isWorkoutDone(date) {
  return loadDB().workoutLog.some(e => e.date === date);
}

export function toggleWorkout(date, dayIndex) {
  const db   = loadDB();
  const done = db.workoutLog.some(e => e.date === date);
  db.workoutLog = done
    ? db.workoutLog.filter(e => e.date !== date)
    : [...db.workoutLog, { date, dayIndex }];
  saveDB(db);
  return !done; /* повертає новий стан */
}

export function getWorkoutLog() {
  return loadDB().workoutLog;
}

/* =====================
   ЩОДЕННИК ВАГИ
   (Фаза 1 — тут тільки CRUD, UI буде пізніше)
   ===================== */

export function getWeights() {
  return [...loadDB().weights].sort((a, b) => a.date.localeCompare(b.date));
}

export function addWeight(value) {
  const date = new Date().toISOString().slice(0, 10);
  const db   = loadDB();
  /* Якщо запис за сьогодні вже є — оновлюємо */
  const idx  = db.weights.findIndex(w => w.date === date);
  if (idx >= 0) db.weights[idx].value = value;
  else db.weights.push({ date, value });
  saveDB(db);
}

export function removeWeight(date) {
  const db = loadDB();
  db.weights = db.weights.filter(w => w.date !== date);
  saveDB(db);
}

/* =====================
   ЕКСПОРТ / ІМПОРТ JSON
   ===================== */

export function exportJSON() {
  const db = loadDB();
  const payload = {
    _version:  db._version,
    _exported: new Date().toISOString(),
    profile:   db.profile,
    weights:   db.weights,
    workoutLog: db.workoutLog,
  };
  return JSON.stringify(payload, null, 2);
}

export function importJSON(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);

    if (!data._version || data._version !== SCHEMA_VERSION) {
      return { ok: false, error: `Непідтримувана версія схеми: ${data._version ?? '?'}` };
    }

    const db = loadDB();
    if (data.profile)    db.profile    = { ...DEFAULT_PROFILE, ...data.profile };
    if (Array.isArray(data.weights))    db.weights    = data.weights;
    if (Array.isArray(data.workoutLog)) db.workoutLog = data.workoutLog;

    saveDB(db);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: `Помилка читання файлу: ${e.message}` };
  }
}