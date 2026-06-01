/* =====================
   app.js — логіка v5
   Фічі: профіль, розрахунок калорій (Mifflin-St Jeor), макроси,
   масштабування порцій, динамічні підходи, YouTube-акордеон,
   темна тема, відмітки, таймер відпочинку, push-нагадування
   ===================== */

let activeDay = 0;
let openAccordion = null;
let profile = null;
let pendingChanges = false; /* чи є незастосовані зміни */

/* ---- Ініціалізація ---- */
document.addEventListener('DOMContentLoaded', () => {
  profile = loadProfile();
  initTheme();
  initOfflineBanner();
  renderStats();
  renderSched();
  selectDay(getTodayIndex());
  renderMacroBar();
  renderNutrition(1);
  updateDoneCount();
  registerServiceWorker();
  /* Відновлюємо заплановані нагадування */
  if (profile.notifyEnabled && profile.notifyTime) {
    Notifications.schedule(profile.notifyTime);
  }
});

/* =====================
   ПРОФІЛЬ
   ===================== */
function loadProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem('user_profile'));
    return { ...DEFAULT_PROFILE, ...(saved || {}) };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

function saveProfile() {
  localStorage.setItem('user_profile', JSON.stringify(profile));
}

/* =====================
   РОЗРАХУНКИ
   ===================== */

/* BMR — Mifflin-St Jeor */
function calcBMR(p) {
  const base = 10 * p.currentWeight + 6.25 * p.height - 5 * p.age;
  return p.sex === 'male' ? base + 5 : base - 161;
}

/* TDEE = BMR × фактор активності */
function calcTDEE(p) {
  return calcBMR(p) * ACTIVITY_FACTORS[p.activity];
}

/* Цільові калорії з урахуванням цілі */
function calcTargetCal(p) {
  const tdee = calcTDEE(p);
  const adjusted = tdee + GOALS[p.goal].calAdjust;
  const minCal = p.sex === 'male' ? 1500 : 1300;
  return Math.max(Math.round(adjusted), minCal);
}

/* Макроси у грамах */
function calcMacros(p) {
  const cal = calcTargetCal(p);
  const m = GOALS[p.goal].macros;
  return {
    protein: Math.round(cal * m.p / 4),
    carbs:   Math.round(cal * m.c / 4),
    fat:     Math.round(cal * m.f / 9),
  };
}

/* Загальний коефіцієнт масштабування */
function calcScaleFactor(p) {
  return calcTargetCal(p) / BASE_CAL;
}

/* Фінальна порція для інгредієнта */
function calcPortion(item, p) {
  if (item.fixed) return `${item.base} ${item.unit}`;
  const goalScale = GOALS[p.goal].portionScale[item.type] || 1.0;
  const scaled = item.base * calcScaleFactor(p) * goalScale;
  const rounded = Math.max(5, Math.round(scaled / 5) * 5);
  return `${rounded}${item.unit}`;
}

/* Параметри підходів за ціллю */
function calcSets(p) {
  const g = GOALS[p.goal];
  return { sets: g.sets, reps: g.reps, rest: g.rest, note: g.note };
}

/* Час відпочинку в секундах (з рядка типу "60 сек") */
function getRestSeconds(p) {
  const g = GOALS[p.goal];
  const match = g.rest.match(/\d+/);
  return match ? parseInt(match[0]) : 60;
}

/* Запуск таймера з поточним часом відпочинку */
function startRestTimer() {
  RestTimer.start(getRestSeconds(profile));
}

/* =====================
   ТЕМА
   ===================== */
function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(saved ? saved === 'dark' : prefersDark);
}
function toggleTheme() { setTheme(!document.body.classList.contains('dark')); }
function setTheme(isDark) {
  document.body.classList.toggle('dark', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  document.getElementById('icon-sun').style.display  = isDark ? 'block' : 'none';
  document.getElementById('icon-moon').style.display = isDark ? 'none'  : 'block';
  document.getElementById('theme-color-meta').content = isDark ? '#141413' : '#1D9E75';
}

/* =====================
   БЛОК СТАТИСТИКИ
   ===================== */
function renderStats() {
  const cal = calcTargetCal(profile);
  const g = GOALS[profile.goal];
  document.getElementById('stat-current').textContent = profile.currentWeight + ' кг';
  document.getElementById('stat-target').textContent  = profile.targetWeight + ' кг';
  document.getElementById('stat-goal-icon').textContent = g.icon;
  document.getElementById('stat-goal-label').textContent = g.label;
  document.getElementById('stat-cal').textContent = cal;
}

/* Inline-редагування ваги */
function editStat(field) {
  const el = document.getElementById(field === 'current' ? 'stat-current' : 'stat-target');
  const current = parseInt(profile[field === 'current' ? 'currentWeight' : 'targetWeight']);
  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'stat-input';
  input.value = current;
  input.min = 30; input.max = 250;
  el.textContent = '';
  el.appendChild(input);
  input.focus();
  input.select();

  const commit = () => {
    const val = parseInt(input.value);
    if (val >= 30 && val <= 250) {
      profile[field === 'current' ? 'currentWeight' : 'targetWeight'] = val;
      pendingChanges = true;
      showApplyButton();
    }
    renderStats();
  };
  input.addEventListener('blur', commit);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') input.blur(); });
}

function showApplyButton() {
  document.getElementById('apply-btn-wrap').classList.add('show');
}

function applyChanges() {
  saveProfile();
  pendingChanges = false;
  document.getElementById('apply-btn-wrap').classList.remove('show');
  renderStats();
  renderSched();
  renderWorkout();
  renderMacroBar();
  const wk = document.getElementById('btn-w2').classList.contains('active') ? 2 : 1;
  renderNutrition(wk);
  const cal = calcTargetCal(profile);
  const m = calcMacros(profile);
  const g = GOALS[profile.goal];
  showToast(`✓ Оновлено · ${g.icon} ${g.label} · ${cal} ккал · Б ${m.protein}г`);
}

/* =====================
   НАЛАШТУВАННЯ ⚙️
   ===================== */
function openSettings() {
  document.getElementById('set-height').value = profile.height;
  document.getElementById('set-age').value = profile.age;
  document.querySelectorAll('input[name="sex"]').forEach(r => r.checked = r.value === profile.sex);
  document.querySelectorAll('input[name="activity"]').forEach(r => r.checked = r.value === profile.activity);
  renderGoalCards();
  /* Нагадування */
  document.getElementById('notify-toggle').checked = profile.notifyEnabled;
  document.getElementById('notify-time').value = profile.notifyTime;
  updateNotifyUI();
  document.getElementById('settings-modal').classList.add('open');
}
function closeSettings() { document.getElementById('settings-modal').classList.remove('open'); }
function closeSettingsOverlay(e) { if (e.target === document.getElementById('settings-modal')) closeSettings(); }

let tempGoal = null;
function renderGoalCards() {
  tempGoal = tempGoal || profile.goal;
  const wrap = document.getElementById('goal-cards');
  wrap.innerHTML = Object.entries(GOALS).map(([key, g]) => `
    <div class="goal-card ${key === tempGoal ? 'selected' : ''}" onclick="selectGoal('${key}')">
      <div class="goal-icon">${g.icon}</div>
      <div class="goal-name">${g.label}</div>
      <div class="goal-desc">${g.calAdjust > 0 ? '+' : ''}${g.calAdjust} ккал</div>
    </div>`).join('');
}
function selectGoal(key) { tempGoal = key; renderGoalCards(); }

/* ---- Нагадування: UI стан ---- */
function updateNotifyUI() {
  const enabled = document.getElementById('notify-toggle').checked;
  const timeWrap = document.getElementById('notify-time-wrap');
  const status = document.getElementById('notify-status');
  timeWrap.style.display = enabled ? 'block' : 'none';

  if (!Notifications.isSupported()) {
    status.textContent = '⚠️ Браузер не підтримує сповіщення';
    status.className = 'notify-status warn';
    return;
  }
  const perm = Notifications.permission();
  if (enabled && perm === 'denied') {
    status.textContent = '⚠️ Сповіщення заблоковані в налаштуваннях браузера';
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

async function onNotifyToggle() {
  const enabled = document.getElementById('notify-toggle').checked;
  if (enabled) {
    const perm = await Notifications.requestPermission();
    if (perm !== 'granted') {
      document.getElementById('notify-toggle').checked = false;
    }
  }
  updateNotifyUI();
}

function testNotification() {
  if (!Notifications.test()) {
    showToast('Спочатку увімкни нагадування і дай дозвіл');
  }
}

async function saveSettings() {
  profile.height = parseInt(document.getElementById('set-height').value) || profile.height;
  profile.age = parseInt(document.getElementById('set-age').value) || profile.age;
  profile.sex = document.querySelector('input[name="sex"]:checked').value;
  profile.activity = document.querySelector('input[name="activity"]:checked').value;
  profile.goal = tempGoal;

  /* Нагадування */
  const notifyEnabled = document.getElementById('notify-toggle').checked;
  profile.notifyTime = document.getElementById('notify-time').value || '18:00';

  if (notifyEnabled) {
    const perm = await Notifications.requestPermission();
    profile.notifyEnabled = perm === 'granted';
    if (profile.notifyEnabled) {
      Notifications.schedule(profile.notifyTime);
    }
  } else {
    profile.notifyEnabled = false;
    Notifications.cancel();
  }

  saveProfile();
  pendingChanges = true;
  closeSettings();
  showApplyButton();
  renderStats();
  showToast('Налаштування збережено — натисни «Застосувати»');
}

/* =====================
   ТРЕНУВАННЯ + ВІДМІТКИ
   ===================== */
function getTodayKey(dayIndex) {
  const today = new Date();
  const dow = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - dow);
  monday.setHours(0, 0, 0, 0);
  const target = new Date(monday);
  target.setDate(monday.getDate() + dayIndex);
  return `done_${target.getFullYear()}-${String(target.getMonth()+1).padStart(2,'0')}-${String(target.getDate()).padStart(2,'0')}_${dayIndex}`;
}
function isDone(dayIndex) { return localStorage.getItem(getTodayKey(dayIndex)) === 'true'; }
function toggleDone(dayIndex) {
  const key = getTodayKey(dayIndex);
  const cur = localStorage.getItem(key) === 'true';
  localStorage.setItem(key, String(!cur));
  renderSched(); renderWorkout(); updateDoneCount();
  showToast(cur ? 'Відмітку знято' : '✓ Тренування виконано!');
}
function updateDoneCount() {
  let c = 0;
  for (let i = 0; i < 7; i++) if (isDone(i)) c++;
  document.getElementById('stat-done-val').textContent = c;
}

function getTodayIndex() {
  const dow = new Date().getDay();
  return dow === 0 ? 6 : dow - 1;
}

function renderSched() {
  document.getElementById('week-sched').innerHTML = DAYS_META.map((d, i) => {
    const cls = ['day-pill', i === activeDay ? 'active' : '', isDone(i) ? 'done' : ''].join(' ').trim();
    return `<div class="${cls}" onclick="selectDay(${i})">
      <div class="dp-label">${d.label}</div>
      <div class="dp-dot dot-${d.type}"></div>
      <div class="dp-short">${d.short}</div>
    </div>`;
  }).join('');
}

function selectDay(i) {
  if (activeDay !== i) openAccordion = null;
  activeDay = i;
  renderSched();
  renderWorkout();
}

function pickRandomVideo(videos) { return videos[Math.floor(Math.random() * videos.length)]; }

function toggleExercise(exIndex) {
  const ex = WORKOUTS[activeDay].exercises[exIndex];
  if (!ex.videos || !ex.videos.length) return;
  const same = openAccordion && openAccordion.day === activeDay && openAccordion.ex === exIndex;
  openAccordion = same ? null : { day: activeDay, ex: exIndex };
  renderWorkout();
  if (openAccordion) setTimeout(() => {
    const el = document.getElementById(`acc-${exIndex}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 50);
}

function renderWorkout() {
  const w = WORKOUTS[activeDay];
  const done = isDone(activeDay);
  const isRest = w.type === 'gray';
  const iconMap = { teal: 'icon-teal', blue: 'icon-blue', coral: 'icon-coral', gray: 'icon-gray' };
  const setsInfo = calcSets(profile);
  const g = GOALS[profile.goal];

  /* Рядок з режимом тренування (для силових днів) */
  const modeRow = (!isRest && !w.cardio)
    ? `<div class="workout-mode">${g.icon} ${g.label} · ${setsInfo.sets} × ${setsInfo.reps} · відпочинок ${setsInfo.rest}</div>`
    : '';

  const exHTML = w.exercises.map((e, i) => {
    const hasVideo = e.videos && e.videos.length;
    const isOpen = openAccordion && openAccordion.day === activeDay && openAccordion.ex === i;
    const rowCls = ['ex-row', hasVideo ? 'has-video' : '', isOpen ? 'active' : ''].join(' ').trim();
    /* Сети: фіксовані (кардіо/планка) або динамічні (силові) */
    const setsText = e.fixedSets ? e.fixedSets : `${setsInfo.sets} × ${setsInfo.reps}`;
    const videoId = (isOpen && hasVideo) ? pickRandomVideo(e.videos) : null;

    const acc = (isOpen && videoId) ? `
      <div class="ex-accordion open" id="acc-${i}">
        <div class="yt-wrap">
          <iframe src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1"
            title="Техніка: ${e.name}" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen loading="lazy"></iframe>
        </div>
        ${e.tip ? `<p class="ex-tip"><span class="ex-tip-icon">💡</span>${e.tip}</p>` : ''}
        <div class="ex-acc-actions">
          <button class="ex-reload-btn" onclick="event.stopPropagation(); reloadVideo(${i})">↻ Інше відео</button>
          <button class="ex-timer-btn" onclick="event.stopPropagation(); startRestTimer()">⏱ Старт таймер</button>
        </div>
      </div>` : `<div class="ex-accordion" id="acc-${i}"></div>`;

    return `
      <div class="${rowCls}" onclick="${hasVideo ? `toggleExercise(${i})` : ''}">
        <span class="ex-name">${e.name}</span>
        <div class="ex-right">
          <span class="ex-sets">${setsText}</span>
          ${hasVideo ? '<span class="ex-arrow">▾</span>' : ''}
        </div>
      </div>${acc}`;
  }).join('');

  const doneBtn = isRest ? '' : `
    <button class="done-btn ${done ? 'marked' : ''}" onclick="toggleDone(${activeDay})">
      ${done ? '<span>✓</span> Виконано — натисни щоб скасувати' : '<span>○</span> Відмітити як виконане'}
    </button>`;

  /* Кнопка таймера для силових днів (під усіма вправами) */
  const timerBtn = (!isRest && !w.cardio) ? `
    <button class="rest-start-btn" onclick="startRestTimer()">
      ⏱ Таймер відпочинку (${getRestSeconds(profile)} сек)
    </button>` : '';

  const hint = w.exercises.some(e => e.videos) ? '<p class="video-hint">Натисни на вправу ▾ щоб переглянути відео техніки</p>' : '';

  document.getElementById('workout-content').innerHTML = `
    <div class="${done ? 'card done-card' : 'card'}">
      <div class="card-header">
        <div class="card-icon ${iconMap[w.type]}">${w.icon}</div>
        <div><div class="card-title">${w.title}</div><div class="card-sub">${w.sub}</div></div>
      </div>
      ${modeRow}
      ${hint}
      ${exHTML}
      ${timerBtn}
      ${doneBtn}
    </div>`;
}

function reloadVideo(exIndex) {
  renderWorkout();
  setTimeout(() => {
    const el = document.getElementById(`acc-${exIndex}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 50);
}

/* =====================
   ХАРЧУВАННЯ + МАКРОСИ
   ===================== */
function renderMacroBar() {
  const cal = calcTargetCal(profile);
  const m = calcMacros(profile);
  const g = GOALS[profile.goal];
  const ratios = g.macros;
  document.getElementById('macro-bar').innerHTML = `
    <div class="macro-header">
      <span>${g.icon} ${g.label}</span>
      <span class="macro-cal">${cal} ккал/день</span>
    </div>
    <div class="macro-track">
      <div class="macro-seg seg-protein" style="width:${ratios.p*100}%"></div>
      <div class="macro-seg seg-carb" style="width:${ratios.c*100}%"></div>
      <div class="macro-seg seg-fat" style="width:${ratios.f*100}%"></div>
    </div>
    <div class="macro-legend">
      <span><i class="dot-protein"></i>Білок ${m.protein}г</span>
      <span><i class="dot-carb"></i>Вуглев. ${m.carbs}г</span>
      <span><i class="dot-fat"></i>Жири ${m.fat}г</span>
    </div>`;
}

function renderNutrition(weekNum) {
  const data = weekNum === 1 ? WEEK1 : WEEK2;
  document.getElementById('nutrition-content').innerHTML = data.map(d => `
    <div class="card">
      <div class="card-title" style="margin-bottom:10px">${d.day}</div>
      <div class="meal-grid">
        ${d.meals.map(meal => {
          const desc = meal.items.map(it => {
            const portion = calcPortion(it, profile);
            return `${portion} ${it.name}`;
          }).join(' + ');
          return `<div class="meal-card">
            <div class="meal-time">${meal.t}</div>
            <div class="meal-name">${meal.n}</div>
            <div class="meal-desc">${desc}</div>
          </div>`;
        }).join('')}
      </div>
    </div>`).join('');
}

function showWeek(n) {
  document.getElementById('btn-w1').classList.toggle('active', n === 1);
  document.getElementById('btn-w2').classList.toggle('active', n === 2);
  renderNutrition(n);
}

/* =====================
   ВКЛАДКИ
   ===================== */
function switchTab(name) {
  const names = ['workout', 'nutrition', 'tips'];
  document.querySelectorAll('.tab').forEach((b, i) => b.classList.toggle('active', names[i] === name));
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('sec-' + name).classList.add('active');
}

/* =====================
   ОФЛАЙН
   ===================== */
function initOfflineBanner() {
  const b = document.createElement('div');
  b.className = 'offline-banner';
  b.id = 'offline-banner';
  b.textContent = '⚡ Офлайн-режим — відео недоступні, решта працює';
  document.body.prepend(b);
  window.addEventListener('offline', () => document.getElementById('offline-banner').classList.add('show'));
  window.addEventListener('online', () => { document.getElementById('offline-banner').classList.remove('show'); showToast("З'єднання відновлено 🌐"); });
  if (!navigator.onLine) b.classList.add('show');
}

/* =====================
   SERVICE WORKER
   ===================== */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.warn('SW:', err));
  }
}

/* =====================
   КАЛЕНДАР
   ===================== */
function openCalModal() {
  const today = new Date();
  const dow = today.getDay();
  const diff = dow === 0 ? 1 : (8 - dow) % 7 || 7;
  const next = new Date(today);
  next.setDate(today.getDate() + diff);
  document.getElementById('start-date').value = next.toISOString().slice(0, 10);
  document.getElementById('cal-modal').classList.add('open');
}
function closeCalModal() { document.getElementById('cal-modal').classList.remove('open'); }
function closeIfOverlay(e) { if (e.target === document.getElementById('cal-modal')) closeCalModal(); }
function pad(n) { return String(n).padStart(2, '0'); }
function toICSDate(d) { return d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+'T'+pad(d.getHours())+pad(d.getMinutes())+'00'; }
function generateICS() {
  const sv = document.getElementById('start-date').value;
  if (!sv) { alert('Вкажи дату'); return; }
  const sd = new Date(sv + 'T07:00:00');
  const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Fitness//UK','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Тренування','X-WR-TIMEZONE:Europe/Kiev'];
  for (let w = 0; w < 12; w++) for (const ev of CAL_EVENTS) {
    const s = new Date(sd); s.setDate(s.getDate() + w*7 + ev.dayOffset); s.setHours(7,0,0,0);
    const e = new Date(s.getTime() + ev.dur*60000);
    lines.push('BEGIN:VEVENT', `UID:f-w${w}-d${ev.dayOffset}-${Date.now()}@fit`, 'DTSTART:'+toICSDate(s), 'DTEND:'+toICSDate(e), 'SUMMARY:'+ev.title, 'DESCRIPTION:'+CAL_DESCRIPTIONS[ev.descKey].replace(/\n/g,'\\n'), 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'trenuvanya.ics'; a.click();
  URL.revokeObjectURL(url); closeCalModal();
  showToast('Файл завантажено! Відкрий на iPhone 📅');
}

/* =====================
   TOAST
   ===================== */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
