/* ============================================================
   MONSOON DIARIES — Main Experience Engine
   Mobile-first | Cinematic | All powered by config.js
   ============================================================ */

'use strict';

// ── AUDIO SETUP ─────────────────────────────────────────────
const bgAudio   = document.getElementById('bg-audio');
const rainAudio = document.getElementById('rain-audio');
let musicPlaying = false;

// Fade audio in/out
function fadeAudio(audioEl, targetVol, duration = 1000) {
  const step = (targetVol - audioEl.volume) / (duration / 50);
  const timer = setInterval(() => {
    audioEl.volume = Math.max(0, Math.min(1, audioEl.volume + step));
    if ((step > 0 && audioEl.volume >= targetVol) ||
        (step < 0 && audioEl.volume <= targetVol)) {
      audioEl.volume = targetVol;
      clearInterval(timer);
      if (targetVol === 0) audioEl.pause();
    }
  }, 50);
}

function startMusic() {
  bgAudio.volume = 0;
  bgAudio.play().catch(() => {});
  fadeAudio(bgAudio, 0.5, 2000);
  musicPlaying = true;
  document.getElementById('music-icon').textContent = '❚❚';
}

function startRain() {
  if (!BIRTHDAY_CONFIG.music.rainSoundsEnabled) return;
  rainAudio.volume = 0;
  rainAudio.play().catch(() => {});
  fadeAudio(rainAudio, 0.25, 2000);
}

function stopRain() {
  fadeAudio(rainAudio, 0, 1000);
}

// Music player button
document.getElementById('music-btn').addEventListener('click', () => {
  if (musicPlaying) {
    fadeAudio(bgAudio, 0, 800);
    musicPlaying = false;
    document.getElementById('music-icon').textContent = '▶';
  } else {
    startMusic();
  }
});

// ── CHAPTER STATE ────────────────────────────────────────────
let currentChapter = -1; // -1 = loader
const CHAPTERS = [
  { id: 'ch1', init: initChapter1 },
  { id: 'ch2', init: initChapter2 },
  { id: 'ch3', init: initChapter3 },
  { id: 'ch4', init: initChapter4 },
  { id: 'ch5', init: initChapter5 },
];

function showChapter(index) {
  // Hide all chapters
  document.querySelectorAll('.chapter').forEach(ch => ch.classList.add('hidden'));

  // Update nav dots
  document.querySelectorAll('.chapter-dot').forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i < index)  dot.classList.add('done');
    if (i === index) dot.classList.add('active');
  });

  // Show target chapter
  const chEl = document.getElementById(CHAPTERS[index].id);
  chEl.classList.remove('hidden');

  // Handle audio transitions
  if (index === 0 || index === 1) {
    stopRain();
  } else if (index === 2) {
    startRain();
  } else if (index === 3) {
    stopRain();
  } else if (index === 4) {
    stopRain();
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Init chapter if first visit
  const wasVisited = chEl.dataset.visited;
  if (!wasVisited) {
    chEl.dataset.visited = 'true';
    CHAPTERS[index].init();
  }

  currentChapter = index;
}

// Chapter nav dots
document.querySelectorAll('.chapter-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const idx = parseInt(dot.dataset.chapter);
    if (idx <= currentChapter || dot.classList.contains('done')) {
      showChapter(idx);
    }
  });
});

// ── LOADING SCREEN ───────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.style.display = 'none';
      document.getElementById('music-player').classList.remove('hidden');
      document.getElementById('chapter-nav').classList.remove('hidden');
      showChapter(0);
    }, 900);
  }, 1800);
});

// ════════════════════════════════════════════════════════════
// CHAPTER 1 — PEHLE (Dark, lonely, empty before her)
// ════════════════════════════════════════════════════════════
function initChapter1() {
  const cfg = BIRTHDAY_CONFIG.chapter1;

  // Typewriter effect
  const typewriterEl = document.getElementById('tw-line');
  const lines = [
    "Ek waqt tha...",
    "Zindagi bahut khali thi.",
    "Fir ek galti ho gayi.",
    "Aur sab kuch badal gaya. ❤️",
  ];
  let lineIdx = 0, charIdx = 0, isDeleting = false;

  function typeWriter() {
    const current = lines[lineIdx];
    if (!isDeleting) {
      typewriterEl.textContent = current.slice(0, ++charIdx);
      typewriterEl.classList.add('typewriter-cursor');
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(typeWriter, 1600);
        return;
      }
    } else {
      typewriterEl.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        isDeleting = false;
        lineIdx = (lineIdx + 1) % lines.length;
      }
    }
    setTimeout(typeWriter, isDeleting ? 45 : 75);
  }
  setTimeout(typeWriter, 1200);

  // Poem lines fade in
  const poemEl = document.getElementById('ch1-poem');
  setTimeout(() => {
    poemEl.style.opacity = '1';
    const lines = poemEl.querySelectorAll('p');
    lines.forEach((line, i) => {
      setTimeout(() => {
        line.style.opacity = '1';
        line.style.transition = 'opacity 0.8s ease';
      }, i * 500);
    });
  }, 1500);

  // Canvas: floating star particles
  const canvas = document.getElementById('ch1-canvas');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  for (let i = 0; i < 180; i++) {
    stars.push({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.5 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.008 + 0.002,
      phase: Math.random() * Math.PI * 2,
    });
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() / 1000;
    stars.forEach(s => {
      const a = 0.3 + 0.7 * Math.abs(Math.sin(s.phase + t * s.speed * 5));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 185, 255, ${a})`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }
  drawStars();

  // Rain
  createRain('rain1', 60, { minH: 10, maxH: 22, minDur: 1.2, maxDur: 2.2, opacity: 0.25 });

  // Floating particles (glowing dots)
  const ch1 = document.getElementById('ch1');
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 90 + 5}%;
      top: ${Math.random() * 90 + 5}%;
      background: rgba(${94 + Math.random()*50}, ${75 + Math.random()*50}, ${139 + Math.random()*50}, 0.7);
      animation-duration: ${3 + Math.random() * 4}s;
      animation-delay: ${Math.random() * 3}s;
      box-shadow: 0 0 ${size * 3}px rgba(94,75,139,0.5);
    `;
    ch1.appendChild(p);
  }

  // Begin button
  document.getElementById('begin-btn').addEventListener('click', () => {
    startMusic();
    gsap.to('#ch1', { opacity: 0, duration: 0.8, onComplete: () => showChapter(1) });
  });
}

// ════════════════════════════════════════════════════════════
// CHAPTER 2 — JAB TUM MILE (Golden, warm, memories)
// ════════════════════════════════════════════════════════════
function initChapter2() {
  const cfg = BIRTHDAY_CONFIG.chapter2;
  const grid = document.getElementById('memory-grid');
  const modal = document.getElementById('memory-modal');

  // Build memory cards
  cfg.memories.forEach((mem, i) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.style.animationDelay = `${0.3 + i * 0.1}s`;
    card.innerHTML = `
      <span class="memory-emoji">${mem.emoji}</span>
      <span class="memory-card-title">${mem.title}</span>
    `;
    card.addEventListener('click', () => openMemoryModal(mem));
    card.addEventListener('keypress', e => { if (e.key === 'Enter') openMemoryModal(mem); });
    grid.appendChild(card);
  });

  // Floating petals
  const petalsEl = document.getElementById('petals2');
  const petalEmojis = ['🌸', '✨', '🌼', '💛', '🍂', '⭐'];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      animation-duration: ${5 + Math.random() * 8}s;
      animation-delay: ${Math.random() * 6}s;
      font-size: ${0.7 + Math.random() * 0.8}rem;
    `;
    petalsEl.appendChild(p);
  }

  // Modal logic
  function openMemoryModal(mem) {
    const folder = mem.folder;
    const photos = BIRTHDAY_CONFIG.photos[folder] || [];
    const photo  = photos[Math.floor(Math.random() * photos.length)] || '';

    document.getElementById('modal-photo').src   = photo;
    document.getElementById('modal-photo').alt   = mem.title;
    document.getElementById('modal-title').textContent = mem.title;
    document.getElementById('modal-desc').textContent  = mem.description;
    document.getElementById('modal-photo').style.display = photo ? 'block' : 'none';

    modal.classList.remove('hidden');
    document.getElementById('letter-envelope') && void 0; // focus trap
    document.getElementById('modal-close').focus();

    // Mini confetti
    burstConfetti('modal-confetti', 20);
  }

  document.getElementById('modal-close').addEventListener('click', () => {
    modal.classList.add('hidden');
  });
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  // Next chapter button
  document.getElementById('ch2-next').addEventListener('click', () => {
    gsap.to('#ch2', { opacity: 0, duration: 0.7, onComplete: () => { document.getElementById('ch2').style.opacity = ''; showChapter(2); } });
  });
}

// ════════════════════════════════════════════════════════════
// CHAPTER 3 — BAARISH MEIN (Monsoon, cozy, love)
// ════════════════════════════════════════════════════════════
function initChapter3() {
  const cfg = BIRTHDAY_CONFIG.chapter3;

  // Rain memory text
  document.getElementById('rain-memory-text').textContent = cfg.mainMemory.description;

  // Heavy rain
  createRain('rain3', 100, { minH: 14, maxH: 30, minDur: 0.8, maxDur: 1.6, opacity: 0.45 });

  // Moments list (staggered reveal on scroll / intersection)
  const momentsList = document.getElementById('moments-list');
  cfg.moments.forEach((moment, i) => {
    const item = document.createElement('div');
    item.className = 'moment-item';
    item.style.transitionDelay = `${i * 0.12}s`;
    item.innerHTML = `<span class="moment-icon">${moment.icon}</span><span>${moment.text}</span>`;
    momentsList.appendChild(item);
  });

  // Trigger moments visible after delay
  setTimeout(() => {
    document.querySelectorAll('.moment-item').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 150);
    });
  }, 800);

  // Hearts — reasons I love you
  const heartsContainer = document.getElementById('hearts-container');
  const reasons = cfg.reasonsILoveYou;
  let revealed = 0;

  reasons.forEach((reason, i) => {
    const heart = document.createElement('div');
    heart.className = 'heart-bubble';
    heart.setAttribute('role', 'button');
    heart.setAttribute('tabindex', '0');
    heart.setAttribute('aria-label', `Heart ${i + 1} — tap to reveal`);
    heart.style.animationDuration = `${2 + Math.random() * 2}s`;
    heart.style.animationDelay    = `${Math.random() * 2}s`;
    heart.innerHTML = `
      ❤️
      <div class="heart-reason-tooltip">${reason}</div>
    `;
    heart.addEventListener('click', () => {
      if (!heart.classList.contains('revealed')) {
        heart.classList.add('revealed');
        heart.setAttribute('aria-label', reason);
        revealed++;
        updateHeartsProgress(revealed, reasons.length);
        // Tiny confetti burst
        burstConfetti('ch3', 8, { x: heart.getBoundingClientRect().left + 27, y: heart.getBoundingClientRect().top });
      }
    });
    heart.addEventListener('keypress', e => { if (e.key === 'Enter' || e.key === ' ') heart.click(); });
    heartsContainer.appendChild(heart);
  });

  updateHeartsProgress(0, reasons.length);

  // Next button
  document.getElementById('ch3-next').addEventListener('click', () => {
    gsap.to('#ch3', { opacity: 0, duration: 0.7, onComplete: () => { document.getElementById('ch3').style.opacity = ''; showChapter(3); } });
  });
}

function updateHeartsProgress(count, total) {
  const el = document.getElementById('hearts-progress');
  if (count === 0) {
    el.textContent = `${total} raazein hain — dhundhte jao...`;
  } else if (count === total) {
    el.textContent = `Sab ${total} raazein khul gayi! ❤️`;
    el.style.color = 'rgba(255,107,157,0.9)';
  } else {
    el.textContent = `${count} / ${total} raazein khuli...`;
  }
}

// ════════════════════════════════════════════════════════════
// CHAPTER 4 — JAB TUM GAYI (Dusk, distance, longing)
// ════════════════════════════════════════════════════════════
function initChapter4() {
  const cfg = BIRTHDAY_CONFIG.chapter4;

  // Description
  document.getElementById('ch4-desc').textContent = cfg.description;

  // Distance moments
  const distEl = document.getElementById('distance-moments');
  cfg.moments.forEach((m, i) => {
    const item = document.createElement('div');
    item.className = 'distance-item';
    item.style.animationDelay = `${0.6 + i * 0.35}s`;
    item.textContent = m;
    distEl.appendChild(item);
  });

  // Letter
  document.getElementById('distance-letter-text').textContent = cfg.letter;

  // Dust particles
  const dustEl = document.getElementById('dust4');
  for (let i = 0; i < 25; i++) {
    const d = document.createElement('div');
    d.className = 'dust';
    const size = Math.random() * 3 + 1;
    d.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      background: rgba(212,132,154,${0.2 + Math.random() * 0.3});
      animation-duration: ${4 + Math.random() * 5}s;
      animation-delay: ${Math.random() * 4}s;
    `;
    dustEl.appendChild(d);
  }

  // Next button
  document.getElementById('ch4-next').addEventListener('click', () => {
    gsap.to('#ch4', { opacity: 0, duration: 0.7, onComplete: () => { document.getElementById('ch4').style.opacity = ''; showChapter(4); } });
  });
}

// ════════════════════════════════════════════════════════════
// CHAPTER 5 — AAJ AUR HAMESHA (Sunrise, gold, future)
// ════════════════════════════════════════════════════════════
function initChapter5() {
  const cfg = BIRTHDAY_CONFIG.chapter5;

  // Anniversary tag
  document.getElementById('anni-tag').textContent = BIRTHDAY_CONFIG.anniversaryMessage;

  // Fireworks burst on chapter entry
  setTimeout(() => launchFireworks(), 600);
  setTimeout(() => launchFireworks(), 1100);
  setTimeout(() => launchFireworks(), 1700);

  // Aurora waves
  buildAurora();

  // Shooting stars
  setInterval(() => launchShootingStar(), 2500);

  // Canvas: galaxy particles
  const canvas = document.getElementById('ch5-canvas');
  const ctx = canvas.getContext('2d');
  function resizeC5() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeC5();
  window.addEventListener('resize', resizeC5);
  const galaxyParticles = [];
  for (let i = 0; i < 120; i++) {
    galaxyParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      alpha: Math.random(),
      color: Math.random() > 0.5 ? '139,111,255' : '245,200,66',
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.004 + 0.001,
    });
  }
  (function drawGalaxy() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() / 1000;
    galaxyParticles.forEach(p => {
      const a = 0.2 + 0.8 * Math.abs(Math.sin(p.phase + t * p.speed * 5));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${a})`;
      ctx.fill();
    });
    requestAnimationFrame(drawGalaxy);
  })();

  // Lanterns
  const lanternContainer = document.getElementById('lanterns');
  const lanternEmojis = ['🏮', '🪔', '✨', '⭐', '💫'];
  function spawnLantern() {
    const l = document.createElement('div');
    l.className = 'lantern';
    l.textContent = lanternEmojis[Math.floor(Math.random() * lanternEmojis.length)];
    l.style.cssText = `
      left: ${Math.random() * 90 + 5}%;
      bottom: -10px;
      animation-duration: ${6 + Math.random() * 6}s;
      animation-delay: 0s;
      font-size: ${1 + Math.random() * 0.8}rem;
    `;
    lanternContainer.appendChild(l);
    setTimeout(() => l.remove(), 13000);
  }
  spawnLantern();
  setInterval(spawnLantern, 1800);

  // Wishes bubbles
  const wishesContainer = document.getElementById('wishes-container');
  cfg.wishes.forEach((wish, i) => {
    const bubble = document.createElement('div');
    bubble.className = 'wish-bubble';
    bubble.textContent = wish;
    bubble.style.animationDelay = `${0.8 + i * 0.15}s`;
    wishesContainer.appendChild(bubble);
  });

  // Envelope → Letter reveal
  const envelope    = document.getElementById('letter-envelope');
  const fullLetter  = document.getElementById('full-letter');
  const letterContent = document.getElementById('letter-content');

  envelope.addEventListener('click', revealLetter);
  envelope.addEventListener('keypress', e => { if (e.key === 'Enter') revealLetter(); });

  function revealLetter() {
    envelope.classList.add('hidden');
    fullLetter.classList.remove('hidden');
    letterContent.textContent = cfg.endingLetter;
    fullLetter.style.opacity = '0';
    gsap.to(fullLetter, { opacity: 1, duration: 1, ease: 'power2.out' });

    // After letter fully visible, show closing block
    setTimeout(() => {
      const closing = document.getElementById('closing-block');
      document.getElementById('closing1').textContent = cfg.closingLine;
      document.getElementById('closing2').textContent = cfg.finalLine;
      closing.classList.remove('hidden');

      // Final fireworks celebration
      for (let i = 0; i < 5; i++) {
        setTimeout(() => launchFireworks(), i * 400);
      }
    }, 3500);
  }
}

// ── HELPER: RAIN GENERATOR ────────────────────────────────────
function createRain(containerId, count, opts = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  const { minH = 10, maxH = 25, minDur = 1, maxDur = 2, opacity = 0.35 } = opts;

  for (let i = 0; i < count; i++) {
    const drop = document.createElement('div');
    drop.className = 'raindrop';
    const h   = minH + Math.random() * (maxH - minH);
    const dur = minDur + Math.random() * (maxDur - minDur);
    drop.style.cssText = `
      left: ${Math.random() * 100}%;
      height: ${h}px;
      opacity: ${opacity * (0.5 + Math.random() * 0.5)};
      animation-duration: ${dur}s;
      animation-delay: ${Math.random() * dur}s;
    `;
    container.appendChild(drop);
  }
}

// ── HELPER: CONFETTI BURST ────────────────────────────────────
function burstConfetti(containerId, count = 20, pos = null) {
  let container;
  if (pos) {
    container = document.body;
  } else {
    container = document.getElementById(containerId);
    if (!container) return;
  }

  const colors = ['#ff6b9d', '#ffd700', '#52b788', '#8b6fff', '#f4a261', '#ff4444'];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const color = colors[Math.floor(Math.random() * colors.length)];
    const x = pos ? pos.x + (Math.random() - 0.5) * 60 : Math.random() * 80 + 10 + '%';
    const y = pos ? pos.y : '30%';

    if (pos) {
      piece.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        background: ${color};
        width: ${4 + Math.random() * 6}px;
        height: ${4 + Math.random() * 6}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation: confettiFall ${0.8 + Math.random() * 0.6}s ease forwards;
        z-index: 9000;
        pointer-events: none;
      `;
    } else {
      piece.style.cssText = `
        left: ${Math.random() * 100}%;
        top: 0;
        background: ${color};
        width: ${4 + Math.random() * 6}px;
        height: ${4 + Math.random() * 6}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation: confettiFall ${0.8 + Math.random() * 0.8}s ease forwards;
        animation-delay: ${Math.random() * 0.3}s;
      `;
    }
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 1500);
  }
}

// ── HELPER: AURORA BUILD ──────────────────────────────────────
function buildAurora() {
  const aurora = document.getElementById('aurora');
  const waves = [
    { color: 'rgba(91,39,230,0.35)', w: '80vw', h: '40vh', top: '5%', left: '10%', dur: '12s' },
    { color: 'rgba(0,200,150,0.25)', w: '70vw', h: '35vh', top: '15%', left: '20%', dur: '9s' },
    { color: 'rgba(200,100,255,0.2)', w: '60vw', h: '30vh', top: '10%', left: '30%', dur: '15s' },
  ];
  waves.forEach(w => {
    const div = document.createElement('div');
    div.className = 'aurora-wave';
    div.style.cssText = `
      width: ${w.w}; height: ${w.h};
      top: ${w.top}; left: ${w.left};
      background: ${w.color};
      animation-duration: ${w.dur};
    `;
    aurora.appendChild(div);
  });
}

// ── HELPER: FIREWORKS ─────────────────────────────────────────
function launchFireworks() {
  const container = document.getElementById('fireworks5');
  if (!container) return;

  const colors = ['#ffd700', '#ff6b9d', '#8b6fff', '#52b788', '#f4a261', '#ffffff'];
  const cx = 20 + Math.random() * 60; // % across
  const cy = 10 + Math.random() * 40; // % down

  for (let i = 0; i < 24; i++) {
    const spark = document.createElement('div');
    spark.className = 'firework-spark';
    const angle = (i / 24) * Math.PI * 2;
    const dist  = 40 + Math.random() * 60;
    spark.style.cssText = `
      left: ${cx}%;
      top: ${cy}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      --dx: ${Math.cos(angle) * dist}px;
      --dy: ${Math.sin(angle) * dist}px;
      animation-duration: ${0.5 + Math.random() * 0.4}s;
      width: ${2 + Math.random() * 3}px;
      height: ${2 + Math.random() * 3}px;
    `;
    container.appendChild(spark);
    setTimeout(() => spark.remove(), 1000);
  }
}

// ── HELPER: SHOOTING STAR ─────────────────────────────────────
function launchShootingStar() {
  const ch5 = document.getElementById('ch5');
  if (!ch5 || ch5.classList.contains('hidden')) return;

  const star = document.createElement('div');
  star.className = 'shooting-star';
  const startX = Math.random() * 60;
  const startY = Math.random() * 40;
  const len    = 80 + Math.random() * 120;
  star.style.cssText = `
    top: ${startY}%;
    left: ${startX}%;
    width: ${len}px;
    --dx: ${len * 1.5}px;
    --dy: ${len * 0.8}px;
    animation-duration: ${0.6 + Math.random() * 0.4}s;
  `;
  document.body.appendChild(star);
  setTimeout(() => star.remove(), 1200);
}

// ── TOUCH / SWIPE NAVIGATION ──────────────────────────────────
let touchStartX = 0, touchStartY = 0, touchStartTime = 0;

document.addEventListener('touchstart', e => {
  touchStartX    = e.changedTouches[0].screenX;
  touchStartY    = e.changedTouches[0].screenY;
  touchStartTime = Date.now();
}, { passive: true });

document.addEventListener('touchend', e => {
  if (Date.now() - touchStartTime > 600) return; // too slow — not a swipe
  const dx = e.changedTouches[0].screenX - touchStartX;
  const dy = e.changedTouches[0].screenY - touchStartY;
  if (Math.abs(dx) < Math.abs(dy)) return; // vertical scroll — ignore
  if (Math.abs(dx) < 50) return; // too short

  if (dx < 0 && currentChapter < CHAPTERS.length - 1) {
    // Swipe left → next chapter (only from chapter 1 beginning screen handled via button)
    // For chapters 2-4, next buttons handle progression
    // Allow swipe forward only if chapter has been "completed"
  }
  if (dx > 0 && currentChapter > 0) {
    // Swipe right → go back
    showChapter(currentChapter - 1);
  }
}, { passive: true });

// ── KEYBOARD NAVIGATION ───────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    if (currentChapter < CHAPTERS.length - 1) showChapter(currentChapter + 1);
  }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    if (currentChapter > 0) showChapter(currentChapter - 1);
  }
});
