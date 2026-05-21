/* ----------------------------------------------------------------
   ambient-petals.js
   Spawns the gently drifting petals in the background by appending
   .petal elements (styled in base.css) to #petals on page load.
   ---------------------------------------------------------------- */
(function () {
  const COUNT = 18;
  const HUES  = ['#ffd1dc', '#ffc1c1', '#fff1a1', '#ffe0b2'];

  function spawnPetals() {
    const container = document.getElementById('petals');
    if (!container) return;

    for (let i = 0; i < COUNT; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      petal.style.left = Math.random() * 100 + 'vw';
      petal.style.animationDuration = (8 + Math.random() * 10) + 's';
      petal.style.animationDelay    = (-Math.random() * 12) + 's';

      const scale = 0.6 + Math.random() * 1.1;
      petal.style.transform = `scale(${scale})`;

      const hue = HUES[i % HUES.length];
      petal.style.background = `radial-gradient(circle at 30% 30%, ${hue}, #f48fb1)`;

      container.appendChild(petal);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', spawnPetals);
  } else {
    spawnPetals();
  }
})();
