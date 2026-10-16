/* ==========================================================
   Strut & Thread - sign up / log in
   Accounts live in Local Storage (demo only, no server).
   ========================================================== */
(() => {
  const card = document.getElementById('authCard');
  let mode = window.location.hash === '#login' ? 'login' : 'signup';

  async function hash(text) {
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback for browsers that block crypto.subtle (e.g. some file:// setups)
    let h = 5381;
    for (const ch of text) h = ((h << 5) + h + ch.charCodeAt(0)) >>> 0;
    return 'x' + h.toString(16);
  }

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const USERNAME = /^[A-Za-z0-9_.]{4,20}$/;

  function validateIdentity(value) {
    if (!value) return 'Please enter your email or username.';
    if (value.includes('@')) return EMAIL.test(value) ? '' : 'That email address looks incomplete.';
    return USERNAME.test(value) ? '' : 'Usernames use 4–20 letters, numbers, dots or underscores.';
  }
  function validatePassword(value, strict) {
    if (!value) return 'Please enter a password.';
    if (!strict) return '';
    if (value.length < 8) return 'Use at least 8 characters.';
    if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return 'Include at least one letter and one number.';
    return '';
  }
  function strengthOf(pw) {
    let s = 0;
    if (pw.length >= 8) s++;
    if (pw.length >= 12) s++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return Math.min(s, 4);
  }

  function renderForm() {
    const signup = mode === 'signup';
    document.title = (signup ? 'Sign Up' : 'Log In') + ' | Strut & Thread';
    card.innerHTML = `
      <h1>${signup ? 'Sign Up' : 'Log In'}</h1>
      <form class="auth-form" id="authForm" novalidate>
        <div class="auth-field">
          <input id="identity" name="identity" type="text" autocomplete="${signup ? 'email' : 'username'}" aria-describedby="identityErr">
          <label for="identity">Email/Username</label>
          <p class="field-error" id="identityErr" role="alert"></p>
        </div>
        <div class="auth-field">
          <div class="password-wrap">
            <input id="password" name="password" type="password" autocomplete="${signup ? 'new-password' : 'current-password'}" aria-describedby="passwordErr">
            <button class="pw-toggle" id="pwToggle" type="button" aria-pressed="false">Show</button>
          </div>
          ${signup ? '<div class="strength" aria-hidden="true"><i id="strengthBar"></i></div><p class="strength-label" id="strengthLabel">Use 8+ characters with a letter and a number.</p>' : ''}
          <label for="password">Password</label>
          <p class="field-error" id="passwordErr" role="alert"></p>
        </div>
        <div class="auth-actions">
          <button class="btn btn--block" type="submit" id="authSubmit">${signup ? 'Create account' : 'Log in'}</button>
          <button class="auth-switch" type="button" id="authSwitch">${signup ? 'Already have an account? Log In' : 'New here? Sign Up'}</button>
          <p class="auth-note">Demo store: your details stay in this browser only.</p>
        </div>
      </form>`;
    wireForm();
  }

  function renderWelcome(user) {
    document.title = 'My Account | Strut & Thread';
    const orders = ST.read(ST.KEYS.orders, []).filter(o => o.user === user.name);
    card.innerHTML = `
      <div class="welcome">
        <div class="avatar" aria-hidden="true">${ST.esc(user.name.charAt(0))}</div>
        <h1 style="margin:0">Welcome, ${ST.esc(user.name)}</h1>
        <p class="auth-note" style="font-size:.95rem">You are signed in${orders.length ? ` and have placed ${orders.length} demo order${orders.length === 1 ? '' : 's'}` : ''}.</p>
        <a class="btn btn--block" href="shop.html">Continue shopping</a>
        <button class="btn btn--ghost btn--block" id="logout" type="button">Log out</button>
      </div>`;
    document.getElementById('logout').addEventListener('click', () => {
      localStorage.removeItem(ST.KEYS.session);
      ST.toast('You have been logged out.', 'ok');
      setTimeout(() => window.location.reload(), 600);
    });
  }

  function setError(input, errEl, message) {
    errEl.textContent = message;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function wireForm() {
    const form = document.getElementById('authForm');
    const identity = document.getElementById('identity');
    const password = document.getElementById('password');
    const idErr = document.getElementById('identityErr');
    const pwErr = document.getElementById('passwordErr');
    const signup = mode === 'signup';

    document.getElementById('authSwitch').addEventListener('click', () => {
      mode = signup ? 'login' : 'signup';
      history.replaceState(null, '', mode === 'login' ? '#login' : '#');
      renderForm();
    });
    document.getElementById('pwToggle').addEventListener('click', e => {
      const show = password.type === 'password';
      password.type = show ? 'text' : 'password';
      e.target.textContent = show ? 'Hide' : 'Show';
      e.target.setAttribute('aria-pressed', String(show));
    });

    identity.addEventListener('blur', () => setError(identity, idErr, validateIdentity(identity.value.trim())));
    password.addEventListener('input', () => {
      if (signup) {
        const s = strengthOf(password.value);
        const bar = document.getElementById('strengthBar');
        bar.style.width = (s * 25) + '%';
        bar.style.background = ['#b3261e', '#b3261e', '#d98a1c', '#7aa33a', '#2e7d4f'][s];
        document.getElementById('strengthLabel').textContent = password.value ? ['Very weak', 'Weak', 'Okay', 'Good', 'Strong'][s] : 'Use 8+ characters with a letter and a number.';
      }
      if (pwErr.textContent) setError(password, pwErr, validatePassword(password.value, signup));
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const id = identity.value.trim();
      const pw = password.value;
      const idMsg = validateIdentity(id);
      const pwMsg = validatePassword(pw, signup);
      setError(identity, idErr, idMsg);
      setError(password, pwErr, pwMsg);
      if (idMsg || pwMsg) { (idMsg ? identity : password).focus(); return; }

      const users = ST.read(ST.KEYS.users, []);
      const key = id.toLowerCase();
      const existing = users.find(u => u.key === key);
      const digest = await hash(pw);

      if (signup) {
        if (existing) { setError(identity, idErr, 'That email or username is already registered. Try logging in.'); identity.focus(); return; }
        users.push({ key, name: id.includes('@') ? id.split('@')[0] : id, id, pass: digest, created: new Date().toISOString() });
        ST.write(ST.KEYS.users, users);
        ST.write(ST.KEYS.session, { key, name: users[users.length - 1].name });
        ST.toast('Account created. Welcome to Strut & Thread!', 'ok');
        setTimeout(() => { window.location.href = 'index.html'; }, 900);
      } else {
        if (!existing || existing.pass !== digest) { setError(password, pwErr, 'Email/username or password is incorrect.'); password.focus(); return; }
        ST.write(ST.KEYS.session, { key, name: existing.name });
        ST.toast('Welcome back, ' + existing.name + '!', 'ok');
        setTimeout(() => { window.location.href = 'index.html'; }, 900);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const user = ST.session();
    user ? renderWelcome(user) : renderForm();
  });
})();
