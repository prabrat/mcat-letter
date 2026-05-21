/* ----------------------------------------------------------------
   passcode.js
   Gates the envelope behind a 4-digit code.
   - Correct code: shows ♡ Welcome ♡, then calls Envelope.open().
   - Wrong code:   shakes the card, prints "Incorrect", wilts the
                   tulips, and rains down a burst of colored petals.

   The envelope's click is intercepted here — instead of opening
   directly, it shows the passcode modal first.
   ---------------------------------------------------------------- */
(function () {
  const CORRECT_PASSCODE = '1207';
  const SUCCESS_DELAY    = 700;
  const RESET_DELAY      = 1800;
  const PETAL_BURST      = 22;

  const envelopeEl = document.getElementById('envelope');
  const modal      = document.getElementById('passcodeModal');
  const card       = document.getElementById('passcodeCard');
  const message    = document.getElementById('passcodeMessage');
  const boxes      = Array.from(modal.querySelectorAll('.passcode-box'));

  let checking = false;

  /* -------- Modal show / hide -------- */
  function show() {
    if (window.Envelope && window.Envelope.isOpen()) return;
    boxes.forEach(b => b.value = '');
    message.textContent = '';
    message.className   = 'passcode-message';
    card.classList.remove('error');
    modal.classList.add('visible');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => boxes[0].focus(), 250);
  }

  function hide() {
    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
  }

  /* -------- Petal burst on a wrong entry -------- */
  function dropFallingPetals(count) {
    const colors = ['#ffb1c1', '#e94f6b', '#ff8c8c', '#fff3a8', '#f0a838', '#ffd6e1'];

    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.className = 'falling-petal';

      // Drop them roughly from the tulip head regions on both sides
      const fromLeft = Math.random() < 0.5;
      const baseX = fromLeft ? (10 + Math.random() * 18) : (72 + Math.random() * 18);
      petal.style.left = baseX + 'vw';
      petal.style.top  = (8 + Math.random() * 35) + 'vh';

      petal.style.background = `radial-gradient(circle at 30% 30%, #fff, ${colors[i % colors.length]})`;
      petal.style.setProperty('--dx', ((Math.random() - 0.5) * 180) + 'px');
      petal.style.animationDelay    = (Math.random() * 0.4) + 's';
      petal.style.animationDuration = (1.6 + Math.random() * 1.2) + 's';

      document.body.appendChild(petal);
      setTimeout(() => petal.remove(), 3200);
    }
  }

  /* -------- Validation -------- */
  function check() {
    if (checking) return;
    const code = boxes.map(b => b.value).join('');
    if (code.length < 4) return;
    checking = true;

    if (code === CORRECT_PASSCODE) {
      message.textContent = '♡  Welcome  ♡';
      message.classList.add('show', 'success');
      setTimeout(() => {
        hide();
        if (window.Envelope) window.Envelope.open();
        checking = false;
      }, SUCCESS_DELAY);
    } else {
      card.classList.add('error');
      message.textContent = 'Incorrect';
      message.classList.add('show');
      document.body.classList.add('wilt');
      dropFallingPetals(PETAL_BURST);

      setTimeout(() => {
        document.body.classList.remove('wilt');
        card.classList.remove('error');
        boxes.forEach(b => b.value = '');
        message.classList.remove('show');
        setTimeout(() => { message.textContent = ''; }, 300);
        boxes[0].focus();
        checking = false;
      }, RESET_DELAY);
    }
  }

  /* -------- Wire up the digit boxes -------- */
  boxes.forEach((box, idx) => {
    box.addEventListener('input', (e) => {
      const v = (e.target.value || '').replace(/\D/g, '').slice(-1);
      e.target.value = v;
      message.classList.remove('show');
      card.classList.remove('error');

      if (v && idx < boxes.length - 1) {
        boxes[idx + 1].focus();
      }
      if (boxes.every(b => b.value)) {
        check();
      }
    });

    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !box.value && idx > 0) {
        boxes[idx - 1].focus();
        boxes[idx - 1].value = '';
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft'  && idx > 0)                boxes[idx - 1].focus();
      if (e.key === 'ArrowRight' && idx < boxes.length - 1) boxes[idx + 1].focus();
      if (e.key === 'Enter') check();
    });
  });

  /* -------- Envelope click → show the passcode prompt -------- */
  envelopeEl.addEventListener('click', show);
  envelopeEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      show();
    }
  });

  /* -------- Dismiss handlers (Esc + click outside the card) -------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('visible')) {
      hide();
    }
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal && !checking) hide();
  });
})();
