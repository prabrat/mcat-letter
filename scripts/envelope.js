/* ----------------------------------------------------------------
   envelope.js
   Drives the 3-step opening animation:
     1) .flipped  — envelope rotates 180° (Y axis)
     2) .open     — the triangular flap rotates open upward
     3) letterPage.visible — the full letter page fades in
   Reverse order on close.

   Exposes window.Envelope = { open, close, isOpen } so the
   passcode flow can trigger the opening on a correct entry.
   ---------------------------------------------------------------- */
(function () {
  const FLIP_TO_FLAP_DELAY  = 1100;  /* wait for flipY to finish */
  const FLAP_TO_LETTER_DELAY = 2200; /* wait for the flap to open */
  const LETTER_TO_FLAP_DELAY = 500;  /* close timings, reversed */
  const FLAP_TO_FLIP_DELAY   = 400;

  const envelope   = document.getElementById('envelope');
  const letterPage = document.getElementById('letterPage');
  const closeBtn   = document.getElementById('closeBtn');

  let opened = false;

  function open() {
    if (opened) return;
    opened = true;

    envelope.classList.add('flipped');
    setTimeout(() => envelope.classList.add('open'), FLIP_TO_FLAP_DELAY);
    setTimeout(() => {
      letterPage.classList.add('visible');
      letterPage.setAttribute('aria-hidden', 'false');
    }, FLAP_TO_LETTER_DELAY);
  }

  function close() {
    letterPage.classList.remove('visible');
    letterPage.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      envelope.classList.remove('open');
      setTimeout(() => {
        envelope.classList.remove('flipped');
        opened = false;
      }, FLAP_TO_FLIP_DELAY);
    }, LETTER_TO_FLAP_DELAY);
  }

  function isOpen() {
    return opened;
  }

  window.Envelope = { open, close, isOpen };

  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && letterPage.classList.contains('visible')) {
      close();
    }
  });
})();
