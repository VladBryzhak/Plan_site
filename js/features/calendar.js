/* =====================
   features/calendar.js — генерація .ics для Apple Calendar
   ===================== */

import { CAL_EVENTS, CAL_DESCRIPTIONS } from '../data/workouts.js';
import { showToast } from '../utils/ui.js';

/* ---- Утиліти форматування ---- */
const pad = n => String(n).padStart(2, '0');

function toICSDate(d) {
  return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate())
    + 'T' + pad(d.getHours()) + pad(d.getMinutes()) + '00';
}

/* ---- Модальне вікно ---- */
export function openCalModal() {
  const today = new Date();
  const dow   = today.getDay();
  const diff  = dow === 0 ? 1 : (8 - dow) % 7 || 7;
  const next  = new Date(today);
  next.setDate(today.getDate() + diff);
  const input = document.getElementById('start-date');
  if (input) input.value = next.toISOString().slice(0, 10);
  document.getElementById('cal-modal')?.classList.add('open');
}

export function closeCalModal() {
  document.getElementById('cal-modal')?.classList.remove('open');
}

export function closeIfOverlay(e) {
  if (e.target === document.getElementById('cal-modal')) closeCalModal();
}

/* ---- Генерація .ics ---- */
export function generateICS() {
  const startVal = document.getElementById('start-date')?.value;
  if (!startVal) { alert('Вкажи дату початку'); return; }

  const startDate = new Date(startVal + 'T07:00:00');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Fitness Plan//UK',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'X-WR-CALNAME:Тренування', 'X-WR-TIMEZONE:Europe/Kiev',
  ];

  for (let w = 0; w < 12; w++) {
    for (const ev of CAL_EVENTS) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + w * 7 + ev.dayOffset);
      start.setHours(7, 0, 0, 0);
      const end = new Date(start.getTime() + ev.dur * 60000);
      lines.push(
        'BEGIN:VEVENT',
        `UID:fitness-w${w}-d${ev.dayOffset}-${Date.now()}@fitplan`,
        'DTSTART:' + toICSDate(start),
        'DTEND:'   + toICSDate(end),
        'SUMMARY:' + ev.title,
        'DESCRIPTION:' + CAL_DESCRIPTIONS[ev.descKey].replace(/\n/g, '\\n'),
        'END:VEVENT',
      );
    }
  }

  lines.push('END:VCALENDAR');

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'trenuvanya.ics'; a.click();
  URL.revokeObjectURL(url);
  closeCalModal();
  showToast('Файл завантажено! Відкрий на iPhone 📅');
}
