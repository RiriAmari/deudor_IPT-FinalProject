/* ==========================================================
   Strut & Thread - product listing pages
   Used by shop, new-arrivals, women, men, accessories and sales.
   The page type comes from <body data-scope="...">.
  Handles: filters, search text, sorting, product cards,
  and quick-view modal.
   ========================================================== */
(() => {
  const scope = document.body.dataset.scope || 'all';
  const SCOPES = {
    all:         () => true,
    new:         p => p.isNew,
    women:       p => p.division === 'women',
    men:         p => p.division === 'men',
    accessories: p => p.division === 'accessories',
    sale:        p => p.salePct > 0
  };
  const DIVISION_LABELS = { women: 'Women', men: 'Men', girls: 'Girls', boys: 'Boys', accessories: 'Accessories' };
  const base = PRODUCTS.filter(SCOPES[scope] || SCOPES.all);

  /* ---------- filter state (seeded from the URL) ---------- */
  const params = new URLSearchParams(window.location.search);
  const state = {
    q: params.get('q') || '',
    divisions: new Set(params.get('division') ? [params.get('division')] : []),
    categories: new Set(params.get('category') ? [params.get('category')] : []),
    tag: COLLECTIONS[params.get('tag')] ? params.get('tag') : '',
    onlySale: false,
    maxPrice: 0,
    sort: scope === 'sale' ? 'discount' : (scope === 'new' ? 'newest' : 'featured')
  };
  const priceCeiling = Math.ceil(Math.max(...base.map(salePrice)) / 500) * 500;
  state.maxPrice = priceCeiling;

  const el = {
    filters: document.getElementById('filters'),
    grid: document.getElementById('grid'),
    count: document.getElementById('resultCount'),
    note: document.getElementById('activeNote'),
    sort: document.getElementById('sortSelect'),
    toggle: document.getElementById('filterToggle')
  };

  /* ---------- helpers ---------- */
  const countBy = (list, key) => list.reduce((m, p) => (m[p[key]] = (m[p[key]] || 0) + 1, m), {});

  function renderFilters() {
    const cats = countBy(base, 'category');
    const divs = countBy(base, 'division');
    const showDivisions = Object.keys(divs).length > 1;
    el.filters.innerHTML = `
      <div class="filter-panel__head"><h2>Filter</h2><button class="link-btn" type="button" id="collapseAll">Collapse all</button></div>
      <details class="fsection" open><summary>Search</summary>
        <div class="fsection__body"><label class="visually-hidden" for="fq">Search this page</label>
        <input class="field-input" id="fq" type="search" placeholder="Search" value="${ST.esc(state.q)}"></div></details>
      ${showDivisions ? `<details class="fsection" open><summary>Division</summary><div class="fsection__body">
        ${Object.keys(divs).map(d => `<label class="check"><input type="checkbox" data-filter="division" value="${d}"${state.divisions.has(d) ? ' checked' : ''}>${DIVISION_LABELS[d]}<small>${divs[d]}</small></label>`).join('')}
      </div></details>` : ''}
      <details class="fsection" open><summary>${scope === 'accessories' ? 'Type' : 'Category'}</summary><div class="fsection__body">
        ${Object.keys(cats).sort().map(c => `<label class="check"><input type="checkbox" data-filter="category" value="${ST.esc(c)}"${state.categories.has(c) ? ' checked' : ''}>${ST.esc(c)}<small>${cats[c]}</small></label>`).join('')}
      </div></details>
      <details class="fsection" open><summary>Price</summary><div class="fsection__body">
        <input class="range" id="fprice" type="range" min="500" max="${priceCeiling}" step="100" value="${state.maxPrice}" aria-label="Maximum price">
        <div class="range-out"><span>${ST.money(0)}</span><span>Up to <strong id="fpriceOut">${ST.money(state.maxPrice)}</strong></span></div>
      </div></details>
      ${scope !== 'sale' ? `<details class="fsection" open><summary>Deals</summary><div class="fsection__body">
        <label class="check"><input type="checkbox" id="fsale"${state.onlySale ? ' checked' : ''}>Sale items only</label></div></details>` : ''}
      <button class="btn btn--ghost btn--block" type="button" id="clearFilters">Clear all filters</button>`;
  }

  function visible() {
    const q = state.q.trim();
    let list = base.filter(p =>
      (!q || ST.matches(p, q)) &&
      (!state.divisions.size || state.divisions.has(p.division)) &&
      (!state.categories.size || state.categories.has(p.category)) &&
      (!state.tag || COLLECTIONS[state.tag].test(p)) &&
      (!state.onlySale || p.salePct > 0) &&
      salePrice(p) <= state.maxPrice
    );
    const by = {
      featured: (a, b) => (b.favorite - a.favorite) || (a.id - b.id),
      newest: (a, b) => (b.isNew - a.isNew) || (b.id - a.id),
      'price-asc': (a, b) => salePrice(a) - salePrice(b),
      'price-desc': (a, b) => salePrice(b) - salePrice(a),
      discount: (a, b) => (b.salePct - a.salePct) || (a.id - b.id)
    };
    return list.sort(by[state.sort] || by.featured);
  }

  function cardHTML(p) {
    const sale = p.salePct > 0;
    const oneSize = p.sizes.length === 1;
    return `<article class="card" data-id="${p.id}">
      <button class="card__media" type="button" data-open="${p.id}" aria-label="Quick view: ${ST.esc(p.name)}">
        ${garmentSVG(p)}
        <span class="badges">${p.isNew ? '<span class="badge">New</span>' : ''}${sale ? `<span class="badge badge--sale">-${p.salePct}%</span>` : ''}</span>
      </button>
      <div class="card__body">
        <span class="card__cat">${ST.esc(p.category)}</span>
        <h3 class="card__name">${ST.esc(p.name)}</h3>
        <span class="card__color"><i class="swatch" style="background:${p.hex}"></i>${ST.esc(p.color)}</span>
        <div class="price">${sale ? `<strong>${ST.money(salePrice(p))}</strong><s>${ST.money(p.price)}</s>` : `<strong>${ST.money(p.price)}</strong>`}</div>
        <button class="btn" type="button" data-add="${p.id}">${oneSize ? 'Add to cart' : 'Choose size'}</button>
      </div>
    </article>`;
  }

  function renderGrid() {
    const list = visible();
    el.count.textContent = `${list.length} item${list.length === 1 ? '' : 's'}`;
    el.grid.innerHTML = list.length ? list.map(cardHTML).join('') :
      `<div class="empty"><h3>Nothing matches those filters</h3><p>Try a different word, a higher price, or clear your filters.</p><button class="btn" type="button" id="emptyClear">Clear all filters</button></div>`;
    renderNote();
  }

  function renderNote() {
    const bits = [];
    if (state.tag) bits.push(COLLECTIONS[state.tag].label);
    if (state.q.trim()) bits.push(`“${ST.esc(state.q.trim())}”`);
    if (!bits.length) { el.note.hidden = true; return; }
    el.note.hidden = false;
    el.note.innerHTML = `<span>Showing: <strong>${bits.join(' · ')}</strong></span><button class="link-btn" type="button" id="noteClear">Clear</button>`;
  }

  function resetFilters() {
    state.q = ''; state.divisions.clear(); state.categories.clear(); state.tag = ''; state.onlySale = false; state.maxPrice = priceCeiling;
    renderFilters();
    renderGrid();
  }

  /* ---------- quick view ---------- */
  function openQuick(id, focusSize) {
    const p = ST.byId(id);
    const modal = document.getElementById('quickModal');
    const sale = p.salePct > 0;
    modal.innerHTML = `<div class="modal__panel">
      <button class="icon-btn modal__close" type="button" data-close aria-label="Close">&times;</button>
      <div class="quick">
        <div class="quick__media">${garmentSVG(p)}</div>
        <form class="quick__info" id="quickForm" novalidate>
          <span class="card__cat">${ST.esc(p.category)} · ${DIVISION_LABELS[p.division]}</span>
          <h2>${ST.esc(p.name)}</h2>
          <div class="price">${sale ? `<strong>${ST.money(salePrice(p))}</strong><s>${ST.money(p.price)}</s><span class="off">Save ${p.salePct}%</span>` : `<strong>${ST.money(p.price)}</strong>`}</div>
          <p>${ST.esc(p.desc)}</p>
          <span class="card__color"><i class="swatch" style="background:${p.hex}"></i>${ST.esc(p.color)}</span>
          <fieldset style="border:0;padding:0;margin:0"><legend class="card__cat" style="margin-bottom:.4rem">Size</legend>
            <div class="size-row">${p.sizes.map((s, i) => `<label><input type="radio" name="size" value="${ST.esc(s)}"${p.sizes.length === 1 ? ' checked' : ''}><span>${ST.esc(s)}</span></label>`).join('')}</div></fieldset>
          <p class="field-error" id="sizeError" role="alert"></p>
          <button class="btn btn--block" type="submit">Add to cart</button>
        </form>
      </div></div>`;
    ST.openLayerEl(modal, modal.querySelector('input[name="size"]'));
    if (focusSize) document.getElementById('sizeError').textContent = '';
    modal.querySelector('#quickForm').addEventListener('submit', e => {
      e.preventDefault();
      const chosen = modal.querySelector('input[name="size"]:checked');
      if (!chosen) { document.getElementById('sizeError').textContent = 'Please choose a size.'; return; }
      ST.addToCart(p.id, chosen.value, 1);
      ST.closeLayers();
    });
  }
  /* ---------- wiring ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    renderFilters();
    el.sort.value = state.sort;
    renderGrid();
    el.filters.addEventListener('input', e => {
      const t = e.target;
      if (t.id === 'fq') { state.q = t.value; renderGrid(); }
      if (t.id === 'fprice') { state.maxPrice = Number(t.value); document.getElementById('fpriceOut').textContent = ST.money(state.maxPrice); renderGrid(); }
    });
    el.filters.addEventListener('change', e => {
      const t = e.target;
      if (t.dataset.filter === 'division') { t.checked ? state.divisions.add(t.value) : state.divisions.delete(t.value); renderGrid(); }
      if (t.dataset.filter === 'category') { t.checked ? state.categories.add(t.value) : state.categories.delete(t.value); renderGrid(); }
      if (t.id === 'fsale') { state.onlySale = t.checked; renderGrid(); }
    });
    el.filters.addEventListener('click', e => {
      if (e.target.id === 'clearFilters') resetFilters();
      if (e.target.id === 'collapseAll') {
        const sections = el.filters.querySelectorAll('details');
        const anyOpen = [...sections].some(d => d.open);
        sections.forEach(d => { d.open = !anyOpen; });
        e.target.textContent = anyOpen ? 'Expand all' : 'Collapse all';
      }
    });
    el.filters.addEventListener('submit', e => e.preventDefault());

    el.sort.addEventListener('change', () => { state.sort = el.sort.value; renderGrid(); });
    el.toggle.addEventListener('click', () => {
      const open = el.filters.classList.toggle('open');
      el.toggle.setAttribute('aria-expanded', String(open));
    });

    el.grid.addEventListener('click', e => {
      if (e.target.id === 'emptyClear') return resetFilters();
      const open = e.target.closest('[data-open]');
      const add = e.target.closest('[data-add]');
      if (open) openQuick(Number(open.dataset.open));
      if (add) {
        const p = ST.byId(Number(add.dataset.add));
        if (p.sizes.length === 1) ST.addToCart(p.id, p.sizes[0], 1);
        else openQuick(p.id, true);
      }
    });
    el.note.addEventListener('click', e => { if (e.target.id === 'noteClear') resetFilters(); });
    document.getElementById('quickModal').addEventListener('click', e => {
      if (e.target.closest('[data-close]') || e.target.id === 'quickModal') ST.closeLayers();
    });
    document.addEventListener('currencychange', () => { renderFilters(); renderGrid(); });
  });
})();
