const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const themeButton = document.querySelector('.theme-toggle');

menuButton.hidden = false;
themeButton.hidden = false;
navigation.dataset.collapsed = 'true';

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.dataset.collapsed = 'true';
}

menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  navigation.dataset.collapsed = String(expanded);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});

function applyTheme(dark) {
  document.body.classList.toggle('dark', dark);
  themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
}
try {
  applyTheme(localStorage.getItem('forma-theme') === 'dark');
} catch { /* The site also works when browser storage is unavailable. */ }
themeButton.addEventListener('click', () => {
  const dark = !document.body.classList.contains('dark');
  applyTheme(dark);
  try { localStorage.setItem('forma-theme', dark ? 'dark' : 'light'); } catch { /* Optional preference. */ }
});

const filters = document.querySelector('.filters');
const projects = [...document.querySelectorAll('.project')];
filters.hidden = false;
filters.addEventListener('click', event => {
  const button = event.target.closest('button[data-filter]');
  if (!button) return;
  filters.querySelectorAll('button').forEach(filter => {
    const selected = filter === button;
    filter.classList.toggle('active', selected);
    filter.setAttribute('aria-pressed', String(selected));
  });
  projects.forEach(project => {
    project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter;
  });
  const count = projects.filter(project => !project.hidden).length;
  document.querySelector('#filter-status').textContent = `${count} ${count === 1 ? 'project' : 'projects'} shown.`;
});
document.querySelector('#year').textContent = new Date().getFullYear();
