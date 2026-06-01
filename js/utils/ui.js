/* =====================
   utils/ui.js — допоміжні UI-функції
   ===================== */

/* ---- Toast-повідомлення ---- */
export function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ---- Офлайн-банер ---- */
export function initOfflineBanner() {
  const banner = document.createElement('div');
  banner.className = 'offline-banner';
  banner.id = 'offline-banner';
  banner.textContent = '⚡ Офлайн-режим — відео недоступні, решта працює';
  document.body.prepend(banner);

  window.addEventListener('offline', () =>
    document.getElementById('offline-banner')?.classList.add('show'));
  window.addEventListener('online', () => {
    document.getElementById('offline-banner')?.classList.remove('show');
    showToast("З'єднання відновлено 🌐");
  });

  if (!navigator.onLine) banner.classList.add('show');
}

/* ---- Service Worker ---- */
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .catch(err => console.warn('SW:', err));
  }
}

/* ---- Перемикання вкладок ---- */
export function switchTab(name) {
  const tabNames = ['workout', 'nutrition', 'tips'];
  document.querySelectorAll('.tab').forEach((btn, i) => {
    btn.classList.toggle('active', tabNames[i] === name);
  });
  document.querySelectorAll('.section').forEach(sec =>
    sec.classList.remove('active'));
  document.getElementById('sec-' + name)?.classList.add('active');
}
