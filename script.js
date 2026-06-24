const API_URL = 'https://api.tvmaze.com/search/shows';

const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const results = document.getElementById('results');
const loading = document.getElementById('loading');
const errorEl = document.getElementById('error');
const emptyEl = document.getElementById('empty');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const query = input.value.trim();
  if (!query) return;

  hideAll();
  loading.classList.remove('hidden');

  try {
    const url = `${API_URL}?q=${encodeURIComponent(query)}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    loading.classList.add('hidden');

    if (data.length === 0) {
      emptyEl.textContent = 'no results found. try something else.';
      emptyEl.classList.remove('hidden');
      return;
    }

    renderResults(data);
  } catch (err) {
    loading.classList.add('hidden');
    errorEl.textContent = 'something went wrong. check your connection.';
    errorEl.classList.remove('hidden');
  }
});

function renderResults(shows) {
  results.innerHTML = '';

  shows.forEach((item) => {
    const show = item.show;
    const card = document.createElement('div');
    card.className = 'show-card';

    if (show.image && show.image.medium) {
      const img = document.createElement('img');
      img.src = show.image.medium;
      img.alt = show.name;
      card.appendChild(img);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'no-img';
      placeholder.textContent = 'no image';
      card.appendChild(placeholder);
    }

    const info = document.createElement('div');
    info.className = 'show-info';

    const title = document.createElement('h2');
    title.textContent = show.name;

    const meta = document.createElement('p');
    meta.className = 'meta';
    const parts = [];
    if (show.premiered) parts.push(show.premiered.slice(0, 4));
    if (show.rating && show.rating.average) parts.push(show.rating.average + '/10');
    if (show.status) parts.push(show.status);
    meta.textContent = parts.join(' \u2022 ');

    const genres = document.createElement('p');
    genres.className = 'genres';
    genres.textContent = show.genres && show.genres.length ? show.genres.join(', ') : '';

    const summary = document.createElement('p');
    summary.className = 'summary';
    summary.innerHTML = show.summary
      ? show.summary.replace(/<[^>]+>/g, '').slice(0, 200) + '...'
      : '';

    info.appendChild(title);
    info.appendChild(meta);
    info.appendChild(genres);
    info.appendChild(summary);
    card.appendChild(info);

    results.appendChild(card);
  });
}

function hideAll() {
  loading.classList.add('hidden');
  errorEl.classList.add('hidden');
  emptyEl.classList.add('hidden');
  results.innerHTML = '';
}
