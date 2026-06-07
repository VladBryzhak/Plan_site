/* =====================
   features/profile.js — UI профілю: статистика, налаштування
   ===================== */

import { GOALS }                         from '../data/profile.js';
import { calcTargetCal }                 from '../core/calc.js';
import { saveProfile }                   from '../core/storage.js';
import { state }                         from '../core/state.js';
import { showToast }                     from '../utils/ui.js';
import {
  notifyIsSupported, notifyPermission,
  notifyRequestPermission, notifySchedule,
  notifyCancel, notifyTest,
}                                        from '../notifications.js';

/* =====================
   СТАТИСТИКА
   ===================== */
export function renderStats() {
  const cal = calcTargetCal(state.profile);
  const g   = GOALS[state.profile.goal];

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('stat-current',    state.profile.currentWeight + ' кг');
  set('stat-target',     state.profile.targetWeight  + ' кг');
  set('stat-goal-icon',  g.icon);
  set('stat-goal-label', g.label);
  set('stat-cal',        cal);
}

export function editStat(field) {
  const id  = field === 'current' ? 'stat-current' : 'stat-target';
  const key = field === 'current' ? 'currentWeight' : 'targetWeight';
  const el  = document.getElementById(id);
  if (!el) return;

  const cur   = state.profile[key];
  const input = document.createElement('input');
  input.type  = 'number';
  input.className = 'stat-input';
  input.value = cur;
  input.min = 30; input.max = 250;
  el.textContent = '';
  el.appendChild(input);
  input.focus();
  input.select();

  const commit = () => {
    const val = parseInt(input.value);
    if (val >= 30 && val <= 250) {
      state.profile[key] = val;
      state.pendingChanges = true;
      showApplyButton();
    }
    renderStats();
  };
  input.addEventListener('blur', commit);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') input.blur(); });
}

export function showApplyButton() {
  document.getElementById('apply-btn-wrap')?.classList.add('show');
}

/* =====================
   НАЛАШТУВАННЯ ⚙️
   ===================== */
export function openSettings() {
  const p = state.profile;
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  setVal('set-height', p.height);
  setVal('set-age',    p.age);

  document.querySelectorAll('input[name="sex"]')
    .forEach(r => r.checked = r.value === p.sex);
  document.querySelectorAll('input[name="activity"]')
    .forEach(r => r.checked = r.value === p.activity);

  state.tempGoal = p.goal;
  renderGoalCards();

  const toggleEl = document.getElementById('notify-toggle');
  const timeEl   = document.getElementById('notify-time');
  if (toggleEl) toggleEl.checked = p.notifyEnabled;
  if (timeEl)   timeEl.value     = p.notifyTime;
  updateNotifyUI();

  document.getElementById('settings-modal')?.classList.add('open');
}

export function closeSettings() {
  document.getElementById('settings-modal')?.classList.remove('open');
}

export function renderGoalCards() {
  const wrap = document.getElementById('goal-cards');
  if (!wrap) return;
  wrap.innerHTML = Object.entries(GOALS).map(([key, g]) => `
    <div class="goal-card ${key === state.tempGoal ? 'selected' : ''}"
         data-action="select-goal" data-goal="${key}">
      <div class="goal-icon">${g.icon}</div>
      <div class="goal-name">${g.label}</div>
      <div class="goal-desc">${g.calAdjust > 0 ? '+' : ''}${g.calAdjust} ккал</div>
    </div>`).join('');
}

export function selectGoal(key) {
  state.tempGoal = key;
  renderGoalCards();
}

/* ---- Нагадування ---- */
export function updateNotifyUI() {
  const enabled  = document.getElementById('notify-toggle')?.checked;
  const timeWrap = document.getElementById('notify-time-wrap');
  const status   = document.getElementById('notify-status');
  if (timeWrap) timeWrap.style.display = enabled ? 'block' : 'none';
  if (!status) return;

  if (!notifyIsSupported()) {
    status.textContent = '⚠️ Браузер не підтримує сповіщення';
    status.className = 'notify-status warn';
    return;
  }
  const perm = notifyPermission();
  if (enabled && perm === 'denied') {
    status.textContent = '⚠️ Сповіщення заблоковані в браузері';
    status.className = 'notify-status warn';
  } else if (enabled && perm === 'granted') {
    status.textContent = '✓ Нагадування за 20 хв до тренування';
    status.className = 'notify-status ok';
  } else if (enabled) {
    status.textContent = 'Потрібен дозвіл — натисни «Зберегти»';
    status.className = 'notify-status';
  } else {
    status.textContent = '';
    status.className = 'notify-status';
  }
}

export async function onNotifyToggle() {
  if (document.getElementById('notify-toggle')?.checked) {
    const perm = await notifyRequestPermission();
    if (perm !== 'granted') {
      const el = document.getElementById('notify-toggle');
      if (el) el.checked = false;
    }
  }
  updateNotifyUI();
}

export function testNotification() {
  if (!notifyTest()) showToast('Спочатку увімкни нагадування і дай дозвіл');
}

export async function saveSettings() {
  const p = state.profile;
  const getVal = id => document.getElementById(id)?.value;

  p.height   = parseInt(getVal('set-height')) || p.height;
  p.age      = parseInt(getVal('set-age'))    || p.age;
  p.sex      = document.querySelector('input[name="sex"]:checked')?.value || p.sex;
  p.activity = document.querySelector('input[name="activity"]:checked')?.value || p.activity;
  p.goal     = state.tempGoal || p.goal;

  const notifyEnabled = document.getElementById('notify-toggle')?.checked;
  p.notifyTime = getVal('notify-time') || '18:00';

  if (notifyEnabled) {
    const perm = await notifyRequestPermission();
    p.notifyEnabled = perm === 'granted';
    if (p.notifyEnabled) notifySchedule(p.notifyTime);
  } else {
    p.notifyEnabled = false;
    notifyCancel();
  }

  saveProfile(p);
  state.pendingChanges = true;
  closeSettings();
  showApplyButton();
  renderStats();
  showToast('Налаштування збережено — натисни «Застосувати»');
}