/* =====================
   features/nutrition.js — рендер харчування і макро-панелі
   ===================== */

import { WEEK1, WEEK2 }    from '../data/nutrition.js';
import { GOALS }           from '../data/profile.js';
import { calcMacros, calcTargetCal, calcPortion } from '../core/calc.js';
import { state }           from '../core/state.js';

/* ---- Макро-панель ---- */
export function renderMacroBar() {
  const container = document.getElementById('macro-bar');
  if (!container) return;

  const cal    = calcTargetCal(state.profile);
  const macros = calcMacros(state.profile);
  const g      = GOALS[state.profile.goal];
  const r      = g.macros;

  container.innerHTML = `
    <div class="macro-header">
      <span>${g.icon} ${g.label}</span>
      <span class="macro-cal">${cal} ккал/день</span>
    </div>
    <div class="macro-track">
      <div class="macro-seg seg-protein" style="width:${r.p * 100}%"></div>
      <div class="macro-seg seg-carb"    style="width:${r.c * 100}%"></div>
      <div class="macro-seg seg-fat"     style="width:${r.f * 100}%"></div>
    </div>
    <div class="macro-legend">
      <span><i class="dot-protein"></i>Білок ${macros.protein}г</span>
      <span><i class="dot-carb"></i>Вуглев. ${macros.carbs}г</span>
      <span><i class="dot-fat"></i>Жири ${macros.fat}г</span>
    </div>`;
}

/* ---- Рендер харчування ---- */
export function renderNutrition(weekNum) {
  const container = document.getElementById('nutrition-content');
  if (!container) return;

  const data = weekNum === 1 ? WEEK1 : WEEK2;
  container.innerHTML = data.map(d => {
    const mealsHTML = d.meals.map(meal => {
      const desc = meal.items
        .map(it => `${calcPortion(it, state.profile)} ${it.name}`)
        .join(' + ');
      return `
        <div class="meal-card">
          <div class="meal-time">${meal.t}</div>
          <div class="meal-name">${meal.n}</div>
          <div class="meal-desc">${desc}</div>
        </div>`;
    }).join('');

    return `
      <div class="card">
        <div class="card-title" style="margin-bottom:10px">${d.day}</div>
        <div class="meal-grid">${mealsHTML}</div>
      </div>`;
  }).join('');
}

/* ---- Перемикання тижнів ---- */
export function showWeek(n) {
  document.getElementById('btn-w1')?.classList.toggle('active', n === 1);
  document.getElementById('btn-w2')?.classList.toggle('active', n === 2);
  renderNutrition(n);
}
