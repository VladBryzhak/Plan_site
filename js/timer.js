/* =====================
   timer.js — таймер відпочинку між підходами
   Фіксований блок внизу екрану, запуск вручну
   ===================== */

const RestTimer = (() => {
  let intervalId = null;
  let remaining = 0;     /* секунд лишилось */
  let total = 0;         /* початкова тривалість */
  let isPaused = false;

  /* ---- Звуковий сигнал через Web Audio API ---- */
  function beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const playTone = (freq, start, dur) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.001, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur);
      };
      /* три висхідних тони */
      playTone(660, 0, 0.15);
      playTone(880, 0.18, 0.15);
      playTone(1100, 0.36, 0.3);
    } catch (e) { /* звук не критичний */ }
  }

  function vibrate() {
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  }

  /* ---- Форматування MM:SS ---- */
  function fmt(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  /* ---- Оновлення UI ---- */
  function render() {
    const bar = document.getElementById('rest-timer');
    if (!bar) return;

    const pct = total > 0 ? (remaining / total) * 100 : 0;
    const circumference = 2 * Math.PI * 26; /* r=26 */
    const offset = circumference * (1 - pct / 100);

    document.getElementById('rt-time').textContent = fmt(remaining);
    document.getElementById('rt-progress').style.strokeDashoffset = offset;

    const playPauseIcon = document.getElementById('rt-playpause');
    if (playPauseIcon) {
      playPauseIcon.textContent = isPaused ? '▶' : '⏸';
    }
  }

  /* ---- Тік щосекунди ---- */
  function tick() {
    if (isPaused) return;
    remaining--;
    render();
    if (remaining <= 0) {
      finish();
    }
  }

  function finish() {
    clearInterval(intervalId);
    intervalId = null;
    beep();
    vibrate();
    const bar = document.getElementById('rest-timer');
    if (bar) {
      bar.classList.add('finished');
      document.getElementById('rt-time').textContent = 'Готово!';
    }
    /* Автоматичне закриття через 2 сек */
    setTimeout(() => close(), 2000);
  }

  /* ---- Публічні методи ---- */
  function start(seconds) {
    clearInterval(intervalId);
    total = seconds;
    remaining = seconds;
    isPaused = false;

    const bar = document.getElementById('rest-timer');
    bar.classList.remove('finished');
    bar.classList.add('active');

    render();
    intervalId = setInterval(tick, 1000);
  }

  function togglePause() {
    isPaused = !isPaused;
    render();
  }

  function addTime(seconds) {
    remaining += seconds;
    total = Math.max(total, remaining);
    if (remaining > 0) {
      const bar = document.getElementById('rest-timer');
      bar.classList.remove('finished');
      if (!intervalId) intervalId = setInterval(tick, 1000);
    }
    render();
  }

  function reset() {
    remaining = total;
    isPaused = false;
    const bar = document.getElementById('rest-timer');
    bar.classList.remove('finished');
    if (!intervalId) intervalId = setInterval(tick, 1000);
    render();
  }

  function close() {
    clearInterval(intervalId);
    intervalId = null;
    const bar = document.getElementById('rest-timer');
    if (bar) {
      bar.classList.remove('active', 'finished');
    }
  }

  return { start, togglePause, addTime, reset, close };
})();
