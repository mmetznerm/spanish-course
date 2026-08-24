const state = {
  search: '',
  category: 'Todas',
  source: 'Todas',
  favoritesOnly: false,
  viewerId: null,
};

const els = {
  cards: document.getElementById('cards'),
  empty: document.getElementById('empty-state'),
  count: document.getElementById('results-count'),
  search: document.getElementById('search-input'),
  categoryChips: document.getElementById('category-chips'),
  sourceChips: document.getElementById('source-chips'),
  favoriteFilter: document.getElementById('favorite-filter'),
  viewer: document.getElementById('viewer'),
  viewerTitle: document.getElementById('viewer-title'),
  viewerMeta: document.getElementById('viewer-meta'),
  viewerImage: document.getElementById('viewer-image'),
  viewerClose: document.getElementById('viewer-close'),
  viewerPrev: document.getElementById('viewer-prev'),
  viewerNext: document.getElementById('viewer-next'),
  viewerFavorite: document.getElementById('viewer-favorite'),
  viewerOpenOriginal: document.getElementById('viewer-open-original'),
};

const allItems = window.MAPAS_DATA || [];
const favorites = new Set(JSON.parse(localStorage.getItem('mapas-favorites') || '[]'));

function saveFavorites() {
  localStorage.setItem('mapas-favorites', JSON.stringify([...favorites]));
}

function uniqueValues(items, key) {
  return [...new Set(items.map(item => item[key]))];
}

function makeChip(label, active, onClick) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `chip${active ? ' is-active' : ''}`;
  btn.textContent = label;
  btn.addEventListener('click', onClick);
  return btn;
}

function setupChips() {
  const categories = ['Todas', ...uniqueValues(allItems, 'category')];
  const sources = ['Todas', ...uniqueValues(allItems, 'source')];

  categories.forEach(label => {
    els.categoryChips.appendChild(makeChip(label, label === state.category, () => {
      state.category = label;
      rerender();
    }));
  });

  sources.forEach(label => {
    els.sourceChips.appendChild(makeChip(label, label === state.source, () => {
      state.source = label;
      rerender();
    }));
  });
}

function filteredItems() {
  const term = state.search.trim().toLowerCase();
  return allItems.filter(item => {
    if (state.category !== 'Todas' && item.category !== state.category) return false;
    if (state.source !== 'Todas' && item.source !== state.source) return false;
    if (state.favoritesOnly && !favorites.has(item.id)) return false;
    if (!term) return true;
    const hay = [item.title, item.category, item.source, ...(item.tags || [])].join(' ').toLowerCase();
    return hay.includes(term);
  });
}

function updateChipStates() {
  [...els.categoryChips.children].forEach(btn => btn.classList.toggle('is-active', btn.textContent === state.category));
  [...els.sourceChips.children].forEach(btn => btn.classList.toggle('is-active', btn.textContent === state.source));
  els.favoriteFilter.classList.toggle('is-active', state.favoritesOnly);
  els.favoriteFilter.textContent = state.favoritesOnly ? '★ Mostrando só favoritos' : '☆ Mostrar só favoritos';
}

function toggleFavorite(id) {
  if (favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  saveFavorites();
  rerender(false);
}

function cardElement(item) {
  const article = document.createElement('article');
  article.className = 'card';
  article.innerHTML = `
    <div class="card__image-wrap">
      <img class="card__image" src="${item.thumb}" alt="${item.title}" loading="lazy" />
      <span class="card__badge">${item.category}</span>
      <button class="card__favorite ${favorites.has(item.id) ? 'is-on' : ''}" type="button" aria-label="Favoritar">${favorites.has(item.id) ? '★' : '☆'}</button>
    </div>
    <div class="card__body">
      <h2 class="card__title">${item.title}</h2>
      <p class="card__meta">${item.source} • Página ${item.page}</p>
      <div class="card__tags">
        ${(item.tags || []).slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
    </div>
  `;

  article.querySelector('.card__favorite').addEventListener('click', ev => {
    ev.stopPropagation();
    toggleFavorite(item.id);
  });
  article.addEventListener('click', () => openViewer(item.id));
  return article;
}

function rerender(resetGrid = true) {
  updateChipStates();
  const items = filteredItems();
  els.cards.innerHTML = '';
  items.forEach(item => els.cards.appendChild(cardElement(item)));
  els.count.textContent = `${items.length} resultado${items.length === 1 ? '' : 's'}`;
  els.empty.classList.toggle('hidden', items.length > 0);
  if (resetGrid && window.scrollY > 260) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (state.viewerId && !items.find(i => i.id === state.viewerId)) {
    state.viewerId = items[0]?.id || null;
    if (state.viewerId) fillViewer();
    else els.viewer.close();
  }
}

function currentFilteredList() {
  return filteredItems();
}

function viewerIndex() {
  return currentFilteredList().findIndex(item => item.id === state.viewerId);
}

function fillViewer() {
  const list = currentFilteredList();
  const item = list.find(i => i.id === state.viewerId);
  if (!item) return;

  const index = list.findIndex(i => i.id === item.id);
  els.viewerTitle.textContent = item.title;
  els.viewerMeta.textContent = `${item.source} • Página ${item.page} • Cartão ${item.quadrant} de 4 • ${index + 1}/${list.length}`;
  els.viewerImage.src = item.full;
  els.viewerImage.alt = item.title;
  els.viewerOpenOriginal.href = item.full;
  els.viewerFavorite.textContent = favorites.has(item.id) ? '★' : '☆';
  els.viewerFavorite.classList.toggle('is-on', favorites.has(item.id));
  els.viewerPrev.disabled = index <= 0;
  els.viewerNext.disabled = index >= list.length - 1;
}

function openViewer(id) {
  state.viewerId = id;
  fillViewer();
  if (!els.viewer.open) els.viewer.showModal();
}

function stepViewer(delta) {
  const list = currentFilteredList();
  let index = viewerIndex();
  if (index === -1) return;
  index += delta;
  if (index < 0 || index >= list.length) return;
  state.viewerId = list[index].id;
  fillViewer();
}

els.search.addEventListener('input', () => {
  state.search = els.search.value;
  rerender();
});
els.favoriteFilter.addEventListener('click', () => {
  state.favoritesOnly = !state.favoritesOnly;
  rerender();
});
els.viewerClose.addEventListener('click', () => els.viewer.close());
els.viewerPrev.addEventListener('click', () => stepViewer(-1));
els.viewerNext.addEventListener('click', () => stepViewer(1));
els.viewerFavorite.addEventListener('click', () => {
  if (!state.viewerId) return;
  toggleFavorite(state.viewerId);
  fillViewer();
});

document.addEventListener('keydown', ev => {
  if (!els.viewer.open) return;
  if (ev.key === 'ArrowLeft') stepViewer(-1);
  if (ev.key === 'ArrowRight') stepViewer(1);
  if (ev.key === 'Escape') els.viewer.close();
});

setupChips();
rerender(false);
