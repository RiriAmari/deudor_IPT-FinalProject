/* ==========================================================
   Strut & Thread - shared behaviour (loaded on every page)
   - builds the header and footer
   - cart (Local Storage) + cart drawer + checkout
   - search overlay with live results
   - currency / region menu, toast messages, newsletter form
   ========================================================== */
const ST = (() => {
  /* ---------- storage helpers ---------- */
  const KEYS = {
    cart: 'st_cart', users: 'st_users', session: 'st_session', currency: 'st_currency',
    searches: 'st_recent_searches', messages: 'st_messages', newsletter: 'st_newsletter', orders: 'st_orders'
  };
  const read = (key, fallback) => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
    catch (e) { return fallback; }
  };
  const write = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked: keep working in memory */ }
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const byId = id => PRODUCTS.find(p => p.id === id);

  /* ---------- currency ---------- */
  const CURRENCIES = {
    PHP: { label: 'Philippines', symbol: '₱', rate: 1 },
    USD: { label: 'International', symbol: '$', rate: 1 / 58 }
  };
  let currency = read(KEYS.currency, 'PHP');
  if (!CURRENCIES[currency]) currency = 'PHP';
  const money = php => {
    const c = CURRENCIES[currency];
    const v = php * c.rate;
    return c.symbol + v.toLocaleString('en-US', { minimumFractionDigits: currency === 'USD' ? 2 : 0, maximumFractionDigits: 2 });
  };

  /* ---------- session ---------- */
  const session = () => read(KEYS.session, null);

  /* ---------- icons ---------- */
  const ICONS = {
    phone: '<svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
    cart: '<svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    globe: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>'
  };
  const PH_FLAG = '<svg class="flag" viewBox="0 0 18 12" aria-hidden="true"><rect width="18" height="6" fill="#0038a8"/><rect y="6" width="18" height="6" fill="#ce1126"/><path d="M0 0 L9 6 L0 12Z" fill="#fff"/><circle cx="2.6" cy="6" r="1" fill="#fcd116"/></svg>';

  /* ---------- toast ---------- */
  let toastZone;
  function toast(message, type) {
    const el = document.createElement('div');
    el.className = 'toast' + (type ? ' toast--' + type : '');
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
    el.textContent = message;
    toastZone.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  /* ---------- header + footer ---------- */
  const NAV = [
    ['index.html', 'Home', 'home'], ['new-arrivals.html', 'New Arrivals', 'new'], ['women.html', 'Women', 'women'],
    ['men.html', 'Men', 'men'], ['accessories.html', 'Accessories', 'accessories'], ['sales.html', 'Sales', 'sales'],
    ['about.html', 'About Us', 'about'], ['signup.html', 'Sign Up', 'signup']
  ];

  function buildHeader() {
    const page = document.body.dataset.page;
    const user = session();
    const links = NAV.map(([href, label, key]) => {
      const text = key === 'signup' && user ? 'My Account' : label;
      return `<li><a href="${href}"${key === page ? ' aria-current="page"' : ''}>${text}</a></li>`;
    }).join('');
    const host = document.getElementById('site-header');
    host.className = 'site-header';
    host.innerHTML = `
      <div class="topbar"><div class="topbar__inner">
        <a class="topbar__item" href="tel:+631234567890"><span class="icon">${ICONS.phone}</span><span class="hide-sm">(+63) 123-456-7890</span></a>
        <button class="topbar__item" id="cartBtn" type="button" aria-haspopup="dialog"><span class="icon">${ICONS.cart}</span>Cart (<span id="cartCount">0</span>)</button>
        <button class="topbar__item" id="searchBtn" type="button" aria-haspopup="dialog"><span class="icon">${ICONS.search}</span>Search</button>
        <div class="region">
          <button class="topbar__item" id="regionBtn" type="button" aria-haspopup="true" aria-expanded="false"><span id="regionIcon"></span><span id="regionLabel"></span></button>
          <ul class="region__menu" id="regionMenu" hidden>
            <li><button type="button" role="menuitemradio" data-cur="PHP">${PH_FLAG.replace('class="flag"', 'class="flag" style="display:inline-block;vertical-align:-1px;margin-right:.5rem"')}Philippines (₱ PHP)</button></li>
            <li><button type="button" role="menuitemradio" data-cur="USD"><span class="icon" style="display:inline-block;vertical-align:-3px;margin-right:.5rem">${ICONS.globe}</span>International ($ USD)</button></li>
          </ul>
        </div>
      </div></div>
      <nav class="mainnav" aria-label="Main">
        <a class="brand" href="index.html">Strut &amp; Thread</a>
        <button class="nav-toggle" id="navToggle" type="button" aria-expanded="false" aria-controls="navLinks">Menu</button>
        <ul class="nav-links" id="navLinks">${links}</ul>
      </nav>`;
  }

  function buildFooter() {
    const host = document.getElementById('site-footer');
    if (!host) return;
    host.className = 'site-footer';
    host.innerHTML = `
      <div class="footer-grid">
        <div>
          <p class="footer-brand">Strut &amp; Thread</p>
          <p>Thoughtfully made clothing for every day, designed in Manila.</p>
          <form class="newsletter" id="newsletterForm" novalidate>
            <label class="visually-hidden" for="newsletterEmail">Email address</label>
            <input id="newsletterEmail" type="email" placeholder="Your email" autocomplete="email">
            <button type="submit">Join</button>
          </form>
          <p class="footer-msg" id="newsletterMsg" aria-live="polite"></p>
        </div>
        <div><h2>Shop</h2><ul>
          <li><a href="new-arrivals.html">New Arrivals</a></li><li><a href="women.html">Women</a></li><li><a href="men.html">Men</a></li>
          <li><a href="accessories.html">Accessories</a></li><li><a href="sales.html">Sales</a></li></ul></div>
        <div><h2>Company</h2><ul>
          <li><a href="about.html">About Us</a></li><li><a href="about.html#faq">FAQ</a></li><li><a href="about.html#contact">Contact</a></li><li><a href="signup.html">Account</a></li></ul></div>
        <div><h2>Visit</h2><ul>
          <li>Unit 12, Thread Lane</li><li>Makati City, Metro Manila</li><li>Mon–Sun, 10:00–21:00</li><li>(+63) 123-456-7890</li></ul></div>
      </div>
      <div class="footer-bottom"><span>© <span id="year"></span> Strut &amp; Thread. A student project for Integrative Programming Technologies.</span><span>Prices in PHP unless changed in the region menu.</span></div>`;
    document.getElementById('year').textContent = new Date().getFullYear();
  }

  /* ---------- overlays (cart, search, quick view) ---------- */
  function buildOverlays() {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="overlay" id="overlay"></div>
      <aside class="drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-labelledby="cartTitle" aria-hidden="true">
        <div class="drawer__head"><h2 id="cartTitle">Your Cart</h2><button class="icon-btn" id="cartClose" type="button" aria-label="Close cart">&times;</button></div>
        <ul class="cart-items" id="cartItems"></ul>
        <div class="drawer__foot" id="cartFoot"></div>
      </aside>
      <div class="modal search-modal" id="searchModal" role="dialog" aria-modal="true" aria-label="Search products" aria-hidden="true">
        <div class="modal__panel search-box">
          <form id="searchForm" role="search">
            <input type="search" id="searchInput" placeholder="Search dresses, denim, bags…" autocomplete="off" aria-label="Search products">
            <button class="btn" type="submit">Search</button>
            <button class="btn btn--ghost" type="button" id="searchClose">Close</button>
          </form>
          <ul class="live-results" id="liveResults"></ul>
          <p class="live-hint" id="liveHint">Start typing to see matching products.</p>
        </div>
      </div>
      <div class="modal" id="quickModal" role="dialog" aria-modal="true" aria-label="Product details" aria-hidden="true"></div>
      <div class="toast-zone" id="toastZone" aria-live="polite"></div>`);
    toastZone = document.getElementById('toastZone');
  }

  let openLayer = null;
  function openLayerEl(el, focusEl) {
    closeLayers();
    openLayer = el;
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    document.getElementById('overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    if (focusEl) setTimeout(() => focusEl.focus(), 60);
  }
  function closeLayers() {
    if (!openLayer) return;
    openLayer.classList.remove('open');
    openLayer.setAttribute('aria-hidden', 'true');
    document.getElementById('overlay').classList.remove('open');
    document.body.style.overflow = '';
    openLayer = null;
  }

  /* ---------- cart ---------- */
  let cart = read(KEYS.cart, []).filter(l => byId(l.id));
  const saveCart = () => { write(KEYS.cart, cart); renderCart(); };
  const unit = item => salePrice(item);
  const cartCount = () => cart.reduce((n, l) => n + l.qty, 0);
  const cartTotal = () => cart.reduce((sum, l) => sum + unit(byId(l.id)) * l.qty, 0);

  function addToCart(id, size, qty = 1) {
    const found = cart.find(l => l.id === id && l.size === size);
    if (found) found.qty = Math.min(10, found.qty + qty);
    else cart.push({ id, size, qty });
    saveCart();
    toast(byId(id).name + ' added to cart', 'ok');
  }
  function changeQty(index, delta) {
    const line = cart[index];
    if (!line) return;
    line.qty += delta;
    if (line.qty < 1) cart.splice(index, 1);
    line.qty = Math.min(10, line.qty || 1);
    saveCart();
  }

  function renderCart() {
    document.getElementById('cartCount').textContent = cartCount();
    const list = document.getElementById('cartItems');
    const foot = document.getElementById('cartFoot');
    if (!cart.length) {
      list.innerHTML = '<li class="cart-empty"><p><strong>Your cart is empty.</strong></p><p>Add something you love and it will show up here.</p></li>';
      foot.innerHTML = '<a class="btn btn--block" href="shop.html">Start shopping</a>';
      return;
    }
    list.innerHTML = cart.map((l, i) => {
      const item = byId(l.id);
      return `<li class="cart-item">
        <div class="cart-item__img">${garmentSVG(item)}</div>
        <div><h3>${esc(item.name)}</h3><small>${esc(item.color)} · ${esc(l.size)}</small>
          <div class="qty"><button type="button" data-act="dec" data-i="${i}" aria-label="Decrease quantity">−</button><span aria-live="polite">${l.qty}</span><button type="button" data-act="inc" data-i="${i}" aria-label="Increase quantity">+</button></div></div>
        <div class="cart-item__price">${money(unit(item) * l.qty)}<button type="button" data-act="rm" data-i="${i}">Remove</button></div>
      </li>`;
    }).join('');
    foot.innerHTML = `<div class="subtotal"><span>Subtotal</span><span>${money(cartTotal())}</span></div>
      <p class="auth-note">Shipping is calculated at checkout. Free delivery in Metro Manila over ${money(2500)}.</p>
      <button class="btn btn--block" type="button" id="checkoutBtn">Checkout</button>
      <button class="btn btn--ghost btn--block" type="button" id="clearCart">Clear cart</button>`;
  }

  function checkout() {
    const user = session();
    if (!user) {
      toast('Please sign up or log in to check out.', 'error');
      setTimeout(() => { window.location.href = 'signup.html'; }, 1300);
      return;
    }
    const orders = read(KEYS.orders, []);
    const order = { ref: 'ST-' + Date.now().toString().slice(-6), user: user.name, total: cartTotal(), lines: cart.slice(), date: new Date().toISOString() };
    orders.push(order);
    write(KEYS.orders, orders);
    cart = [];
    write(KEYS.cart, cart);
    renderCart();
    document.getElementById('cartItems').innerHTML = `<li class="cart-empty"><p><strong>Thank you, ${esc(user.name)}!</strong></p><p>Order ${order.ref} for ${money(order.total)} has been placed. This is a demo store, so nothing was charged.</p></li>`;
    document.getElementById('cartFoot').innerHTML = '<a class="btn btn--block" href="shop.html">Keep shopping</a>';
  }

  /* ---------- search overlay ---------- */
  function matches(item, q) {
    const hay = (item.name + ' ' + item.category + ' ' + item.color + ' ' + item.division).toLowerCase();
    return q.toLowerCase().split(/\s+/).filter(Boolean).every(t => hay.includes(t));
  }
  function rememberSearch(q) {
    q = q.trim();
    if (!q) return;
    const list = read(KEYS.searches, []).filter(s => s.toLowerCase() !== q.toLowerCase());
    list.unshift(q);
    write(KEYS.searches, list.slice(0, 6));
  }
  function wireSearch() {
    const input = document.getElementById('searchInput');
    const results = document.getElementById('liveResults');
    const hint = document.getElementById('liveHint');
    const showRecent = () => {
      const recent = read(KEYS.searches, []);
      results.innerHTML = recent.map(s => `<li><a href="shop.html?q=${encodeURIComponent(s)}">${esc(s)}<small>Recent</small></a></li>`).join('');
      hint.textContent = recent.length ? 'Your recent searches' : 'Start typing to see matching products.';
    };
    document.getElementById('searchBtn').addEventListener('click', () => { openLayerEl(document.getElementById('searchModal'), input); input.value = ''; showRecent(); });
    document.getElementById('searchClose').addEventListener('click', closeLayers);
    input.addEventListener('input', () => {
      const q = input.value.trim();
      if (!q) { showRecent(); return; }
      const found = PRODUCTS.filter(p => matches(p, q));
      results.innerHTML = found.slice(0, 8).map(p =>
        `<li><a href="shop.html?q=${encodeURIComponent(p.name)}"><span>${esc(p.name)} <small>${esc(p.category)}</small></span><strong>${money(salePrice(p))}</strong></a></li>`).join('');
      hint.textContent = found.length ? `${found.length} match${found.length === 1 ? '' : 'es'}. Press Enter to see them all.` : `No products match “${q}”. Try a different word.`;
    });
    document.getElementById('searchForm').addEventListener('submit', e => {
      e.preventDefault();
      const q = input.value.trim();
      if (!q) { input.focus(); return; }
      rememberSearch(q);
      window.location.href = 'shop.html?q=' + encodeURIComponent(q);
    });
  }

  /* ---------- region / currency ---------- */
  function wireRegion() {
    const btn = document.getElementById('regionBtn');
    const menu = document.getElementById('regionMenu');
    const paint = () => {
      document.getElementById('regionLabel').textContent = CURRENCIES[currency].label;
      document.getElementById('regionIcon').innerHTML = currency === 'PHP' ? PH_FLAG : `<span class="icon">${ICONS.globe}</span>`;
      menu.querySelectorAll('button').forEach(b => b.setAttribute('aria-checked', String(b.dataset.cur === currency)));
    };
    paint();
    btn.addEventListener('click', e => { e.stopPropagation(); const open = menu.hidden; menu.hidden = !open; btn.setAttribute('aria-expanded', String(open)); });
    menu.addEventListener('click', e => {
      const b = e.target.closest('button[data-cur]');
      if (!b) return;
      currency = b.dataset.cur;
      write(KEYS.currency, currency);
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      paint();
      renderCart();
      document.dispatchEvent(new CustomEvent('currencychange'));
      toast('Prices now shown in ' + currency, 'ok');
    });
    document.addEventListener('click', () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); });
  }

  /* ---------- newsletter ---------- */
  function wireNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    const msg = document.getElementById('newsletterMsg');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('newsletterEmail').value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.style.color = '#ff9b8f'; msg.textContent = 'Please enter a valid email address.'; return; }
      const list = read(KEYS.newsletter, []);
      if (list.includes(email.toLowerCase())) { msg.style.color = '#e8d7a8'; msg.textContent = 'You are already on the list.'; return; }
      list.push(email.toLowerCase());
      write(KEYS.newsletter, list);
      form.reset();
      msg.style.color = '#9be3b4';
      msg.textContent = 'Thanks for joining! Watch your inbox for new drops.';
    });
  }

  /* ---------- init ---------- */
  function init() {
    buildHeader();
    buildFooter();
    buildOverlays();
    renderCart();
    wireSearch();
    wireRegion();
    wireNewsletter();

    document.getElementById('cartBtn').addEventListener('click', () => openLayerEl(document.getElementById('cartDrawer'), document.getElementById('cartClose')));
    document.getElementById('cartClose').addEventListener('click', closeLayers);
    document.getElementById('overlay').addEventListener('click', closeLayers);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLayers(); });
    document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', e => { if (e.target === m) closeLayers(); }));

    document.getElementById('cartDrawer').addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.id === 'checkoutBtn') return checkout();
      if (b.id === 'clearCart') { cart = []; saveCart(); return; }
      const i = Number(b.dataset.i);
      if (b.dataset.act === 'inc') changeQty(i, 1);
      if (b.dataset.act === 'dec') changeQty(i, -1);
      if (b.dataset.act === 'rm') { cart.splice(i, 1); saveCart(); }
    });

    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    KEYS, read, write, esc, byId, money, toast, session, addToCart, rememberSearch, matches,
    openLayerEl, closeLayers, get currency() { return currency; }
  };
})();
