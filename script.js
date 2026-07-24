/* ============================================================
   MONSOON DIARIES — Linear Cinematic Engine
   Decoy → Reveal → Gate → Cinema → Moments → Hearts+Shower →
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
  currentAudio = next;
  next.volume = 0;
  next.play().then(() => fadeVol(next, vol, 1500, false)).catch(() => {});
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
    if (currentAudio) currentAudio.play().then(() => fadeVol(currentAudio, 0.45, 600, false)).catch(() => {});
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
  } catch(e) {}
}
function stopRainSound() {
  if (!rainNode) return;
  try { rainNode.gain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.5); } catch(e) {}
  setTimeout(() => { try { rainNode.src.stop(); } catch(e) {} rainNode = null; }, 1500);
}

// Synth SFX
function sfxPlay(type) {
  try {
    const ctx = getACtx();
    const now = ctx.currentTime;
    const osc  = ctx.createOscillator();
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
  } catch(e) {}
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
// SPARKS
// ══════════════════════════════════════════════════════════════════
function burstSpark(cx, cy, count = 10) {
  const colors = ['#ff6b9d', '#ffd700', '#c47bff', '#52b788', '#fff', '#ff9a9e'];
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    s.style.cssText = `left:${cx}px;top:${cy}px;position:fixed;`;
    s.style.background = colors[i % colors.length];
    const angle = Math.random() * Math.PI * 2;
    const dist  = 30 + Math.random() * 55;
    s.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    s.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    s.style.setProperty('--dur', `${0.4 + Math.random() * 0.35}s`);
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 800);
  }
}

// ══════════════════════════════════════════════════════════════════
// RAIN DROPS
// ══════════════════════════════════════════════════════════════════
function createRain(id, count = 60, color = 'rgba(174,220,180,0.3)') {
  const wrap = document.getElementById(id);
  if (!wrap) return;
  wrap.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const d = document.createElement('div');
    d.className = 'drop';
    d.style.left     = `${Math.random() * 100}%`;
    d.style.height   = `${14 + Math.random() * 22}px`;
    d.style.opacity  = `${0.12 + Math.random() * 0.2}`;
    d.style.background = `linear-gradient(to bottom, transparent, ${color})`;
    d.style.animationDuration = `${0.6 + Math.random() * 0.9}s`;
    d.style.animationDelay    = `${Math.random() * 2}s`;
    wrap.appendChild(d);
  }
}

// ══════════════════════════════════════════════════════════════════
// FIREWORKS
// ══════════════════════════════════════════════════════════════════
function launchFireworks(containerId, bursts = 5) {
  const container = document.getElementById(containerId);
  const colors = ['#ffd700', '#ff6b9d', '#c47bff', '#52b788', '#fff', '#ff9a9e'];
  for (let b = 0; b < bursts; b++) {
    setTimeout(() => {
      const cx = 10 + Math.random() * 80;
      const cy = 5  + Math.random() * 45;
      for (let i = 0; i < 22; i++) {
        const s = document.createElement('div');
        s.className = 'spark';
        s.style.cssText = `position:fixed;left:${cx}%;top:${cy}%;`;
        s.style.background = colors[i % colors.length];
        const angle = (i / 22) * Math.PI * 2;
        const dist  = 35 + Math.random() * 60;
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
// DECOY → REVEAL → GATE
// ══════════════════════════════════════════════════════════════════
document.getElementById('decoy-btn').addEventListener('click', startReveal);

async function startReveal() {
  const decoy = document.getElementById('decoy-site');
  decoy.classList.add('fade-out');
  await new Promise(r => setTimeout(r, 700));
  decoy.style.display = 'none';

  const overlay = document.getElementById('reveal-overlay');
  const msgEl   = document.getElementById('reveal-msg');
  const dotsEl  = overlay.querySelector('.reveal-dots');
  overlay.classList.remove('ui-hidden');
  msgEl.textContent = BIRTHDAY_CONFIG.revealMsg;

  await new Promise(r => setTimeout(r, 80));
  msgEl.classList.add('show');

  // Show dots after message appears
  await new Promise(r => setTimeout(r, 1200));
  dotsEl.classList.add('show');

  // Wait 5 seconds total before moving on
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

  // Spawn gate particles
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
    // Start music (yourmusic.mp3) immediately
    bgMusicPlaying = true;
    playTrack('music-main', 0.5);

    gate.classList.add('open');

    setTimeout(() => {
      const exp = document.getElementById('experience');
      exp.classList.remove('ui-hidden');
      document.getElementById('music-player').style.display = 'flex';

      setTimeout(() => {
        gate.style.display = 'none';
        startCinema();
      }, 700);
    }, 1000);
  }, 500);
}

// ══════════════════════════════════════════════════════════════════
// ACT 1 — CINEMATIC FILM (auto-play)
// ══════════════════════════════════════════════════════════════════
const SCENES = BIRTHDAY_CONFIG.scenes;
let sceneIdx = 0, photoIdx = 0, activeSlot = 'a';
let sceneTimer = null, photoTimer = null;

function startCinema() {
  document.getElementById('act-cinema').classList.remove('ui-hidden');

  // Build dots
  const dotsEl = document.getElementById('scene-dots');
  dotsEl.innerHTML = '';
  SCENES.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'sdot' + (i === 0 ? ' active' : '');
    dotsEl.appendChild(d);
  });

  // Dust particles
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

  // Dots
  document.querySelectorAll('.sdot').forEach((d, i) => {
    d.className = 'sdot' + (i < idx ? ' done' : i === idx ? ' active' : '');
  });

  // Text card animation
  const card = document.getElementById('cinema-card');
  gsap.to(card, {
    opacity: 0, y: 10, duration: 0.4, ease: 'power2.in',
    onComplete: () => {
      document.getElementById('cinema-title').textContent   = s.title;
      document.getElementById('cinema-text').textContent    = s.text;
      document.getElementById('cinema-caption').textContent = s.caption || '';
      gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' });
    }
  });

  // Photos — cycle
  setPhoto(s.photos, 0);
  if (s.photos.length > 1) {
    const interval = Math.floor(s.durationMs / s.photos.length);
    let pI = 0;
    const cycle = () => { pI++; if (pI < s.photos.length) { setPhoto(s.photos, pI); photoTimer = setTimeout(cycle, interval); } };
    photoTimer = setTimeout(cycle, interval);
  }

  // Progress bar
  const fill = document.getElementById('cinema-fill');
  fill.style.transition = 'none'; fill.style.width = '0%';
  setTimeout(() => { fill.style.transition = `width ${s.durationMs}ms linear`; fill.style.width = '100%'; }, 80);

  sceneTimer = setTimeout(() => { playScene(idx + 1); }, s.durationMs);
}

function setPhoto(photos, pIdx) {
  const imgA = document.getElementById('img-a');
  const imgB = document.getElementById('img-b');
  const active = activeSlot === 'a' ? imgA : imgB;
  const out    = activeSlot === 'a' ? imgB : imgA;

  active.src = photos[pIdx % photos.length];
  active.style.opacity    = '0';
  active.style.transition = 'opacity 1.5s ease-in-out';
  active.onload  = () => {
    active.classList.add('cinema-img-active');
    requestAnimationFrame(() => {
      active.style.opacity = '1';
      out.style.opacity    = '0';
    });
  };
  active.onerror = () => {};
  activeSlot = activeSlot === 'a' ? 'b' : 'a';
}

async function endCinema() {
  await switchAct('act-cinema', 'act-moments', startMoments);
}

// ══════════════════════════════════════════════════════════════════
// ACT 2 — MOMENTS
// ══════════════════════════════════════════════════════════════════
function startMoments() {
  createRain('moments-rain', 60);
  startRainSound(0.035);

  // Soft orb canvas
  const cv = document.getElementById('moments-canvas');
  const cx = cv.getContext('2d');
  cv.width = window.innerWidth; cv.height = window.innerHeight;
  const orbs = Array.from({ length: 5 }, () => ({
    x: Math.random(), y: Math.random(), r: 60 + Math.random() * 100,
    alpha: 0.015 + Math.random() * 0.02,
    vx: (Math.random() - 0.5) * 0.0002, vy: (Math.random() - 0.5) * 0.0001
  }));
  (function renderOrbs() {
    if (document.getElementById('act-moments').classList.contains('ui-hidden')) return;
    cx.clearRect(0, 0, cv.width, cv.height);
    const W = cv.width, H = cv.height;
    orbs.forEach(o => {
      o.x = Math.max(0, Math.min(1, o.x + o.vx));
      o.y = Math.max(0, Math.min(1, o.y + o.vy));
      if (o.x <= 0 || o.x >= 1) o.vx = -o.vx;
      if (o.y <= 0 || o.y >= 1) o.vy = -o.vy;
      const g = cx.createRadialGradient(o.x*W, o.y*H, 0, o.x*W, o.y*H, o.r);
      g.addColorStop(0, `rgba(82,183,136,${o.alpha})`);
      g.addColorStop(1, 'rgba(82,183,136,0)');
      cx.beginPath(); cx.arc(o.x*W, o.y*H, o.r, 0, Math.PI*2);
      cx.fillStyle = g; cx.fill();
    });
    requestAnimationFrame(renderOrbs);
  })();

  // Stagger moments
  const list = document.getElementById('moments-list');
  list.innerHTML = '';
  const moments = BIRTHDAY_CONFIG.moments;
  moments.forEach((m, i) => {
    const item = document.createElement('div');
    item.className = 'moment-item';
    item.innerHTML = `<span class="moment-icon">${m.icon}</span><span>${m.text}</span>`;
    list.appendChild(item);
    setTimeout(() => item.classList.add('visible'), i * 450 + 200);
  });

  const totalMs = moments.length * 450 + 2500;
  setTimeout(() => {
    stopRainSound();
    switchAct('act-moments', 'act-hearts', startHearts);
  }, totalMs);
}

// ══════════════════════════════════════════════════════════════════
// ACT 3 — HEARTS + LOVE SHOWER BACKGROUND
// ══════════════════════════════════════════════════════════════════
let heartsRevealed = 0;
const HEARTS = BIRTHDAY_CONFIG.hearts;

function startHearts() {
  heartsRevealed = 0;
  document.getElementById('hearts-count').textContent = `0 / ${HEARTS.length} raazein khuli...`;

  createRain('hearts-rain', 50, 'rgba(255,107,157,0.25)');
  startRainSound(0.03);
  startLoveShowerBg();

  // Firefly + aurora canvas
  const cv = document.getElementById('hearts-canvas');
  const cx = cv.getContext('2d');
  cv.width = window.innerWidth; cv.height = window.innerHeight;

  const flies = Array.from({ length: 22 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 2 + 0.8,
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
    cx.clearRect(0, 0, cv.width, cv.height);
    const W = cv.width, H = cv.height;
    // Orbs
    orbs.forEach(o => {
      o.x = Math.max(0, Math.min(1, o.x + o.vx));
      o.y = Math.max(0, Math.min(1, o.y + o.vy));
      if (o.x <= 0 || o.x >= 1) o.vx = -o.vx;
      if (o.y <= 0 || o.y >= 1) o.vy = -o.vy;
      const g = cx.createRadialGradient(o.x*W, o.y*H, 0, o.x*W, o.y*H, o.r);
      g.addColorStop(0, `rgba(196,77,255,${o.alpha})`);
      g.addColorStop(1, 'rgba(196,77,255,0)');
      cx.beginPath(); cx.arc(o.x*W, o.y*H, o.r, 0, Math.PI*2);
      cx.fillStyle = g; cx.fill();
    });
    // Fireflies
    flies.forEach(f => {
      f.angle += (Math.random() - 0.5) * 0.1;
      f.x = Math.max(0, Math.min(1, f.x + Math.cos(f.angle) * f.speed));
      f.y = Math.max(0, Math.min(1, f.y + Math.sin(f.angle) * f.speed));
      f.alpha = 0.3 + Math.random() * 0.7;
      const g = cx.createRadialGradient(f.x*W, f.y*H, 0, f.x*W, f.y*H, f.r*5);
      g.addColorStop(0, `rgba(244,220,80,${f.alpha})`);
      g.addColorStop(1, 'rgba(244,162,97,0)');
      cx.beginPath(); cx.arc(f.x*W, f.y*H, f.r, 0, Math.PI*2);
      cx.fillStyle = g; cx.fill();
    });
    requestAnimationFrame(renderHeartsCanvas);
  })();

  // Place 10 hearts
  const arena  = document.getElementById('hearts-arena');
  arena.innerHTML = '';
  const popup   = document.getElementById('heart-popup');
  const popEmoji = document.getElementById('popup-emoji');
  const popMsg  = document.getElementById('popup-msg');
  document.getElementById('popup-close').onclick = () => popup.classList.add('ui-hidden');

  const positions = [
    { l: 6,  t: 28 }, { l: 20, t: 8  }, { l: 36, t: 38 },
    { l: 52, t: 12 }, { l: 68, t: 36 }, { l: 80, t: 10 },
    { l: 10, t: 64 }, { l: 42, t: 70 }, { l: 63, t: 58 },
    { l: 83, t: 66 }
  ];

  HEARTS.forEach((h, i) => {
    const bbl = document.createElement('div');
    bbl.className = 'heart-bubble';
    bbl.textContent = '❤️';
    bbl.style.left = `calc(${positions[i].l}% - 25px)`;
    bbl.style.top  = `calc(${positions[i].t}% - 25px)`;
    bbl.style.setProperty('--fDur', `${2.5 + Math.random() * 1.8}s`);
    bbl.style.setProperty('--fDel', `${Math.random() * 1.5}s`);

    let done = false;
    bbl.addEventListener('click', e => {
      e.stopPropagation();
      if (!done) {
        done = true;
        heartsRevealed++;
        bbl.classList.add('wink');
        setTimeout(() => {
          bbl.textContent = h.emoji;
          bbl.classList.remove('wink');
          bbl.classList.add('revealed');
          bbl.style.animation = 'none';
        }, 500);
        document.getElementById('hearts-count').textContent =
          `${heartsRevealed} / ${HEARTS.length} raazein khuli...`;
        burstSpark(e.clientX, e.clientY, 12);
        sfxPlay('chime');

        // Show popup
        popEmoji.textContent = h.emoji;
        popMsg.textContent   = h.reason;
        popup.classList.remove('ui-hidden');

        if (heartsRevealed === HEARTS.length) {
          // All done — wait 2.5s then advance
          setTimeout(() => popup.classList.add('ui-hidden'), 2200);
          setTimeout(() => {
            stopRainSound();
            switchAct('act-hearts', 'act-proposal', startProposal);
          }, 2800);
        }
      } else {
        popEmoji.textContent = h.emoji;
        popMsg.textContent   = h.reason;
        popup.classList.remove('ui-hidden');
      }
    });
    arena.appendChild(bbl);
  });
}

// Love shower background — hearts raining down behind the floating hearts
function startLoveShowerBg() {
  const wrap = document.getElementById('love-shower-bg');
  wrap.innerHTML = '';
  const emojis = ['❤️', '💕', '💖', '💗', '💓', '🌸'];

  function spawnBgHeart() {
    if (document.getElementById('act-hearts').classList.contains('ui-hidden')) return;
    const el = document.createElement('div');
    el.className = 'bg-falling-heart';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left     = `${Math.random() * 100}%`;
    el.style.fontSize = `${0.8 + Math.random() * 1.2}rem`;
    const rot = -20 + Math.random() * 40;
    const sc  = 0.6 + Math.random() * 0.6;
    el.style.setProperty('--rot', `${rot}deg`);
    el.style.setProperty('--sc', sc);
    const dur = 6 + Math.random() * 5;
    el.style.animationDuration = `${dur}s`;
    el.style.animationDelay   = `${Math.random() * 2}s`;
    wrap.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.remove(); }, (dur + 2) * 1000);
    setTimeout(spawnBgHeart, 600 + Math.random() * 700);
  }
  spawnBgHeart();
}

// ══════════════════════════════════════════════════════════════════
// ACT 4 — PROPOSAL (chibi + ring)
// ══════════════════════════════════════════════════════════════════
function startProposal() {
  // Aurora canvas
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
      const g = cx.createRadialGradient(o.x*W, o.y*H, 0, o.x*W, o.y*H, o.r);
      g.addColorStop(0, `hsla(${o.hue},70%,55%,${o.alpha})`);
      g.addColorStop(1, `hsla(${o.hue},70%,55%,0)`);
      cx.beginPath(); cx.arc(o.x*W, o.y*H, o.r, 0, Math.PI*2);
      cx.fillStyle = g; cx.fill();
    });
    requestAnimationFrame(renderAurora);
  })();

  // Chibi walks in
  setTimeout(() => {
    document.getElementById('chibi-wrap').classList.add('in');
  }, 300);

  // Typewriter dialogue
  const cfg   = BIRTHDAY_CONFIG.proposal;
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
      // Show final quote then ring
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
  document.getElementById('bday-name').textContent  = `Happy Birthday ${BIRTHDAY_CONFIG.nickname}! 🎂`;
  document.getElementById('bday-anni').textContent  = BIRTHDAY_CONFIG.anniversaryMessage;

  // Birthday canvas — stars
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
      cx.beginPath(); cx.arc(s.x*W, s.y*H, s.r, 0, Math.PI*2);
      cx.fillStyle = `rgba(255,215,0,${Math.abs(s.alpha) * 0.65})`; cx.fill();
    });
    requestAnimationFrame(renderStars);
  })();

  // Build 5 candles
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

      // Puff
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
// ACT 6 — FINALE (letter + fireworks + lanterns)
// ══════════════════════════════════════════════════════════════════
function startFinale() {
  launchFireworks('finale-fireworks', 6);
  startLanterns();

  // Stars canvas
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
      cx.beginPath(); cx.arc(s.x*W, s.y*H, s.r, 0, Math.PI*2);
      cx.fillStyle = `rgba(255,215,0,${Math.abs(s.alpha) * 0.65})`; cx.fill();
    });
    requestAnimationFrame(renderStars);
  })();

  const env     = document.getElementById('finale-envelope');
  const letter  = document.getElementById('finale-letter');
  const closing = document.getElementById('finale-closing');

  env.addEventListener('click', () => {
    gsap.to(env, {
      opacity: 0, scale: 0.88, duration: 0.4,
      onComplete: () => {
        env.classList.add('ui-hidden');
        letter.classList.remove('ui-hidden');
        document.getElementById('letter-body').textContent = BIRTHDAY_CONFIG.letter;
        gsap.fromTo(letter, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 });
        setTimeout(() => {
          closing.classList.remove('ui-hidden');
          document.getElementById('closing-line').textContent = BIRTHDAY_CONFIG.closingLine;
          gsap.fromTo(closing, { opacity: 0 }, { opacity: 1, duration: 1.2 });
          launchFireworks('finale-fireworks', 5);
        }, 3800);
      }
    });
  });
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