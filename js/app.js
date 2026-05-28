/* =====================
   app.js — логіка додатку
   ===================== */

let activeDay = 0;

/* ---- Ініціалізація ---- */
document.addEventListener('DOMContentLoaded', () => {
  renderSched();
  const todayIndex = getTodayIndex();
  selectDay(todayIndex);
  renderNutrition(1);
});

/* Повертає індекс (0–6) поточного дня тижня (Пн=0, Нд=6) */
function getTodayIndex() {
  const dow = new Date().getDay(); // 0=Нд, 1=Пн … 6=Сб
  return dow === 0 ? 6 : dow - 1;
}

/* ---- Тижневий розклад ---- */
function renderSched() {
  const container = document.getElementById('week-sched');
  container.innerHTML = DAYS_META.map((d, i) => `
    <div class="day-pill${i === activeDay ? ' active' : ''}" onclick="selectDay(${i})">
      <div class="dp-label">${d.label}</div>
      <div class="dp-dot dot-${d.type}"></div>
      <div class="dp-short">${d.short}</div>
    </div>
  `).join('');
}

/* ---- Вибір дня ---- */
function selectDay(index) {
  activeDay = index;
  renderSched();
  renderWorkout();
}

/* ---- Рендер тренування ---- */
function renderWorkout() {
  const w = WORKOUTS[activeDay];
  const iconClassMap = { teal: 'icon-teal', blue: 'icon-blue', coral: 'icon-coral', gray: 'icon-gray' };

  document.getElementById('workout-content').innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-icon ${iconClassMap[w.type]}">${w.icon}</div>
        <div>
          <div class="card-title">${w.title}</div>
          <div class="card-sub">${w.sub}</div>
        </div>
      </div>
      ${w.exercises.map(e => `
        <div class="ex-row">
          <span class="ex-name">${e.name}</span>
          <span class="ex-sets">${e.sets}</span>
        </div>
      `).join('')}
    </div>
  `;
}

/* ---- Рендер харчування ---- */
function renderNutrition(weekNum) {
  const data = weekNum === 1 ? WEEK1 : WEEK2;
  document.getElementById('nutrition-content').innerHTML = data.map(d => `
    <div class="card">
      <div class="card-title" style="margin-bottom:10px">${d.day}</div>
      <div class="meal-grid">
        ${d.meals.map(m => `
          <div class="meal-card">
            <div class="meal-time">${m.t}</div>
            <div class="meal-name">${m.n}</div>
            <div class="meal-desc">${m.d}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

/* ---- Перемикання тижнів харчування ---- */
function showWeek(n) {
  document.getElementById('btn-w1').classList.toggle('active', n === 1);
  document.getElementById('btn-w2').classList.toggle('active', n === 2);
  renderNutrition(n);
}

/* ---- Перемикання вкладок ---- */
function switchTab(name) {
  const tabNames = ['workout', 'nutrition', 'tips'];
  document.querySelectorAll('.tab').forEach((btn, i) => {
    btn.classList.toggle('active', tabNames[i] === name);
  });
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById('sec-' + name).classList.add('active');
}

/* ---- Модальне вікно календаря ---- */
function openCalModal() {
  // Підставити наступний понеділок як дефолт
  const today = new Date();
  const dow = today.getDay();
  const daysUntilMonday = dow === 0 ? 1 : (8 - dow) % 7 || 7;
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilMonday);
  document.getElementById('start-date').value = nextMonday.toISOString().slice(0, 10);
  document.getElementById('cal-modal').classList.add('open');
}

function closeCalModal() {
  document.getElementById('cal-modal').classList.remove('open');
}

function closeIfOverlay(event) {
  if (event.target === document.getElementById('cal-modal')) {
    closeCalModal();
  }
}

/* ---- Генерація .ics файлу ---- */
function pad(n) { return String(n).padStart(2, '0'); }

function toICSDate(date) {
  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    '00'
  );
}

function generateICS() {
  const startVal = document.getElementById('start-date').value;
  if (!startVal) { alert('Вкажи дату початку'); return; }

  const startDate = new Date(startVal + 'T07:00:00');
  const WEEKS = 12;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Fitness Plan//UK',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Тренування',
    'X-WR-TIMEZONE:Europe/Kiev',
  ];

  for (let w = 0; w < WEEKS; w++) {
    for (const ev of CAL_EVENTS) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + w * 7 + ev.dayOffset);
      start.setHours(7, 0, 0, 0);
      const end = new Date(start.getTime() + ev.dur * 60000);

      lines.push('BEGIN:VEVENT');
      lines.push(`UID:fitness-w${w}-d${ev.dayOffset}-${Date.now()}@fitplan`);
      lines.push('DTSTART:' + toICSDate(start));
      lines.push('DTEND:'   + toICSDate(end));
      lines.push('SUMMARY:' + ev.title);
      lines.push('DESCRIPTION:' + CAL_DESCRIPTIONS[ev.descKey].replace(/\n/g, '\\n'));
      lines.push('END:VEVENT');
    }
  }

  lines.push('END:VCALENDAR');

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'trenuvanya.ics';
  a.click();
  URL.revokeObjectURL(url);

  closeCalModal();
  showToast('Файл завантажено! Відкрий його на iPhone 📅');
}

/* ---- Toast-повідомлення ---- */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}
