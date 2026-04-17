console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contacts' },
    { url: 'resume/', title: 'Resume' },
    { url: 'https://github.com/RocioSAguirre', title: 'GitHub' },
  ];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/portfolio/";         // GitHub Pages repo name


for (let p of pages) {
    let url = p.url;
    let title = p.title;

    url = !url.startsWith('http') ? BASE_PATH + url : url;


    let isCurrent =
        location.pathname === BASE_PATH + p.url ||
        location.pathname === BASE_PATH + p.url + "index.html";

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);

    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname,
    );

    if (a.host !== location.host) {
    a.target = "_blank";
    }
  }

  document.body.insertAdjacentHTML(
'afterbegin',
`
    <label class="color-scheme">
        Theme:
        <select id="theme-select">
        <option value="auto">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        </select>
    </label>`,
);

const select = document.querySelector('#theme-select');
if ('colorScheme' in localStorage) {
  const saved = localStorage.colorScheme;
  select.value = saved;

  if (saved === 'auto') {
    document.documentElement.style.setProperty('color-scheme', 'light dark');
  } else {
    document.documentElement.style.setProperty('color-scheme', saved);
  }
}

select.addEventListener('change', function (event) {
  const value = event.target.value;
  localStorage.colorScheme = value;

  if (value === 'auto') {
    document.documentElement.style.setProperty('color-scheme', 'light dark');
  } else {
    document.documentElement.style.setProperty('color-scheme', value);
  }
});

const form = document.querySelector('form');

form?.addEventListener('submit', function (event) {
  event.preventDefault();

  const data = new FormData(form);
  let url = form.action + '?';
  let params = [];

  for (let [name, value] of data) {
    params.push(`${name}=${encodeURIComponent(value)}`);
  }

  url += params.join('&');
  location.href = url;
});