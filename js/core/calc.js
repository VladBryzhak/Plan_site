/* =====================
   core/calc.js — всі формули розрахунків (без DOM)
   Mifflin-St Jeor BMR, TDEE, макроси, порції, сети
   ===================== */

import { GOALS, ACTIVITY_FACTORS, BASE_CAL } from '../data/profile.js';

/* ---- BMR (Mifflin-St Jeor) ---- */
export function calcBMR(p) {
  const base = 10 * p.currentWeight + 6.25 * p.height - 5 * p.age;
  return p.sex === 'male' ? base + 5 : base - 161;
}

/* ---- TDEE = BMR × фактор активності ---- */
export function calcTDEE(p) {
  return calcBMR(p) * ACTIVITY_FACTORS[p.activity];
}

/* ---- Цільові калорії з урахуванням цілі ---- */
export function calcTargetCal(p) {
  const adjusted = calcTDEE(p) + GOALS[p.goal].calAdjust;
  const minCal   = p.sex === 'male' ? 1500 : 1300;
  return Math.max(Math.round(adjusted), minCal);
}

/* ---- Макроси у грамах ---- */
export function calcMacros(p) {
  const cal = calcTargetCal(p);
  const m   = GOALS[p.goal].macros;
  return {
    protein: Math.round(cal * m.p / 4),
    carbs:   Math.round(cal * m.c / 4),
    fat:     Math.round(cal * m.f / 9),
  };
}

/* ---- Масштабний коефіцієнт порцій ---- */
export function calcScaleFactor(p) {
  return calcTargetCal(p) / BASE_CAL;
}

/* ---- Фінальна порція для інгредієнта ---- */
export function calcPortion(item, p) {
  if (item.fixed) return `${item.base} ${item.unit}`;
  const goalScale = GOALS[p.goal].portionScale[item.type] || 1.0;
  const scaled    = item.base * calcScaleFactor(p) * goalScale;
  const rounded   = Math.max(5, Math.round(scaled / 5) * 5);
  return `${rounded}${item.unit}`;
}

/* ---- Параметри підходів і відпочинку за ціллю ---- */
export function calcSets(p) {
  const g = GOALS[p.goal];
  return { sets: g.sets, reps: g.reps, rest: g.rest, note: g.note };
}

/* ---- Час відпочинку в секундах (з рядка "60 сек") ---- */
export function getRestSeconds(p) {
  const match = GOALS[p.goal].rest.match(/\d+/);
  return match ? parseInt(match[0]) : 60;
}
