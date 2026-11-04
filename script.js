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
const mobileViewport = matchMedia('(max-width: 700px)');
mobileViewport.addEventListener('change', closeMenu);
document.addEventListener('click', event => {
  if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});
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
const preferredTheme = matchMedia('(prefers-color-scheme: dark)');
let savedTheme = null;
try { savedTheme = localStorage.getItem('forma-theme'); } catch { /* Storage is optional. */ }
applyTheme(savedTheme === 'dark' || (savedTheme !== 'light' && preferredTheme.matches));
preferredTheme.addEventListener('change', event => {
  if (savedTheme !== 'light' && savedTheme !== 'dark') applyTheme(event.matches);
});
themeButton.addEventListener('click', () => {
  const dark = !document.body.classList.contains('dark');
  savedTheme = dark ? 'dark' : 'light';
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

const contactForm = document.querySelector('#contact-form');
const contactStatus = document.querySelector('#contact-status');
const contactEmail = document.querySelector('#contact-email').getAttribute('href').slice('mailto:'.length);
contactForm.hidden = false;

// Reject whitespace-only entries as well as the browser's normal validation errors.
function validateInquiry() {
  for (const name of ['name', 'subject', 'message']) {
    const field = contactForm.elements.namedItem(name);
    const minimum = name === 'message' ? 10 : 1;
    field.setCustomValidity(field.value.trim().length < minimum
      ? (name === 'message' ? 'Please write at least 10 characters about your project.' : 'Please fill in this field.')
      : '');
  }
  return contactForm.reportValidity();
}

function getInquiry() {
  const data = new FormData(contactForm);
  const value = name => String(data.get(name)).trim();
  return {
    subject: `[${value('service')}] ${value('subject')}`,
    body: `Name: ${value('name')}\nEmail: ${value('email')}\nInterested in: ${value('service')}\n\n${value('message')}`
  };
}

contactForm.addEventListener('input', event => {
  if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
  contactStatus.textContent = '';
});
contactForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!validateInquiry()) return;
  const inquiry = getInquiry();
  const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(inquiry.subject)}&body=${encodeURIComponent(inquiry.body)}`;
  // Long mailto links are inconsistently supported across email applications.
  if (mailto.length > 1800) {
    contactStatus.textContent = 'Your message is too long for a reliable email link. Download the inquiry and attach it using “Email me directly”, or shorten your message.';
    return;
  }
  contactStatus.textContent = 'Your email draft is ready to open. Send it from your email app to finish. If no app opens, download the inquiry and email it using your usual email service.';
  window.location.href = mailto;
});

document.querySelector('#download-inquiry').addEventListener('click', () => {
  if (!validateInquiry()) return;
  const inquiry = getInquiry();
  const blob = new Blob([`To: ${contactEmail}\nSubject: ${inquiry.subject}\n\n${inquiry.body}\n`], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'forma-project-inquiry.txt';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  contactStatus.textContent = `Your download is ready. Email the file to ${contactEmail} to share your inquiry. Nothing has been sent yet.`;
});

document.querySelectorAll('.project-inquiry').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', () => {
    contactForm.elements.namedItem('service').value = button.dataset.service;
    const subject = contactForm.elements.namedItem('subject');
    if (!subject.value.trim()) subject.value = button.dataset.subject;
    subject.setCustomValidity('');
    document.querySelector('#contact').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    contactForm.elements.namedItem('name').focus({ preventScroll: true });
  });
});
