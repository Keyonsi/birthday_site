/* ============================================================
   MONSOON DIARIES — Linear Cinematic Engine v1.0.3
   Decoy (flip card + fireworks + countdown) →
   Reveal → Gate →
   Intro (safar + preload) →
   Cinema (photos) →
   Moments (full-screen canvas clouds + moon + lightning) →
   Hearts (big SVG heart fill + floating) →
   Proposal → Candles → Finale
   ============================================================ */
'use strict';

// ══════════════════════════════════════════════════════════════════
// AUDIO
// ══════════════════════════════════════════════════════════════════
let currentAudio = null;
let bgMusicPlaying = false;

function fadeVol(audio, target, ms, stopOnDone) {
  const steps = 20, dt = ms / steps, delta = (target - audio.volume) / steps;
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

function playTrack(id, vol = 0.45) {
  if (!bgMusicPlaying) return;
  const next = document.getElementById(id);
  if (!next) return;
  if (currentAudio && currentAudio !== next) fadeVol(currentAudio, 0, 900, true);
  const isSame = (currentAudio === next);
  currentAudio = next;
  if (!isSame) {
    next.volume = 0;
    next.play().then(() => fadeVol(next, vol, 1500, false)).catch(() => { });
  } else {
    fadeVol(next, vol, 1500, false);
  }
}

document.getElementById('music-btn').addEventListener('click', () => {
  const icon = document.getElementById('music-icon');
  if (bgMusicPlaying) {
    bgMusicPlaying = false;
    if (currentAudio) fadeVol(currentAudio, 0, 600, true);
    icon.textContent = '▶';
  } else {
    bgMusicPlaying = true;
    icon.textContent = '❚❚';
    if (currentAudio) currentAudio.play().then(() => fadeVol(currentAudio, 0.45, 600, false)).catch(() => { });
  }
});

// Web Audio — rain noise
let audioCtx = null;
let rainNode = null;
function getACtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function startRainSound(vol = 0.04) {
  try {
    const ctx = getACtx();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1800;
    const gain = ctx.createGain(); gain.gain.value = vol;
    src.connect(lp); lp.connect(gain); gain.connect(ctx.destination);
    src.start();
    rainNode = { src, gain };
  } catch (e) { }
}
function stopRainSound() {
  if (!rainNode) return;
  try { rainNode.gain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.5); } catch (e) { }
  setTimeout(() => { try { rainNode.src.stop(); } catch (e) { } rainNode = null; }, 1500);
}

// Synth SFX
function sfxPlay(type) {
  try {
    const ctx = getACtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    if (type === 'candle') {
      osc.type = 'sine'; osc.frequency.value = 880;
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.18);
      gain.gain.value = 0.15;
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now); osc.stop(now + 0.25);
    } else if (type === 'chime') {
      osc.type = 'sine'; osc.frequency.value = 1320;
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.3);
      gain.gain.value = 0.12;
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now); osc.stop(now + 0.4);
    } else if (type === 'thunder') {
      osc.type = 'sawtooth'; osc.frequency.value = 120;
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);
      gain.gain.value = 0.25;
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      osc.start(now); osc.stop(now + 0.45);
    } else if (type === 'allBlown') {
      [440, 554, 659, 880].forEach((f, i) => {
        const o2 = ctx.createOscillator(), g2 = ctx.createGain();
        o2.connect(g2); g2.connect(ctx.destination);
        o2.type = 'sine'; o2.frequency.value = f;
        g2.gain.value = 0.1;
        g2.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
        o2.start(now + i * 0.1); o2.stop(now + i * 0.12 + 0.4);
      });
    }
  } catch (e) { }
}

// ══════════════════════════════════════════════════════════════════
// TRANSITIONS
// ══════════════════════════════════════════════════════════════════
function fadeToBlack(ms = 700) {
  return new Promise(resolve => {
    const ov = document.getElementById('act-transition');
    ov.classList.remove('ui-hidden');
    gsap.to(ov, { opacity: 1, duration: ms / 1000, ease: 'power2.inOut', onComplete: resolve });
  });
}
function fadeFromBlack(ms = 900) {
  return new Promise(resolve => {
    const ov = document.getElementById('act-transition');
    gsap.to(ov, {
      opacity: 0, duration: ms / 1000, ease: 'power2.inOut',
      onComplete: () => { ov.classList.add('ui-hidden'); resolve(); }
    });
  });
}
async function switchAct(fromId, toId, cb) {
  await fadeToBlack();
  document.querySelectorAll('.act').forEach(a => a.classList.add('ui-hidden'));
  if (toId) document.getElementById(toId).classList.remove('ui-hidden');
  if (cb) cb();
  await fadeFromBlack();
}

// ══════════════════════════════════════════════════════════════════
// SPARKS & LIGHTNING BOLT PROCEDURAL ENGINE
// ══════════════════════════════════════════════════════════════════
function burstSpark(cx, cy, count = 10) {
  const colors = ['#ff6b9d', '#ffd700', '#c47bff', '#52b788', '#fff', '#ff9a9e'];
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    s.style.cssText = `left:${cx}px;top:${cy}px;position:fixed;`;
    s.style.background = colors[i % colors.length];
    const angle = Math.random() * Math.PI * 2;
    const dist = 30 + Math.random() * 55;
    s.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    s.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    s.style.setProperty('--dur', `${0.4 + Math.random() * 0.35}s`);
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 800);
  }
}

function drawLightningBolt(startX, startY, endX, endY) {
  const cv = document.getElementById('lightning-canvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  cv.width = window.innerWidth;
  cv.height = window.innerHeight;

  const points = [];
  let currX = startX, currY = startY;
  points.push({ x: currX, y: currY });

  const steps = 18;
  const dx = (endX - startX) / steps;
  const dy = (endY - startY) / steps;

  for (let i = 0; i < steps; i++) {
    currX += dx + (Math.random() - 0.5) * 35;
    currY += dy + (Math.random() - 0.5) * 20;
    points.push({ x: currX, y: currY });
  }
  points.push({ x: endX, y: endY });

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#52b788';
  ctx.shadowBlur = 25;
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#e0ffff';
  ctx.stroke();
  ctx.restore();

  gsap.to(cv, {
    opacity: 0, duration: 0.35,
    onComplete: () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      cv.style.opacity = '1';
    }
  });
}

// ══════════════════════════════════════════════════════════════════
// RAIN DROPS
// ══════════════════════════════════════════════════════════════════
function createRain(id, count = 110, color = 'rgba(174,220,180,0.3)') {
  const wrap = document.getElementById(id);
  if (!wrap) return;
  wrap.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const d = document.createElement('div');
    d.className = 'drop';
    const isForeground = Math.random() > 0.55;
    d.style.left = `${Math.random() * 100}%`;
    d.style.height = isForeground ? `${20 + Math.random() * 26}px` : `${10 + Math.random() * 16}px`;
    d.style.width = isForeground ? '2.4px' : '1.4px';
    d.style.opacity = isForeground ? `${0.22 + Math.random() * 0.28}` : `${0.08 + Math.random() * 0.14}`;
    d.style.background = `linear-gradient(to bottom, transparent, ${color})`;
    d.style.animationDuration = isForeground ? `${0.45 + Math.random() * 0.5}s` : `${0.8 + Math.random() * 0.9}s`;
    d.style.animationDelay = `${Math.random() * 2}s`;
    d.style.setProperty('--sway', `${-14 + Math.random() * 28}px`);
    wrap.appendChild(d);
  }
}

// ══════════════════════════════════════════════════════════════════
// FIREWORKS (reusable)
// ══════════════════════════════════════════════════════════════════
function launchFireworks(containerId, bursts = 5) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const colors = ['#ffd700', '#ff6b9d', '#c47bff', '#52b788', '#fff', '#ff9a9e'];
  for (let b = 0; b < bursts; b++) {
    setTimeout(() => {
      const cx = 10 + Math.random() * 80;
      const cy = 5 + Math.random() * 45;
      for (let i = 0; i < 22; i++) {
        const s = document.createElement('div');
        s.className = 'spark';
        s.style.cssText = `position:fixed;left:${cx}%;top:${cy}%;`;
        s.style.background = colors[i % colors.length];
        const angle = (i / 22) * Math.PI * 2;
        const dist = 35 + Math.random() * 60;
        s.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
        s.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
        s.style.setProperty('--dur', `${0.55 + Math.random() * 0.45}s`);
        container.appendChild(s);
        setTimeout(() => s.remove(), 1200);
      }
    }, b * 400);
  }
}

// ══════════════════════════════════════════════════════════════════
// DECOY — FLIP CARD + BALLOON BURST + FIREWORKS + COUNTDOWN RING
// ══════════════════════════════════════════════════════════════════
let decoyCountdownInterval = null;

document.getElementById('decoy-btn').addEventListener('click', openDecoyCard);

function openDecoyCard() {
  const wrapper = document.getElementById('decoy-flip-wrapper');
  const balloons = document.getElementById('decoy-balloons');

  // Unlock audio early
  try { getACtx(); } catch (e) { }

  // 1. Flip the card
  wrapper.classList.add('flipped');

  // 2. Burst the balloons upward after 400ms
  setTimeout(() => {
    Array.from(balloons.children).forEach((b, i) => {
      setTimeout(() => b.classList.add('balloon-fly'), i * 120);
    });
  }, 400);

  // 3. Start fireworks on the decoy canvas after 600ms
  setTimeout(() => {
    startDecoyFireworks();
  }, 600);

  // 4. Start the SVG countdown ring after 800ms
  setTimeout(() => {
    startDecoyCountdown();
  }, 800);
}

function startDecoyFireworks() {
  const cv = document.getElementById('decoy-fireworks-canvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  cv.width = window.innerWidth;
  cv.height = window.innerHeight;

  const colors = ['#ffd700', '#ff6b9d', '#c47bff', '#ff9a9e', '#fff', '#f472b6'];

  // Burst 4 times over 3.2 seconds
  for (let b = 0; b < 4; b++) {
    setTimeout(() => {
      if (cv.style.display === 'none') return;
      const bx = 15 + Math.random() * 70;
      const by = 8 + Math.random() * 35;
      const numParticles = 28;
      const particles = [];
      for (let i = 0; i < numParticles; i++) {
        const angle = (i / numParticles) * Math.PI * 2;
        const speed = 1.8 + Math.random() * 2.5;
        particles.push({
          x: cv.width * bx / 100,
          y: cv.height * by / 100,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          r: 2.5 + Math.random() * 2
        });
      }

      let frame = 0;
      function animateBurst() {
        if (frame++ > 55) return;
        ctx.clearRect(0, 0, cv.width, cv.height);
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.04; // gravity
          p.alpha -= 0.018;
          p.vx *= 0.97;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color + Math.max(0, Math.floor(p.alpha * 255)).toString(16).padStart(2, '0');
          ctx.fill();
        });
        requestAnimationFrame(animateBurst);
      }
      animateBurst();
    }, b * 800);
  }
}

function startDecoyCountdown() {
  const ringProgress = document.getElementById('decoy-ring-progress');
  const continueBtn = document.getElementById('decoy-continue-btn');
  const hint = document.getElementById('decoy-ring-hint');
  if (!ringProgress) return;

  const circumference = 213.6; // 2 * PI * 34
  const totalMs = 8000;
  const startTime = Date.now();

  // Animate the ring progress
  decoyCountdownInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / totalMs, 1);
    // dashoffset goes from 213.6 (empty) → 0 (full)
    ringProgress.style.strokeDashoffset = circumference * (1 - progress);

    if (progress >= 1) {
      clearInterval(decoyCountdownInterval);
      if (hint) hint.textContent = 'Chalte hain! 🚀';
      triggerDecoyReveal();
    }
  }, 50);

  // Button also triggers early
  continueBtn.addEventListener('click', () => {
    clearInterval(decoyCountdownInterval);
    triggerDecoyReveal();
  }, { once: true });
}

function triggerDecoyReveal() {
  startReveal();
}

async function startReveal() {
  // Force unlock Web Audio and start music
  try {
    getACtx();
    bgMusicPlaying = true;
    const mainMusic = document.getElementById('music-main');
    if (mainMusic) {
      mainMusic.volume = 0;
      mainMusic.play().then(() => { currentAudio = mainMusic; }).catch(() => { });
    }
  } catch (e) { }

  const decoy = document.getElementById('decoy-site');
  decoy.classList.add('fade-out');
  await new Promise(r => setTimeout(r, 700));
  decoy.style.display = 'none';

  await new Promise(r => setTimeout(r, 1500));

  const overlay = document.getElementById('reveal-overlay');
  const msgEl = document.getElementById('reveal-msg');
  const dotsEl = overlay.querySelector('.reveal-dots');
  overlay.classList.remove('ui-hidden');
  msgEl.textContent = BIRTHDAY_CONFIG.revealMsg;

  await new Promise(r => setTimeout(r, 80));
  msgEl.classList.add('show');

  await new Promise(r => setTimeout(r, 1200));
  dotsEl.classList.add('show');

  await new Promise(r => setTimeout(r, 3800));

  msgEl.classList.remove('show');
  dotsEl.classList.remove('show');
  await new Promise(r => setTimeout(r, 700));
  overlay.classList.add('ui-hidden');

  openGate();
}

function openGate() {
  const gate = document.getElementById('gate-wrap');
  gate.classList.remove('ui-hidden');
  gate.classList.add('glowing');

  const pWrap = document.getElementById('gate-particles');
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'spark';
    p.style.cssText = `position:absolute;left:50%;top:${20 + Math.random() * 60}%;`;
    p.style.background = ['#c47bff', '#ff6b9d', '#ffd700', '#fff'][i % 4];
    const dx = (Math.random() - 0.5) * 120;
    const dy = (Math.random() - 0.5) * 80;
    p.style.setProperty('--dx', `${dx}px`);
    p.style.setProperty('--dy', `${dy}px`);
    p.style.setProperty('--dur', `${0.8 + Math.random() * 0.6}s`);
    p.style.animationDelay = `${Math.random() * 0.4}s`;
    pWrap.appendChild(p);
  }

  setTimeout(() => {
    bgMusicPlaying = true;
    playTrack('music-main', 0.5);

    gate.classList.add('open');

    setTimeout(() => {
      const exp = document.getElementById('experience');
      exp.classList.remove('ui-hidden');
      document.getElementById('music-player').style.display = 'flex';

      setTimeout(() => {
        gate.style.display = 'none';
        startIntro();
      }, 700);
    }, 1000);
  }, 500);
}

// ══════════════════════════════════════════════════════════════════
// ACT 0.5 — SAFAR INTRO (with background preload)
// ══════════════════════════════════════════════════════════════════
function preloadAllPhotos() {
  const allPhotos = [];
  (BIRTHDAY_CONFIG.scenes || []).forEach(s => {
    (s.photos || []).forEach(p => allPhotos.push(p));
  });
  allPhotos.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

function startIntro() {
  document.getElementById('act-intro').classList.remove('ui-hidden');

  // Preload all cinema photos silently in background
  preloadAllPhotos();

  // Starfield canvas
  const cv = document.getElementById('intro-canvas');
  const ctx = cv.getContext('2d');
  cv.width = window.innerWidth;
  cv.height = window.innerHeight;

  const stars = Array.from({ length: 120 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.5 + 0.3,
    alpha: Math.random(),
    speed: (Math.random() * 0.008 + 0.002) * (Math.random() > 0.5 ? 1 : -1)
  }));

  // A few large colored orbs
  const orbs = [
    { x: 0.2, y: 0.3, r: 120, hue: 270, alpha: 0.04 },
    { x: 0.8, y: 0.6, r: 140, hue: 330, alpha: 0.035 },
    { x: 0.5, y: 0.8, r: 90, hue: 200, alpha: 0.03 }
  ];

  (function renderIntroCanvas() {
    if (document.getElementById('act-intro').classList.contains('ui-hidden')) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    const W = cv.width, H = cv.height;

    // Orbs
    orbs.forEach(o => {
      const g = ctx.createRadialGradient(o.x * W, o.y * H, 0, o.x * W, o.y * H, o.r);
      g.addColorStop(0, `hsla(${o.hue},70%,55%,${o.alpha})`);
      g.addColorStop(1, `hsla(${o.hue},70%,55%,0)`);
      ctx.beginPath(); ctx.arc(o.x * W, o.y * H, o.r, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
    });

    // Stars
    stars.forEach(s => {
      s.alpha += s.speed;
      if (s.alpha >= 1 || s.alpha <= 0) s.speed = -s.speed;
      ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,240,255,${Math.abs(s.alpha) * 0.75})`;
      ctx.fill();
    });

    requestAnimationFrame(renderIntroCanvas);
  })();

  // Begin button
  document.getElementById('intro-begin-btn').addEventListener('click', () => {
    sfxPlay('chime');
    switchAct('act-intro', 'act-cinema', startCinema);
  }, { once: true });
}

// ══════════════════════════════════════════════════════════════════
// ACT 1 — CINEMA (auto-play)
// ══════════════════════════════════════════════════════════════════
const SCENES = BIRTHDAY_CONFIG.scenes;
let sceneIdx = 0, photoIdx = 0, activeSlot = 'a';
let sceneTimer = null, photoTimer = null;

function startCinema() {
  document.getElementById('act-cinema').classList.remove('ui-hidden');

  const skipBtn = document.getElementById('cinema-skip-btn');
  if (skipBtn) {
    skipBtn.onclick = () => {
      clearTimeout(sceneTimer);
      clearTimeout(photoTimer);
      endCinema();
    };
  }

  const dotsEl = document.getElementById('scene-dots');
  dotsEl.innerHTML = '';
  SCENES.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'sdot' + (i === 0 ? ' active' : '');
    dotsEl.appendChild(d);
  });

  const cv = document.getElementById('cinema-canvas');
  const cx = cv.getContext('2d');
  cv.width = window.innerWidth; cv.height = window.innerHeight;
  const dust = Array.from({ length: 55 }, () => ({
    x: Math.random() * cv.width, y: Math.random() * cv.height,
    r: Math.random() * 1.8 + 0.4, alpha: Math.random() * 0.3 + 0.08,
    vy: -(Math.random() * 0.22 + 0.06), vx: (Math.random() - 0.5) * 0.05
  }));
  (function renderDust() {
    if (document.getElementById('act-cinema').classList.contains('ui-hidden')) return;
    cx.clearRect(0, 0, cv.width, cv.height);
    dust.forEach(d => {
      d.y += d.vy; d.x += d.vx;
      if (d.y < 0) d.y = cv.height;
      if (d.x < 0 || d.x > cv.width) d.vx = -d.vx;
      cx.beginPath(); cx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      cx.fillStyle = `rgba(255,215,160,${d.alpha})`; cx.fill();
    });
    requestAnimationFrame(renderDust);
  })();

  playScene(0);
}

function playScene(idx) {
  clearTimeout(sceneTimer); clearTimeout(photoTimer);
  if (idx >= SCENES.length) { endCinema(); return; }

  const s = SCENES[idx];

  document.querySelectorAll('.sdot').forEach((d, i) => {
    d.className = 'sdot' + (i < idx ? ' done' : i === idx ? ' active' : '');
  });

  const card = document.getElementById('cinema-card');
  gsap.to(card, {
    opacity: 0, y: 10, duration: 0.4, ease: 'power2.in',
    onComplete: () => {
      document.getElementById('cinema-title').textContent = s.title;
      document.getElementById('cinema-text').textContent = s.text;
      document.getElementById('cinema-caption').textContent = s.caption || '';
      gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' });
    }
  });

  setPhoto(s.photos, 0);
  if (s.photos.length > 1) {
    const interval = Math.floor(s.durationMs / s.photos.length);
    let pI = 0;
    const cycle = () => { pI++; if (pI < s.photos.length) { setPhoto(s.photos, pI); photoTimer = setTimeout(cycle, interval); } };
    photoTimer = setTimeout(cycle, interval);
  }

  const fill = document.getElementById('cinema-fill');
  fill.style.transition = 'none'; fill.style.width = '0%';
  setTimeout(() => { fill.style.transition = `width ${s.durationMs}ms linear`; fill.style.width = '100%'; }, 80);

  sceneTimer = setTimeout(() => { playScene(idx + 1); }, s.durationMs);
}

function setPhoto(photos, pIdx) {
  const imgA = document.getElementById('img-a');
  const imgB = document.getElementById('img-b');
  const active = activeSlot === 'a' ? imgA : imgB;
  const out = activeSlot === 'a' ? imgB : imgA;

  active.src = photos[pIdx % photos.length];
  active.style.opacity = '0';
  active.style.transition = 'opacity 1.5s ease-in-out';
  active.onload = () => {
    active.classList.add('cinema-img-active');
    out.classList.remove('cinema-img-active');
    requestAnimationFrame(() => {
      active.style.opacity = '1';
      out.style.opacity = '0';
    });
  };
  active.onerror = () => { };
  activeSlot = activeSlot === 'a' ? 'b' : 'a';
}

async function endCinema() {
  await switchAct('act-cinema', 'act-moments', startMoments);
}

// ══════════════════════════════════════════════════════════════════
// ACT 2 — MOMENTS: Full-screen canvas (Sky + Moon + Clouds + Lightning)
// ══════════════════════════════════════════════════════════════════
let momentsRevealed = 0;

// Cloud data — positions as fractions of canvas size
// Clouds are painted on the moments-canvas using arc-based shapes
// We store each cloud as { cx, cy, scale, revealed, done }
let cloudData = [];

function startMoments() {
  momentsRevealed = 0;
  const moments = BIRTHDAY_CONFIG.moments;
  document.getElementById('moments-count').textContent = `0 / ${moments.length} yaadein khuli...`;

  createRain('moments-rain', 130, 'rgba(82,183,136,0.28)');
  startRainSound(0.04);

  const cv = document.getElementById('moments-canvas');
  const ctx = cv.getContext('2d');
  cv.width = window.innerWidth;
  cv.height = window.innerHeight;
  const W = cv.width, H = cv.height;

  // ── Moon definition (upper-center-right) ──
  const moon = {
    cx: W * 0.62,
    cy: H * 0.28,
    r: Math.min(W, H) * 0.095,
    glow: 0.3,    // 0 = faint → 1 = full
    brightness: 1
  };

  // ── Build cloud positions (8 clouds over moon area) ──
  cloudData = [];
  const rawPositions = [
    { xf: 0.18, yf: 0.16 }, { xf: 0.48, yf: 0.10 }, { xf: 0.72, yf: 0.15 },
    { xf: 0.30, yf: 0.28 }, { xf: 0.58, yf: 0.22 }, { xf: 0.82, yf: 0.28 },
    { xf: 0.22, yf: 0.40 }, { xf: 0.68, yf: 0.38 }
  ];
  moments.forEach((m, i) => {
    const pos = rawPositions[i % rawPositions.length];
    cloudData.push({
      idx: i,
      cx: W * pos.xf,
      cy: H * pos.yf,
      scale: 0.7 + Math.random() * 0.5,
      alpha: 0.55 + Math.random() * 0.25,
      driftOffset: Math.random() * Math.PI * 2,
      driftSpeed: 0.0008 + Math.random() * 0.0006,
      lit: false,       // becomes true when tapped
      litAlpha: 0,      // 0→1 glow when tapped
      revealed: false,  // after reveal, show icon
      done: false,      // touch handled once
      icon: m.icon,
      moment: m
    });
  });

  // ── Fireflies ──
  const flies = Array.from({ length: 14 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.8 + 0.8,
    angle: Math.random() * Math.PI * 2,
    speed: 0.35 + Math.random() * 0.55,
    alpha: Math.random()
  }));

  // ── Ambient lightning loop ──
  (function ambientLightning() {
    if (document.getElementById('act-moments').classList.contains('ui-hidden')) return;
    const flash = document.getElementById('lightning-flash');
    const delay = 3500 + Math.random() * 5500;
    setTimeout(() => {
      if (document.getElementById('act-moments').classList.contains('ui-hidden')) return;
      gsap.timeline()
        .to(flash, { opacity: 0.3, duration: 0.06 })
        .to(flash, { opacity: 0, duration: 0.18 });
      ambientLightning();
    }, delay);
  })();

  // ── Draw helpers ──
  function drawCloud(ctx, cx, cy, scale, alpha, isLit, litAlpha) {
    const s = scale;
    const baseAlpha = isLit ? Math.min(1, alpha + litAlpha * 0.45) : alpha;

    ctx.save();
    ctx.globalAlpha = baseAlpha;

    // Cloud glow halo if lit
    if (litAlpha > 0.01) {
      const glowR = 90 * s;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      g.addColorStop(0, `rgba(255,255,255,${litAlpha * 0.25})`);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      ctx.globalAlpha = baseAlpha;
    }

    const cloudColor = isLit
      ? `rgba(240,248,255,${Math.min(0.95, baseAlpha + litAlpha * 0.2)})`
      : `rgba(190,215,200,${baseAlpha})`;

    ctx.fillStyle = cloudColor;
    ctx.shadowColor = isLit ? 'rgba(255,255,255,0.5)' : 'rgba(100,180,140,0.2)';
    ctx.shadowBlur = isLit ? 22 : 8;

    // Multi-circle cloud body
    ctx.beginPath(); ctx.arc(cx,      cy,      38 * s, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx - 30 * s, cy + 8 * s, 28 * s, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 30 * s, cy + 8 * s, 26 * s, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx - 16 * s, cy - 24 * s, 24 * s, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 18 * s, cy - 20 * s, 20 * s, 0, Math.PI * 2); ctx.fill();
    // Flat bottom fill
    ctx.beginPath();
    ctx.rect(cx - 68 * s, cy, 136 * s, 30 * s);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawMoon(ctx, cx, cy, r, glowFrac, brightness) {
    ctx.save();
    // Outer glow
    const glowR = r + 55 * glowFrac;
    const glow = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, glowR);
    glow.addColorStop(0, `rgba(255,255,230,${0.25 + glowFrac * 0.55})`);
    glow.addColorStop(1, 'rgba(255,255,230,0)');
    ctx.beginPath(); ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
    ctx.fillStyle = glow; ctx.fill();

    // Moon disk
    const moonGrad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, 0, cx, cy, r);
    moonGrad.addColorStop(0, `rgba(255,255,248,${0.35 + glowFrac * 0.65})`);
    moonGrad.addColorStop(0.6, `rgba(240,245,230,${0.28 + glowFrac * 0.52})`);
    moonGrad.addColorStop(1, `rgba(200,220,200,${0.15 + glowFrac * 0.35})`);
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = moonGrad; ctx.fill();

    // Subtle surface craters
    if (glowFrac > 0.15) {
      ctx.globalAlpha = 0.07 * glowFrac;
      ctx.fillStyle = 'rgba(150,180,150,1)';
      [[cx + r * 0.2, cy - r * 0.1, r * 0.08],
       [cx - r * 0.25, cy + r * 0.15, r * 0.06],
       [cx + r * 0.05, cy + r * 0.25, r * 0.05]].forEach(([x, y, cr]) => {
        ctx.beginPath(); ctx.arc(x, y, cr, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  let frameTime = 0;

  // ── Main render loop ──
  (function render(ts) {
    if (document.getElementById('act-moments').classList.contains('ui-hidden')) return;
    frameTime = ts;

    ctx.clearRect(0, 0, W, H);

    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
    skyGrad.addColorStop(0, '#010e04');
    skyGrad.addColorStop(0.5, '#030c06');
    skyGrad.addColorStop(1, '#020a05');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    // Moon
    drawMoon(ctx, moon.cx, moon.cy, moon.r, moon.glow, moon.brightness);

    // Clouds (behind moon are drawn first, clouds in front second)
    // Sort: draw revealed clouds last (they glow brighter)
    const sorted = [...cloudData].sort((a, b) => (a.revealed ? 1 : 0) - (b.revealed ? 1 : 0));
    sorted.forEach(c => {
      // Gentle horizontal drift
      const drift = Math.sin(ts * c.driftSpeed + c.driftOffset) * 8;
      const drawX = c.cx + drift;
      // Fade litAlpha back down over time
      if (c.lit && c.litAlpha > 0 && !c.revealed) c.litAlpha = Math.min(1, c.litAlpha);
      if (c.revealed) c.litAlpha = Math.min(1, (c.litAlpha || 0) + 0.01);
      drawCloud(ctx, drawX, c.cy, c.scale, c.alpha, c.lit || c.revealed, c.litAlpha || 0);

      // Icon text for revealed clouds
      if (c.revealed) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, (c.litAlpha || 0) * 1.5);
        ctx.font = `${Math.round(26 * c.scale)}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(c.icon, drawX, c.cy - 2);
        ctx.restore();
      }
    });

    // Fireflies
    flies.forEach(f => {
      f.angle += (Math.random() - 0.5) * 0.08;
      f.x = Math.max(0, Math.min(W, f.x + Math.cos(f.angle) * f.speed));
      f.y = Math.max(0, Math.min(H, f.y + Math.sin(f.angle) * f.speed));
      f.alpha = 0.25 + Math.abs(Math.sin(ts * 0.002 + f.angle)) * 0.75;
      const fg = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 5);
      fg.addColorStop(0, `rgba(244,220,80,${f.alpha})`);
      fg.addColorStop(1, 'rgba(244,162,97,0)');
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = fg; ctx.fill();
    });

    requestAnimationFrame(render);
  })(0);

  // ── Touch/click detection on canvas ──
  const popup = document.getElementById('moment-popup');
  const popIcon = document.getElementById('moment-popup-icon');
  const popMsg = document.getElementById('moment-popup-msg');
  document.getElementById('moment-popup-close').onclick = () => popup.classList.add('ui-hidden');

  function findCloudAt(x, y) {
    // Hit radius for each cloud: ~60*scale px
    for (let i = cloudData.length - 1; i >= 0; i--) {
      const c = cloudData[i];
      const drift = Math.sin(frameTime * c.driftSpeed + c.driftOffset) * 8;
      const dx = x - (c.cx + drift);
      const dy = y - c.cy;
      const hitR = 60 * c.scale;
      if (dx * dx + dy * dy < hitR * hitR) return c;
    }
    return null;
  }

  function onMomentsClick(e) {
    e.preventDefault();
    const rect = cv.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const cloud = findCloudAt(x, y);
    if (!cloud) return;

    if (cloud.done) {
      // Re-show popup for already revealed cloud
      popIcon.textContent = cloud.icon;
      popMsg.textContent = cloud.moment.text;
      popup.classList.remove('ui-hidden');
      return;
    }

    cloud.done = true;
    cloud.lit = true;
    cloud.litAlpha = 1;
    momentsRevealed++;

    // Lightning strike from top to this cloud
    const drift = Math.sin(frameTime * cloud.driftSpeed + cloud.driftOffset) * 8;
    drawLightningBolt(cloud.cx + drift, 0, cloud.cx + drift, cloud.cy);
    sfxPlay('thunder');
    burstSpark(clientX, clientY, 10);

    // Flash
    const flash = document.getElementById('lightning-flash');
    const act = document.getElementById('act-moments');
    gsap.timeline()
      .to(flash, { opacity: 0.9, duration: 0.05 })
      .to(flash, { opacity: 0, duration: 0.08 })
      .to(flash, { opacity: 0.6, duration: 0.04 })
      .to(flash, { opacity: 0, duration: 0.15 });

    gsap.timeline()
      .to(act, { x: -7, y: 4, duration: 0.04 })
      .to(act, { x: 6, y: -5, duration: 0.04 })
      .to(act, { x: -4, y: 2, duration: 0.04 })
      .to(act, { x: 0, y: 0, duration: 0.04 });

    // Reveal cloud
    setTimeout(() => { cloud.revealed = true; }, 350);

    // Update count
    document.getElementById('moments-count').textContent =
      `${momentsRevealed} / ${moments.length} yaadein khuli...`;

    // Grow moon's glow
    moon.glow = Math.min(1, momentsRevealed / moments.length);

    // Show popup
    setTimeout(() => {
      popIcon.textContent = cloud.icon;
      popMsg.textContent = cloud.moment.text;
      popup.classList.remove('ui-hidden');
    }, 400);

    if (momentsRevealed === moments.length) {
      // All revealed — show transition message
      setTimeout(() => popup.classList.add('ui-hidden'), 2400);

      setTimeout(() => {
        const flash2 = document.getElementById('lightning-flash');
        gsap.to(flash2, { opacity: 0.9, duration: 1.1, ease: 'power1.in' });
      }, 2600);

      setTimeout(() => {
        // Show the transition text overlay
        const transMsg = document.getElementById('moments-transition-msg');
        if (transMsg) {
          transMsg.classList.remove('ui-hidden');
          setTimeout(() => {
            stopRainSound();
            switchAct('act-moments', 'act-hearts', startHearts);
          }, 2800);
        } else {
          stopRainSound();
          switchAct('act-moments', 'act-hearts', startHearts);
        }
      }, 3600);
    }
  }

  cv.addEventListener('click', onMomentsClick);
  cv.addEventListener('touchstart', onMomentsClick, { passive: false });
}

// ══════════════════════════════════════════════════════════════════
// ACT 3 — HEARTS: Big SVG heart fill + floating hearts
// ══════════════════════════════════════════════════════════════════
let heartsRevealed = 0;
const HEARTS = BIRTHDAY_CONFIG.hearts;

function startHearts() {
  heartsRevealed = 0;
  document.getElementById('hearts-count').textContent = `0 / ${HEARTS.length} raazein khuli...`;

  createRain('hearts-rain', 95, 'rgba(255,107,157,0.22)');
  startRainSound(0.03);
  startLoveShowerBg();

  // Background: purple orbs + fireflies on canvas
  const cv = document.getElementById('hearts-canvas');
  const ctx = cv.getContext('2d');
  cv.width = window.innerWidth; cv.height = window.innerHeight;

  const flies = Array.from({ length: 22 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 2.2 + 0.8,
    angle: Math.random() * Math.PI * 2,
    speed: 0.0015 + Math.random() * 0.002,
    alpha: Math.random()
  }));
  const orbs = Array.from({ length: 3 }, () => ({
    x: Math.random(), y: Math.random(), r: 80 + Math.random() * 120,
    alpha: 0.02 + Math.random() * 0.025,
    vx: (Math.random() - 0.5) * 0.0002, vy: (Math.random() - 0.5) * 0.0001
  }));

  (function renderHeartsCanvas() {
    if (document.getElementById('act-hearts').classList.contains('ui-hidden')) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    const W = cv.width, H = cv.height;
    orbs.forEach(o => {
      o.x = Math.max(0, Math.min(1, o.x + o.vx));
      o.y = Math.max(0, Math.min(1, o.y + o.vy));
      if (o.x <= 0 || o.x >= 1) o.vx = -o.vx;
      if (o.y <= 0 || o.y >= 1) o.vy = -o.vy;
      const g = ctx.createRadialGradient(o.x * W, o.y * H, 0, o.x * W, o.y * H, o.r);
      g.addColorStop(0, `rgba(196,77,255,${o.alpha})`);
      g.addColorStop(1, 'rgba(196,77,255,0)');
      ctx.beginPath(); ctx.arc(o.x * W, o.y * H, o.r, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
    });
    flies.forEach(f => {
      f.angle += (Math.random() - 0.5) * 0.1;
      f.x = Math.max(0, Math.min(1, f.x + Math.cos(f.angle) * f.speed));
      f.y = Math.max(0, Math.min(1, f.y + Math.sin(f.angle) * f.speed));
      f.alpha = 0.3 + Math.random() * 0.7;
      const fg = ctx.createRadialGradient(f.x * W, f.y * H, 0, f.x * W, f.y * H, f.r * 5);
      fg.addColorStop(0, `rgba(244,220,80,${f.alpha})`);
      fg.addColorStop(1, 'rgba(244,162,97,0)');
      ctx.beginPath(); ctx.arc(f.x * W, f.y * H, f.r, 0, Math.PI * 2);
      ctx.fillStyle = fg; ctx.fill();
    });
    requestAnimationFrame(renderHeartsCanvas);
  })();

  // ── Spawn 15 floating heart bubbles across the full screen ──
  const floatingLayer = document.getElementById('hearts-floating-layer');
  floatingLayer.innerHTML = '';

  const popup = document.getElementById('heart-popup');
  const popEmoji = document.getElementById('popup-emoji');
  const popMsg = document.getElementById('popup-msg');
  document.getElementById('popup-close').onclick = () => popup.classList.add('ui-hidden');

  // Scattered positions across the whole screen (not a grid)
  const spawnPositions = [
    { l: 5,  t: 8  }, { l: 25, t: 5  }, { l: 50, t: 10 }, { l: 72, t: 6  }, { l: 88, t: 12 },
    { l: 10, t: 30 }, { l: 35, t: 35 }, { l: 60, t: 28 }, { l: 80, t: 32 }, { l: 92, t: 22 },
    { l: 3,  t: 55 }, { l: 22, t: 60 }, { l: 48, t: 52 }, { l: 70, t: 58 }, { l: 88, t: 50 }
  ];

  HEARTS.forEach((h, i) => {
    const pos = spawnPositions[i % spawnPositions.length];
    const bbl = document.createElement('div');
    bbl.className = 'heart-bubble';
    bbl.textContent = '❤️';
    // Position as % of viewport, subtract half bubble size (approx 28px)
    bbl.style.left = `calc(${pos.l}% - 28px)`;
    bbl.style.top  = `calc(${pos.t}% - 28px)`;
    bbl.style.setProperty('--fDur', `${2.5 + Math.random() * 1.8}s`);
    bbl.style.setProperty('--fDel', `${Math.random() * 1.5}s`);
    bbl.style.setProperty('--dDur', `${5 + Math.random() * 4}s`);
    bbl.style.setProperty('--dDel', `${Math.random() * 3}s`);
    bbl.style.setProperty('--driftAmt', `${(Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 25)}px`);

    let done = false;
    bbl.addEventListener('click', e => {
      e.stopPropagation();
      if (!done) {
        done = true;
        heartsRevealed++;

        sfxPlay('chime');
        burstSpark(e.clientX, e.clientY, 14);

        bbl.classList.add('wink');
        setTimeout(() => {
          bbl.textContent = h.emoji;
          bbl.classList.remove('wink');
          bbl.classList.add('revealed');
        }, 400);

        document.getElementById('hearts-count').textContent =
          `${heartsRevealed} / ${HEARTS.length} raazein khuli...`;

        // Update big heart fill
        updateBigHeart(heartsRevealed, HEARTS.length);

        // Show center photo after 7+ reveals
        if (heartsRevealed >= 7) {
          const photoWrap = document.getElementById('heart-center-photo-wrap');
          if (photoWrap && !photoWrap.classList.contains('visible')) {
            photoWrap.classList.add('visible');
          }
        }

        setTimeout(() => {
          popEmoji.textContent = h.emoji;
          popMsg.textContent = h.reason;
          popup.classList.remove('ui-hidden');
          bbl.classList.add('dissolve');
        }, 300);

        if (heartsRevealed === HEARTS.length) {
          const bigContainer = document.getElementById('big-heart-container');
          if (bigContainer) bigContainer.classList.add('fully-revealed');

          setTimeout(() => popup.classList.add('ui-hidden'), 2200);

          // Show achievement
          setTimeout(() => {
            const achievement = document.getElementById('heart-achievement');
            if (achievement) {
              achievement.classList.remove('ui-hidden');
              gsap.fromTo(achievement.querySelector('.achievement-inner'),
                { scale: 0.6, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.6, ease: 'elastic.out(1, 0.6)' });
            }
          }, 2500);

          // Pink flash transition
          setTimeout(() => {
            const act = document.getElementById('act-hearts');
            gsap.to(act, { filter: 'brightness(3) saturate(2)', duration: 0.5,
              onComplete: () => gsap.set(act, { filter: '' }) });
          }, 4500);

          setTimeout(() => {
            stopRainSound();
            switchAct('act-hearts', 'act-proposal', startProposal);
          }, 5000);
        }
      } else {
        popEmoji.textContent = h.emoji;
        popMsg.textContent = h.reason;
        popup.classList.remove('ui-hidden');
      }
    });

    floatingLayer.appendChild(bbl);
  });
}

// Update the big SVG heart fill (y attribute of the fill rect slides up)
function updateBigHeart(revealed, total) {
  const fillRect = document.getElementById('heart-fill-rect');
  const outline = document.querySelector('.big-heart-outline');
  if (!fillRect) return;

  const progress = revealed / total; // 0 → 1
  // heart viewBox height=180, fill rect starts at y=180 (empty) → y=0 (full)
  const newY = 180 * (1 - progress);
  fillRect.setAttribute('y', newY);

  // Brighten outline
  if (outline) {
    const strokeAlpha = 0.4 + progress * 0.55;
    outline.style.stroke = `rgba(255,107,157,${strokeAlpha})`;
    outline.style.strokeWidth = 1.5 + progress * 1.5;
  }
}

function startLoveShowerBg() {
  const wrap = document.getElementById('love-shower-bg');
  wrap.innerHTML = '';
  const emojis = ['❤️', '💕', '💖', '💗', '💓', '🌸'];

  function spawnBgHeart() {
    if (document.getElementById('act-hearts').classList.contains('ui-hidden')) return;
    const el = document.createElement('div');
    el.className = 'bg-falling-heart';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = `${Math.random() * 100}%`;
    el.style.fontSize = `${0.8 + Math.random() * 1.2}rem`;
    const rot = -20 + Math.random() * 40;
    const sc = 0.6 + Math.random() * 0.6;
    el.style.setProperty('--rot', `${rot}deg`);
    el.style.setProperty('--sc', sc);
    const dur = 6 + Math.random() * 5;
    el.style.animationDuration = `${dur}s`;
    el.style.animationDelay = `${Math.random() * 2}s`;
    wrap.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.remove(); }, (dur + 2) * 1000);
    setTimeout(spawnBgHeart, 600 + Math.random() * 700);
  }
  spawnBgHeart();
}

// ══════════════════════════════════════════════════════════════════
// ACT 4 — PROPOSAL (ANIME SILHOUETTES + RING)
// ══════════════════════════════════════════════════════════════════
function startProposal() {
  const cv = document.getElementById('proposal-canvas');
  const cx = cv.getContext('2d');
  cv.width = window.innerWidth; cv.height = window.innerHeight;
  const aOrbs = Array.from({ length: 5 }, () => ({
    x: Math.random(), y: Math.random(), r: 90 + Math.random() * 130,
    hue: Math.random() > 0.5 ? 270 : 320,
    alpha: 0.03 + Math.random() * 0.04,
    vx: (Math.random() - 0.5) * 0.0003, vy: (Math.random() - 0.5) * 0.0002
  }));
  (function renderAurora() {
    if (document.getElementById('act-proposal').classList.contains('ui-hidden')) return;
    cx.clearRect(0, 0, cv.width, cv.height);
    const W = cv.width, H = cv.height;
    aOrbs.forEach(o => {
      o.x = Math.max(0, Math.min(1, o.x + o.vx));
      o.y = Math.max(0, Math.min(1, o.y + o.vy));
      if (o.x <= 0 || o.x >= 1) o.vx = -o.vx;
      if (o.y <= 0 || o.y >= 1) o.vy = -o.vy;
      const g = cx.createRadialGradient(o.x * W, o.y * H, 0, o.x * W, o.y * H, o.r);
      g.addColorStop(0, `hsla(${o.hue},70%,55%,${o.alpha})`);
      g.addColorStop(1, `hsla(${o.hue},70%,55%,0)`);
      cx.beginPath(); cx.arc(o.x * W, o.y * H, o.r, 0, Math.PI * 2);
      cx.fillStyle = g; cx.fill();
    });
    requestAnimationFrame(renderAurora);
  })();

  setTimeout(() => {
    const silWrap = document.getElementById('silhouette-wrap');
    if (silWrap) silWrap.classList.add('in');
  }, 300);

  const cfg = BIRTHDAY_CONFIG.proposal;
  const lines = cfg.dialogueLines || [];
  let lineIdx = 0;
  const textEl = document.getElementById('proposal-text');

  function typeLine(text, onDone) {
    textEl.textContent = '';
    let i = 0;
    const tick = () => {
      if (i >= text.length) { if (onDone) setTimeout(onDone, 900); return; }
      textEl.textContent += text[i++];
      setTimeout(tick, 48);
    };
    tick();
  }
  function nextLine() {
    if (lineIdx >= lines.length) {
      const standing = document.querySelector('.boy-standing');
      const kneeling = document.querySelector('.boy-kneeling');
      if (standing && kneeling) {
        gsap.to(standing, { opacity: 0, scale: 0.95, duration: 0.5 });
        gsap.fromTo(kneeling, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6, delay: 0.1 });
      }
      setTimeout(() => {
        textEl.textContent = cfg.finalQuote;
        gsap.fromTo(document.getElementById('proposal-box'),
          { scale: 0.95, opacity: 0.5 }, { scale: 1, opacity: 1, duration: 0.5 });
        sfxPlay('chime');
        setTimeout(() => {
          const ringBox = document.getElementById('ring-box');
          ringBox.classList.remove('ui-hidden');
          gsap.fromTo(ringBox, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.5)' });
          sfxPlay('chime');
        }, 1600);
      }, 400);
      return;
    }
    typeLine(lines[lineIdx], () => { lineIdx++; nextLine(); });
  }
  setTimeout(nextLine, 1000);

  document.getElementById('proposal-accept-btn').onclick = () => {
    sfxPlay('chime');
    burstSpark(window.innerWidth / 2, window.innerHeight * 0.4, 18);
    setTimeout(() => {
      switchAct('act-proposal', 'act-candles', startCandles);
    }, 1200);
  };
}

// ══════════════════════════════════════════════════════════════════
// ACT 5 — BIRTHDAY CANDLES
// ══════════════════════════════════════════════════════════════════
function startCandles() {
  document.getElementById('bday-name').textContent = `Happy Birthday ${BIRTHDAY_CONFIG.nickname}! 🎂`;
  document.getElementById('bday-anni').textContent = BIRTHDAY_CONFIG.anniversaryMessage;

  const cv = document.getElementById('candles-canvas');
  const cx = cv.getContext('2d');
  cv.width = window.innerWidth; cv.height = window.innerHeight;
  const stars = Array.from({ length: 70 }, () => ({
    x: Math.random(), y: Math.random(), r: Math.random() * 1.5,
    alpha: Math.random(),
    speed: (Math.random() * 0.012 + 0.003) * (Math.random() > 0.5 ? 1 : -1)
  }));
  (function renderStars() {
    if (document.getElementById('act-candles').classList.contains('ui-hidden')) return;
    cx.clearRect(0, 0, cv.width, cv.height);
    const W = cv.width, H = cv.height;
    stars.forEach(s => {
      s.alpha += s.speed;
      if (s.alpha >= 1 || s.alpha <= 0) s.speed = -s.speed;
      cx.beginPath(); cx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      cx.fillStyle = `rgba(255,215,0,${Math.abs(s.alpha) * 0.65})`; cx.fill();
    });
    requestAnimationFrame(renderStars);
  })();

  const row = document.getElementById('candles-row');
  row.innerHTML = '';
  let blown = 0;
  const total = 5;

  for (let i = 0; i < total; i++) {
    const candle = document.createElement('div');
    candle.className = 'candle-item';
    candle.innerHTML = `
      <div class="candle-flame" id="flame-${i}"></div>
      <div class="candle-body"></div>
    `;
    candle.addEventListener('click', e => {
      const flame = document.getElementById(`flame-${i}`);
      if (flame.classList.contains('out')) return;
      flame.classList.add('out');
      sfxPlay('candle');
      blown++;
      document.getElementById('candles-status').textContent = `${blown} / ${total} bujhe`;
      burstSpark(e.clientX, e.clientY, 8);

      const puff = document.createElement('div');
      puff.className = 'candle-puff'; puff.textContent = '💨';
      puff.style.left = `${e.clientX - 20}px`; puff.style.top = `${e.clientY - 30}px`;
      document.body.appendChild(puff);
      setTimeout(() => puff.remove(), 1000);

      if (blown === total) {
        sfxPlay('allBlown');
        document.getElementById('candles-hint').textContent = 'Happy Birthday Pranu! 🎉🎂';
        launchFireworks('candles-fw', 7);
        setTimeout(() => {
          switchAct('act-candles', 'act-finale', startFinale);
        }, 3000);
      }
    });
    row.appendChild(candle);
  }
}

// ══════════════════════════════════════════════════════════════════
// ACT 6 — FINALE
// ══════════════════════════════════════════════════════════════════
function startFinale() {
  launchFireworks('finale-fireworks', 6);
  startLanterns();

  const cv = document.getElementById('finale-canvas');
  const cx = cv.getContext('2d');
  cv.width = window.innerWidth; cv.height = window.innerHeight;
  const stars = Array.from({ length: 90 }, () => ({
    x: Math.random(), y: Math.random(), r: Math.random() * 1.5,
    alpha: Math.random(),
    speed: (Math.random() * 0.01 + 0.003) * (Math.random() > 0.5 ? 1 : -1)
  }));
  (function renderStars() {
    if (document.getElementById('act-finale').classList.contains('ui-hidden')) return;
    cx.clearRect(0, 0, cv.width, cv.height);
    const W = cv.width, H = cv.height;
    stars.forEach(s => {
      s.alpha += s.speed;
      if (s.alpha >= 1 || s.alpha <= 0) s.speed = -s.speed;
      cx.beginPath(); cx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      cx.fillStyle = `rgba(255,215,0,${Math.abs(s.alpha) * 0.65})`; cx.fill();
    });
    requestAnimationFrame(renderStars);
  })();

  const env = document.getElementById('finale-envelope');
  const letterPop = document.getElementById('finale-letter-popup');
  const closing = document.getElementById('finale-closing');

  env.addEventListener('click', () => {
    gsap.to(env, {
      opacity: 0, scale: 0.88, duration: 0.4,
      onComplete: () => {
        env.classList.add('ui-hidden');
        document.getElementById('letter-body').textContent = BIRTHDAY_CONFIG.letter;
        closing.classList.add('ui-hidden');

        letterPop.classList.remove('ui-hidden');
        gsap.fromTo(letterPop.querySelector('.heart-popup-inner'),
          { opacity: 0, y: 20, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6 });

        setTimeout(() => {
          closing.classList.remove('ui-hidden');
          document.getElementById('closing-line').textContent = BIRTHDAY_CONFIG.closingLine;
          gsap.fromTo(closing, { opacity: 0 }, { opacity: 1, duration: 1.2 });
          launchFireworks('finale-fireworks', 5);
        }, 3800);
      }
    });
  });

  const replayBtn = document.getElementById('replay-btn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => { window.location.reload(); });
  }
}

function startLanterns() {
  const container = document.getElementById('finale-lanterns');
  const items = ['🏮', '✨', '💛', '🌟', '🎇', '🪔', '💖'];
  (function spawnLantern() {
    if (document.getElementById('act-finale').classList.contains('ui-hidden')) return;
    const l = document.createElement('div');
    l.className = 'lantern'; l.textContent = items[Math.floor(Math.random() * items.length)];
    l.style.left = `${5 + Math.random() * 88}%`;
    l.style.fontSize = `${0.9 + Math.random() * 0.8}rem`;
    const dur = 9 + Math.random() * 7;
    l.style.animationDuration = `${dur}s`;
    container.appendChild(l);
    setTimeout(() => l.remove(), dur * 1000);
    setTimeout(spawnLantern, 1400 + Math.random() * 1800);
  })();
}

// Canvas resize
window.addEventListener('resize', () => {
  document.querySelectorAll('canvas').forEach(cv => {
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;
  });
});