/* =====================
   utils/theme.js — темна / світла тема
   ===================== */

export function initTheme() {
  const saved      = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(saved ? saved === 'dark' : prefersDark);
}

export function toggleTheme() {
  setTheme(!document.body.classList.contains('dark'));
}

export function setTheme(isDark) {
  document.body.classList.toggle('dark', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  const sunEl  = document.getElementById('icon-sun');
  const moonEl = document.getElementById('icon-moon');
  const metaEl = document.getElementById('theme-color-meta');

  if (sunEl)  sunEl.style.display  = isDark ? 'block' : 'none';
  if (moonEl) moonEl.style.display = isDark ? 'none'  : 'block';
  if (metaEl) metaEl.content = isDark ? '#141413' : '#1D9E75';
}
