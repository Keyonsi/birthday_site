/* ============================================================
   MONSOON DIARIES — Linear Cinematic Engine
   Flow: Decoy → Reveal → Gate → Cinema → Moments → Hearts → Shower → Finale
   No games. No buttons. Pure emotion.
   ============================================================ */
'use strict';

// ── AUDIO ─────────────────────────────────────────────────────────
let currentAudio = null;
let bgMusicPlaying = false;

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

function playTrack(id, vol = 0.45) {
  if (!bgMusicPlaying) return;
  const next = document.getElementById(id);
  if (!next) return;
  if (currentAudio && currentAudio !== next) {
    fadeVolume(currentAudio, 0, 1000, true);
  }
  currentAudio = next;
  next.volume = 0;
  next.play().then(() => fadeVolume(next, vol, 1500, false)).catch(() => {});
}

document.getElementById('music-btn').addEventListener('click', () => {
  const icon = document.getElementById('music-icon');
  if (bgMusicPlaying) {
    bgMusicPlaying = false;
    if (currentAudio) fadeVolume(currentAudio, 0, 600, true);
    icon.textContent = '▶';
  } else {
    bgMusicPlaying = true;
    icon.textContent = '❚❚';
    if (currentAudio) currentAudio.play().then(() => fadeVolume(currentAudio, 0.45, 600, false)).catch(() => {});
  }
});

// ── TRANSITIONS ────────────────────────────────────────────────────
function fadeToBlack(ms = 800) {
  return new Promise(resolve => {
    const ov = document.getElementById('act-transition');
    ov.classList.remove('ui-hidden');
    gsap.to(ov, { opacity: 1, duration: ms / 1000, ease: 'power2.inOut', onComplete: resolve });
  });
}
function fadeFromBlack(ms = 1000) {
  return new Promise(resolve => {
    const ov = document.getElementById('act-transition');
    gsap.to(ov, {
      opacity: 0, duration: ms / 1000, ease: 'power2.inOut',
      onComplete: () => { ov.classList.add('ui-hidden'); resolve(); }
    });
  });
}
async function switchAct(fromId, toId, musicId, callback) {
  await fadeToBlack();
  if (fromId) document.getElementById(fromId).classList.add('ui-hidden');
  if (toId)   document.getElementById(toId).classList.remove('ui-hidden');
  if (musicId) playTrack(musicId);
  if (callback) callback();
  await fadeFromBlack();
}

// ── SPARK BURST ────────────────────────────────────────────────────
function burstSpark(cx, cy) {
  const colors = ['#ff6b9d', '#ffd700', '#c47bff', '#fff', '#52b788'];
  for (let i = 0; i < 10; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    s.style.cssText = `left:${cx}px;top:${cy}px;`;
    s.style.background = colors[i % colors.length];
    const angle = Math.random() * Math.PI * 2;
    const dist  = 30 + Math.random() * 45;
    s.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    s.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    s.style.animationDuration = `${0.45 + Math.random() * 0.35}s`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 850);
  }
}

// ── RAIN ───────────────────────────────────────────────────────────
function createRain(containerId, count = 60) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  wrap.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const d = document.createElement('div');
    d.className = 'drop';
    d.style.left     = `${Math.random() * 100}%`;
    d.style.height   = `${14 + Math.random() * 22}px`;
    d.style.opacity  = `${0.15 + Math.random() * 0.2}`;
    d.style.animationDuration = `${0.65 + Math.random() * 0.9}s`;
    d.style.animationDelay    = `${Math.random() * 2}s`;
    wrap.appendChild(d);
  }
}

// ══════════════════════════════════════════════════════════════════
// DECOY → REVEAL → GATE
// ══════════════════════════════════════════════════════════════════
document.getElementById('decoy-btn').addEventListener('click', startReveal);

async function startReveal() {
  // Fade out decoy
  const decoy = document.getElementById('decoy-site');
  decoy.classList.add('fade-out');
  await new Promise(r => setTimeout(r, 650));
  decoy.style.display = 'none';

  // Show reveal overlay
  const overlay = document.getElementById('reveal-overlay');
  const msgEl   = document.getElementById('reveal-msg');
  overlay.classList.remove('ui-hidden');
  msgEl.textContent = BIRTHDAY_CONFIG.revealMsg;

  // Animate message in
  await new Promise(r => setTimeout(r, 80));
  msgEl.classList.add('show');

  // Wait 2.5s then start gate
  await new Promise(r => setTimeout(r, 2500));
  msgEl.classList.remove('show');
  await new Promise(r => setTimeout(r, 600));
  overlay.classList.add('ui-hidden');

  openGate();
}

function openGate() {
  const gate = document.getElementById('gate-wrap');
  gate.classList.remove('ui-hidden');

  // Glow first
  gate.classList.add('glowing');

  setTimeout(() => {
    // Start music
    bgMusicPlaying = true;
    playTrack('music-ch1');

    // Open gate doors
    gate.classList.add('open');

    setTimeout(() => {
      // Show experience behind the gate
      document.getElementById('experience').classList.remove('ui-hidden');
      document.getElementById('music-player').style.display = 'flex';

      // After gate fully opens, start cinema
      setTimeout(() => {
        gate.style.display = 'none';
        startCinema();
      }, 600);
    }, 900);
  }, 400);
}

// ══════════════════════════════════════════════════════════════════
// ACT 1 — CINEMA (auto-play photo film)
// ══════════════════════════════════════════════════════════════════
const SCENES = BIRTHDAY_CONFIG.scenes;
let sceneIdx = 0;
let photoIdx = 0;
let activeSlot = 'a';
let sceneTimer = null;
let photoTimer = null;

function startCinema() {
  document.getElementById('act-cinema').classList.remove('ui-hidden');

  // Build scene dots
  const dotsEl = document.getElementById('scene-dots');
  dotsEl.innerHTML = '';
  SCENES.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'sdot' + (i === 0 ? ' active' : '');
    dotsEl.appendChild(d);
  });

  // Cinematic canvas — floating dust
  const canvas = document.getElementById('cinema-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const dust = Array.from({ length: 55 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.4,
    alpha: Math.random() * 0.35 + 0.1,
    vy: -(Math.random() * 0.22 + 0.06),
    vx: (Math.random() - 0.5) * 0.05
  }));
  function renderDust() {
    if (document.getElementById('act-cinema').classList.contains('ui-hidden')) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dust.forEach(d => {
      d.y += d.vy; d.x += d.vx;
      if (d.y < 0) d.y = canvas.height;
      if (d.x < 0 || d.x > canvas.width) d.vx = -d.vx;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,215,160,${d.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(renderDust);
  }
  renderDust();

  sceneIdx = 0;
  playScene(0);
}

function playScene(idx) {
  clearTimeout(sceneTimer);
  clearTimeout(photoTimer);

  if (idx >= SCENES.length) {
    endCinema();
    return;
  }

  const s = SCENES[idx];

  // Update dots
  document.querySelectorAll('.sdot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
    if (i < idx) d.classList.add('done');
  });

  // Animate text card
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

  // Photos
  setScenePhoto(s.photos, 0);
  photoIdx = 0;
  const photoCycleMs = Math.floor(s.durationMs / s.photos.length);
  function cyclePhotos() {
    photoIdx++;
    if (photoIdx < s.photos.length) {
      setScenePhoto(s.photos, photoIdx);
      photoTimer = setTimeout(cyclePhotos, photoCycleMs);
    }
  }
  if (s.photos.length > 1) photoTimer = setTimeout(cyclePhotos, photoCycleMs);

  // Progress bar
  const fill = document.getElementById('cinema-fill');
  fill.style.transition = 'none';
  fill.style.width = '0%';
  setTimeout(() => {
    fill.style.transition = `width ${s.durationMs}ms linear`;
    fill.style.width = '100%';
  }, 80);

  // Auto-advance
  sceneTimer = setTimeout(() => {
    sceneIdx++;
    playScene(sceneIdx);
  }, s.durationMs);
}

function setScenePhoto(photos, pIdx) {
  const imgA = document.getElementById('img-a');
  const imgB = document.getElementById('img-b');
  const active = activeSlot === 'a' ? imgA : imgB;
  const out    = activeSlot === 'a' ? imgB : imgA;

  active.src = photos[pIdx % photos.length];
  active.style.opacity = '0';
  active.style.transition = 'opacity 1.5s ease-in-out';
  active.onload = () => {
    requestAnimationFrame(() => {
      active.style.opacity = '1';
      out.style.opacity    = '0';
      // Reset Ken Burns animation
      active.style.animation = 'none';
      void active.offsetWidth;
      active.style.animation = 'kenBurns 8s ease-in-out forwards';
    });
  };
  active.onerror = () => {};
  activeSlot = activeSlot === 'a' ? 'b' : 'a';
}

async function endCinema() {
  await switchAct('act-cinema', 'act-moments', 'music-ch2', () => {
    startMoments();
  });
}

// ══════════════════════════════════════════════════════════════════
// ACT 2 — MOMENTS (auto-reveal list, then auto-advance)
// ══════════════════════════════════════════════════════════════════
function startMoments() {
  createRain('moments-rain', 55);

  // Moments canvas — soft orbs
  const canvas = document.getElementById('moments-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const orbs = Array.from({ length: 5 }, () => ({
    x: Math.random(), y: Math.random(),
    r: 60 + Math.random() * 100,
    alpha: 0.015 + Math.random() * 0.02,
    vx: (Math.random() - 0.5) * 0.0002,
    vy: (Math.random() - 0.5) * 0.0001
  }));
  function renderOrbs() {
    if (document.getElementById('act-moments').classList.contains('ui-hidden')) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const W = canvas.width, H = canvas.height;
    orbs.forEach(o => {
      o.x = Math.max(0, Math.min(1, o.x + o.vx));
      o.y = Math.max(0, Math.min(1, o.y + o.vy));
      if (o.x <= 0 || o.x >= 1) o.vx = -o.vx;
      if (o.y <= 0 || o.y >= 1) o.vy = -o.vy;
      const g = ctx.createRadialGradient(o.x * W, o.y * H, 0, o.x * W, o.y * H, o.r);
      g.addColorStop(0, `rgba(82,183,136,${o.alpha})`);
      g.addColorStop(1, 'rgba(82,183,136,0)');
      ctx.beginPath();
      ctx.arc(o.x * W, o.y * H, o.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });
    requestAnimationFrame(renderOrbs);
  }
  renderOrbs();

  // Build and stagger-reveal moment items
  const list = document.getElementById('moments-list');
  list.innerHTML = '';
  const moments = BIRTHDAY_CONFIG.moments;
  moments.forEach((m, i) => {
    const item = document.createElement('div');
    item.className = 'moment-item';
    item.innerHTML = `<span class="moment-icon">${m.icon}</span><span>${m.text}</span>`;
    list.appendChild(item);
    setTimeout(() => item.classList.add('visible'), i * 450);
  });

  // After all moments shown, wait 2s then go to hearts
  const totalRevealMs = moments.length * 450 + 600;
  setTimeout(() => {
    switchAct('act-moments', 'act-hearts', null, startHearts);
  }, totalRevealMs + 2000);
}

// ══════════════════════════════════════════════════════════════════
// ACT 3 — FLOATING HEARTS (10 hearts, tap all → auto next)
// ══════════════════════════════════════════════════════════════════
let heartsRevealed = 0;
const HEARTS = BIRTHDAY_CONFIG.hearts;

function startHearts() {
  heartsRevealed = 0;
  document.getElementById('hearts-count').textContent = `0 / ${HEARTS.length} raazein khuli...`;

  // Firefly canvas
  const canvas = document.getElementById('hearts-canvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const flies = Array.from({ length: 25 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 2 + 0.8,
    angle: Math.random() * Math.PI * 2,
    speed: 0.002 + Math.random() * 0.002,
    alpha: Math.random()
  }));
  function renderFlies() {
    if (document.getElementById('act-hearts').classList.contains('ui-hidden')) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const W = canvas.width, H = canvas.height;
    flies.forEach(f => {
      f.angle += (Math.random() - 0.5) * 0.12;
      f.x = Math.max(0, Math.min(1, f.x + Math.cos(f.angle) * f.speed));
      f.y = Math.max(0, Math.min(1, f.y + Math.sin(f.angle) * f.speed));
      f.alpha = 0.3 + Math.random() * 0.7;
      const g = ctx.createRadialGradient(f.x*W, f.y*H, 0, f.x*W, f.y*H, f.r*5);
      g.addColorStop(0, `rgba(244,220,80,${f.alpha})`);
      g.addColorStop(1, 'rgba(244,162,97,0)');
      ctx.beginPath();
      ctx.arc(f.x*W, f.y*H, f.r, 0, Math.PI*2);
      ctx.fillStyle = g;
      ctx.fill();
    });
    requestAnimationFrame(renderFlies);
  }
  renderFlies();
  createRain('hearts-rain', 45);

  // Place 10 hearts in the arena
  const arena = document.getElementById('hearts-arena');
  arena.innerHTML = '';
  const popup   = document.getElementById('heart-popup');
  const popEmoji = document.getElementById('popup-emoji');
  const popMsg  = document.getElementById('popup-msg');

  document.getElementById('popup-close').onclick = () => popup.classList.add('ui-hidden');

  const positions = [
    { left: 8,  top: 30 }, { left: 22, top: 10 }, { left: 38, top: 40 },
    { left: 55, top: 15 }, { left: 70, top: 38 }, { left: 82, top: 12 },
    { left: 14, top: 68 }, { left: 44, top: 72 }, { left: 65, top: 62 },
    { left: 85, top: 70 }
  ];

  HEARTS.forEach((h, i) => {
    const bbl = document.createElement('div');
    bbl.className = 'heart-bubble';
    bbl.textContent = '❤️';
    bbl.style.left = `calc(${positions[i].left}% - 24px)`;
    bbl.style.top  = `calc(${positions[i].top}% - 24px)`;

    // Floating animation offset per heart
    bbl.style.animation = `float ${2.5 + Math.random() * 1.5}s ease-in-out ${Math.random() * 1.5}s infinite`;

    let done = false;
    bbl.addEventListener('click', e => {
      e.stopPropagation();
      if (!done) {
        done = true;
        heartsRevealed++;
        bbl.classList.add('wink');
        bbl.textContent = h.emoji;
        bbl.classList.add('revealed');
        document.getElementById('hearts-count').textContent =
          `${heartsRevealed} / ${HEARTS.length} raazein khuli...`;
        burstSpark(e.clientX, e.clientY);

        // Show popup
        popEmoji.textContent = h.emoji;
        popMsg.textContent   = h.reason;
        popup.classList.remove('ui-hidden');

        // Check if all revealed
        if (heartsRevealed === HEARTS.length) {
          setTimeout(() => {
            popup.classList.add('ui-hidden');
          }, 2000);
          // 2.5s pause then auto-advance to shower
          setTimeout(() => {
            switchAct('act-hearts', 'act-shower', 'music-ch3', startShower);
          }, 2800);
        }
      } else {
        // Re-show reason
        popEmoji.textContent = h.emoji;
        popMsg.textContent   = h.reason;
        popup.classList.remove('ui-hidden');
      }
    });

    arena.appendChild(bbl);
  });
}

// ══════════════════════════════════════════════════════════════════
// ACT 4 — LOVE SHOWER (catch falling hearts, then auto-advance)
// ══════════════════════════════════════════════════════════════════
let showerCaught = 0;
const SHOWER_TOTAL = 10;

function startShower() {
  showerCaught = 0;
  document.getElementById('shower-score').textContent = `0 / ${SHOWER_TOTAL}`;

  const arena = document.getElementById('shower-arena');
  arena.innerHTML = '';

  // Canvas — purple/pink aurora
  const canvas = document.getElementById('shower-canvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const aOrbs = Array.from({ length: 4 }, () => ({
    x: Math.random(), y: Math.random(),
    r: 80 + Math.random() * 120,
    hue: Math.random() > 0.5 ? 280 : 330,
    alpha: 0.025 + Math.random() * 0.03,
    vx: (Math.random() - 0.5) * 0.0003,
    vy: (Math.random() - 0.5) * 0.0002
  }));
  function renderAurora() {
    if (document.getElementById('act-shower').classList.contains('ui-hidden')) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const W = canvas.width, H = canvas.height;
    aOrbs.forEach(o => {
      o.x = Math.max(0, Math.min(1, o.x + o.vx));
      o.y = Math.max(0, Math.min(1, o.y + o.vy));
      if (o.x <= 0 || o.x >= 1) o.vx = -o.vx;
      if (o.y <= 0 || o.y >= 1) o.vy = -o.vy;
      const g = ctx.createRadialGradient(o.x*W, o.y*H, 0, o.x*W, o.y*H, o.r);
      g.addColorStop(0, `hsla(${o.hue},75%,60%,${o.alpha})`);
      g.addColorStop(1, `hsla(${o.hue},75%,60%,0)`);
      ctx.beginPath();
      ctx.arc(o.x*W, o.y*H, o.r, 0, Math.PI*2);
      ctx.fillStyle = g;
      ctx.fill();
    });
    requestAnimationFrame(renderAurora);
  }
  renderAurora();

  const msgs = BIRTHDAY_CONFIG.showerMessages;
  let spawned = 0;

  function spawnHeart() {
    if (spawned >= SHOWER_TOTAL) return;
    spawned++;

    const fh = document.createElement('div');
    fh.className   = 'falling-heart';
    fh.textContent = '❤️';
    const rot = -15 + Math.random() * 30;
    fh.style.setProperty('--rot', `${rot}deg`);
    fh.style.left = `${5 + Math.random() * 80}%`;
    const dur = 3.5 + Math.random() * 2.5;
    fh.style.animationDuration = `${dur}s`;
    arena.appendChild(fh);

    fh.addEventListener('click', e => {
      e.stopPropagation();
      if (fh.classList.contains('caught')) return;
      fh.classList.add('caught');
      showerCaught++;
      document.getElementById('shower-score').textContent = `${showerCaught} / ${SHOWER_TOTAL}`;
      burstSpark(e.clientX, e.clientY);

      if (showerCaught >= SHOWER_TOTAL) {
        // All caught — advance to finale
        setTimeout(() => {
          switchAct('act-shower', 'act-finale', 'music-ch1', startFinale);
        }, 1200);
      }
    });

    // Auto-remove after fall
    setTimeout(() => { if (fh.parentNode) fh.remove(); }, dur * 1000 + 200);

    // Spawn next heart
    setTimeout(spawnHeart, 1200 + Math.random() * 800);
  }

  // Start spawning
  setTimeout(spawnHeart, 800);

  // Safety: if user doesn't catch all in 35s, auto-advance anyway
  setTimeout(() => {
    if (!document.getElementById('act-shower').classList.contains('ui-hidden')) {
      switchAct('act-shower', 'act-finale', 'music-ch1', startFinale);
    }
  }, 35000);
}

// ══════════════════════════════════════════════════════════════════
// ACT 5 — FINALE (fireworks, lanterns, letter)
// ══════════════════════════════════════════════════════════════════
function startFinale() {
  startFireworks();
  startLanterns();

  // Envelope → letter
  const env    = document.getElementById('finale-envelope');
  const letter = document.getElementById('finale-letter');
  const closing = document.getElementById('finale-closing');

  env.addEventListener('click', () => {
    gsap.to(env, {
      opacity: 0, scale: 0.9, duration: 0.4,
      onComplete: () => {
        env.classList.add('ui-hidden');
        letter.classList.remove('ui-hidden');
        document.getElementById('letter-body').textContent = BIRTHDAY_CONFIG.letter;
        gsap.fromTo(letter, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 });
        setTimeout(() => {
          closing.classList.remove('ui-hidden');
          document.getElementById('closing-line').textContent = BIRTHDAY_CONFIG.closingLine;
          gsap.fromTo(closing, { opacity: 0 }, { opacity: 1, duration: 1.2 });
          startFireworks(); // Second burst
        }, 3500);
      }
    });
  });

  // Finale canvas — golden stars
  const canvas = document.getElementById('finale-canvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const stars = Array.from({ length: 80 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.5,
    alpha: Math.random(),
    speed: (Math.random() * 0.012 + 0.003) * (Math.random() > 0.5 ? 1 : -1)
  }));
  function renderStars() {
    if (document.getElementById('act-finale').classList.contains('ui-hidden')) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const W = canvas.width, H = canvas.height;
    stars.forEach(s => {
      s.alpha += s.speed;
      if (s.alpha >= 1 || s.alpha <= 0) s.speed = -s.speed;
      ctx.beginPath();
      ctx.arc(s.x*W, s.y*H, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,215,0,${Math.abs(s.alpha) * 0.7})`;
      ctx.fill();
    });
    requestAnimationFrame(renderStars);
  }
  renderStars();
}

function startFireworks() {
  const container = document.getElementById('finale-fireworks');
  for (let b = 0; b < 5; b++) {
    setTimeout(() => {
      const cx = 10 + Math.random() * 80;
      const cy = 5  + Math.random() * 45;
      const colors = ['#ffd700', '#ff6b9d', '#c47bff', '#52b788', '#fff'];
      for (let i = 0; i < 22; i++) {
        const s = document.createElement('div');
        s.className = 'spark';
        s.style.position = 'fixed';
        s.style.left = `${cx}%`;
        s.style.top  = `${cy}%`;
        s.style.background = colors[i % colors.length];
        const angle = (i / 22) * Math.PI * 2;
        const dist  = 35 + Math.random() * 55;
        s.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
        s.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
        s.style.animationDuration = `${0.55 + Math.random() * 0.45}s`;
        container.appendChild(s);
        setTimeout(() => s.remove(), 1100);
      }
    }, b * 380);
  }
}

function startLanterns() {
  const container = document.getElementById('finale-lanterns');
  const items = ['🏮', '✨', '💛', '🌟', '🎇', '🪔'];
  function spawnLantern() {
    if (document.getElementById('act-finale').classList.contains('ui-hidden')) return;
    const l = document.createElement('div');
    l.className   = 'lantern';
    l.textContent = items[Math.floor(Math.random() * items.length)];
    l.style.left  = `${5 + Math.random() * 88}%`;
    l.style.fontSize = `${1 + Math.random() * 0.7}rem`;
    const dur = 9 + Math.random() * 7;
    l.style.animationDuration = `${dur}s`;
    container.appendChild(l);
    setTimeout(() => l.remove(), dur * 1000);
    setTimeout(spawnLantern, 1500 + Math.random() * 2000);
  }
  spawnLantern();
}