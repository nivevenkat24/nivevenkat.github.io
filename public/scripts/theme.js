const STORAGE_KEY = 'theme';

function systemPrefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(theme) {
  // theme: 'light' | 'dark'
  document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
  document.body.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
  const icon = document.getElementById('themeIcon');
  if (icon) icon.src = theme === 'dark' ? 'assets/icons/sun.svg' : 'assets/icons/moon.svg';
}

function getInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return systemPrefersDark() ? 'dark' : 'light';
}

function toggleTheme() {
  const current = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(STORAGE_KEY, next);
  applyTheme(next);
}

// Initialize on load
const initial = getInitialTheme();
applyTheme(initial);

// Attach toggle
const btn = document.getElementById('themeToggle');
if (btn) btn.addEventListener('click', toggleTheme);

