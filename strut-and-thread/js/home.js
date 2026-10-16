/* ==========================================================
   Strut & Thread - home page
   Sidebar search, favourite searches, collapse all, and a
   "Fresh in" preview row that reuses the product catalogue.
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  /* sidebar search -> shop page */
  const form = document.getElementById('sideSearch');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = document.getElementById('sideQ').value.trim();
    if (!q) { document.getElementById('sideQ').focus(); ST.toast('Type something to search.', 'error'); return; }
    ST.rememberSearch(q);
    window.location.href = 'shop.html?q=' + encodeURIComponent(q);
  });

  /* favourite (recent) searches */
  const toggle = document.getElementById('favToggle');
  const list = document.getElementById('favList');
  const defaults = ['linen', 'denim', 'cardigan', 'leather bag'];
  function paintFavs() {
    const recent = ST.read(ST.KEYS.searches, []);
    const items = [...new Set([...recent, ...defaults])].slice(0, 6);
    list.innerHTML = items.map(s => `<li><a href="shop.html?q=${encodeURIComponent(s)}">${ST.esc(s)}</a></li>`).join('');
  }
  paintFavs();
  toggle.addEventListener('click', () => {
    const open = list.hidden;
    list.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.lastElementChild.textContent = open ? '⌄' : '>';
  });

  /* collapse / expand sidebar groups */
  const collapse = document.getElementById('collapseSide');
  collapse.addEventListener('click', () => {
    const groups = document.querySelectorAll('#sideGroups .filter-group ul');
    const anyOpen = [...groups].some(u => !u.hidden);
    groups.forEach(u => { u.hidden = anyOpen; });
    collapse.textContent = anyOpen ? 'Expand all' : 'Collapse all';
  });

  /* fresh-in preview row */
  const row = document.getElementById('freshRow');
  const fresh = PRODUCTS.filter(p => p.isNew).slice(0, 4);
  const draw = () => {
    row.innerHTML = fresh.map(p => `
      <article class="card">
        <a class="card__media" href="new-arrivals.html" aria-label="${ST.esc(p.name)}">${garmentSVG(p)}<span class="badges"><span class="badge">New</span></span></a>
        <div class="card__body"><span class="card__cat">${ST.esc(p.category)}</span><h3 class="card__name">${ST.esc(p.name)}</h3>
        <div class="price"><strong>${ST.money(salePrice(p))}</strong></div></div>
      </article>`).join('');
  };
  draw();
  document.addEventListener('currencychange', draw);
});
