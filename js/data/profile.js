/* =====================
   data/profile.js — константи профілю, цілі, активність
   ===================== */

export const BASE_CAL = 2100;



export const ACTIVITY_FACTORS = {
  sedentary: 1.20,
  moderate:  1.55,
  active:    1.725,
};

export const GOALS = {
  cut:    { label: 'Схуднення', icon: '🔥', calAdjust: -500, macros: { p: 0.35, c: 0.35, f: 0.30 },
            sets: 4, reps: '12–15', rest: '60 сек', note: 'Акцент на кардіо між підходами',
            portionScale: { protein: 1.0, carb: 0.85, fat: 0.9, veggie: 1.1 } },
  bulk:   { label: 'Набір маси', icon: '💪', calAdjust: 300, macros: { p: 0.30, c: 0.45, f: 0.25 },
            sets: 5, reps: '6–10', rest: '90 сек', note: 'Прогресія ваги щотижня',
            portionScale: { protein: 1.0, carb: 1.15, fat: 0.95, veggie: 1.0 } },
  recomp: { label: 'Рельєф', icon: '⚡', calAdjust: -200, macros: { p: 0.40, c: 0.30, f: 0.30 },
            sets: 4, reps: '10–12', rest: '75 сек', note: 'Суперсети для щільності',
            portionScale: { protein: 1.15, carb: 0.80, fat: 1.0, veggie: 1.2 } },
};

export const DEFAULT_PROFILE = {
  currentWeight: 90,
  targetWeight:  82,
  height:        180,
  age:           30,
  sex:           'male',
  activity:      'moderate',
  goal:          'cut',
  notifyEnabled: false,
  notifyTime:    '18:00',
};