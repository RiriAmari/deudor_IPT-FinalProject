/* ==========================================================
   Strut & Thread - About page
   Contact form with validation, stored in Local Storage.
   (The FAQ accordion uses native <details>, no script needed.)
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactStatus');
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const rules = {
    cName: v => v.trim().length >= 2 ? '' : 'Please tell us your name.',
    cEmail: v => EMAIL.test(v.trim()) ? '' : 'Enter a valid email address, like name@example.com.',
    cTopic: v => v ? '' : 'Pick a topic so we can route your message.',
    cMessage: v => v.trim().length >= 10 ? '' : 'Write at least 10 characters.'
  };

  function check(input) {
    const msg = rules[input.id](input.value);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    document.getElementById(input.id + 'Err').textContent = msg;
    return !msg;
  }

  Object.keys(rules).forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('blur', () => check(input));
    input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') check(input); });
  });

  const counter = document.getElementById('cCount');
  document.getElementById('cMessage').addEventListener('input', e => { counter.textContent = e.target.value.length + ' / 500'; });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const inputs = Object.keys(rules).map(id => document.getElementById(id));
    const results = inputs.map(check);
    if (results.includes(false)) {
      inputs[results.indexOf(false)].focus();
      status.textContent = 'Please fix the highlighted fields.';
      status.style.color = 'var(--sale)';
      return;
    }
    const messages = ST.read(ST.KEYS.messages, []);
    messages.push({
      name: inputs[0].value.trim(), email: inputs[1].value.trim(), topic: inputs[2].value,
      message: inputs[3].value.trim(), sent: new Date().toISOString()
    });
    ST.write(ST.KEYS.messages, messages);
    form.reset();
    counter.textContent = '0 / 500';
    status.textContent = '';
    ST.toast('Message sent. We reply within one business day.', 'ok');
  });
});
