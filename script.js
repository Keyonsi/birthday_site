/* ============================================================
   MONSOON DIARIES — Complete Script Engine
   ============================================================ */
'use strict';

// ── AUDIO SYSTEM ─────────────────────────────────────────────
const CHAPTER_AUDIO_IDS = ['music-ch1', 'music-ch2', 'music-ch3', 'music-ch4', 'music-ch5'];
let currentChapter = -1;
let currentAudio = null;
let bgMusicPlaying = false;

function getAudio(chIdx) {
  return document.getElementById(CHAPTER_AUDIO_IDS[chIdx]);
}

function fadeVolume(audio, target, ms, stopOnDone) {
  const steps = 20;
  const dt = ms / steps;
  const delta = (target - audio.volume) / steps;
  let n = 0;
  const t = setInterval(() => {
    audio.volume = Math.max(0, Math.min(1, audio.volume + delta));
    if (++n >= steps) {
      audio.volume = target;
      clearInterval(t);
      if (stopOnDone && target === 0) audio.pause();
    }
  }, dt);
}

function switchAudio(chIdx) {
  if (!bgMusicPlaying) return;
  const next = getAudio(chIdx);
  if (!next) return;
  if (currentAudio && currentAudio !== next) {
    fadeVolume(currentAudio, 0, 1200, true);
  }
  currentAudio = next;
  next.volume = 0;
  next.play().then(() => fadeVolume(next, 0.45, 1800, false))
    .catch(e => console.log('Audio blocked:', e));
}

// ── LOADER ────────────────────────────────────────────────────
(function initLoader() {
  const canvas = document.getElementById('loader-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  const particles = [];

  function resizeLoader() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeLoader();
  window.addEventListener('resize', resizeLoader);

  // Create floating pink hearts/sparkles on loader
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * 1,
      y: Math.random(),
      size: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 0.0015 + 0.0005,
      alpha: Math.random(),
      alphaDir: Math.random() > 0.5 ? 1 : -1,
      alphaSpeed: Math.random() * 0.008 + 0.003
    });
  }

  let loaderAnimId;
  function loaderLoop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.y -= p.speed;
      if (p.y < 0) { p.y = 1; p.x = Math.random(); }
      p.alpha += p.alphaDir * p.alphaSpeed;
      if (p.alpha > 1 || p.alpha < 0) p.alphaDir = -p.alphaDir;

      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,154,158,${Math.abs(p.alpha) * 0.5})`;
      ctx.fill();
    });
    loaderAnimId = requestAnimationFrame(loaderLoop);
  }
  loaderLoop();

  const loader = document.getElementById('loader');
  function startExperience() {
    cancelAnimationFrame(loaderAnimId);
    bgMusicPlaying = true;
    document.getElementById('music-icon').textContent = '❚❚';

    gsap.to('#loader', {
      opacity: 0, duration: 1, ease: 'power2.inOut',
      onComplete: () => {
        loader.style.display = 'none';
        document.getElementById('music-player').classList.remove('ui-hidden');
        document.getElementById('chapter-nav').classList.remove('ui-hidden');
        showChapter(0);
      }
    });
  }
  loader.addEventListener('click', startExperience);
  loader.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') startExperience(); });
})();

// ── MUSIC BUTTON ─────────────────────────────────────────────
document.getElementById('music-btn').addEventListener('click', () => {
  if (bgMusicPlaying) {
    if (currentAudio) fadeVolume(currentAudio, 0, 800, true);
    bgMusicPlaying = false;
    document.getElementById('music-icon').textContent = '▶';
  } else {
    bgMusicPlaying = true;
    document.getElementById('music-icon').textContent = '❚❚';
    if (currentChapter >= 0) switchAudio(currentChapter);
  }
});

// ── CHAPTER SYSTEM ────────────────────────────────────────────
const CHAPTER_IDS = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5'];
let animationFrameId = null;

document.querySelectorAll('.chapter-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const idx = parseInt(dot.dataset.chapter);
    if (idx <= currentChapter || dot.classList.contains('done')) {
      showChapter(idx);
    }
  });
});

function showChapter(idx) {
  // Cancel any running canvas loops
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  CHAPTER_IDS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (i === idx) {
      el.classList.remove('ch-hidden');
    } else {
      el.classList.add('ch-hidden');
    }
  });

  document.querySelectorAll('.chapter-dot').forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i < idx) dot.classList.add('done');
    if (i === idx) dot.classList.add('active');
  });

  currentChapter = idx;
  switchAudio(idx);

  // Chapter-specific init
  switch (idx) {
    case 0: initCh1(); break;
    case 1: initCh2(); break;
    case 2: initCh3(); break;
    case 3: initCh4(); break;
    case 4: initCh5(); break;
  }
}

// ═══════════════════════════════════════════════════════════
// CHAPTER 1 — PEHLE (Starfield + Shooting Stars)
// ═══════════════════════════════════════════════════════════
function initCh1() {
  const ch1cfg = BIRTHDAY_CONFIG.chapter1;

  // Description line
  document.getElementById('ch1-desc').textContent = ch1cfg.description;

  // Animated counter — counts up to counterDays
  const counterEl = document.getElementById('counter-num');
  const targetCount = ch1cfg.counterDays || 0;
  let counted = 0;
  const counterStep = Math.max(1, Math.round(targetCount / 40));
  const counterTimer = setInterval(() => {
    counted = Math.min(targetCount, counted + counterStep);
    counterEl.textContent = counted;
    if (counted >= targetCount) clearInterval(counterTimer);
  }, 30);

  // Memory fragments — soft cross-fading empty-day moments
  const fragWrap = document.getElementById('ch1-fragments');
  fragWrap.innerHTML = '';
  const fragments = ch1cfg.memoryFragments || [];
  fragments.forEach((f, i) => {
    const el = document.createElement('div');
    el.className = 'fragment-line';
    el.textContent = f;
    fragWrap.appendChild(el);
  });
  let fragIdx = 0;
  const fragEls = fragWrap.querySelectorAll('.fragment-line');
  function cycleFragments() {
    if (currentChapter !== 0 || !fragEls.length) return;
    fragEls.forEach(el => el.classList.remove('visible'));
    fragEls[fragIdx].classList.add('visible');
    fragIdx = (fragIdx + 1) % fragEls.length;
    setTimeout(cycleFragments, 2600);
  }
  setTimeout(cycleFragments, 600);

  // Ambient sound cue — music stays soft/sparse-feeling until "Tum mili" moment
  let volumeRaised = false;
  if (currentAudio && bgMusicPlaying) fadeVolume(currentAudio, 0.16, 1200, false);

  // Typewriter
  const tw = document.getElementById('tw');
  const lines = [
    "Ek waqt tha...",
    "Sab kuch boring aur khali tha.",
    "Par phir...",
    "Tum mili! ❤️"
  ];
  let lineIdx = 0, charIdx = 0, isDeleting = false;
  tw.textContent = "";

  function type() {
    if (currentChapter !== 0) return;
    const cur = lines[lineIdx];
    if (!isDeleting) {
      tw.textContent = cur.slice(0, ++charIdx);
      if (charIdx === cur.length) {
        if (lineIdx === 3 && !volumeRaised) {
          volumeRaised = true;
          if (currentAudio && bgMusicPlaying) fadeVolume(currentAudio, 0.45, 1800, false);
          document.getElementById('ch1').classList.add('color-bloom');
        }
        isDeleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      tw.textContent = cur.slice(0, --charIdx);
      if (charIdx === 0) {
        isDeleting = false;
        lineIdx = (lineIdx + 1) % lines.length;
      }
    }
    setTimeout(type, isDeleting ? 38 : 85);
  }
  setTimeout(type, 800);

  // Staggered poem line reveal — the last line ("Tab tum nahi the") dims the stars
  const poemLines = document.querySelectorAll('#poem p');
  let dimTarget = 1; // 1 = full brightness, lower = dimmed
  poemLines.forEach((p, i) => {
    setTimeout(() => {
      if (currentChapter !== 0) return;
      p.classList.add('visible');
      if (p.classList.contains('poem-emphasis')) {
        dimTarget = 0.45;
        setTimeout(() => { if (currentChapter === 0) startConstellation(); }, 2200);
      }
    }, 1800 + i * 900);
  });

  // Canvas: stars + occasional shooting star + constellation + parallax
  const canvas = document.getElementById('ch1-canvas');
  const ctx = canvas.getContext('2d');
  function resizeCh1() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCh1();
  window.addEventListener('resize', resizeCh1);

  // Regular stars
  const stars = Array.from({ length: 260 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.6 + 0.3,
    alpha: Math.random(),
    speed: (Math.random() * 0.015 + 0.004) * (Math.random() > 0.5 ? 1 : -1)
  }));

  // Parallax offset — follows pointer/touch, subtle
  let px = 0, py = 0, targetPx = 0, targetPy = 0;
  function handlePointer(e) {
    if (currentChapter !== 0) return;
    const point = e.touches ? e.touches[0] : e;
    targetPx = (point.clientX / window.innerWidth - 0.5) * 18;
    targetPy = (point.clientY / window.innerHeight - 0.5) * 18;
  }
  window.addEventListener('pointermove', handlePointer);
  window.addEventListener('touchmove', handlePointer, { passive: true });

  // Tap-to-wish: tap near a star, it sparkles and bursts
  canvas.addEventListener('click', e => {
    if (currentChapter !== 0) return;
    burstSpark(e.clientX, e.clientY);
  });

  // Shooting stars
  const shooters = [];
  function spawnShooter() {
    if (currentChapter !== 0) return;
    shooters.push({
      x: Math.random() * 0.6,
      y: Math.random() * 0.4,
      vx: (Math.random() * 0.004 + 0.003),
      vy: (Math.random() * 0.002 + 0.001),
      len: Math.random() * 0.08 + 0.04,
      alpha: 1,
      decay: Math.random() * 0.015 + 0.01
    });
    setTimeout(spawnShooter, 3500 + Math.random() * 4000);
  }
  setTimeout(spawnShooter, 2000);

  // Constellation — a small heart shape that quietly draws itself into the sky
  const heartPoints = [
    { x: 0.5, y: 0.16 }, { x: 0.44, y: 0.10 }, { x: 0.37, y: 0.09 }, { x: 0.31, y: 0.13 },
    { x: 0.30, y: 0.20 }, { x: 0.34, y: 0.27 }, { x: 0.43, y: 0.35 }, { x: 0.5, y: 0.43 },
    { x: 0.57, y: 0.35 }, { x: 0.66, y: 0.27 }, { x: 0.70, y: 0.20 }, { x: 0.69, y: 0.13 },
    { x: 0.63, y: 0.09 }, { x: 0.56, y: 0.10 }, { x: 0.5, y: 0.16 }
  ];
  let constellationProgress = 0; // how many segments drawn
  let constellationActive = false;
  function startConstellation() {
    if (constellationActive) return;
    constellationActive = true;
    document.getElementById('ch1-hint').classList.remove('ui-hidden');
    let seg = 0;
    const timer = setInterval(() => {
      seg++;
      constellationProgress = seg;
      if (seg >= heartPoints.length) {
        clearInterval(timer);
        document.getElementById('begin-btn').classList.add('intensify');
      }
    }, 130);
  }

  function loopCh1() {
    if (currentChapter !== 0) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const W = canvas.width, H = canvas.height;

    px += (targetPx - px) * 0.06;
    py += (targetPy - py) * 0.06;

    // Stars
    stars.forEach(s => {
      s.alpha = Math.max(0, Math.min(1, s.alpha + s.speed));
      if (s.alpha >= 1 || s.alpha <= 0) s.speed = -s.speed;
      ctx.beginPath();
      ctx.arc(s.x * W + px, s.y * H + py, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(210,205,255,${s.alpha * dimTarget})`;
      ctx.fill();
    });

    // Shooting stars
    for (let i = shooters.length - 1; i >= 0; i--) {
      const s = shooters[i];
      s.x += s.vx;
      s.y += s.vy;
      s.alpha -= s.decay;
      if (s.alpha <= 0) { shooters.splice(i, 1); continue; }

      const grd = ctx.createLinearGradient(
        s.x * W + px, s.y * H + py,
        (s.x - s.len) * W + px, (s.y - s.len / 2) * H + py
      );
      grd.addColorStop(0, `rgba(255,255,255,${s.alpha})`);
      grd.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.moveTo(s.x * W + px, s.y * H + py);
      ctx.lineTo((s.x - s.len) * W + px, (s.y - s.len / 2) * H + py);
      ctx.strokeStyle = grd;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Constellation — glowing connected points, drawn progressively
    if (constellationProgress > 0) {
      ctx.save();
      ctx.strokeStyle = 'rgba(200,170,255,0.5)';
      ctx.lineWidth = 1.2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(200,170,255,0.6)';
      ctx.beginPath();
      for (let i = 0; i < Math.min(constellationProgress, heartPoints.length); i++) {
        const pt = heartPoints[i];
        const cx = pt.x * W + px * 0.6, cy = pt.y * H + py * 0.6;
        if (i === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
      }
      ctx.stroke();
      for (let i = 0; i < Math.min(constellationProgress, heartPoints.length); i++) {
        const pt = heartPoints[i];
        const cx = pt.x * W + px * 0.6, cy = pt.y * H + py * 0.6;
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(230,210,255,0.9)';
        ctx.fill();
      }
      ctx.restore();
    }

    animationFrameId = requestAnimationFrame(loopCh1);
  }
  loopCh1();

  createRain('rain1', 45);

  document.getElementById('begin-btn').onclick = () => showChapter(1);
}

// ═══════════════════════════════════════════════════════════
// CHAPTER 2 — TERI KAHANI (Full-Screen Photo Journey)
// ═══════════════════════════════════════════════════════════
const ERAS = BIRTHDAY_CONFIG.eras;
let eraIdx = 0;
let photoIdx = 0;
let photoCounts = {};  // era folder -> count
let kenBurnsToggle = false;
let photoJourneyEnded = false;

// Discover actual photo counts by trying to load images
function buildPhotoList(era) {
  // Use the configured counts, try images 1..N
  const count = (BIRTHDAY_CONFIG.photoCounts && BIRTHDAY_CONFIG.photoCounts[era.folder]) || 2;
  const list = [];
  for (let i = 1; i <= count; i++) {
    list.push(`images/${era.folder}/${i}.jpg`);
  }
  return list;
}

function getPhotoList(era) {
  if (!photoCounts[era.folder]) {
    photoCounts[era.folder] = buildPhotoList(era);
  }
  return photoCounts[era.folder];
}

function updateEraOverlay(era) {
  document.getElementById('era-emoji-fs').textContent = era.emoji;
  document.getElementById('era-name-fs').textContent = era.name;
  document.getElementById('era-desc-fs').textContent = era.desc;

  // Era dots
  const dotsEl = document.getElementById('era-dots');
  dotsEl.innerHTML = '';
  ERAS.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = `era-dot${i < eraIdx ? ' done' : i === eraIdx ? ' active' : ''}`;
    dotsEl.appendChild(d);
  });
}

function loadPhoto(path, isAlt) {
  const layerA = document.getElementById('photo-layer-a');
  const layerB = document.getElementById('photo-layer-b');

  kenBurnsToggle = !kenBurnsToggle;

  if (layerA.classList.contains('active')) {
    // Switch to B
    layerB.style.backgroundImage = `url('${path}')`;
    layerB.className = `photo-layer active${kenBurnsToggle ? ' kb-alt' : ''}`;
    // Force reflow to restart animation
    void layerB.offsetWidth;
    layerA.className = 'photo-layer';
  } else {
    layerA.style.backgroundImage = `url('${path}')`;
    layerA.className = `photo-layer active${kenBurnsToggle ? ' kb-alt' : ''}`;
    void layerA.offsetWidth;
    layerB.className = 'photo-layer';
  }

  // Update counter
  const photos = getPhotoList(ERAS[eraIdx]);
  document.getElementById('photo-counter').textContent = `${photoIdx + 1} / ${photos.length}`;
}

function advanceJourney() {
  const dreamFrame = document.getElementById('dream-frame');

  // If dream frame is showing, close it and go to next chapter (regardless of photoJourneyEnded state)
  if (!dreamFrame.classList.contains('ui-hidden')) {
    dreamFrame.classList.add('ui-hidden');
    showChapter(2);
    return;
  }

  if (photoJourneyEnded) return;

  const era = ERAS[eraIdx];
  const photos = getPhotoList(era);
  photoIdx++;

  if (photoIdx >= photos.length) {
    // Move to next era
    photoIdx = 0;
    eraIdx++;

    if (eraIdx >= ERAS.length) {
      // All eras done — show dream frame
      photoJourneyEnded = true;
      setTimeout(() => {
        dreamFrame.classList.remove('ui-hidden');
        document.getElementById('ps-tap-hint').classList.add('ui-hidden');
      }, 300);
      return;
    }

    updateEraOverlay(ERAS[eraIdx]);
  }

  loadPhoto(getPhotoList(ERAS[eraIdx])[photoIdx], kenBurnsToggle);
}

function initCh2() {
  eraIdx = 0;
  photoIdx = 0;
  photoJourneyEnded = false;
  photoCounts = {}; // reset cache

  // Load first photo of first era
  updateEraOverlay(ERAS[0]);
  const firstEra = ERAS[0];
  const firstPhotos = getPhotoList(firstEra);
  loadPhoto(firstPhotos[0], false);
  document.getElementById('photo-counter').textContent = `1 / ${firstPhotos.length}`;
  document.getElementById('ps-tap-hint').classList.remove('ui-hidden');

  // Tap to advance
  const ch2 = document.getElementById('ch2');
  ch2.onclick = advanceJourney;

  // Mood particle canvas — changes color per era
  const canvas = document.getElementById('ps-canvas');
  const ctx = canvas.getContext('2d');
  function resizeCh2() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCh2();

  const moodColors = {
    pink: [255, 182, 193],
    gold: [255, 215, 100],
    purple: [196, 123, 255],
    rose: [255, 107, 157],
    warm: [255, 162, 100]
  };

  function getMoodColor() {
    const era = ERAS[Math.min(eraIdx, ERAS.length - 1)];
    return moodColors[era.mood] || [255, 182, 193];
  }

  const particles = Array.from({ length: 40 }, () => ({
    x: Math.random(),
    y: Math.random() + 0.5,  // start below
    r: Math.random() * 3 + 1,
    vy: -(Math.random() * 0.0012 + 0.0003),
    vx: (Math.random() - 0.5) * 0.0005,
    alpha: Math.random() * 0.4 + 0.1
  }));

  function loopCh2() {
    if (currentChapter !== 1) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const W = canvas.width, H = canvas.height;
    const [r, g, b] = getMoodColor();

    particles.forEach(p => {
      p.y += p.vy;
      p.x += p.vx;
      if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
      if (p.x < 0 || p.x > 1) p.vx = -p.vx;

      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha * 0.4})`;
      ctx.fill();
    });
    animationFrameId = requestAnimationFrame(loopCh2);
  }
  loopCh2();
}

// ═══════════════════════════════════════════════════════════
// CHAPTER 3 — BAARISH MEIN (Hearts + Fireflies + Rain)
// ═══════════════════════════════════════════════════════════
let activeHearts = [];

function initCh3() {
  const cfg = BIRTHDAY_CONFIG.chapter3;
  document.getElementById('rain-text').textContent = cfg.mainMemory.description;

  // Shayari lines (animated, staggered)
  const shayariWrap = document.querySelector('.rain-shayari');
  if (shayariWrap && cfg.mainMemory.shayari) {
    shayariWrap.innerHTML = cfg.mainMemory.shayari.map(l => `<p>${l}</p>`).join('');
  }

  // ── PART 1: Quiz game ─────────────────────────────────────
  runQuiz(cfg);

  // ── PART 2 setup happens after quiz completes (see revealHeartsSection) ──

  // Modal setup
  const modal = document.getElementById('heart-popup');
  document.getElementById('heart-popup-close').onclick = () => modal.classList.add('ui-hidden');

  // Firefly canvas
  const canvas = document.getElementById('ch3-canvas');
  const ctx = canvas.getContext('2d');
  function resizeCh3() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCh3();

  const flies = Array.from({ length: 30 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 2.5 + 1,
    angle: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.003 + 0.001,
    alpha: Math.random()
  }));

  // Monsoon drops on ch3 canvas
  const drops = Array.from({ length: 80 }, () => ({
    x: Math.random(),
    y: Math.random(),
    len: Math.random() * 0.06 + 0.02,
    speed: Math.random() * 0.006 + 0.003,
    alpha: Math.random() * 0.25 + 0.05
  }));

  // Garden petals — slow drifting, gentle sway
  const petals = Array.from({ length: 14 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 3 + 2.5,
    vy: Math.random() * 0.00035 + 0.00015,
    sway: Math.random() * 200,
    swaySpeed: 0.006 + Math.random() * 0.006,
    swayAmp: 0.015 + Math.random() * 0.015,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.01,
    hue: Math.random() > 0.5 ? '255,182,193' : '212,237,218'
  }));

  function loopCh3() {
    if (currentChapter !== 2) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const W = canvas.width, H = canvas.height;

    // Rain drops
    drops.forEach(d => {
      d.y += d.speed;
      if (d.y > 1.05) { d.y = -0.05; d.x = Math.random(); }
      ctx.beginPath();
      ctx.moveTo(d.x * W, d.y * H);
      ctx.lineTo(d.x * W + W * 0.004, (d.y + d.len) * H);
      ctx.strokeStyle = `rgba(174,220,180,${d.alpha})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });

    // Garden petals — drifting down with a gentle sway and rotation
    petals.forEach(p => {
      p.sway += p.swaySpeed;
      p.y += p.vy;
      p.rot += p.rotSpeed;
      if (p.y > 1.05) { p.y = -0.05; p.x = Math.random(); }
      const px = (p.x + Math.sin(p.sway) * p.swayAmp) * W;
      const py = p.y * H;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(p.rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue},0.35)`;
      ctx.fill();
      ctx.restore();
    });

    // Fireflies
    flies.forEach(f => {
      f.angle += (Math.random() - 0.5) * 0.15;
      f.x = Math.max(0, Math.min(1, f.x + Math.cos(f.angle) * f.speed));
      f.y = Math.max(0, Math.min(1, f.y + Math.sin(f.angle) * f.speed));
      f.alpha = 0.4 + Math.random() * 0.6;
      ctx.beginPath();
      ctx.arc(f.x * W, f.y * H, f.r, 0, Math.PI * 2);
      const glow = ctx.createRadialGradient(f.x * W, f.y * H, 0, f.x * W, f.y * H, f.r * 4);
      glow.addColorStop(0, `rgba(244,220,80,${f.alpha})`);
      glow.addColorStop(1, 'rgba(244,162,97,0)');
      ctx.fillStyle = glow;
      ctx.fill();
    });

    animationFrameId = requestAnimationFrame(loopCh3);
  }
  loopCh3();

  createRain('rain3', 80);
  document.getElementById('ch3-next').onclick = () => showChapter(3);
}

// ── QUIZ GAME (Part 1) ──────────────────────────────────────
function runQuiz(cfg) {
  const questions = cfg.quiz;
  const scores = {};
  let qIdx = 0;

  const stepEl = document.getElementById('quiz-step');
  const barEl = document.getElementById('quiz-progress-bar');
  const cardEl = document.getElementById('quiz-question-card');

  function renderQuestion() {
    const q = questions[qIdx];
    stepEl.textContent = `Sawal ${qIdx + 1} / ${questions.length}`;
    barEl.style.width = `${((qIdx) / questions.length) * 100 + (100 / questions.length) * 0.15}%`;

    cardEl.classList.remove('leaving');
    cardEl.innerHTML = `
      <p class="quiz-q-text">${q.q}</p>
      <div class="quiz-options">
        ${q.options.map((o, i) => `
          <button class="quiz-option" data-idx="${i}" style="animation-delay:${i * 0.06}s">
            <span class="quiz-option-icon">${o.icon}</span><span>${o.text}</span>
          </button>
        `).join('')}
      </div>
    `;

    cardEl.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (cardEl.classList.contains('leaving')) return;
        const opt = q.options[parseInt(btn.dataset.idx)];
        btn.classList.add('chosen');
        scores[opt.tag] = (scores[opt.tag] || 0) + 1;
        barEl.style.width = `${((qIdx + 1) / questions.length) * 100}%`;

        setTimeout(() => {
          cardEl.classList.add('leaving');
          setTimeout(() => {
            qIdx++;
            if (qIdx < questions.length) {
              renderQuestion();
            } else {
              finishQuiz(cfg, scores);
            }
          }, 250);
        }, 280);
      });
    });
  }

  renderQuestion();
}

function finishQuiz(cfg, scores) {
  document.getElementById('quiz-wrap').classList.add('ui-hidden');

  // Rank tags by score, take top 3, map each to its moment
  const rankedTags = Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([tag]) => tag);
  const usedTags = new Set();
  const topMoments = [];
  rankedTags.forEach(tag => {
    if (topMoments.length >= 3) return;
    const moment = cfg.moments.find(m => m.tag === tag && !usedTags.has(m.tag));
    if (moment) { topMoments.push(moment); usedTags.add(tag); }
  });
  // Fallback: fill from remaining moments if fewer than 3 tags scored
  cfg.moments.forEach(m => {
    if (topMoments.length < 3 && !topMoments.includes(m)) topMoments.push(m);
  });

  const resultWrap = document.getElementById('quiz-result');
  const cardsWrap = document.getElementById('result-cards');
  cardsWrap.innerHTML = topMoments.slice(0, 3).map(m => `
    <div class="result-card">
      <span class="result-card-icon">${m.icon}</span>
      <span>${m.text}</span>
    </div>
  `).join('');
  resultWrap.classList.remove('ui-hidden');

  setTimeout(revealHeartsSection, 1800);
}

function revealHeartsSection() {
  const heartsWrap = document.getElementById('hearts-section');
  heartsWrap.classList.remove('ui-hidden');
  heartsWrap.innerHTML = `
    <p class="hearts-hint">❤️ Udte hue dil ko pakdo, raaz khulengi...</p>
    <div class="hearts-wrap" id="hearts-wrap" aria-label="Reasons I love you"></div>
    <p class="hearts-count" id="hearts-count" aria-live="polite"></p>
  `;
  initHearts();
}

// ── HEARTS (Part 2) ─────────────────────────────────────────
function initHearts() {
  const cfg = BIRTHDAY_CONFIG.chapter3;
  const modal = document.getElementById('heart-popup');
  const wrap = document.getElementById('hearts-wrap');
  wrap.innerHTML = '';
  activeHearts = [];
  let revealed = 0;

  cfg.reasonsILoveYou.forEach((reason, i) => {
    const bubble = document.createElement('div');
    bubble.className = 'heart-bubble';
    bubble.innerHTML = '❤️';

    const hData = {
      el: bubble,
      x: 10 + Math.random() * 75,
      y: 60 + Math.random() * 150,
      speed: Math.random() * 0.7 + 0.3,
      wobble: Math.random() * 200,
      wobbleAmp: 8 + Math.random() * 10,
      wobbleSpeed: 0.008 + Math.random() * 0.012,
      reason: reason.text,
      emoji: reason.emoji,
      done: false
    };

    bubble.addEventListener('click', e => {
      e.stopPropagation();
      if (!hData.done) {
        hData.done = true;
        revealed++;
        document.getElementById('hearts-count').textContent =
          `${revealed} / ${cfg.reasonsILoveYou.length} raazein khuli...`;

        // Detach the heart from its confined box and let it fly free across the screen
        const rect = bubble.getBoundingClientRect();
        bubble.classList.add('flying', 'wink');
        bubble.innerHTML = hData.emoji;
        bubble.style.left = `${rect.left}px`;
        bubble.style.top = `${rect.top}px`;

        burstEmojiEffect(e.clientX, e.clientY, hData.emoji);

        requestAnimationFrame(() => {
          bubble.style.left = `${window.innerWidth / 2 - 30}px`;
          bubble.style.top = `${window.innerHeight * 0.28}px`;
        });

        setTimeout(() => {
          document.getElementById('heart-popup-icon').textContent = hData.emoji;
          document.getElementById('heart-popup-msg').textContent = hData.reason;
          modal.classList.remove('ui-hidden');
          bubble.classList.add('fading');
          setTimeout(() => bubble.remove(), 650);
        }, 500);
      } else {
        document.getElementById('heart-popup-icon').textContent = hData.emoji;
        document.getElementById('heart-popup-msg').textContent = hData.reason;
        modal.classList.remove('ui-hidden');
      }
    });

    wrap.appendChild(bubble);
    activeHearts.push(hData);
  });

  document.getElementById('hearts-count').textContent =
    `0 / ${cfg.reasonsILoveYou.length} raazein khuli...`;

  // Float animation loop
  function floatHearts() {
    if (currentChapter !== 2) return;
    activeHearts.forEach(h => {
      if (h.el.classList.contains('flying')) return;
      h.wobble += h.wobbleSpeed;
      h.y -= h.speed * 0.4;
      const curX = h.x + Math.sin(h.wobble) * h.wobbleAmp;
      h.el.style.left = `${curX}%`;
      h.el.style.top = `${h.y}px`;
      if (h.y < -55) {
        h.y = 270;
        h.x = 10 + Math.random() * 75;
      }
    });
    requestAnimationFrame(floatHearts);
  }
  floatHearts();
}

function burstEmojiEffect(cx, cy, emoji) {
  for (let i = 0; i < 8; i++) {
    const s = document.createElement('div');
    s.className = 'emoji-burst';
    s.textContent = emoji;
    s.style.left = `${cx}px`;
    s.style.top = `${cy}px`;
    const angle = Math.random() * Math.PI * 2;
    const dist = 30 + Math.random() * 60;
    s.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    s.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    s.style.setProperty('--rot', `${(Math.random() - 0.5) * 120}deg`);
    s.style.animationDelay = `${i * 0.03}s`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1300);
  }
}

// ═══════════════════════════════════════════════════════════
// CHAPTER 4 — DOORI (Dust + Longing)
// ═══════════════════════════════════════════════════════════
function initCh4() {
  const cfg = BIRTHDAY_CONFIG.chapter4;
  document.getElementById('ch4-desc').textContent = cfg.description;
  document.getElementById('letter-text').textContent = cfg.letter;

  const distWrap = document.getElementById('dist-moments');
  distWrap.innerHTML = '';
  cfg.moments.forEach((m, i) => {
    const item = document.createElement('div');
    item.className = 'dist-item';
    item.style.animationDelay = `${i * 0.12}s`;
    item.textContent = m;
    distWrap.appendChild(item);
  });

  const canvas = document.getElementById('ch4-canvas');
  const ctx = canvas.getContext('2d');
  function resizeCh4() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCh4();

  // Dust motes + slow falling petals
  const dust = Array.from({ length: 45 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.8 + 0.3,
    alpha: Math.random() * 0.35 + 0.05,
    alphaDir: Math.random() > 0.5 ? 1 : -1,
    alphaSpeed: Math.random() * 0.005 + 0.001,
    vy: Math.random() * 0.0006 + 0.0001,
    vx: (Math.random() - 0.5) * 0.0002
  }));

  // Longing orbs (slow, hazy circles)
  const orbs = Array.from({ length: 5 }, () => ({
    x: Math.random(), y: Math.random(),
    r: 30 + Math.random() * 60,
    alpha: 0.02 + Math.random() * 0.04,
    vx: (Math.random() - 0.5) * 0.0003,
    vy: (Math.random() - 0.5) * 0.0002
  }));

  function loopCh4() {
    if (currentChapter !== 3) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const W = canvas.width, H = canvas.height;

    // Hazy orbs
    orbs.forEach(o => {
      o.x = Math.max(0, Math.min(1, o.x + o.vx));
      o.y = Math.max(0, Math.min(1, o.y + o.vy));
      if (o.x <= 0 || o.x >= 1) o.vx = -o.vx;
      if (o.y <= 0 || o.y >= 1) o.vy = -o.vy;
      const grd = ctx.createRadialGradient(o.x * W, o.y * H, 0, o.x * W, o.y * H, o.r);
      grd.addColorStop(0, `rgba(212,132,154,${o.alpha})`);
      grd.addColorStop(1, 'rgba(212,132,154,0)');
      ctx.beginPath();
      ctx.arc(o.x * W, o.y * H, o.r, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    });

    // Dust motes
    dust.forEach(d => {
      d.x = Math.max(0, Math.min(1, d.x + d.vx));
      d.y += d.vy;
      if (d.y > 1.02) { d.y = -0.02; d.x = Math.random(); }
      d.alpha += d.alphaDir * d.alphaSpeed;
      if (d.alpha > 0.45 || d.alpha < 0.03) d.alphaDir = -d.alphaDir;

      ctx.beginPath();
      ctx.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240,210,200,${d.alpha})`;
      ctx.fill();
    });

    animationFrameId = requestAnimationFrame(loopCh4);
  }
  loopCh4();

  document.getElementById('ch4-next').onclick = () => showChapter(4);
}

// ═══════════════════════════════════════════════════════════
// CHAPTER 5 — AAJ AUR HAMESHA (Celebration)
// ═══════════════════════════════════════════════════════════
function initCh5() {
  const cfg = BIRTHDAY_CONFIG.chapter5;
  document.getElementById('bday-name').textContent = BIRTHDAY_CONFIG.name;
  document.getElementById('anni-tag').textContent = BIRTHDAY_CONFIG.anniversaryMessage;

  const wishesWrap = document.getElementById('wishes-wrap');
  wishesWrap.innerHTML = '';
  cfg.wishes.forEach((w, i) => {
    const b = document.createElement('div');
    b.className = 'wish-bubble';
    b.style.animationDelay = `${i * 0.1}s`;
    b.textContent = w;
    wishesWrap.appendChild(b);
  });

  const envelope = document.getElementById('envelope');
  const fullLetter = document.getElementById('full-letter');
  envelope.onclick = () => {
    envelope.classList.add('ui-hidden');
    fullLetter.classList.remove('ui-hidden');
    document.getElementById('letter-body-ch5').textContent = cfg.endingLetter;
    setTimeout(() => {
      document.getElementById('close1').textContent = cfg.closingLine;
      document.getElementById('close2').textContent = cfg.finalLine;
      document.getElementById('closing').classList.remove('ui-hidden');
      launchFireworks();
    }, 2200);
  };

  // Sky stars canvas
  const canvas = document.getElementById('ch5-canvas');
  const ctx = canvas.getContext('2d');
  function resizeCh5() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCh5();

  const stars = Array.from({ length: 60 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.6,
    alpha: Math.random(),
    speed: (Math.random() * 0.012 + 0.003) * (Math.random() > 0.5 ? 1 : -1)
  }));

  function loopCh5() {
    if (currentChapter !== 4) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const W = canvas.width, H = canvas.height;
    stars.forEach(s => {
      s.alpha += s.speed;
      if (s.alpha >= 1 || s.alpha <= 0) s.speed = -s.speed;
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,215,0,${Math.abs(s.alpha) * 0.7})`;
      ctx.fill();
    });
    animationFrameId = requestAnimationFrame(loopCh5);
  }
  loopCh5();

  createLanterns();
  launchFireworks();
}

// ── UTILITIES ────────────────────────────────────────────────

function createRain(id, count) {
  const wrap = document.getElementById(id);
  if (!wrap) return;
  wrap.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const drop = document.createElement('div');
    drop.className = 'drop';
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.height = `${14 + Math.random() * 20}px`;
    drop.style.animationDuration = `${0.65 + Math.random() * 0.85}s`;
    drop.style.animationDelay = `${Math.random() * 1.8}s`;
    wrap.appendChild(drop);
  }
}

function createLanterns() {
  const container = document.getElementById('lanterns');
  if (!container) return;
  container.innerHTML = '';
  const items = ['🏮', '🪔', '✨', '💛', '🌟', '🎇'];
  const spawn = () => {
    if (currentChapter !== 4) return;
    const l = document.createElement('div');
    l.className = 'lantern';
    l.textContent = items[Math.floor(Math.random() * items.length)];
    l.style.left = `${Math.random() * 88 + 6}%`;
    l.style.fontSize = `${1 + Math.random() * 0.8}rem`;
    const dur = 8 + Math.random() * 7;
    l.style.animationDuration = `${dur}s`;
    container.appendChild(l);
    setTimeout(() => l.remove(), dur * 1000);
    setTimeout(spawn, 1200 + Math.random() * 1500);
  };
  setTimeout(spawn, 500);
}

function launchFireworks() {
  for (let i = 0; i < 6; i++) {
    setTimeout(singleFirework, i * 350);
  }
}

function singleFirework() {
  const container = document.getElementById('fw5');
  if (!container) return;
  const x = Math.random() * 80 + 10;
  const y = Math.random() * 45 + 5;
  const colors = ['#ffd700', '#ff6b9d', '#8b6fff', '#52b788', '#f4a261', '#fff'];
  const count = 22;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    s.style.left = `${x}%`;
    s.style.top = `${y}%`;
    s.style.background = colors[Math.floor(Math.random() * colors.length)];
    const angle = (i / count) * Math.PI * 2;
    const dist = 35 + Math.random() * 55;
    s.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    s.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    s.style.animationDuration = `${0.65 + Math.random() * 0.5}s`;
    container.appendChild(s);
    setTimeout(() => s.remove(), 1200);
  }
}

function burstSpark(cx, cy) {
  const colors = ['#ff6b9d', '#ffd700', '#8b6fff', '#fff'];
  for (let i = 0; i < 12; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    s.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;z-index:9999;`;
    s.style.background = colors[Math.floor(Math.random() * colors.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = 25 + Math.random() * 40;
    s.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    s.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    s.style.animationDuration = `${0.5 + Math.random() * 0.35}s`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 900);
  }
}