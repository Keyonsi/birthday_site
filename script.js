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

}

let decoyFwRunning = false;

function startDecoyFireworks() {
  const cv = document.getElementById('decoy-fireworks-canvas');
  const counterEl = document.getElementById('decoy-rocket-counter');
  const badgeEl = document.getElementById('rocket-count-badge');
  if (!cv) return;

  const ctx = cv.getContext('2d');
  cv.style.zIndex = '1';
  cv.width = window.innerWidth;
  cv.height = window.innerHeight;

  window.addEventListener('resize', () => {
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;
  });

  const colors = ['#ffd700', '#ff2d55', '#c47bff', '#00f5d4', '#ff9a9e', '#ffffff', '#f472b6'];
  let rockets = [];
  let particles = [];
  let currentAge = 0;
  const maxAge = 23; // 2 Aug 2003 -> 2 Aug 2026 = 23 Years!
  decoyFwRunning = true;

  if (counterEl) counterEl.classList.remove('ui-hidden');

  // Helper to launch one rocket from bottom
  function launchRocket() {
    if (!decoyFwRunning) return;
    const startX = (0.2 + Math.random() * 0.6) * cv.width;
    const targetY = (0.12 + Math.random() * 0.28) * cv.height;
    
    rockets.push({
      x: startX,
      y: cv.height,
      targetY: targetY,
      vy: -(11 + Math.random() * 4),
      color: colors[Math.floor(Math.random() * colors.length)],
      trail: []
    });
  }

  // Launch rockets one by one every 450ms until 23 rockets are launched
  let rocketsLaunched = 0;
  const rocketTimer = setInterval(() => {
    if (!decoyFwRunning || rocketsLaunched >= maxAge) {
      clearInterval(rocketTimer);
      return;
    }
    launchRocket();
    rocketsLaunched++;
  }, 450);

  // Main render loop for rockets & firework explosions
  (function renderRocketFw() {
    if (!decoyFwRunning) { ctx.clearRect(0, 0, cv.width, cv.height); return; }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.fillRect(0, 0, cv.width, cv.height);

    // Update and draw active rockets
    rockets.forEach((r, idx) => {
      r.y += r.vy;
      // Add spark trail
      r.trail.push({ x: r.x + (Math.random() - 0.5) * 2, y: r.y, alpha: 0.8, r: 1.8 });
      if (r.trail.length > 10) r.trail.shift();

      // Draw trail
      r.trail.forEach(t => {
        t.alpha -= 0.08;
        ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 220, 100, ${Math.max(0, t.alpha)})`;
        ctx.fill();
      });

      // Draw rocket head
      ctx.beginPath(); ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff'; ctx.fill();

      // Explosion trigger when rocket reaches target height
      if (r.y <= r.targetY) {
        sfxPlay('candle'); // sound on explosion
        currentAge++;

        // Update counter badge text
        if (badgeEl) {
          if (currentAge < maxAge) {
            badgeEl.textContent = `Year ${2003 + currentAge - 1}... ${currentAge} ${currentAge === 1 ? 'Year' : 'Years'} ✨`;
          } else {
            badgeEl.textContent = `Happy 23rd Birthday, My Baby! 🥳🎂🎉`;
            badgeEl.style.background = 'linear-gradient(135deg, #ff2d55, #c47bff)';
            badgeEl.style.fontSize = 'clamp(1.2rem, 5vw, 1.8rem)';
            
            // Start 8-second countdown to main reveal AFTER final 23rd rocket burst
            setTimeout(() => {
              triggerDecoyReveal();
            }, 8000);
          }
          // Bounce badge
          gsap.fromTo(badgeEl, { scale: 0.85 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
        }

        // Spawn 45 firework particles
        const count = 45;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const speed = 1.8 + Math.random() * 3.8;
          particles.push({
            x: r.x, y: r.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            color: r.color,
            r: 2.2 + Math.random() * 2.5
          });
        }

        rockets.splice(idx, 1);
      }
    });

    // Update and draw firework particles
    particles.forEach((p, idx) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.038; // gravity
      p.vx *= 0.975;
      p.alpha -= 0.015;

      if (p.alpha <= 0) { particles.splice(idx, 1); return; }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    requestAnimationFrame(renderRocketFw);
  })();
}

function triggerDecoyReveal() {
  decoyFwRunning = false;
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

  // Update intro text with more cinematic wording
  const titleEl = document.querySelector('.intro-title');
  const subEl   = document.querySelector('.intro-subtitle');
  const subText = document.querySelector('.intro-subtext');
  if (titleEl) titleEl.innerHTML = 'Tumhari Yaadein 🌸';
  if (subEl)   subEl.textContent = 'Kuch pal hote hain jo zindagi bhar yaad rehte hain...';
  if (subText) subText.textContent = 'Aaj main tumhein unhi palon mein le jaana chahta hoon.';
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

let cricketInterval = null;
let cricketHumOsc = null;
let cricketHumGain = null;

function startCricketsSound() {
  try {
    const ctx = getACtx();
    const now = ctx.currentTime;
    
    cricketHumOsc = ctx.createOscillator();
    cricketHumGain = ctx.createGain();
    cricketHumOsc.type = 'sine';
    cricketHumOsc.frequency.value = 52; // very cozy deep night hum
    cricketHumGain.gain.setValueAtTime(0, now);
    cricketHumGain.gain.linearRampToValueAtTime(0.035, now + 1.5);
    cricketHumOsc.connect(cricketHumGain);
    cricketHumGain.connect(ctx.destination);
    cricketHumOsc.start(now);

    let active = true;
    cricketInterval = setInterval(() => {
      if (!active || ctx.state === 'suspended') return;
      // Synthesize cricket chirps: high pitch modulated pulses
      const t = ctx.currentTime;
      const numChirps = 3 + Math.floor(Math.random() * 2);
      for (let i = 0; i < numChirps; i++) {
        const offset = i * 0.07;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(3200 + Math.random() * 200, t + offset);
        o.frequency.exponentialRampToValueAtTime(2600, t + offset + 0.05);
        g.gain.setValueAtTime(0, t + offset);
        g.gain.linearRampToValueAtTime(0.008, t + offset + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + offset + 0.045);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t + offset);
        o.stop(t + offset + 0.05);
      }
    }, 1800 + Math.random() * 800);
  } catch(e) {}
}

function stopCricketsSound() {
  try {
    if (cricketInterval) { clearInterval(cricketInterval); cricketInterval = null; }
    if (cricketHumGain) {
      cricketHumGain.gain.setTargetAtTime(0, getACtx().currentTime, 0.4);
      setTimeout(() => {
        try { if (cricketHumOsc) { cricketHumOsc.stop(); cricketHumOsc = null; } } catch(e){}
      }, 1000);
    }
  } catch(e) {}
}

// ══════════════════════════════════════════════════════════════════
// ACT 2 — MOMENTS: Full-screen canvas (Sky + Moon + Clouds + Lightning)
// ══════════════════════════════════════════════════════════════════
let momentsRevealed = 0;

// Cloud data for the moments scene
let cloudData = [];
// State for the final moon flare burst drawn on canvas
let moonFlareState = null;
// Decoy leaves
let leafDecoyInterval = null;

function startMoments() {
  momentsRevealed = 0;
  const moments = BIRTHDAY_CONFIG.moments;
  if (document.getElementById('moments-count')) {
    document.getElementById('moments-count').textContent = `0 / ${moments.length} yaadein khuli...`;
  }

  createRain('moments-rain', 80, 'rgba(120,160,255,0.18)');
  startRainSound(0.03);
  startCricketsSound();

  const cv = document.getElementById('moments-canvas');
  const ctx = cv.getContext('2d');
  cv.width = window.innerWidth;
  cv.height = window.innerHeight;
  const W = cv.width, H = cv.height;

  // ── Moon — single source of truth for position ──
  const moonR = Math.min(W, H) * 0.11;   // bigger, more premium
  const moon = {
    cx: W * 0.72,
    cy: H * 0.18,
    r: moonR,
    glow: 0.15
  };

  // ── Constellation Star Positions for 39 memories (2 August 2003 Starry Sky) ──
  const nonMoonMemories = moments.filter(m => !m.isMoonClimax);
  cloudData = [];

  // Moon fraction in normalized space
  const moonXf = moon.cx / W, moonYf = moon.cy / H;
  const moonExcludeRadius = 0.16; // don't place stars too close to moon

  const cols = 6, rows = 7;
  const positions = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const xf = 0.06 + (c + 0.5) * (0.88 / cols) + (Math.random() - 0.5) * 0.04;
      const yf = 0.06 + (r + 0.5) * (0.65 / rows) + (Math.random() - 0.5) * 0.04;
      const dx = xf - moonXf, dy = yf - moonYf;
      if (Math.sqrt(dx * dx + dy * dy) > moonExcludeRadius) {
        positions.push({ xf, yf });
      }
    }
  }
  // Shuffle positions for natural distribution
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  nonMoonMemories.forEach((m, i) => {
    const pos = positions[i % positions.length] || { xf: 0.1 + Math.random() * 0.8, yf: 0.1 + Math.random() * 0.55 };
    const baseScale = 0.7 + Math.random() * 0.4;
    cloudData.push({
      idx: i, interactive: true,
      cx: W * pos.xf, cy: H * pos.yf,
      scale: baseScale,
      // Twinkle animation state
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.02 + Math.random() * 0.03,
      litAlpha: 0, revealed: false, done: false,
      icon: m.icon || '✨', moment: m
    });
  });

  // ── Background twinkling star field ──
  const bgStars = Array.from({ length: 120 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H * 0.75,
    r: Math.random() * 1.2 + 0.2,
    phase: Math.random() * Math.PI * 2,
    speed: 0.015 + Math.random() * 0.025
  }));

  // ── Fireflies ──
  const flies = Array.from({ length: 14 }, () => ({
    x: Math.random() * W,
    y: H * 0.55 + Math.random() * H * 0.35,
    r: Math.random() * 1.8 + 0.9,
    angle: Math.random() * Math.PI * 2,
    speed: 0.25 + Math.random() * 0.4,
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

  // ── Spawn interactive falling leaf decoys ──
  const leafContainer = document.getElementById('act-moments');
  const leafEmojis = ['🍁', '🍂', '🍃'];
  
  function spawnDecoyLeaf() {
    if (document.getElementById('act-moments').classList.contains('ui-hidden')) return;
    const leaf = document.createElement('div');
    leaf.className = 'decoy-active-item';
    leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
    leaf.style.left = `${10 + Math.random() * 80}%`;
    leaf.style.top = `-30px`;
    
    // Slow fall rotation drift
    const startX = Math.random() * 10;
    gsap.fromTo(leaf, 
      { y: -30, rotation: 0, x: startX },
      { 
        y: window.innerHeight + 50, 
        rotation: 360 + Math.random() * 360, 
        x: startX + (Math.random() > 0.5 ? 40 : -40),
        duration: 8 + Math.random() * 6, 
        ease: 'none',
        onComplete: () => leaf.remove()
      }
    );

    leaf.addEventListener('click', (e) => {
      e.stopPropagation();
      leaf.classList.add('popped');
      sfxPlay('candle'); // high chime sound
      burstSpark(e.clientX, e.clientY, 6);
      setTimeout(() => leaf.remove(), 400);
    });

    leafContainer.appendChild(leaf);
  }
  
  // Spawn a leaf decoy every 4 seconds
  leafDecoyInterval = setInterval(spawnDecoyLeaf, 4000);

  // ════ DRAW HELPERS ════

  function drawCloud(ctx, cx, cy, scale, alpha, litAlpha) {
    const s = scale;
    ctx.save();
    const baseAlpha = Math.min(0.92, alpha + litAlpha * 0.35);
    ctx.globalAlpha = baseAlpha;

    if (litAlpha > 0.01) {
      const glowR = 85 * s;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      g.addColorStop(0, `rgba(255,255,255,${litAlpha * 0.28})`);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      ctx.globalAlpha = baseAlpha;
    }

    ctx.shadowColor = litAlpha > 0.3 ? 'rgba(255,255,255,0.5)' : 'rgba(100,180,140,0.18)';
    ctx.shadowBlur = litAlpha > 0.3 ? 18 : 6;

    const lum = Math.round(litAlpha * 60);
    ctx.fillStyle = `rgb(${185 + lum},${210 + lum},${200 + lum})`;

    ctx.beginPath(); ctx.arc(cx,           cy,           36 * s, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx - 28 * s,  cy + 8 * s,   26 * s, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 28 * s,  cy + 8 * s,   24 * s, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx - 14 * s,  cy - 22 * s,  22 * s, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 16 * s,  cy - 18 * s,  18 * s, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(cx - 62 * s, cy, 124 * s, 28 * s);

    ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawMoon(ctx, cx, cy, r, glowFrac) {
    ctx.save();

    // Outermost diffuse atmospheric halo (3 layers)
    const haloSizes = [r * 4.5, r * 3.0, r * 1.8];
    const haloAlphas = [0.022, 0.055, 0.12];
    haloSizes.forEach((hr, i) => {
      const h = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, hr);
      h.addColorStop(0, `rgba(255,245,200,${(haloAlphas[i] + glowFrac * 0.12) * glowFrac})`);
      h.addColorStop(1, 'rgba(255,235,150,0)');
      ctx.beginPath(); ctx.arc(cx, cy, hr, 0, Math.PI * 2);
      ctx.fillStyle = h; ctx.fill();
    });

    // Inner close glow ring
    const innerGlowR = r * 1.6 + r * 0.9 * glowFrac;
    const ig = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, innerGlowR);
    ig.addColorStop(0, `rgba(255,250,220,${0.15 + glowFrac * 0.55})`);
    ig.addColorStop(0.6, `rgba(255,235,150,${glowFrac * 0.28})`);
    ig.addColorStop(1, 'rgba(255,220,100,0)');
    ctx.beginPath(); ctx.arc(cx, cy, innerGlowR, 0, Math.PI * 2);
    ctx.fillStyle = ig; ctx.fill();

    // Moon surface body — warm cream/ivory to golden edge
    const moonGrad = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.25, 0, cx, cy, r);
    moonGrad.addColorStop(0, `rgba(255,255,252,${0.55 + glowFrac * 0.45})`);
    moonGrad.addColorStop(0.4, `rgba(255,252,230,${0.42 + glowFrac * 0.5})`);
    moonGrad.addColorStop(0.8, `rgba(245,235,195,${0.28 + glowFrac * 0.5})`);
    moonGrad.addColorStop(1, `rgba(220,210,170,${0.12 + glowFrac * 0.38})`);
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = moonGrad; ctx.fill();
    ctx.restore();
  }

  // Draw suburban ranch house layout (matching sample photo)
  function drawVegetation(ctx, W, H) {
    const groundY = H * 0.76;

    // ── Ground gradient strip ──
    const groundGrad = ctx.createLinearGradient(0, groundY, 0, H);
    groundGrad.addColorStop(0, 'rgba(15,42,22,0.9)');
    groundGrad.addColorStop(0.4, 'rgba(8,26,14,0.96)');
    groundGrad.addColorStop(1, 'rgba(3,12,5,1)');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, groundY, W, H - groundY);

    // ── Wet Grass wave ──
    ctx.save();
    ctx.fillStyle = 'rgba(28,82,38,0.85)';
    ctx.beginPath();
    ctx.moveTo(0, groundY + 10);
    for (let x = 0; x <= W; x += 18) {
      ctx.quadraticCurveTo(x + 5, groundY - 12, x + 9, groundY + 2);
      ctx.quadraticCurveTo(x + 13, groundY - 10, x + 18, groundY + 8);
    }
    ctx.lineTo(W, H); ctx.lineTo(0, H);
    ctx.closePath(); ctx.fill();
    ctx.restore();

    // Helper: draw a tree silhouette
    function drawTree(x, y, scale) {
      const s = scale;
      ctx.save();
      ctx.fillStyle = 'rgba(8,25,12,0.88)';
      ctx.fillRect(x - 4 * s, y, 8 * s, 30 * s);
      const colors = ['rgba(12,48,22,0.9)', 'rgba(16,65,28,0.85)', 'rgba(22,80,36,0.8)'];
      [[0, -50, 36], [-8, -75, 28], [-12, -95, 22]].forEach(([dy, top, width], i) => {
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.moveTo(x, y + top * s);
        ctx.lineTo(x - width * s, y + (top + 35) * s);
        ctx.lineTo(x + width * s, y + (top + 35) * s);
        ctx.closePath(); ctx.fill();
      });
      ctx.restore();
    }

    const hs = Math.min(1, W / 420);

    // Tree silhouettes behind the cottage framing it (from photo)
    ctx.fillStyle = 'rgba(6,18,10,0.95)';
    ctx.beginPath();
    ctx.arc(W * 0.15, groundY - 30 * hs, 55 * hs, 0, Math.PI * 2);
    ctx.arc(W * 0.32, groundY - 45 * hs, 65 * hs, 0, Math.PI * 2);
    ctx.arc(W * 0.68, groundY - 45 * hs, 68 * hs, 0, Math.PI * 2);
    ctx.arc(W * 0.85, groundY - 30 * hs, 60 * hs, 0, Math.PI * 2);
    ctx.fill();

    // Draw small procedural pine trees on the edges
    drawTree(W * 0.06, groundY, 0.85 * hs);
    drawTree(W * 0.94, groundY, 0.9 * hs);

    // ── Wide Suburban Ranch House Layout (from Photo) ──
    const hx = W * 0.5; // center
    const hy = groundY;
    const hw = Math.max(220, Math.min(360, W * 0.65)); // wide profile ranch house
    const hh = hw * 0.38;

    // House main body
    ctx.save();
    ctx.fillStyle = 'rgba(24,20,32,0.94)'; // dark siding look
    ctx.fillRect(hx - hw / 2, hy - hh, hw, hh);

    // Front porch overhang roof (polygon matching photo profile)
    ctx.fillStyle = 'rgba(12,10,18,0.96)'; // dark roof shingle
    ctx.beginPath();
    ctx.moveTo(hx - hw / 2 - 8 * hs, hy - hh);
    ctx.lineTo(hx, hy - hh - hh * 0.25); // pitched roof peak
    ctx.lineTo(hx + hw / 2 + 8 * hs, hy - hh);
    ctx.lineTo(hx + hw / 2, hy - hh);
    ctx.lineTo(hx - hw / 2, hy - hh);
    ctx.closePath(); ctx.fill();

    // Chimney (left side)
    const chx = hx - hw * 0.35, chy = hy - hh - 4 * hs;
    ctx.fillStyle = 'rgba(15,12,20,0.96)';
    ctx.fillRect(chx - 5 * hs, chy - 15 * hs, 10 * hs, 18 * hs);
    ctx.fillStyle = 'rgba(8,6,12,0.98)';
    ctx.fillRect(chx - 6 * hs, chy - 18 * hs, 12 * hs, 3 * hs);

    // ── Garage Door structure on the right side ──
    const gw = hw * 0.28, gh = hh * 0.62;
    const gx = hx + hw * 0.32, gy = hy;
    ctx.fillStyle = 'rgba(16,14,24,0.95)';
    ctx.fillRect(gx - gw / 2, gy - gh, gw, gh);
    // Garage door panels outline
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(gx - gw / 2 + 2 * hs, gy - gh + 2 * hs, gw - 4 * hs, gh - 4 * hs);

    // ── Arched window in center (warm golden-yellow glow inside) ──
    const aw = hw * 0.24, ah = hh * 0.65;
    const ax = hx - hw * 0.05, ay = hy - ah;
    
    // Golden glow cone casting on wet lawn
    const windowGlow = ctx.createRadialGradient(ax, ay + ah / 2, 0, ax, ay + ah / 2, ah * 1.8);
    windowGlow.addColorStop(0, 'rgba(255,180,50,0.22)');
    windowGlow.addColorStop(1, 'rgba(255,180,50,0)');
    ctx.fillStyle = windowGlow;
    ctx.beginPath(); ctx.arc(ax, ay + ah / 2, ah * 1.8, 0, Math.PI * 2); ctx.fill();

    // Inside window fill
    const insideGrad = ctx.createLinearGradient(0, ay, 0, ay + ah);
    insideGrad.addColorStop(0, 'rgba(255,215,80,0.92)');
    insideGrad.addColorStop(1, 'rgba(255,160,40,0.95)');
    ctx.fillStyle = insideGrad;
    
    // Draw Arched window polygon
    ctx.beginPath();
    ctx.arc(ax, ay + aw / 2, aw / 2, Math.PI, 0); // top arch
    ctx.rect(ax - aw / 2, ay + aw / 2, aw, ah - aw / 2); // lower body
    ctx.fill();

    // Window frame pane grid
    ctx.strokeStyle = 'rgba(12,10,18,0.7)';
    ctx.lineWidth = 1.8 * hs;
    // Arch divide lines
    ctx.beginPath();
    ctx.moveTo(ax, ay); ctx.lineTo(ax, ay + ah);
    ctx.moveTo(ax - aw / 2, ay + aw / 2); ctx.lineTo(ax + aw / 2, ay + aw / 2);
    ctx.stroke();

    // ── Garden pathway spotlights along the ground (from photo) ──
    const spots = [
      { x: hx - hw * 0.26, y: hy + 8 * hs },
      { x: hx - hw * 0.12, y: hy + 18 * hs },
      { x: hx + hw * 0.12, y: hy + 18 * hs },
      { x: hx + hw * 0.26, y: hy + 8 * hs }
    ];
    spots.forEach(pt => {
      // Spotlight glow bulb
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 3 * hs, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,220,100,0.95)'; ctx.fill();

      // Spotlight light cone
      const lg = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 20 * hs);
      lg.addColorStop(0, 'rgba(255,215,80,0.3)');
      lg.addColorStop(1, 'rgba(255,215,80,0)');
      ctx.fillStyle = lg;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 20 * hs, 0, Math.PI * 2); ctx.fill();
    });

    // "P ❤ K HOME" text placed above arched window
    ctx.font = `bold ${Math.round(8.5 * hs)}px 'Inter', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,190,210,0.85)';
    ctx.fillText('P ❤ K  HOME', ax, ay - 6 * hs);
    ctx.restore();

    // ── Family silhouettes near the glowing window ──
    function drawPerson(x, y, scale, color, hasChild) {
      ctx.save();
      ctx.fillStyle = color;
      const s = scale;
      // Head
      ctx.beginPath(); ctx.arc(x, y - 24 * s, 5 * s, 0, Math.PI * 2); ctx.fill();
      // Body
      ctx.fillRect(x - 3.5 * s, y - 19 * s, 7 * s, 15 * s);
      // Legs
      ctx.fillRect(x - 3.5 * s, y - 4 * s, 2.5 * s, 10 * s);
      ctx.fillRect(x + 1 * s, y - 4 * s, 2.5 * s, 10 * s);
      if (hasChild) {
        // Child in arms
        ctx.fillStyle = 'rgba(255,190,200,0.85)';
        const cx2 = x + 10 * s, cy2 = y - 13 * s;
        ctx.beginPath(); ctx.arc(cx2, cy2 - 5 * s, 3.5 * s, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(cx2 - 1.8 * s, cy2 - 1.8 * s, 4 * s, 8 * s);
      }
      ctx.restore();
    }

    const ps = Math.min(1, W / 420);
    drawPerson(hx - hw * 0.28, hy - 2, ps * 0.9, 'rgba(196,123,255,0.75)', false); // Man (left)
    drawPerson(hx - hw * 0.16, hy - 2, ps * 0.85, 'rgba(255,107,157,0.75)', true);  // Woman (right, holding child)

    // ── Chimney smoke particles generator ──
    if (Math.random() < 0.065) {
      smokeParticles.push({
        x: chx, y: chy - 18 * hs,
        r: 2.5 * hs,
        alpha: 0.55,
        vx: (Math.random() - 0.5) * 0.16,
        vy: -(0.25 + Math.random() * 0.25)
      });
    }
    // Update and draw smoke
    smokeParticles.forEach((p, index) => {
      p.x += p.vx; p.y += p.vy;
      p.r += 0.055; p.alpha -= 0.0035;
      if (p.alpha <= 0) { smokeParticles.splice(index, 1); return; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,180,190,${p.alpha})`; ctx.fill();
    });

    // ── Birds ──
    ctx.save();
    ctx.strokeStyle = 'rgba(220,240,220,0.5)';
    ctx.lineWidth = 1.2;
    const birdPositions = [
      { x: W * 0.15, y: H * 0.12 }, { x: W * 0.22, y: H * 0.10 }, { x: W * 0.19, y: H * 0.08 },
      { x: W * 0.72, y: H * 0.06 }, { x: W * 0.76, y: H * 0.09 }
    ];
    birdPositions.forEach(b => {
      const bs = 5 + Math.random() * 3;
      ctx.beginPath();
      ctx.moveTo(b.x - bs, b.y);
      ctx.quadraticCurveTo(b.x - bs / 2, b.y - bs / 2, b.x, b.y);
      ctx.quadraticCurveTo(b.x + bs / 2, b.y - bs / 2, b.x + bs, b.y);
      ctx.stroke();
    });
    ctx.restore();
  }

  // ── Moon flare state ──
  moonFlareState = null;

  // ── Main render loop ──
  (function render(ts) {
    if (document.getElementById('act-moments').classList.contains('ui-hidden')) return;

    ctx.clearRect(0, 0, W, H);

    // ── Deep midnight sky gradient ──
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
    skyGrad.addColorStop(0, '#020510');
    skyGrad.addColorStop(0.45, '#060b1e');
    skyGrad.addColorStop(0.75, '#0b0f28');
    skyGrad.addColorStop(1, '#040812');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    // ── Subtle nebula/galaxy smear top-left ──
    const neb = ctx.createRadialGradient(W * 0.18, H * 0.22, 0, W * 0.18, H * 0.22, W * 0.35);
    neb.addColorStop(0, 'rgba(80,60,140,0.055)');
    neb.addColorStop(0.5, 'rgba(60,40,110,0.03)');
    neb.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = neb; ctx.fillRect(0, 0, W, H);

    // ── Background twinkling stars ──
    bgStars.forEach(s => {
      s.phase += s.speed;
      const a = 0.3 + 0.55 * Math.abs(Math.sin(s.phase));
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = '#e8eeff';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });

    // ── Moon glow aura ──
    const glowPulse = 0.03 * Math.sin(ts * 0.0009);
    const effectiveGlow = Math.max(0.15, moon.glow + glowPulse);
    drawMoon(ctx, moon.cx, moon.cy, moon.r, effectiveGlow);

    // ── Moon craters (when glow < 0.6, show crescent-ish detail) ──
    if (moon.glow < 0.6) {
      ctx.save();
      ctx.globalAlpha = (0.6 - moon.glow) * 0.18;
      [[0.28, -0.32, 0.18], [-0.15, 0.1, 0.12], [0.1, 0.35, 0.09]].forEach(([ox, oy, rf]) => {
        ctx.beginPath();
        ctx.arc(moon.cx + ox * moon.r, moon.cy + oy * moon.r, rf * moon.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(60,80,100,0.5)';
        ctx.fill();
      });
      ctx.restore();
    }

    // ── Moon "Chhoo kar dekho" hint label ──
    if (moon.glow >= 0.98) {
      ctx.save();
      const lp = 0.7 + 0.3 * Math.sin(ts * 0.003);
      ctx.globalAlpha = lp;
      ctx.font = `bold ${Math.round(moon.r * 0.38)}px 'Dancing Script', cursive`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff8e1';
      ctx.shadowColor = 'rgba(255,220,100,0.9)';
      ctx.shadowBlur = 18;
      ctx.fillText('✨ Chhoo Kar Dekho ✨', moon.cx, moon.cy + moon.r * 1.65);
      ctx.restore();
    } else {
      // Subtle hint
      ctx.save();
      ctx.globalAlpha = 0.35 + 0.15 * Math.sin(ts * 0.0025);
      ctx.font = `${Math.round(moon.r * 0.28)}px 'Inter', sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#c8e0ff';
      ctx.fillText('🌙', moon.cx, moon.cy + moon.r * 1.5);
      ctx.restore();
    }

    // ── Interactive constellation stars ──
    cloudData.filter(c => c.interactive).forEach(c => {
      c.twinklePhase += c.twinkleSpeed;
      const twinkle = 0.6 + 0.4 * Math.abs(Math.sin(c.twinklePhase));
      const revealed = c.revealed;

      if (revealed) c.litAlpha = Math.min(1, (c.litAlpha || 0) + 0.035);

      ctx.save();

      // Outer glow halo
      const glowSize = revealed ? 28 * c.scale : 18 * c.scale;
      const starGlow = ctx.createRadialGradient(c.cx, c.cy, 0, c.cx, c.cy, glowSize);
      if (revealed) {
        starGlow.addColorStop(0, `rgba(255,235,130,${0.9 * twinkle})`);
        starGlow.addColorStop(0.5, `rgba(255,190,80,${0.4 * twinkle})`);
        starGlow.addColorStop(1, 'rgba(255,150,50,0)');
      } else {
        starGlow.addColorStop(0, `rgba(180,210,255,${0.75 * twinkle})`);
        starGlow.addColorStop(0.5, `rgba(140,180,255,${0.3 * twinkle})`);
        starGlow.addColorStop(1, 'rgba(100,140,255,0)');
      }
      ctx.fillStyle = starGlow;
      ctx.beginPath(); ctx.arc(c.cx, c.cy, glowSize, 0, Math.PI * 2); ctx.fill();

      // Star core (4-pointed sparkle style)
      ctx.save();
      ctx.translate(c.cx, c.cy);
      ctx.rotate(ts * 0.0004 * (revealed ? 0.5 : 1));
      const coreR = (revealed ? 5 : 3.5) * c.scale;
      ctx.fillStyle = revealed ? '#fff8d0' : '#ddeeff';
      ctx.globalAlpha = twinkle;
      ctx.beginPath();
      // 4-pointed star shape
      for (let pt = 0; pt < 8; pt++) {
        const a = (pt * Math.PI) / 4;
        const r = pt % 2 === 0 ? coreR : coreR * 0.4;
        pt === 0 ? ctx.moveTo(r * Math.cos(a), r * Math.sin(a)) : ctx.lineTo(r * Math.cos(a), r * Math.sin(a));
      }
      ctx.closePath(); ctx.fill();
      ctx.restore();

      // Revealed: show emoji icon floating above
      if (revealed) {
        ctx.globalAlpha = Math.min(1, (c.litAlpha || 0) * 1.5);
        ctx.font = `${Math.round(18 * c.scale)}px serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(c.icon, c.cx, c.cy - 22 * c.scale);
      }
      ctx.restore();
    });

    // ── Fireflies (lower half only) ──
    flies.forEach(f => {
      f.angle += (Math.random() - 0.5) * 0.09;
      f.x = Math.max(0, Math.min(W, f.x + Math.cos(f.angle) * f.speed));
      f.y = Math.max(H * 0.55, Math.min(H * 0.92, f.y + Math.sin(f.angle) * f.speed));
      f.alpha = 0.2 + 0.8 * Math.abs(Math.sin(ts * 0.0018 + f.angle * 2));
      const fg = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 6);
      fg.addColorStop(0, `rgba(220,255,140,${f.alpha})`);
      fg.addColorStop(0.4, `rgba(180,220,80,${f.alpha * 0.4})`);
      fg.addColorStop(1, 'rgba(120,180,50,0)');
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 2, 0, Math.PI * 2);
      ctx.fillStyle = fg; ctx.fill();
    });

    // ── Moon flare burst (climax) ──
    if (moonFlareState) {
      const mf = moonFlareState;
      mf.progress = Math.min(1, (ts - mf.startTs) / 2200);
      const radius = moon.r + mf.progress * (Math.min(W, H) * 0.95);
      const alpha = (1 - mf.progress) * 0.92;
      const mg = ctx.createRadialGradient(moon.cx, moon.cy, moon.r * 0.4, moon.cx, moon.cy, radius);
      mg.addColorStop(0, `rgba(255,255,230,${alpha})`);
      mg.addColorStop(0.35, `rgba(255,240,180,${alpha * 0.5})`);
      mg.addColorStop(0.7, `rgba(255,200,100,${alpha * 0.2})`);
      mg.addColorStop(1, 'rgba(255,180,80,0)');
      ctx.beginPath(); ctx.arc(moon.cx, moon.cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = mg; ctx.fill();
    }

    requestAnimationFrame(render);
  })(0);

  // ── Touch/click detection ──
  const popup = document.getElementById('moment-popup');
  const popIcon = document.getElementById('moment-popup-icon');
  const popMsg  = document.getElementById('moment-popup-msg');
  document.getElementById('moment-popup-close').onclick = () => popup.classList.add('ui-hidden');

  // Hit radius: larger for mobile touch
  const hitRadius = Math.max(36, Math.min(W, H) * 0.06);

  function findStarAt(x, y) {
    for (let i = cloudData.length - 1; i >= 0; i--) {
      const c = cloudData[i];
      if (!c.interactive) continue;
      const dx = x - c.cx, dy = y - c.cy;
      const r = Math.max(hitRadius, 28 * c.scale);
      if (dx * dx + dy * dy < r * r) return c;
    }
    return null;
  }

  function isMoonHit(x, y) {
    const dx = x - moon.cx, dy = y - moon.cy;
    return (dx * dx + dy * dy) < (moon.r * 1.8) ** 2;
  }

  function triggerMoonClimax() {
    moon.glow = 1.0;
    moonFlareState = { startTs: performance.now(), progress: 0 };
    sfxPlay('chime');
    burstSpark(moon.cx, moon.cy, 25);

    setTimeout(() => {
      const climaxMemory = moments.find(m => m.isMoonClimax) || moments[moments.length - 1];
      popIcon.textContent = climaxMemory.icon || "🌕";
      popMsg.textContent  = climaxMemory.text;
      popup.classList.remove('ui-hidden');

      // Add auto-transition listener when closing climax modal
      const closeBtn = document.getElementById('moment-popup-close');
      const onClimaxClose = () => {
        closeBtn.removeEventListener('click', onClimaxClose);
        clearInterval(leafDecoyInterval);
        stopCricketsSound();
        stopRainSound();
        switchAct('act-moments', 'act-hearts', startHearts);
      };
      closeBtn.addEventListener('click', onClimaxClose);
    }, 400);
  }

  function onMomentsClick(e) {
    e.preventDefault();
    const rect = cv.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Check Moon hit
    if (isMoonHit(x, y)) {
      triggerMoonClimax();
      return;
    }

    const star = findStarAt(x, y);
    if (!star) return;

    if (star.done) {
      popIcon.textContent = star.icon;
      popMsg.textContent = star.moment.text;
      popup.classList.remove('ui-hidden');
      return;
    }

    star.done = true;
    star.revealed = true;
    star.litAlpha = 1;
    momentsRevealed++;

    sfxPlay('chime');
    burstSpark(clientX, clientY, 12);

    // Increase moon glow dynamically as stars are discovered
    moon.glow = Math.min(1.0, 0.2 + (momentsRevealed / Math.max(1, cloudData.length)) * 0.8);

    setTimeout(() => {
      popIcon.textContent = star.icon;
      popMsg.textContent  = star.moment.text;
      popup.classList.remove('ui-hidden');
    }, 300);

    if (momentsRevealed >= cloudData.length) {
      setTimeout(triggerMoonClimax, 2000);
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

// Heart particle state for velocity-based movement
let heartParticles = [];
let heartsAnimRunning = false;

let starDecoyInterval = null;

function startHearts() {
  heartsRevealed = 0;
  heartParticles = [];
  heartsAnimRunning = true;
  if (document.getElementById('hearts-count')) {
    document.getElementById('hearts-count').textContent = `0 / ${HEARTS.length} raazein khuli...`;
  }

  createRain('hearts-rain', 95, 'rgba(255,107,157,0.22)');
  startRainSound(0.03);
  startLoveShowerBg();

  // Background canvas: orbs + fireflies
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

  // ── Spawn 16 floating heart bubbles (8 real + 8 decoy) with Organic Spacing ──
  const floatingLayer = document.getElementById('hearts-floating-layer');
  floatingLayer.innerHTML = '';

  const W = window.innerWidth, H = window.innerHeight;
  const BUBBLE_R = Math.min(28, W * 0.07);
  const margin = BUBBLE_R + 12;

  // Generate 16 organic random coordinates with distance verification to prevent clumping
  const spawnPoints = [];
  for (let i = 0; i < 16; i++) {
    let x, y, overlap = false, attempts = 0;
    do {
      overlap = false;
      x = margin + Math.random() * (W - margin * 2);
      y = margin + Math.random() * (H * 0.72);
      
      // Avoid spawning directly over the center heart container!
      const cx = W / 2, cy = H / 2;
      const distToCenter = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
      if (distToCenter < 120) {
        overlap = true;
      } else {
        // Avoid spawning directly on top of other points
        for (let j = 0; j < spawnPoints.length; j++) {
          const pt = spawnPoints[j];
          const dist = Math.sqrt((x - pt.x) * (x - pt.x) + (y - pt.y) * (y - pt.y));
          if (dist < BUBBLE_R * 2.3) {
            overlap = true;
            break;
          }
        }
      }
      attempts++;
    } while (overlap && attempts < 100);
    spawnPoints.push({ x, y });
  }

  let spawnIdx = 0;

  // Add 8 Decoy Hearts
  const decoyHeartIcons = ['💔', '💨', '🖤', '😜', '👻', '🙈', '🌸', '✨'];
  for (let d = 0; d < 8; d++) {
    const bbl = document.createElement('div');
    bbl.className = 'heart-bubble decoy-bubble';
    bbl.textContent = '❤️';
    bbl.style.position = 'absolute';
    bbl.style.width  = `${BUBBLE_R * 2}px`;
    bbl.style.height = `${BUBBLE_R * 2}px`;

    const pt = spawnPoints[spawnIdx++] || { x: W * Math.random(), y: H * 0.5 * Math.random() };
    const p = {
      el: bbl,
      x: pt.x,
      y: pt.y,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      heart: null, done: false, i: 100 + d, isDecoy: true
    };
    heartParticles.push(p);
    floatingLayer.appendChild(bbl);

    let done = false;
    bbl.addEventListener('click', e => {
      e.stopPropagation();
      if (!done) {
        done = true;
        p.done = true;
        sfxPlay('candle'); // oops pop sound
        burstSpark(e.clientX, e.clientY, 10);
        bbl.classList.add('wink');
        setTimeout(() => {
          bbl.textContent = decoyHeartIcons[d % decoyHeartIcons.length];
          bbl.classList.remove('wink');
          bbl.classList.add('dissolve');
          setTimeout(() => bbl.remove(), 400);
        }, 300);
      }
    });
  }

  const popup    = document.getElementById('heart-popup');
  const popEmoji = document.getElementById('popup-emoji');
  const popMsg   = document.getElementById('popup-msg');
  document.getElementById('popup-close').onclick = () => popup.classList.add('ui-hidden');

  HEARTS.forEach((h, i) => {
    const bbl = document.createElement('div');
    bbl.className = 'heart-bubble';
    bbl.textContent = '\u2764\uFE0F';
    bbl.style.position = 'absolute';
    bbl.style.setProperty('--fDur', `${2.2 + Math.random() * 1.2}s`);
    bbl.style.setProperty('--fDel', `${Math.random() * 0.8}s`);
    bbl.style.width  = `${BUBBLE_R * 2}px`;
    bbl.style.height = `${BUBBLE_R * 2}px`;

    const pt = spawnPoints[spawnIdx++] || { x: W * Math.random(), y: H * 0.5 * Math.random() };
    const p = {
      el: bbl,
      x: pt.x,
      y: pt.y,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      heart: h, done: false, i
    };
    heartParticles.push(p);
    floatingLayer.appendChild(bbl);

    let done = false;
    bbl.addEventListener('click', e => {
      e.stopPropagation();
      if (!done) {
        done = true;
        p.done = true;
        heartsRevealed++;

        sfxPlay('chime');
        burstSpark(e.clientX, e.clientY, 14);

        bbl.classList.add('wink');
        setTimeout(() => {
          bbl.textContent = h.emoji;
          bbl.classList.remove('wink');
          bbl.classList.add('revealed');
        }, 400);

        if (document.getElementById('hearts-count')) {
          document.getElementById('hearts-count').textContent =
            `${heartsRevealed} / ${HEARTS.length} raazein khuli...`;
        }

        updateBigHeart(heartsRevealed, HEARTS.length);

        // Reveal full heart photo starting from first heart caught!
        if (heartsRevealed >= 1) {
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
          heartsAnimRunning = false;
          const bigContainer = document.getElementById('big-heart-container');
          if (bigContainer) bigContainer.classList.add('fully-revealed');

          setTimeout(() => popup.classList.add('ui-hidden'), 2200);

          // ❤ Glow burst radiates FROM the center heart shape
          setTimeout(() => {
            const burst = document.getElementById('heart-glow-burst');
            if (burst) {
              burst.classList.add('burst');
              // Fire multiple ripples
              [0, 400, 800].forEach(delay => {
                setTimeout(() => {
                  const ripple = burst.cloneNode(false);
                  ripple.style.opacity = '1';
                  ripple.classList.add('burst');
                  document.getElementById('big-heart-container').appendChild(ripple);
                  setTimeout(() => ripple.remove(), 1900);
                }, delay);
              });
            }
          }, 2600);

          // Achievement popup
          setTimeout(() => {
            const achievement = document.getElementById('heart-achievement');
            if (achievement) {
              achievement.classList.remove('ui-hidden');
              gsap.fromTo(achievement.querySelector('.achievement-inner'),
                { scale: 0.6, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.6, ease: 'elastic.out(1, 0.6)' });
            }
          }, 3600);

          // Pink flash → transition
          setTimeout(() => {
            // Clean up Act 3 decoys
            clearInterval(starDecoyInterval);
            document.querySelectorAll('#act-hearts .decoy-active-item').forEach(el => el.remove());
            stopRainSound();
            switchAct('act-hearts', 'act-proposal', startProposal);
          }, 5200);
        }
      } else {
        popEmoji.textContent = h.emoji;
        popMsg.textContent = h.reason;
        popup.classList.remove('ui-hidden');
      }
    });
  });

  // ── Physics animation loop for floating hearts ──
  (function animateHearts(ts) {
    if (document.getElementById('act-hearts').classList.contains('ui-hidden')) return;
    const W2 = window.innerWidth, H2 = window.innerHeight;
    heartParticles.forEach(p => {
      if (p.done) return;
      // Add gentle sine drift
      p.vx += Math.sin(ts * 0.0006 + p.i) * 0.003;
      p.vy += Math.cos(ts * 0.0005 + p.i * 1.3) * 0.002;
      // Speed cap: reduced speed cap for slow elegant floating
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 0.45) { p.vx *= 0.45 / speed; p.vy *= 0.45 / speed; }
      p.x += p.vx;
      p.y += p.vy;
      // Bounce off edges
      if (p.x < margin)       { p.x = margin;       p.vx = Math.abs(p.vx) * 0.85; }
      if (p.x > W2 - margin)  { p.x = W2 - margin;  p.vx = -Math.abs(p.vx) * 0.85; }
      if (p.y < margin)       { p.y = margin;       p.vy = Math.abs(p.vy) * 0.85; }
      if (p.y > H2 - margin - 80) { p.y = H2 - margin - 80; p.vy = -Math.abs(p.vy) * 0.85; }
      p.el.style.left = `${p.x - BUBBLE_R}px`;
      p.el.style.top  = `${p.y - BUBBLE_R}px`;
    });
    requestAnimationFrame(animateHearts);
  })(0);
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
    const artWrap = document.getElementById('proposal-artwork-wrap');
    if (artWrap) artWrap.classList.add('in');
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
    
    // Spark particles at click
    burstSpark(window.innerWidth / 2, window.innerHeight * 0.4, 25);
    
    // Display the romantic holding hands overlay screen
    const handsOverlay = document.getElementById('holding-hands-overlay');
    if (handsOverlay) {
      handsOverlay.classList.remove('ui-hidden');
      
      // Let's spawn some rising hearts inside the overlay for extra romance!
      let heartBurstInterval = setInterval(() => {
        if (handsOverlay.classList.contains('ui-hidden')) {
          clearInterval(heartBurstInterval);
          return;
        }
        burstSpark(window.innerWidth * (0.3 + Math.random() * 0.4), window.innerHeight * (0.4 + Math.random() * 0.3), 6);
      }, 350);

      // Play hand holding scene for 4.5 seconds, then transition to candles
      setTimeout(() => {
        handsOverlay.style.opacity = '0';
        setTimeout(() => {
          handsOverlay.classList.add('ui-hidden');
          handsOverlay.style.opacity = '1';
          clearInterval(heartBurstInterval);
          switchAct('act-proposal', 'act-candles', startCandles);
        }, 800);
      }, 4500);
    } else {
      setTimeout(() => {
        switchAct('act-proposal', 'act-candles', startCandles);
      }, 1200);
    }
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

// Universal Quick Testing Navigation Function
function skipToAct(targetId) {
  // Unhide main experience container so acts are visible immediately
  const exp = document.getElementById('experience');
  if (exp) {
    exp.classList.remove('ui-hidden');
    exp.style.display = 'block';
    exp.style.opacity = '1';
  }

  // Hide decoy, reveal overlay, gate overlay, and holding hands overlay
  const decoy = document.getElementById('decoy-site');
  if (decoy) {
    decoy.classList.add('fade-out');
    decoy.style.display = 'none';
  }
  const overlay = document.getElementById('reveal-overlay');
  if (overlay) overlay.classList.add('ui-hidden');
  const gate = document.getElementById('gate-wrap');
  if (gate) gate.classList.add('ui-hidden');
  const handsOverlay = document.getElementById('holding-hands-overlay');
  if (handsOverlay) handsOverlay.classList.add('ui-hidden');

  // Hide all acts
  document.querySelectorAll('.act').forEach(act => act.classList.add('ui-hidden'));

  // Stop current sounds
  try { stopCricketsSound(); } catch(e) {}
  try { stopRainSound(); } catch(e) {}

  if (targetId === 'decoy') {
    if (decoy) {
      decoy.style.display = 'block';
      decoy.style.opacity = '1';
      decoy.style.pointerEvents = 'all';
      decoy.classList.remove('fade-out');
    }
    return;
  }

  const actMap = {
    'intro': { id: 'act-intro', fn: null },
    'cinema': { id: 'act-cinema', fn: startCinema },
    'moments': { id: 'act-moments', fn: startMoments },
    'hearts': { id: 'act-hearts', fn: startHearts },
    'proposal': { id: 'act-proposal', fn: startProposal },
    'candles': { id: 'act-candles', fn: startCandles }
  };

  const target = actMap[targetId];
  if (target) {
    const el = document.getElementById(target.id);
    if (el) el.classList.remove('ui-hidden');
    if (target.fn) target.fn();
  }
}

function startIntro() {
  playTrack('bg-music-main', 0.45);
}

// Expose functions globally
window.skipToAct = skipToAct;
window.startIntro = startIntro;
window.startCinema = startCinema;
window.startMoments = startMoments;
window.startHearts = startHearts;
window.startProposal = startProposal;
window.startCandles = startCandles;
window.stopCricketsSound = stopCricketsSound;
window.stopRainSound = stopRainSound;