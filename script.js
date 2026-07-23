/* ============================================================
   MONSOON DIARIES — Complete Script Engine
   6-Act Cinematic Flow:
   ACT 0 (Loader) → ACT 1 (Cinema) → ACT 2 (Rain) →
   ACT 3 (Doori) → ACT 4 (Proposal) → ACT 5 (Birthday) →
   LOVE SHOWER → GRAND FINALE
   ============================================================ */
'use strict';

// ── HAPTIC FEEDBACK ─────────────────────────────────────────────
function triggerHaptic(durationMs = 15) {
  try {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      navigator.vibrate(durationMs);
    }
  } catch (e) {}
}

// ── MEMORY ENGINE / QUOTE ROTATION ──────────────────────────────
(function initMemoryEngine() {
  if (!sessionStorage.getItem('birthday_session_seed')) {
    sessionStorage.setItem('birthday_session_seed', Math.floor(Math.random() * 10000).toString());
  }
  if (BIRTHDAY_CONFIG.coldOpenVariants && BIRTHDAY_CONFIG.coldOpenVariants.length) {
    const idx = Math.floor(Math.random() * BIRTHDAY_CONFIG.coldOpenVariants.length);
    BIRTHDAY_CONFIG.coldOpen = BIRTHDAY_CONFIG.coldOpenVariants[idx];
  }
  if (BIRTHDAY_CONFIG.chapterMeta && Array.isArray(BIRTHDAY_CONFIG.chapterMeta)) {
    BIRTHDAY_CONFIG.chapterMeta.forEach(meta => {
      if (meta.taglineVariants && meta.taglineVariants.length) {
        const tIdx = Math.floor(Math.random() * meta.taglineVariants.length);
        meta.tagline = meta.taglineVariants[tIdx];
      }
    });
  }
})();

// ── COLD OPEN ────────────────────────────────────────────────────
(function initColdOpen() {
  const el = document.getElementById('cold-open');
  const lineEl = document.getElementById('cold-open-line');
  const lines = (BIRTHDAY_CONFIG.coldOpen && BIRTHDAY_CONFIG.coldOpen.length)
    ? BIRTHDAY_CONFIG.coldOpen
    : ["Kuch kahaniyaan likhi jaati hain...", "Kuch jee li jaati hain..."];

  let i = 0;
  function showLine() {
    if (i >= lines.length) {
      setTimeout(() => {
        gsap.to(el, { opacity: 0, duration: 1, ease: 'power2.inOut', onComplete: () => { el.style.display = 'none'; } });
      }, 500);
      return;
    }
    lineEl.textContent = lines[i];
    gsap.fromTo(lineEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
    setTimeout(() => {
      gsap.to(lineEl, { opacity: 0, y: -8, duration: 0.6, ease: 'power2.in', onComplete: () => { i++; showLine(); } });
    }, 1700);
  }
  showLine();
})();

// ── DEVICE ORIENTATION MIRROR MODE ──────────────────────────────
(function initOrientationMirror() {
  const mirrorEl = document.getElementById('orientation-mirror');
  if (!mirrorEl) return;
  function checkOrientation() {
    const isMobile = window.innerWidth <= 900 || ('ontouchstart' in window);
    const isLandscape = window.innerWidth > window.innerHeight && isMobile;
    if (isLandscape) {
      mirrorEl.classList.remove('ui-hidden');
      triggerHaptic(20);
    } else {
      mirrorEl.classList.add('ui-hidden');
    }
  }
  window.addEventListener('resize', checkOrientation);
  window.addEventListener('orientationchange', checkOrientation);
})();

// ── SHARED WIND ENGINE ───────────────────────────────────────────
function sharedWindX() {
  return Math.sin(Date.now() / 6000) * 0.00035;
}

// ── GLOBAL TOUCH TRAIL ───────────────────────────────────────────
(function initTouchTrail() {
  let lastSpawn = 0;
  const throttleMs = 90;
  function spawnTrailSpark(x, y) {
    const activeSparks = document.querySelectorAll('.touch-trail-spark').length;
    if (activeSparks >= 5) return;
    const s = document.createElement('div');
    s.className = 'touch-trail-spark';
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 650);
  }
  function handleMove(e) {
    const now = Date.now();
    if (now - lastSpawn < throttleMs) return;
    lastSpawn = now;
    const point = e.touches ? e.touches[0] : e;
    spawnTrailSpark(point.clientX, point.clientY);
  }
  window.addEventListener('pointermove', handleMove);
  window.addEventListener('touchmove', handleMove, { passive: true });

  function spawnBloom(x, y) {
    const b = document.createElement('div');
    b.className = 'touch-bloom';
    b.textContent = '🌸';
    b.style.left = `${x}px`;
    b.style.top = `${y}px`;
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 900);
  }
  window.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, a, input, .heart-bubble, .rose-spot, .bday-candle, .candle-item, .falling-heart')) return;
    spawnBloom(e.clientX, e.clientY);
  });
})();

// ── ACHIEVEMENT SYSTEM ───────────────────────────────────────────
const unlockedAchievements = new Set();
function unlockAchievement(id, label) {
  if (unlockedAchievements.has(id)) return;
  unlockedAchievements.add(id);
  const toast = document.getElementById('achievement-toast');
  document.getElementById('achievement-text').textContent = label;
  toast.classList.remove('ui-hidden');
  requestAnimationFrame(() => toast.classList.add('show'));
  sfxPlay('sparkleChime', 0.25);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('ui-hidden'), 500);
  }, 2600);
}

// ── TIME-AWARE MOOD ──────────────────────────────────────────────
(function initTimeAwareMode() {
  const hour = new Date().getHours();
  let mode = 'day';
  if (hour >= 19 || hour < 5) mode = 'night';
  else if (hour >= 5 && hour < 8) mode = 'morning';
  document.documentElement.classList.add(`time-${mode}`);
})();

// ── WEB AUDIO SYNTHESIZER ENGINE ────────────────────────────────
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioCtx();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playSynthSFX(type) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'candleBlow' || type === 'blow') {
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.35);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      noise.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      noise.start(now);

    } else if (type === 'crack' || type === 'heartCrack') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.15);

    } else if (type === 'chime' || type === 'sparkleChime' || type === 'fireflyChime') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.3);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.4);

    } else if (type === 'pianoTap') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523, now);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.25);
    }
  } catch (e) {}
}

const SFX_LIBRARY = {
  firework: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_dc39b45e26.mp3",
  candleBlow: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_a3cbfd2f6a.mp3",
  nightAmbience: "https://cdn.pixabay.com/download/audio/2021/11/25/audio_00c9c94997.mp3",
  fireflyChime: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3",
  rainLight: "https://cdn.pixabay.com/download/audio/2022/03/09/audio_c8e70a7f38.mp3",
  paperRustle: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3",
  waxSeal: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_8f0f9b1a52.mp3",
  pianoTap: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_88447e769f.mp3",
  heartbeat: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0dd3c0428.mp3",
  sparkleChime: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3"
};
const sfxCache = {};
let sfxEnabled = true;

function sfxPlay(name, volume = 0.4) {
  if (!sfxEnabled) return;
  playSynthSFX(name);
  try {
    const url = SFX_LIBRARY[name];
    if (!url) return;
    const audio = new Audio(url);
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch (e) {}
}

function sfxLoop(name, volume = 0.15) {
  try {
    if (sfxCache[name]) { sfxCache[name].volume = volume; return sfxCache[name]; }
    const url = SFX_LIBRARY[name];
    if (!url) return null;
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = volume;
    audio.play().catch(() => {});
    sfxCache[name] = audio;
    return audio;
  } catch (e) { return null; }
}

function sfxStopLoop(name, fadeMs = 1000) {
  const audio = sfxCache[name];
  if (!audio) return;
  const steps = 12;
  const dt = fadeMs / steps;
  const delta = audio.volume / steps;
  let n = 0;
  const t = setInterval(() => {
    audio.volume = Math.max(0, audio.volume - delta);
    if (++n >= steps) { clearInterval(t); audio.pause(); delete sfxCache[name]; }
  }, dt);
}

function setHeartbeatTempo(rate) {
  if (rate === 'off') { sfxStopLoop('heartbeat', 1500); return; }
  const vol = 0.06;
  const audio = sfxLoop('heartbeat', vol);
  if (!audio) return;
  const rates = { slow: 0.75, normal: 1, fast: 1.25 };
  audio.playbackRate = rates[rate] || 1;
}

// ── BACKGROUND MUSIC SYSTEM ──────────────────────────────────────
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

function playMusicTrack(id) {
  if (!bgMusicPlaying) return;
  const next = document.getElementById(id);
  if (!next) return;
  if (currentAudio && currentAudio !== next) {
    fadeVolume(currentAudio, 0, 1200, true);
  }
  currentAudio = next;
  next.volume = 0;
  next.play().then(() => fadeVolume(next, 0.45, 1800, false)).catch(() => {});
}

// Music player button
(function initMusicPlayer() {
  const btn = document.getElementById('music-btn');
  const icon = document.getElementById('music-icon');
  if (!btn) return;
  btn.onclick = () => {
    if (bgMusicPlaying) {
      bgMusicPlaying = false;
      if (currentAudio) fadeVolume(currentAudio, 0, 600, true);
      icon.textContent = '▶';
    } else {
      bgMusicPlaying = true;
      if (currentAudio) {
        currentAudio.play().then(() => fadeVolume(currentAudio, 0.45, 600, false)).catch(() => {});
      }
      icon.textContent = '❚❚';
    }
  };
})();

// ══════════════════════════════════════════════════════════════════
// ACT TRANSITION ENGINE
// ══════════════════════════════════════════════════════════════════
function transitionToAct(nextActId, callback, opts = {}) {
  const overlay = document.getElementById('act-transition');
  overlay.classList.remove('ui-hidden');
  overlay.style.opacity = '0';

  // Fade to black
  gsap.to(overlay, {
    opacity: 1, duration: opts.fadeDuration || 0.9, ease: 'power2.inOut',
    onComplete: () => {
      // Hide all act sections
      document.querySelectorAll('.act-section').forEach(s => s.classList.add('ui-hidden'));
      document.getElementById('grand-finale').classList.add('ui-hidden');

      // Show the next act
      if (nextActId) {
        const el = document.getElementById(nextActId);
        if (el) el.classList.remove('ui-hidden');
      }

      // Run the setup callback
      if (callback) callback();

      // Fade from black
      gsap.to(overlay, {
        opacity: 0, duration: opts.fadeInDuration || 1.2, ease: 'power2.inOut',
        delay: opts.holdDuration || 0.3,
        onComplete: () => overlay.classList.add('ui-hidden')
      });
    }
  });
}

// Show an act title card then run callback
function showTitleCard(roman, name, tagline, callback) {
  const card = document.getElementById('title-card');
  document.getElementById('title-card-roman').textContent = roman;
  document.getElementById('title-card-name').textContent = name;
  document.getElementById('title-card-tagline').textContent = tagline;
  card.classList.remove('ui-hidden');
  gsap.fromTo(card, { opacity: 0 }, {
    opacity: 1, duration: 0.8, ease: 'power2.out',
    onComplete: () => {
      setTimeout(() => {
        gsap.to(card, {
          opacity: 0, duration: 0.8, ease: 'power2.in',
          onComplete: () => {
            card.classList.add('ui-hidden');
            if (callback) callback();
          }
        });
      }, 2400);
    }
  });
}

// ══════════════════════════════════════════════════════════════════
// ACT 0 — LOADER
// ══════════════════════════════════════════════════════════════════
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

  for (let i = 0; i < 55; i++) {
    particles.push({
      x: Math.random(), y: Math.random(),
      size: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 0.0012 + 0.0004,
      alpha: Math.random()
    });
  }

  let loaderAnimId;
  function loaderLoop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.y -= p.speed;
      if (p.y < 0) p.y = 1;
      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(244, 220, 170, ${p.alpha})`;
      ctx.fill();
    });
    loaderAnimId = requestAnimationFrame(loaderLoop);
  }
  loaderLoop();

  const loader = document.getElementById('loader');
  function startExperience() {
    cancelAnimationFrame(loaderAnimId);
    triggerHaptic(20);
    sfxPlay('sparkleChime', 0.3);
    bgMusicPlaying = true;
    playMusicTrack('music-ch1');
    document.getElementById('music-player').classList.remove('ui-hidden');

    gsap.to('#loader', {
      opacity: 0, duration: 1, ease: 'power2.inOut',
      onComplete: () => {
        loader.style.display = 'none';
        startAct1Cinema();
      }
    });
  }
  loader.addEventListener('click', startExperience);
  loader.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') startExperience(); });
})();

// ══════════════════════════════════════════════════════════════════
// ACT 1 — CINEMA (Auto-playing romantic film)
// ══════════════════════════════════════════════════════════════════
let movieIdx = 0;
let movieTimer = null;
let moviePhotoTimer = null;
let currentPhotoIdx = 0;
let activePhotoSlot = 'a'; // 'a' or 'b'

const seenWhisperIndices = new Set();
let starWhispersInitialized = false;

function startAct1Cinema() {
  document.getElementById('act1-cinema').classList.remove('ui-hidden');

  // Floating dust canvas
  const canvas = document.getElementById('cinema-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const dots = Array.from({ length: 65 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.2 + 0.4,
      alpha: Math.random() * 0.45 + 0.1,
      vy: -(Math.random() * 0.25 + 0.08),
      vx: (Math.random() - 0.5) * 0.06
    }));
    function renderBg() {
      if (document.getElementById('act1-cinema').classList.contains('ui-hidden')) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.y += d.vy;
        d.x += d.vx;
        if (d.y < 0) d.y = canvas.height;
        if (d.x < 0 || d.x > canvas.width) d.vx = -d.vx;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 220, 170, ${d.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(renderBg);
    }
    renderBg();
  }

  // Build dot indicators
  const dotsEl = document.getElementById('cinema-dots');
  if (dotsEl) {
    dotsEl.innerHTML = '';
    BIRTHDAY_CONFIG.movieScenes.forEach((_, i) => {
      const d = document.createElement('span');
      d.className = 'scene-dot' + (i === 0 ? ' active' : '');
      dotsEl.appendChild(d);
    });
  }

  // Hidden star whispers
  initAct1StarWhispers();

  movieIdx = 0;
  playMovieScene(0);
}

function playMovieScene(idx) {
  clearTimeout(movieTimer);
  clearTimeout(moviePhotoTimer);
  const scenes = BIRTHDAY_CONFIG.movieScenes;
  if (idx >= scenes.length) {
    endAct1();
    return;
  }

  const s = scenes[idx];
  currentPhotoIdx = 0;

  // Update dots
  document.querySelectorAll('.scene-dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });

  // Animate content in
  const content = document.getElementById('cinema-content');
  gsap.to(content, {
    opacity: 0, y: 10, duration: 0.4, ease: 'power2.in',
    onComplete: () => {
      document.getElementById('cinema-title').textContent = s.title;
      document.getElementById('cinema-subtitle').textContent = s.subtitle || '';
      document.getElementById('cinema-text').textContent = s.text;
      document.getElementById('cinema-caption').textContent = s.caption || '';
      gsap.fromTo(content, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' });
    }
  });

  // Photo system — cycle through photos array
  setMoviePhoto(s.photos, 0, 'a');

  // Progress bar
  const fill = document.getElementById('cinema-progress-fill');
  if (fill) {
    fill.style.transition = 'none';
    fill.style.width = '0%';
    setTimeout(() => {
      fill.style.transition = `width ${s.durationMs}ms linear`;
      fill.style.width = '100%';
    }, 60);
  }

  sfxPlay('sparkleChime', 0.15);

  movieTimer = setTimeout(() => {
    movieIdx++;
    playMovieScene(movieIdx);
  }, s.durationMs);
}

function setMoviePhoto(photos, photoIdx, slot) {
  if (!photos || photos.length === 0) return;
  const realPhotos = photos.filter(Boolean);
  if (realPhotos.length === 0) return;

  const src = realPhotos[photoIdx % realPhotos.length];
  const imgA = document.getElementById('cinema-img-a');
  const imgB = document.getElementById('cinema-img-b');
  const activeImg = slot === 'a' ? imgA : imgB;
  const outImg = slot === 'a' ? imgB : imgA;

  activeImg.src = src;
  activeImg.style.opacity = '0';
  activeImg.style.transition = 'opacity 1.5s ease-in-out';

  activeImg.onload = () => {
    requestAnimationFrame(() => {
      activeImg.style.opacity = '1';
      outImg.style.opacity = '0';
    });
  };
  activeImg.onerror = () => {};
}

function endAct1() {
  clearTimeout(movieTimer);
  sfxPlay('sparkleChime', 0.3);
  triggerHaptic(15);

  transitionToAct('act2-rain', () => {
    playMusicTrack('music-ch3');
    showTitleCard('II', 'Baarish Mein', 'Kuch yaadein baarish mein bhi kabhi geeli nahi hotin...', () => {
      startAct2Rain();
    });
  });
}

// ── Act 1: Hidden Star Whispers ──────────────────────────────────
function initAct1StarWhispers() {
  if (starWhispersInitialized) return;
  starWhispersInitialized = true;
  const act1 = document.getElementById('act1-cinema');
  const total = 15;
  for (let i = 0; i < total; i++) {
    const spot = document.createElement('div');
    spot.className = 'star-whisper-spot';
    spot.style.left = `${5 + Math.random() * 90}%`;
    spot.style.top = `${5 + Math.random() * 65}%`;
    spot.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerHaptic(15);
      unlockAchievement('first_touch', 'Pehla Sparsh ✨');
      const pool = BIRTHDAY_CONFIG.starWhispers || [];
      if (!pool.length) return;
      let available = pool.map((_, idx) => idx).filter(idx => !seenWhisperIndices.has(idx));
      if (available.length === 0) { seenWhisperIndices.clear(); available = pool.map((_, idx) => idx); }
      const chosen = available[Math.floor(Math.random() * available.length)];
      seenWhisperIndices.add(chosen);
      const line = pool[chosen];
      const toast = getOrCreateWhisperToast();
      toast.textContent = line;
      toast.classList.add('show');
      sfxPlay('sparkleChime', 0.2);
      burstSpark(e.clientX, e.clientY);
      clearTimeout(toast._hideTimer);
      toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 2600);
    });
    act1.appendChild(spot);
  }
}

function getOrCreateWhisperToast() {
  let t = document.getElementById('star-whisper-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'star-whisper-toast';
    t.className = 'star-whisper-toast';
    document.body.appendChild(t);
  }
  return t;
}

// ══════════════════════════════════════════════════════════════════
// ACT 2 — BAARISH MEIN (Rain World + Rose Garden + Floating Hearts)
// ══════════════════════════════════════════════════════════════════
let act2Timer = null;

function startAct2Rain() {
  document.getElementById('collectibles-hud').classList.remove('ui-hidden');

  // Create rain drops
  createRain('act2-rain-drops', 55);

  // Start rain ambience
  sfxLoop('rainLight', 0.08);

  // Rain canvas (soft atmospheric glow)
  const canvas = document.getElementById('act2-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const orbs = Array.from({ length: 4 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 60 + Math.random() * 100,
      alpha: 0.015 + Math.random() * 0.025,
      vx: (Math.random() - 0.5) * 0.0002,
      vy: (Math.random() - 0.5) * 0.0001
    }));
    function loopAct2() {
      if (document.getElementById('act2-rain').classList.contains('ui-hidden')) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height;
      orbs.forEach(o => {
        o.x = Math.max(0, Math.min(1, o.x + o.vx));
        o.y = Math.max(0, Math.min(1, o.y + o.vy));
        if (o.x <= 0 || o.x >= 1) o.vx = -o.vx;
        if (o.y <= 0 || o.y >= 1) o.vy = -o.vy;
        const grd = ctx.createRadialGradient(o.x * W, o.y * H, 0, o.x * W, o.y * H, o.r);
        grd.addColorStop(0, `rgba(100, 160, 220, ${o.alpha})`);
        grd.addColorStop(1, 'rgba(100,160,220,0)');
        ctx.beginPath();
        ctx.arc(o.x * W, o.y * H, o.r, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });
      requestAnimationFrame(loopAct2);
    }
    loopAct2();
  }

  // Rose garden
  initRoseGarden();

  // Hidden letters in act2
  initHiddenLettersAct('act2-rain', ['ch1', 'ch2']);

  // Schedule rain words
  scheduleRainWord();

  // After 40 seconds or rose garden complete → reveal hearts then proceed
  act2Timer = setTimeout(revealAct2Hearts, 40000);
}

function revealAct2Hearts() {
  clearTimeout(act2Timer);
  const heartsSection = document.getElementById('hearts-section');
  heartsSection.classList.remove('ui-hidden');
  gsap.fromTo(heartsSection, { opacity: 0 }, { opacity: 1, duration: 1 });
  initHearts();
}

// ── Hidden Rose Garden ───────────────────────────────────────────
function initRoseGarden() {
  const garden = document.getElementById('rose-garden');
  const counterEl = document.getElementById('rose-counter');
  garden.innerHTML = '';
  counterEl.classList.remove('ui-hidden', 'complete');
  const total = 6;
  let found = 0;
  counterEl.textContent = `🌹 0 / ${total}`;

  const positions = [
    { x: 8, y: 12 }, { x: 85, y: 18 }, { x: 12, y: 55 },
    { x: 88, y: 62 }, { x: 20, y: 85 }, { x: 78, y: 88 }
  ];

  positions.forEach(pos => {
    const spot = document.createElement('div');
    spot.className = 'rose-spot';
    spot.style.left = `${pos.x}%`;
    spot.style.top = `${pos.y}%`;
    spot.innerHTML = '<span class="rose-icon">🌹</span>';
    spot.addEventListener('click', () => {
      if (spot.classList.contains('found')) return;
      triggerHaptic(15);
      spot.classList.add('found');
      found++;
      counterEl.textContent = `🌹 ${found} / ${total}`;
      sfxPlay('sparkleChime', 0.25);
      unlockAchievement('first_rose', '🌹 Pehla Phool Mila!');
      const rect = spot.getBoundingClientRect();
      burstSpark(rect.left + rect.width / 2, rect.top + rect.height / 2);
      if (found === total) {
        triggerHaptic(30);
        counterEl.classList.add('complete');
        counterEl.textContent = `🌹 Poora bagicha khil gaya! ✨`;
        burstConfetti(window.innerWidth / 2, window.innerHeight * 0.3, 22);
        clearTimeout(act2Timer);
        setTimeout(revealAct2Hearts, 1800);
      }
    });
    garden.appendChild(spot);
  });
}

// ── Rain Words ───────────────────────────────────────────────────
function scheduleRainWord() {
  const delay = 5000 + Math.random() * 5000;
  setTimeout(() => {
    if (document.getElementById('act2-rain').classList.contains('ui-hidden')) return;
    spawnRainWord();
    scheduleRainWord();
  }, delay);
}

function spawnRainWord() {
  const words = BIRTHDAY_CONFIG.rainWords || ['Love'];
  const word = words[Math.floor(Math.random() * words.length)];
  const el = document.createElement('div');
  el.className = 'rain-word';
  el.textContent = word;
  el.style.left = `${10 + Math.random() * 75}%`;
  el.style.animationDuration = `${4 + Math.random() * 2}s`;
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerHaptic(15);
    el.classList.add('dissolve');
    sfxPlay('sparkleChime', 0.2);
    burstSpark(e.clientX, e.clientY);
    setTimeout(() => el.remove(), 500);
  });
  document.getElementById('act2-rain').appendChild(el);
  setTimeout(() => { if (el.parentNode) el.remove(); }, 7000);
}

// ── Floating Hearts (Reasons I Love You) ────────────────────────
let activeHearts = [];
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
      triggerHaptic(15);
      if (!hData.done) {
        hData.done = true;
        revealed++;
        document.getElementById('hearts-count').textContent = `${revealed} / ${cfg.reasonsILoveYou.length} raazein khuli...`;
        const rect = bubble.getBoundingClientRect();
        bubble.classList.add('flying', 'wink');
        bubble.innerHTML = hData.emoji;
        bubble.style.left = `${rect.left}px`;
        bubble.style.top = `${rect.top}px`;
        burstEmojiEffect(e.clientX, e.clientY, hData.emoji);
        sfxPlay('sparkleChime', 0.25);
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
          if (revealed === cfg.reasonsILoveYou.length) {
            unlockAchievement('hearts_complete', '💖 Sab Dil Pakad Liye!');
            setTimeout(() => {
              modal.classList.add('ui-hidden');
              endAct2();
            }, 2500);
          }
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

  document.getElementById('hearts-count').textContent = `0 / ${cfg.reasonsILoveYou.length} raazein khuli...`;

  document.getElementById('heart-popup-close').onclick = () => modal.classList.add('ui-hidden');

  // Float animation
  function floatHearts() {
    if (document.getElementById('act2-rain').classList.contains('ui-hidden')) return;
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

function endAct2() {
  sfxStopLoop('rainLight', 1000);
  triggerHaptic(15);
  transitionToAct('act3-doori', () => {
    playMusicTrack('music-ch4');
    setHeartbeatTempo('slow');
    showTitleCard('III', 'Jab Tum Gayi', 'Doori pyaar ko test nahi karti, dil ko sabr sikhati hai.', () => {
      startAct3Doori();
    });
  });
}

// ── Hidden Letters (Act 2 section) ──────────────────────────────
const collectedLetterIndices = new Set();
const LETTER_POSITIONS = [
  { actId: 'act2-rain', x: 10, y: 20 }, { actId: 'act2-rain', x: 88, y: 78 },
  { actId: 'act2-rain', x: 6, y: 30 },  { actId: 'act2-rain', x: 92, y: 40 },
  { actId: 'act3-doori', x: 6, y: 8 },  { actId: 'act3-doori', x: 92, y: 92 },
  { actId: 'act3-doori', x: 88, y: 15 }, { actId: 'act3-doori', x: 8, y: 88 },
  { actId: 'act4-proposal', x: 6, y: 50 }, { actId: 'act4-proposal', x: 92, y: 10 }
];

function initHiddenLettersAct(actId, _legacyIgnored) {
  const letters = BIRTHDAY_CONFIG.hiddenLetters || [];
  document.getElementById('collectibles-hud').classList.remove('ui-hidden');
  LETTER_POSITIONS.filter(p => p.actId === actId).forEach((pos, _) => {
    const globalIdx = LETTER_POSITIONS.findIndex(p2 => p2 === pos);
    const actEl = document.getElementById(actId);
    if (!actEl || letters[globalIdx] === undefined) return;
    const spot = document.createElement('div');
    spot.className = 'letter-spot';
    spot.textContent = '?';
    spot.style.left = `${pos.x}%`;
    spot.style.top = `${pos.y}%`;
    spot.addEventListener('click', (e) => {
      e.stopPropagation();
      if (collectedLetterIndices.has(globalIdx)) return;
      collectedLetterIndices.add(globalIdx);
      spot.textContent = letters[globalIdx];
      spot.classList.add('found');
      sfxPlay('sparkleChime', 0.25);
      burstSpark(e.clientX, e.clientY);
      updateLettersCounter();
      if (collectedLetterIndices.size === letters.length) {
        unlockAchievement('letters_complete', '🔤 Sab Raaz Mil Gaye!');
        setTimeout(showLettersCompleteModal, 900);
      }
    });
    actEl.appendChild(spot);
  });
  updateLettersCounter();
}

function updateLettersCounter() {
  const total = (BIRTHDAY_CONFIG.hiddenLetters || []).length;
  document.getElementById('letters-counter').textContent = `🔤 ${collectedLetterIndices.size}/${total}`;
}

function showLettersCompleteModal() {
  document.getElementById('letters-complete-msg').textContent = BIRTHDAY_CONFIG.hiddenLettersMessage || '';
  const modal = document.getElementById('letters-complete-modal');
  modal.classList.remove('ui-hidden');
  burstConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 26);
  document.getElementById('letters-complete-close').onclick = () => modal.classList.add('ui-hidden');
}

// ══════════════════════════════════════════════════════════════════
// ACT 3 — DOORI (Soul Lights + Firefly Catch)
// ══════════════════════════════════════════════════════════════════
let firefliesCaught = new Set();

function startAct3Doori() {
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

  // Reset reveal state
  const letterWrap = document.getElementById('letter-wrap');
  const nextBtn = document.getElementById('act3-next-btn-wrap');
  const caption = document.getElementById('reunion-caption');
  letterWrap.classList.remove('revealed');
  nextBtn.classList.add('ui-hidden');
  caption.classList && caption.classList.remove('visible');
  caption.textContent = cfg.moments[cfg.moments.length - 1] || '';

  // Hidden letters for this act
  initHiddenLettersAct('act3-doori');

  // Fireflies
  initFireflyCatch();

  // Soul lights canvas
  const canvas = document.getElementById('ch4-canvas');
  const ctx = canvas.getContext('2d');
  function resizeCh4() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCh4();

  const dust = Array.from({ length: 45 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.8 + 0.3,
    alpha: Math.random() * 0.35 + 0.05,
    alphaDir: Math.random() > 0.5 ? 1 : -1,
    alphaSpeed: Math.random() * 0.005 + 0.001,
    vy: Math.random() * 0.0006 + 0.0001,
    vx: (Math.random() - 0.5) * 0.0002
  }));

  const orbs = Array.from({ length: 5 }, () => ({
    x: Math.random(), y: Math.random(),
    r: 30 + Math.random() * 60,
    alpha: 0.02 + Math.random() * 0.04,
    vx: (Math.random() - 0.5) * 0.0003,
    vy: (Math.random() - 0.5) * 0.0002
  }));

  const soulA = { x: 0.14, y: 0.42 };
  const soulB = { x: 0.86, y: 0.42 };
  let merged = false;
  const mergeStart = Date.now() + 1200;
  const mergeDuration = 6500;

  const bridgeStars = Array.from({ length: 40 }, (_, i) => ({
    t: i / 39,
    yOffset: (Math.random() - 0.5) * 0.1,
    twinkle: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.03 + Math.random() * 0.03
  }));

  function updateSouls() {
    if (merged) return;
    const t = Math.max(0, Math.min(1, (Date.now() - mergeStart) / mergeDuration));
    const eased = t * t * (3 - 2 * t);
    soulA.x = 0.14 + (0.5 - 0.14) * eased;
    soulB.x = 0.86 - (0.86 - 0.5) * eased;
    if (t >= 1 && !merged) { merged = true; onSoulsMerged(); }
  }

  function onSoulsMerged() {
    burstSpark(window.innerWidth / 2, window.innerHeight * 0.42);
    burstConfetti(window.innerWidth / 2, window.innerHeight * 0.42, 22);
    sfxPlay('sparkleChime', 0.35);
    setHeartbeatTempo('normal');
    triggerHaptic(25);
    setTimeout(() => {
      const noDistLine = document.getElementById('no-distance-line');
      if (noDistLine) { noDistLine.classList.add('visible'); }
      setTimeout(() => {
        letterWrap.classList.add('revealed');
        nextBtn.classList.remove('ui-hidden');
      }, 1600);
    }, 300);
  }

  function drawBridgeStars(ctx, W, H) {
    if (merged) return;
    const ax = soulA.x, bx = soulB.x, y = soulA.y;
    bridgeStars.forEach(s => {
      const sx = ax + (bx - ax) * s.t;
      if (sx <= ax || sx >= bx) return;
      s.twinkle += s.twinkleSpeed;
      const alpha = (0.15 + 0.25 * Math.abs(Math.sin(s.twinkle))) * (1 - Math.abs(s.t - 0.5) * 0.3);
      ctx.beginPath();
      ctx.arc(sx * W, (y + s.yOffset) * H, 1.1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,225,180,${alpha})`;
      ctx.fill();
    });
  }

  function drawSouls(ctx, W, H) {
    const pts = merged ? [{ x: 0.5, y: 0.42 }] : [soulA, soulB];
    pts.forEach(p => {
      const r = merged ? 26 : 14;
      const grd = ctx.createRadialGradient(p.x * W, p.y * H, 0, p.x * W, p.y * H, r);
      grd.addColorStop(0, merged ? 'rgba(255,210,140,0.55)' : 'rgba(255,190,150,0.4)');
      grd.addColorStop(1, 'rgba(255,190,150,0)');
      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, r, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    });
  }

  function loopAct3() {
    if (document.getElementById('act3-doori').classList.contains('ui-hidden')) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const W = canvas.width, H = canvas.height;
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
    dust.forEach(d => {
      d.x = Math.max(0, Math.min(1, d.x + d.vx + sharedWindX()));
      d.y += d.vy;
      if (d.y > 1.02) { d.y = -0.02; d.x = Math.random(); }
      d.alpha += d.alphaDir * d.alphaSpeed;
      if (d.alpha > 0.45 || d.alpha < 0.03) d.alphaDir = -d.alphaDir;
      ctx.beginPath();
      ctx.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240,210,200,${d.alpha})`;
      ctx.fill();
    });
    updateSouls();
    drawBridgeStars(ctx, W, H);
    drawSouls(ctx, W, H);
    requestAnimationFrame(loopAct3);
  }
  loopAct3();

  document.getElementById('ch4-next').onclick = () => {
    triggerHaptic(15);
    endAct3();
  };
}

// ── Firefly Catch ────────────────────────────────────────────────
function initFireflyCatch() {
  firefliesCaught = new Set();
  const act3 = document.getElementById('act3-doori');
  const total = 5;

  const flies = Array.from({ length: total }, (_, i) => ({
    el: null,
    x: 0.1 + Math.random() * 0.8,
    y: 0.2 + Math.random() * 0.6,
    vx: (Math.random() - 0.5) * 0.003,
    vy: (Math.random() - 0.5) * 0.002,
    phase: Math.random() * Math.PI * 2
  }));

  flies.forEach((fly, idx) => {
    const el = document.createElement('div');
    el.className = 'firefly';
    el.style.left = `${fly.x * 100}%`;
    el.style.top = `${fly.y * 100}%`;
    fly.el = el;
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (firefliesCaught.has(idx)) return;
      firefliesCaught.add(idx);
      el.classList.add('caught');
      triggerHaptic(15);
      sfxPlay('fireflyChime', 0.3);
      burstSpark(e.clientX, e.clientY);
      updateFirefliesCounter();
      if (firefliesCaught.size === total) {
        unlockAchievement('fireflies_complete', '🦋 Firefly Catcher!');
        const wishes = BIRTHDAY_CONFIG.fireflyWishes || [];
        if (wishes.length) {
          const wish = wishes[Math.floor(Math.random() * wishes.length)];
          setTimeout(() => {
            document.getElementById('letters-complete-msg').textContent = wish;
            document.getElementById('letters-complete-modal').classList.remove('ui-hidden');
            document.getElementById('letters-complete-close').onclick = () =>
              document.getElementById('letters-complete-modal').classList.add('ui-hidden');
          }, 600);
        }
        setTimeout(() => el.remove(), 500);
      }
    });
    act3.appendChild(el);
  });

  // Animate fireflies
  function animateFlies() {
    if (document.getElementById('act3-doori').classList.contains('ui-hidden')) return;
    const W = window.innerWidth, H = window.innerHeight;
    flies.forEach(fly => {
      if (!fly.el || fly.el.classList.contains('caught')) return;
      fly.phase += 0.02;
      fly.x += fly.vx + Math.sin(fly.phase) * 0.001;
      fly.y += fly.vy + Math.cos(fly.phase * 0.7) * 0.0008;
      fly.x = Math.max(0.05, Math.min(0.95, fly.x));
      fly.y = Math.max(0.1, Math.min(0.9, fly.y));
      fly.el.style.left = `${fly.x * 100}%`;
      fly.el.style.top = `${fly.y * 100}%`;
    });
    requestAnimationFrame(animateFlies);
  }
  animateFlies();
}

function updateFirefliesCounter() {
  document.getElementById('fireflies-counter').textContent = `🦟 ${firefliesCaught.size}/5`;
}

function endAct3() {
  setHeartbeatTempo('off');
  triggerHaptic(15);
  transitionToAct('act4-proposal', () => {
    playMusicTrack('music-ch2');
    showTitleCard('IV', 'Ek Sapna', 'Jo sach hone wala hai...', () => {
      startAct4Proposal();
    });
  });
}

// ══════════════════════════════════════════════════════════════════
// ACT 4 — PROPOSAL + EMERALD RING
// ══════════════════════════════════════════════════════════════════
function startAct4Proposal() {
  // Hidden letters
  initHiddenLettersAct('act4-proposal');

  // Proposal canvas — aurora background
  const canvas = document.getElementById('proposal-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const auroraOrbs = Array.from({ length: 5 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 80 + Math.random() * 120,
      alpha: 0.03 + Math.random() * 0.04,
      hue: Math.random() > 0.5 ? 270 : 200,
      vx: (Math.random() - 0.5) * 0.0004,
      vy: (Math.random() - 0.5) * 0.0003
    }));
    function loopProposal() {
      if (document.getElementById('act4-proposal').classList.contains('ui-hidden')) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height;
      auroraOrbs.forEach(o => {
        o.x = Math.max(0, Math.min(1, o.x + o.vx));
        o.y = Math.max(0, Math.min(1, o.y + o.vy));
        if (o.x <= 0 || o.x >= 1) o.vx = -o.vx;
        if (o.y <= 0 || o.y >= 1) o.vy = -o.vy;
        const grd = ctx.createRadialGradient(o.x * W, o.y * H, 0, o.x * W, o.y * H, o.r);
        grd.addColorStop(0, `hsla(${o.hue},70%,55%,${o.alpha})`);
        grd.addColorStop(1, `hsla(${o.hue},70%,55%,0)`);
        ctx.beginPath();
        ctx.arc(o.x * W, o.y * H, o.r, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });
      requestAnimationFrame(loopProposal);
    }
    loopProposal();
  }

  // Chibi enters from right
  const chibi = document.getElementById('chibi-proposer');
  chibi.style.transform = 'translateX(150px)';
  chibi.style.opacity = '0';
  setTimeout(() => {
    gsap.to(chibi, { translateX: 0, opacity: 1, duration: 1.2, ease: 'back.out(1.4)' });
  }, 400);

  // Typewriter dialogue
  const dialogueEl = document.getElementById('proposal-dialogue-text');
  const cfg = BIRTHDAY_CONFIG.proposal;
  const lines = cfg.dialogueLines || [];
  let lineIdx = 0;

  function typeLine(text, onDone) {
    dialogueEl.textContent = '';
    let i = 0;
    function typeChar() {
      if (i >= text.length) { if (onDone) setTimeout(onDone, 800); return; }
      dialogueEl.textContent += text[i++];
      setTimeout(typeChar, 45);
    }
    typeChar();
  }

  function nextLine() {
    if (lineIdx >= lines.length) {
      // Show the ring
      setTimeout(() => {
        dialogueEl.textContent = cfg.finalQuote;
        gsap.fromTo(dialogueEl, { scale: 0.9, opacity: 0.5 }, { scale: 1, opacity: 1, duration: 0.5 });
        sfxPlay('sparkleChime', 0.5);
        triggerHaptic(20);
        setTimeout(() => {
          const ringBox = document.getElementById('ring-box');
          ringBox.classList.remove('ui-hidden');
          gsap.fromTo(ringBox, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.5)' });
          sfxPlay('sparkleChime', 0.6);
          triggerHaptic(30);
        }, 1800);
      }, 500);
      return;
    }
    typeLine(lines[lineIdx], () => { lineIdx++; nextLine(); });
  }

  setTimeout(nextLine, 1200);

  document.getElementById('proposal-accept-btn').onclick = () => {
    triggerHaptic(35);
    sfxPlay('sparkleChime', 0.6);
    burstConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 35);
    setTimeout(endAct4, 1400);
  };
}

function endAct4() {
  triggerHaptic(15);
  transitionToAct('act5-birthday', () => {
    playMusicTrack('music-ch5');
    showTitleCard('V', 'Happy Birthday Pranu! 🎂', 'Aaj ka din sirf tumhara hai.', () => {
      startAct5Birthday();
    });
  });
}

// ══════════════════════════════════════════════════════════════════
// ACT 5 — BIRTHDAY (Candles + Cake + Heart + Shower → Finale)
// ══════════════════════════════════════════════════════════════════
function startAct5Birthday() {
  const cfg = BIRTHDAY_CONFIG.chapter5;
  document.getElementById('bday-name').textContent = BIRTHDAY_CONFIG.name;
  document.getElementById('anni-tag').textContent = BIRTHDAY_CONFIG.anniversaryMessage;

  // Stars canvas
  const canvas = document.getElementById('ch5-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const stars = Array.from({ length: 60 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.6,
    alpha: Math.random(),
    speed: (Math.random() * 0.012 + 0.003) * (Math.random() > 0.5 ? 1 : -1)
  }));
  function loopAct5() {
    if (document.getElementById('act5-birthday').classList.contains('ui-hidden')) return;
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
    requestAnimationFrame(loopAct5);
  }
  loopAct5();

  createLanterns();
  launchFireworks();

  // Wishes
  const wishesWrap = document.getElementById('wishes-wrap');
  wishesWrap.innerHTML = '';
  cfg.wishes.forEach((w, i) => {
    const b = document.createElement('div');
    b.className = 'wish-bubble';
    b.style.animationDelay = `${i * 0.1}s`;
    b.textContent = w;
    wishesWrap.appendChild(b);
  });

  // Candles
  initBirthdayCandles(cfg);
}

let blownCandleCount = 0;
function initBirthdayCandles(cfg) {
  blownCandleCount = 0;
  const candleWrap = document.getElementById('cake-candles');
  const cakeHint = document.getElementById('cake-hint');
  const buddy = document.getElementById('chibi-buddy');
  const puffEl = document.getElementById('puff-emoji');
  candleWrap.innerHTML = '';
  const totalCandles = 5;

  for (let i = 0; i < totalCandles; i++) {
    const candle = document.createElement('div');
    candle.className = 'candle-item';
    candle.innerHTML = '<div class="candle-flame"></div><div class="candle-smoke"></div>';
    const flame = candle.querySelector('.candle-flame');
    flame.style.animationDuration = `${0.3 + Math.random() * 0.35}s`;
    flame.style.animationDelay = `${Math.random() * 0.4}s`;

    candle.addEventListener('click', () => {
      if (candle.classList.contains('blown')) return;
      triggerHaptic(15);

      // Move buddy to candle position
      const rect = candle.getBoundingClientRect();
      buddy.style.left = `${rect.left - 30}px`;
      buddy.style.bottom = '120px';
      buddy.style.opacity = '1';

      setTimeout(() => {
        playSynthSFX('candleBlow');
        sfxPlay('candleBlow', 0.35);
        puffEl.classList.remove('ui-hidden');
        puffEl.style.left = `${rect.left}px`;
        puffEl.style.top = `${rect.top - 30}px`;

        setTimeout(() => {
          candle.classList.add('blown');
          blownCandleCount++;
          burstSpark(rect.left + rect.width / 2, rect.top);
          puffEl.classList.add('ui-hidden');

          if (blownCandleCount >= totalCandles) {
            triggerHaptic(30);
            burstConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 30);
            cakeHint.textContent = '✨ Saare candles bujh gaye! Ab Cake Cut Karo! 🎂';
            cakeHint.classList.add('done');
            buddy.style.opacity = '0';
            setTimeout(() => enableCakeCutting(cfg), 1200);
          }
        }, 350);
      }, 300);
    });
    candleWrap.appendChild(candle);
  }
}

function enableCakeCutting(cfg) {
  const cake = document.getElementById('cake-body');
  const sliceLine = document.getElementById('cake-slice-line');
  sliceLine.classList.remove('ui-hidden');
  sliceLine.classList.add('ready');

  cake.addEventListener('click', () => {
    triggerHaptic(25);
    sfxPlay('sparkleChime', 0.4);
    burstConfetti(window.innerWidth / 2, window.innerHeight * 0.5, 30);
    sliceLine.classList.add('cut');
    // Butterfly wishes
    const wishWords = ['Joy ✨', 'Love 💕', 'Hope 🌸', 'Forever 💫'];
    setTimeout(() => {
      const rect = cake.getBoundingClientRect();
      for (let i = 0; i < 3; i++) {
        setTimeout(() => spawnButterflyWish(rect.left + rect.width / 2, rect.top, wishWords[i % wishWords.length]), i * 500);
      }
    }, 600);

    setTimeout(() => {
      // Reveal heart core
      document.getElementById('cake-heart-core').classList.remove('ui-hidden');
      gsap.fromTo('#cake-heart-core', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
      initHeartBreaker(cfg);
    }, 1200);
  }, { once: true });
}

// 3-Stage Heart Breaker
let heartBreakStage = 0;
function initHeartBreaker(cfg) {
  heartBreakStage = 0;
  const heart = document.getElementById('breaking-heart');
  const hint = document.getElementById('heart-break-hint');

  heart.addEventListener('click', () => {
    heartBreakStage++;
    triggerHaptic(20 + heartBreakStage * 8);
    playSynthSFX('crack');

    if (heartBreakStage === 1) {
      heart.className = 'breaking-heart stage-1';
      hint.textContent = '💔 Aur 2 baar tap karo! (1/3)';
      gsap.to(heart, { x: -6, duration: 0.05, yoyo: true, repeat: 5 });
    } else if (heartBreakStage === 2) {
      heart.className = 'breaking-heart stage-2';
      hint.textContent = '⚡ Bas 1 aakhri tap! (2/3)';
      gsap.to(heart, { x: -10, duration: 0.04, yoyo: true, repeat: 8 });
    } else if (heartBreakStage >= 3) {
      heart.className = 'breaking-heart stage-3';
      triggerHaptic(50);
      burstConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 45);
      burstSpark(window.innerWidth / 2, window.innerHeight * 0.4);
      sfxPlay('sparkleChime', 0.7);
      launchFireworks();

      gsap.to(heart, {
        scale: 1.5, opacity: 0, duration: 0.5, ease: 'power2.in',
        onComplete: () => {
          document.getElementById('cake-heart-core').classList.add('ui-hidden');
          // Reveal envelope / letter
          const env = document.getElementById('envelope');
          env.classList.remove('ui-hidden');
          gsap.fromTo(env, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 });

          env.onclick = (e) => {
            triggerHaptic(20);
            sfxPlay('waxSeal', 0.4);
            env.classList.add('ui-hidden');
            const fullLetter = document.getElementById('full-letter');
            fullLetter.classList.remove('ui-hidden');
            document.getElementById('letter-body-ch5').textContent = cfg.endingLetter;
            burstConfetti(e.clientX, e.clientY, 24);
            setTimeout(() => sfxPlay('paperRustle', 0.3), 200);
            setTimeout(() => {
              document.getElementById('close1').textContent = cfg.closingLine;
              document.getElementById('close2').textContent = cfg.finalLine;
              document.getElementById('closing').classList.remove('ui-hidden');
              launchFireworks();
              sfxPlay('firework', 0.4);
              setTimeout(() => {
                document.getElementById('finale-trigger').classList.remove('ui-hidden');
              }, 3000);
            }, 2200);
          };
        }
      });
    }
  });

  document.getElementById('finale-trigger').addEventListener('click', () => {
    startLoveShower();
  });
}

// ══════════════════════════════════════════════════════════════════
// LOVE SHOWER — Catch falling hearts (bridge to Grand Finale)
// ══════════════════════════════════════════════════════════════════
let showerRevealedCount = 0;
function startLoveShower() {
  transitionToAct('shower-stage', () => {
    playMusicTrack('music-ch1');
    showerRevealedCount = 0;
    const container = document.getElementById('shower-container');
    container.innerHTML = '';
    const msgs = BIRTHDAY_CONFIG.heartShowerMessages || [];

    for (let i = 0; i < 25; i++) {
      const h = document.createElement('div');
      h.className = 'falling-heart';
      h.textContent = ['❤️', '💖', '✨', '🌹', '🥰', '💕', '🌸'][i % 7];
      h.style.left = `${Math.random() * 90}%`;
      h.style.animationDuration = `${3 + Math.random() * 3}s`;
      h.style.animationDelay = `${Math.random() * 6}s`;

      h.onclick = () => {
        triggerHaptic(15);
        sfxPlay('sparkleChime', 0.3);
        const msg = msgs[Math.floor(Math.random() * msgs.length)];
        showShowerToast(msg);
        showerRevealedCount++;
        document.getElementById('shower-count').textContent = `${showerRevealedCount} / ${msgs.length} raazein`;
        if (showerRevealedCount >= 5) {
          document.getElementById('shower-continue-btn').classList.remove('ui-hidden');
        }
      };
      container.appendChild(h);
    }

    document.getElementById('shower-continue-btn').onclick = () => {
      transitionToAct(null, () => {
        showTitleCard('✦', 'Grand Finale', 'Yeh toh bas shuruaat hai...', () => {
          startGrandFinale();
        });
      });
    };
  });
}

function showShowerToast(msg) {
  const toast = document.getElementById('shower-toast');
  document.getElementById('toast-message').textContent = msg;
  toast.classList.remove('ui-hidden');
  gsap.fromTo(toast, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.4)' });

  document.getElementById('toast-close-btn').onclick = () => {
    gsap.to(toast, { scale: 0.8, opacity: 0, duration: 0.3, onComplete: () => toast.classList.add('ui-hidden') });
  };
}

// ══════════════════════════════════════════════════════════════════
// GRAND FINALE — 6 cinematic scenes
// ══════════════════════════════════════════════════════════════════
function startGrandFinale() {
  const cfg = BIRTHDAY_CONFIG.finale;
  const overlay = document.getElementById('grand-finale');
  overlay.classList.remove('ui-hidden');
  document.getElementById('music-player').classList.add('ui-hidden');
  setHeartbeatTempo('slow');
  unlockAchievement('finale_reached', '🌟 Love Story Complete!');
  finaleScenePlanet(cfg);
}

function finaleAdvance(fromId, toId, run) {
  const from = document.getElementById(fromId);
  const to = document.getElementById(toId);
  from.classList.add('leaving');
  setTimeout(() => {
    from.classList.add('ui-hidden');
    to.classList.remove('ui-hidden');
    run();
  }, 1200);
}

function finaleScenePlanet(cfg) {
  document.getElementById('planet-line').textContent = cfg.planetLine;
  const canvas = document.getElementById('planet-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H * 0.38;
  const planetR = Math.min(W, H) * 0.16;
  const icons = ['🌳', '🌙', '🏠', '🎂', '⭐', '🦋'];
  let rot = 0;
  let running = true;

  function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    rot += 0.006;
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, planetR);
    grd.addColorStop(0, 'rgba(120,150,190,0.9)');
    grd.addColorStop(1, 'rgba(60,80,120,0.9)');
    ctx.beginPath();
    ctx.arc(cx, cy, planetR, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
    icons.forEach((icon, i) => {
      const angle = rot + (i / icons.length) * Math.PI * 2;
      const ix = cx + Math.cos(angle) * (planetR + 22);
      const iy = cy + Math.sin(angle) * (planetR + 22) * 0.4 + planetR * 0.15;
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(icon, ix, iy);
    });
    requestAnimationFrame(loop);
  }
  loop();

  setTimeout(() => {
    running = false;
    finaleAdvance('scene-planet', 'scene-credits', () => finaleSceneCredits(cfg));
  }, 6000);
}

function finaleSceneCredits(cfg) {
  const lineEl = document.getElementById('credit-line');
  let i = 0;
  function nextCredit() {
    if (i >= cfg.credits.length) {
      finaleAdvance('scene-credits', 'scene-heart', () => finaleSceneHeart(cfg));
      return;
    }
    lineEl.style.opacity = 0;
    lineEl.textContent = cfg.credits[i];
    sfxPlay('sparkleChime', 0.2);
    requestAnimationFrame(() => {
      lineEl.style.transition = 'opacity 0.8s ease';
      lineEl.style.opacity = 1;
    });
    i++;
    setTimeout(() => {
      lineEl.style.opacity = 0;
      setTimeout(nextCredit, 600);
    }, 1800);
  }
  nextCredit();
}

function finaleSceneHeart(cfg) {
  const heart = document.getElementById('finale-heart');
  const hint = document.getElementById('finale-heart-hint');
  const reveal = document.getElementById('finale-i-love-you');
  hint.textContent = cfg.heartHint;
  reveal.textContent = cfg.heartReveal;
  let pressTimer = null;

  function startPress() {
    heart.classList.add('pressing');
    triggerHaptic(10);
    setHeartbeatTempo('fast');
    pressTimer = setTimeout(() => {
      triggerHaptic(40);
      reveal.classList.remove('ui-hidden');
      burstConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 28);
      sfxPlay('sparkleChime', 0.5);
      hint.style.opacity = 0;
      setTimeout(() => {
        finaleAdvance('scene-heart', 'scene-365', () => finaleScene365(cfg));
      }, 2200);
    }, 3000);
  }
  function cancelPress() {
    clearTimeout(pressTimer);
    heart.classList.remove('pressing');
    setHeartbeatTempo('slow');
  }
  heart.addEventListener('pointerdown', startPress);
  heart.addEventListener('pointerup', cancelPress);
  heart.addEventListener('pointerleave', cancelPress);
}

function finaleScene365(cfg) {
  document.getElementById('finale-365-line').textContent = cfg.nights365Line;
  const canvas = document.getElementById('dots-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H * 0.36, scale = Math.min(W, H) * 0.018;

  const total = 365;
  const points = [];
  for (let i = 0; i < total; i++) {
    const t = (i / total) * Math.PI * 2;
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    points.push({
      x: cx + hx * scale + (Math.random() - 0.5) * 4,
      y: cy + hy * scale + (Math.random() - 0.5) * 4,
      revealed: false
    });
  }

  let revealed = 0;
  function drawDots() {
    ctx.clearRect(0, 0, W, H);
    points.forEach(p => {
      if (!p.revealed) return;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,210,230,0.85)';
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(255,180,210,0.6)';
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }

  const revealInterval = setInterval(() => {
    const batch = 12;
    for (let i = 0; i < batch && revealed < total; i++, revealed++) {
      points[revealed].revealed = true;
    }
    drawDots();
    if (revealed >= total) {
      clearInterval(revealInterval);
      sfxPlay('sparkleChime', 0.3);
      setTimeout(() => {
        finaleAdvance('scene-365', 'scene-loop', () => finaleSceneLoop(cfg));
      }, 3500);
    }
  }, 40);
}

function finaleSceneLoop(cfg) {
  document.getElementById('finale-loop-line').textContent = cfg.loopLine;
  const canvas = document.getElementById('loop-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const W = canvas.width, H = canvas.height;

  const stars = Array.from({ length: 120 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.4 + 0.3,
    alpha: Math.random()
  }));
  let running = true;
  function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,225,200,${s.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(loop);
  }
  loop();

  setTimeout(() => {
    running = false;
    finaleAdvance('scene-loop', 'scene-secret', () => finaleSceneSecret(cfg));
  }, 4500);
}

function finaleSceneSecret(cfg) {
  setHeartbeatTempo('off');
  const quoteEl = document.getElementById('secret-quote');
  const finalEl = document.getElementById('secret-final');
  document.getElementById('secret-tagline').textContent = cfg.finalTagline;
  quoteEl.textContent = '';

  setTimeout(() => {
    setHeartbeatTempo('slow');
    const text = cfg.secretQuote;
    let i = 0;
    function typeChar() {
      if (i >= text.length) {
        setTimeout(() => {
          finalEl.classList.remove('ui-hidden');
          burstConfetti(window.innerWidth / 2, window.innerHeight * 0.5, 35);
          sfxPlay('sparkleChime', 0.4);
          triggerHaptic(40);
        }, 900);
        return;
      }
      quoteEl.textContent += text[i];
      i++;
      setTimeout(typeChar, 50);
    }
    typeChar();
  }, 5000);
}

// ══════════════════════════════════════════════════════════════════
// SHARED UTILITY FUNCTIONS
// ══════════════════════════════════════════════════════════════════

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
    if (document.getElementById('act5-birthday').classList.contains('ui-hidden')) return;
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

function burstConfetti(cx, cy, count = 26) {
  const colors = ['#ff8fab', '#ffd166', '#8b6fff', '#52b788', '#f4a261', '#fff'];
  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-bit';
    const isCircle = Math.random() > 0.5;
    const size = 5 + Math.random() * 6;
    c.style.cssText = `
      position:fixed; left:${cx}px; top:${cy}px; z-index:9998;
      width:${size}px; height:${size * (isCircle ? 1 : 1.6)}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      border-radius:${isCircle ? '50%' : '2px'};
    `;
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 140;
    c.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    c.style.setProperty('--dy', `${Math.sin(angle) * dist - 40}px`);
    c.style.setProperty('--rot', `${(Math.random() - 0.5) * 720}deg`);
    c.style.animationDuration = `${1 + Math.random() * 0.8}s`;
    c.style.animationDelay = `${Math.random() * 0.1}s`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 2000);
  }
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

function spawnButterflyWish(x, y, label) {
  const el = document.createElement('div');
  el.className = 'butterfly-wish';
  el.textContent = '🦋';
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  const dx = (Math.random() - 0.5) * 160;
  const dy = -(200 + Math.random() * 150);
  el.style.setProperty('--bx', `${dx}px`);
  el.style.setProperty('--by', `${dy}px`);
  el.style.setProperty('--brot', `${(Math.random() - 0.5) * 60}deg`);
  const wishLabel = document.createElement('span');
  wishLabel.className = 'wish-label';
  wishLabel.textContent = label;
  el.appendChild(wishLabel);
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4200);
}