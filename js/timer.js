/* =====================
   timer.js — таймер відпочинку між підходами
   ===================== */

let intervalId = null;
let remaining  = 0;
let total      = 0;
let isPaused   = false;

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const play = (freq, start, dur) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq; osc.type = 'sine';
      gain.gain.setValueAtTime(0.001, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur);
    };
    play(660, 0, 0.15); play(880, 0.18, 0.15); play(1100, 0.36, 0.3);
  } catch {}
}

function fmt(sec) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

function render() {
  const bar = document.getElementById('rest-timer');
  if (!bar) return;
  const offset = 2 * Math.PI * 26 * (1 - (total > 0 ? remaining / total : 0));
  document.getElementById('rt-time')?.setAttribute('data-text', fmt(remaining));
  const timeEl = document.getElementById('rt-time');
  const progEl = document.getElementById('rt-progress');
  const ppEl   = document.getElementById('rt-playpause');
  if (timeEl) timeEl.textContent = fmt(remaining);
  if (progEl) progEl.style.strokeDashoffset = offset;
  if (ppEl)   ppEl.textContent = isPaused ? '▶' : '⏸';
}

function finish() {
  clearInterval(intervalId); intervalId = null;
  beep();
  if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  document.getElementById('rest-timer')?.classList.add('finished');
  const timeEl = document.getElementById('rt-time');
  if (timeEl) timeEl.textContent = 'Готово!';
  setTimeout(() => timerClose(), 2000);
}

function tick() {
  if (isPaused) return;
  remaining--;
  render();
  if (remaining <= 0) finish();
}

export function timerStart(seconds) {
  clearInterval(intervalId);
  total = seconds; remaining = seconds; isPaused = false;
  const bar = document.getElementById('rest-timer');
  if (bar) { bar.classList.remove('finished'); bar.classList.add('active'); }
  render();
  intervalId = setInterval(tick, 1000);
}

export function timerTogglePause() { isPaused = !isPaused; render(); }

export function timerAddTime(s) {
  remaining += s; total = Math.max(total, remaining);
  if (remaining > 0) {
    document.getElementById('rest-timer')?.classList.remove('finished');
    if (!intervalId) intervalId = setInterval(tick, 1000);
  }
  render();
}

export function timerReset() {
  remaining = total; isPaused = false;
  document.getElementById('rest-timer')?.classList.remove('finished');
  if (!intervalId) intervalId = setInterval(tick, 1000);
  render();
}

export function timerClose() {
  clearInterval(intervalId); intervalId = null;
  document.getElementById('rest-timer')?.classList.remove('active', 'finished');
}
