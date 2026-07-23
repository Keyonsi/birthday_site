/* ============================================================
   MONSOON DIARIES — Complete Script Engine
   ============================================================ */
'use strict';

// ── HAPTIC FEEDBACK UTILITY ─────────────────────────────────────
// Soft 10-20ms vibrations for physical tactile feedback on key touch moments
function triggerHaptic(durationMs = 15) {
  try {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      navigator.vibrate(durationMs);
    }
  } catch (e) {
    // Silent catch if device/browser disables haptics
  }
}

// ── MEMORY ENGINE VARIATION FLAG & QUOTE SELECTION (Phase 9) ───
(function initMemoryEngine() {
  // Session randomizer seed
  if (!sessionStorage.getItem('birthday_session_seed')) {
    sessionStorage.setItem('birthday_session_seed', Math.floor(Math.random() * 10000).toString());
  }

  // 1. Cold open quote rotation
  if (BIRTHDAY_CONFIG.coldOpenVariants && BIRTHDAY_CONFIG.coldOpenVariants.length) {
    const idx = Math.floor(Math.random() * BIRTHDAY_CONFIG.coldOpenVariants.length);
    BIRTHDAY_CONFIG.coldOpen = BIRTHDAY_CONFIG.coldOpenVariants[idx];
  }

  // 2. Chapter taglines rotation
  if (BIRTHDAY_CONFIG.chapterMeta && Array.isArray(BIRTHDAY_CONFIG.chapterMeta)) {
    BIRTHDAY_CONFIG.chapterMeta.forEach(meta => {
      if (meta.taglineVariants && meta.taglineVariants.length) {
        const tIdx = Math.floor(Math.random() * meta.taglineVariants.length);
        meta.tagline = meta.taglineVariants[tIdx];
      }
    });
  }
})();

// ── COLD OPEN — first thing shown, before loader ─────────────
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
        gsap.to(el, {
          opacity: 0, duration: 1, ease: 'power2.inOut',
          onComplete: () => { el.style.display = 'none'; }
        });
      }, 500);
      return;
    }
    lineEl.textContent = lines[i];
    gsap.fromTo(lineEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
    setTimeout(() => {
      gsap.to(lineEl, {
        opacity: 0, y: -8, duration: 0.6, ease: 'power2.in',
        onComplete: () => { i++; showLine(); }
      });
    }, 1700);
  }
  showLine();
})();

// ── DEVICE ORIENTATION MIRROR MODE (Phase 8) ────────────────────
(function initOrientationMirror() {
  const mirrorEl = document.getElementById('orientation-mirror');
  if (!mirrorEl) return;

  function checkOrientation() {
    // Check if device is flipped to landscape on mobile viewports
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

// ── SHARED WIND ENGINE ─────────────────────────────────────────
// A single slow oscillation used across chapters so that petals, fireflies,
// dust motes, and smoke all drift together in the same direction —
// making the world feel like one connected place, not isolated effects.
function sharedWindX() {
  return Math.sin(Date.now() / 6000) * 0.00035;
}

// ── GLOBAL TOUCH TRAIL — tiny gold sparkles following the finger ──────
// Kept intentionally light: max 5 concurrent particles, throttled spawn.
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

  // Bloom-on-touch — a tiny flower blooms briefly wherever the person taps
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
    // Skip blooms on interactive controls so they don't visually clash with buttons/inputs
    if (e.target.closest('button, a, input, .quiz-option, .heart-bubble, .rose-spot, .candle-item')) return;
    spawnBloom(e.clientX, e.clientY);
  });
})();

// ── ACHIEVEMENT SYSTEM ─────────────────────────────────────────
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

// ── INVISIBLE TAP-STARS (Chapter 1) — 15 hidden zones, whispered lines ──
let starWhispersInitialized = false;
const seenWhisperIndices = new Set();

function initStarWhispers() {
  if (starWhispersInitialized) return; // only attach once
  starWhispersInitialized = true;
  const ch1 = document.getElementById('ch1');
  const total = 15;
  for (let i = 0; i < total; i++) {
    const spot = document.createElement('div');
    spot.className = 'star-whisper-spot';
    spot.style.left = `${5 + Math.random() * 90}%`;
    spot.style.top = `${5 + Math.random() * 65}%`;
    spot.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerHaptic(15);
      unlockAchievement('first_touch', 'First Touch');
      const pool = BIRTHDAY_CONFIG.starWhispers || [];
      if (!pool.length) return;

      // Deduplicated whisper selection for Phase 9 Memory Engine
      let availableIndices = pool.map((_, idx) => idx).filter(idx => !seenWhisperIndices.has(idx));
      if (availableIndices.length === 0) {
        seenWhisperIndices.clear(); // reset pool after all 15 seen
        availableIndices = pool.map((_, idx) => idx);
      }
      const chosenIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      seenWhisperIndices.add(chosenIdx);

      const line = pool[chosenIdx];
      const toast = document.getElementById('star-whisper-toast') || createStarWhisperToast();
      toast.textContent = line;
      toast.classList.add('show');
      sfxPlay('sparkleChime', 0.2);
      burstSpark(e.clientX, e.clientY);
      clearTimeout(toast._hideTimer);
      toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 2600);
    });
    ch1.appendChild(spot);
  }
}
function createStarWhisperToast() {
  const t = document.createElement('div');
  t.id = 'star-whisper-toast';
  t.className = 'star-whisper-toast';
  document.body.appendChild(t);
  return t;
}

// ── HIDDEN LETTERS COLLECTIBLE (10 letters spread across all 5 chapters) ──
const collectedLetterIndices = new Set();
const LETTER_POSITIONS = [
  // 2 spots per chapter, placed to avoid key content areas
  { chapter: 'ch1', x: 10, y: 20 }, { chapter: 'ch1', x: 88, y: 78 },
  { chapter: 'ch2', x: 6, y: 30 }, { chapter: 'ch2', x: 92, y: 40 },
  { chapter: 'ch3', x: 6, y: 8 }, { chapter: 'ch3', x: 92, y: 92 },
  { chapter: 'ch4', x: 88, y: 15 }, { chapter: 'ch4', x: 8, y: 88 },
  { chapter: 'ch5', x: 6, y: 50 }, { chapter: 'ch5', x: 92, y: 10 }
];

function initHiddenLetters() {
  const letters = BIRTHDAY_CONFIG.hiddenLetters || [];
  document.getElementById('collectibles-hud').classList.remove('ui-hidden');
  LETTER_POSITIONS.forEach((pos, i) => {
    const chapterEl = document.getElementById(pos.chapter);
    if (!chapterEl || letters[i] === undefined) return;
    const spot = document.createElement('div');
    spot.className = 'letter-spot';
    spot.textContent = '?';
    spot.style.left = `${pos.x}%`;
    spot.style.top = `${pos.y}%`;
    spot.addEventListener('click', (e) => {
      e.stopPropagation();
      if (collectedLetterIndices.has(i)) return;
      collectedLetterIndices.add(i);
      spot.textContent = letters[i];
      spot.classList.add('found');
      sfxPlay('sparkleChime', 0.25);
      burstSpark(e.clientX, e.clientY);
      updateLettersCounter();
      if (collectedLetterIndices.size === letters.length) {
        unlockAchievement('letters_complete', 'Sab Raaz Mil Gaye!');
        setTimeout(showLettersCompleteModal, 900);
      }
    });
    chapterEl.appendChild(spot);
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

// ── FIREFLY CATCH (Chapter 3) ──────────────────────────────────
let firefliesCaught = new Set();
function updateFirefliesCounter() {
  document.getElementById('fireflies-counter').textContent = `🦟 ${firefliesCaught.size}/5`;
}
function tryCatchFirefly(clickXNorm, clickYNorm, flies) {
  if (firefliesCaught.size >= 5) return;
  for (let idx = 0; idx < flies.length; idx++) {
    if (firefliesCaught.has(idx)) continue;
    const f = flies[idx];
    const dx = f.x - clickXNorm, dy = f.y - clickYNorm;
    if (Math.sqrt(dx * dx + dy * dy) < 0.035) {
      firefliesCaught.add(idx);
      updateFirefliesCounter();
      sfxPlay('fireflyChime', 0.3);
      if (firefliesCaught.size === 5) {
        unlockAchievement('fireflies_complete', 'Firefly Catcher!');
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
      }
      return;
    }
  }
}

// Adds a subtle body class so the whole site's mood shifts gently
// with the real time of day: night (deep/moon), morning (golden/warm),
// day (neutral — no extra tint).
(function initTimeAwareMode() {
  const hour = new Date().getHours();
  let mode = 'day';
  if (hour >= 19 || hour < 5) mode = 'night';
  else if (hour >= 5 && hour < 8) mode = 'morning';
  document.documentElement.classList.add(`time-${mode}`);
})();


// ── WEB AUDIO SYNTHESIZER ENGINE (100% Reliable Offline Sound FX) ───
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioCtx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSynthSFX(type) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'candleBlow' || type === 'blow') {
      // White noise puff + low frequency woosh
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

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } else if (type === 'crack' || type === 'heartCrack') {
      // Sudden sharp crack frequency burst
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'chime' || type === 'sparkleChime') {
      // Glowing crystal chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.3);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch (e) {
    // Silent catch
  }
}

// NOTE: These are placeholder royalty-free CDN links with Web Audio Fallback
const SFX_LIBRARY = {
  firework: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_dc39b45e26.mp3",
  candleBlow: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_a3cbfd2f6a.mp3",
  nightAmbience: "https://cdn.pixabay.com/download/audio/2021/11/25/audio_00c9c94997.mp3",
  fireflyChime: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3",
  rainLight: "https://cdn.pixabay.com/download/audio/2022/03/09/audio_c8e70a7f38.mp3",
  paperRustle: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3",
  waxSeal: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_8f0f9b1a52.mp3",
  shutter: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3",
  pianoTap: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_88447e769f.mp3",
  heartbeat: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0dd3c0428.mp3",
  sparkleChime: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3"
};
const sfxCache = {};
let sfxEnabled = true;

function sfxPlay(name, volume = 0.4) {
  if (!sfxEnabled) return;
  // Always trigger reliable synth sound fallback
  playSynthSFX(name);
  try {
    const url = SFX_LIBRARY[name];
    if (!url) return;
    const audio = new Audio(url);
    audio.volume = volume;
    audio.play().catch(() => { });
  } catch (e) { }
}

// Looping ambience/heartbeat control — used for night ambience, rain, heartbeat
function sfxLoop(name, volume = 0.15) {
  try {
    if (sfxCache[name]) { sfxCache[name].volume = volume; return sfxCache[name]; }
    const url = SFX_LIBRARY[name];
    if (!url) return null;
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = volume;
    audio.play().catch(() => { });
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
    if (++n >= steps) {
      clearInterval(t);
      audio.pause();
      delete sfxCache[name];
    }
  }, dt);
}

// Heartbeat tempo engine — tempo shifts with the emotional beat of each chapter.
// rate: 'slow' | 'normal' | 'fast' | 'off'
function setHeartbeatTempo(rate) {
  if (rate === 'off') { sfxStopLoop('heartbeat', 1500); return; }
  const vol = 0.06;
  const audio = sfxLoop('heartbeat', vol);
  if (!audio) return;
  const rates = { slow: 0.75, normal: 1, fast: 1.25 };
  audio.playbackRate = rates[rate] || 1;
}


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

// ── LOADER & INITIALIZATION ─────────────────────────────────────
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

  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.001 + 0.0005,
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

    gsap.to('#loader', {
      opacity: 0, duration: 1, ease: 'power2.inOut',
      onComplete: () => {
        loader.style.display = 'none';
        startMovieEngine();
      }
    });
  }
  loader.addEventListener('click', startExperience);
})();

// ═══════════════════════════════════════════════════════════
// PART 1 — MOVIE STORY ENGINE (AUTO-PLAYING FILM)
// ═══════════════════════════════════════════════════════════
let movieIdx = 0;
let movieTimer = null;

function startMovieEngine() {
  movieIdx = 0;
  playMovieScene(0);

  document.getElementById('cinema-prev-btn').onclick = () => {
    triggerHaptic(10);
    if (movieIdx > 0) {
      movieIdx--;
      playMovieScene(movieIdx);
    }
  };

  document.getElementById('cinema-next-btn').onclick = () => {
    triggerHaptic(10);
    movieIdx++;
    if (movieIdx < BIRTHDAY_CONFIG.movieScenes.length) {
      playMovieScene(movieIdx);
    } else {
      endMovieEngine();
    }
  };
}

function playMovieScene(idx) {
  clearTimeout(movieTimer);
  const scenes = BIRTHDAY_CONFIG.movieScenes;
  if (idx >= scenes.length) {
    endMovieEngine();
    return;
  }

  const s = scenes[idx];
  document.getElementById('cinema-title').textContent = s.title;
  document.getElementById('cinema-subtitle').textContent = s.subtitle;
  document.getElementById('cinema-text').textContent = s.text;
  document.getElementById('cinema-caption').textContent = s.caption;
  document.getElementById('cinema-img').src = s.photo;

  // Animate progress fill
  const fill = document.getElementById('cinema-progress-fill');
  fill.style.transition = 'none';
  fill.style.width = '0%';
  setTimeout(() => {
    fill.style.transition = `width ${s.durationMs}ms linear`;
    fill.style.width = '100%';
  }, 50);

  sfxPlay('sparkleChime', 0.2);

  movieTimer = setTimeout(() => {
    movieIdx++;
    if (movieIdx < scenes.length) {
      playMovieScene(movieIdx);
    } else {
      endMovieEngine();
    }
  }, s.durationMs);
}

function endMovieEngine() {
  clearTimeout(movieTimer);
  gsap.to('#cinema-stage', {
    opacity: 0, duration: 1, onComplete: () => {
      document.getElementById('cinema-stage').classList.add('ui-hidden');
      startProposalStage();
    }
  });
}

// ═══════════════════════════════════════════════════════════
// PART 2 — PROPOSAL SCENE & HALF-MOON EMERALD RING
// ═══════════════════════════════════════════════════════════
function startProposalStage() {
  const pStage = document.getElementById('proposal-stage');
  pStage.classList.remove('ui-hidden');
  gsap.fromTo(pStage, { opacity: 0 }, { opacity: 1, duration: 1 });

  const dialogue = document.getElementById('proposal-dialogue-text');
  dialogue.textContent = BIRTHDAY_CONFIG.proposal.dialogue;

  setTimeout(() => {
    dialogue.textContent = BIRTHDAY_CONFIG.proposal.finalQuote;
    triggerHaptic(20);
    sfxPlay('chime', 0.4);

    setTimeout(() => {
      document.getElementById('ring-box').classList.remove('ui-hidden');
      sfxPlay('sparkleChime', 0.5);
    }, 1500);
  }, 3500);

  document.getElementById('proposal-accept-btn').onclick = () => {
    triggerHaptic(30);
    sfxPlay('chime', 0.5);
    burstConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 30);
    
    gsap.to('#proposal-stage', {
      opacity: 0, duration: 1, onComplete: () => {
        pStage.classList.add('ui-hidden');
        startBirthdayStage();
      }
    });
  };
}

// ═══════════════════════════════════════════════════════════
// PART 3 — GRAND BIRTHDAY SCENE & CHARACTER CANDLE BLOW
// ═══════════════════════════════════════════════════════════
let blownCandleCount = 0;

function startBirthdayStage() {
  const bStage = document.getElementById('birthday-stage');
  bStage.classList.remove('ui-hidden');
  gsap.fromTo(bStage, { opacity: 0 }, { opacity: 1, duration: 1 });

  const candles = document.querySelectorAll('.bday-candle');
  const buddy = document.getElementById('chibi-buddy');

  candles.forEach((candle) => {
    candle.onclick = () => {
      if (candle.classList.contains('blown')) return;

      // Move buddy to candle X position
      const rect = candle.getBoundingClientRect();
      buddy.style.left = `${rect.left}px`;
      
      triggerHaptic(15);
      sfxPlay('candleBlow', 0.4);

      setTimeout(() => {
        candle.classList.add('blown');
        blownCandleCount++;
        burstSpark(rect.left + 5, rect.top);

        if (blownCandleCount >= candles.length) {
          document.getElementById('candle-hint').textContent = "✨ Poore candles bujh gaye! Ab Cake Cut Karo...";
          triggerHaptic(30);
          burstConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 25);
          
          setTimeout(enableCakeCutting, 1200);
        }
      }, 300);
    };
  });
}

function enableCakeCutting() {
  const cake = document.getElementById('cake-3d');
  const cutLine = document.getElementById('cake-cut-line');
  cutLine.classList.remove('ui-hidden');

  cake.onclick = () => {
    triggerHaptic(25);
    sfxPlay('sparkleChime', 0.4);
    burstConfetti(window.innerWidth / 2, window.innerHeight * 0.5, 30);

    // Reveal Heart Core
    document.getElementById('cake-heart-core').classList.remove('ui-hidden');
    initHeartBreaker();
  };
}

// ═══════════════════════════════════════════════════════════
// PART 4 — 3-STAGE BREAKING HEART CORE & LOVE SHOWER
// ═══════════════════════════════════════════════════════════
let heartBreakStage = 0;

function initHeartBreaker() {
  const heart = document.getElementById('breaking-heart');
  const hint = document.getElementById('heart-break-hint');

  heart.onclick = () => {
    heartBreakStage++;
    triggerHaptic(20);
    sfxPlay('crack', 0.5);

    if (heartBreakStage === 1) {
      heart.className = 'breaking-heart stage-1';
      hint.textContent = '💔 Aur 2 baar tap karo! (1/3)';
    } else if (heartBreakStage === 2) {
      heart.className = 'breaking-heart stage-2';
      hint.textContent = '⚡ Bas 1 aakhri tap! (2/3)';
    } else if (heartBreakStage >= 3) {
      triggerHaptic(40);
      sfxPlay('sparkleChime', 0.6);
      burstConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 40);

      document.getElementById('cake-heart-core').classList.add('ui-hidden');
      startLoveShower();
    }
  };
}

function startLoveShower() {
  const showerStage = document.getElementById('shower-stage');
  showerStage.classList.remove('ui-hidden');
  gsap.fromTo(showerStage, { opacity: 0 }, { opacity: 1, duration: 1 });

  const container = document.getElementById('shower-container');
  const msgs = BIRTHDAY_CONFIG.heartShowerMessages || [];

  for (let i = 0; i < 20; i++) {
    const h = document.createElement('div');
    h.className = 'falling-heart';
    h.textContent = ['❤️', '💖', '✨', '🌹', '🥰'][i % 5];
    h.style.left = `${Math.random() * 90}%`;
    h.style.animationDuration = `${3 + Math.random() * 3}s`;
    h.style.animationDelay = `${Math.random() * 5}s`;

    h.onclick = () => {
      triggerHaptic(15);
      sfxPlay('sparkleChime', 0.3);
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      showShowerToast(msg);
    };
    container.appendChild(h);
  }
}

function showShowerToast(msg) {
  const toast = document.getElementById('shower-toast');
  document.getElementById('toast-message').textContent = msg;
  toast.classList.remove('ui-hidden');

  document.getElementById('toast-close-btn').onclick = () => {
    toast.classList.add('ui-hidden');
  };
}

// Sparkle helper
function burstSpark(x, y) {
  for (let i = 0; i < 6; i++) {
    const s = document.createElement('div');
    s.className = 'touch-trail-spark';
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 600);
  }
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
        triggerHaptic(15);
        const opt = q.options[parseInt(btn.dataset.idx)];
        btn.classList.add('chosen');
        sfxPlay('pianoTap', 0.2);
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

  // Adaptive rain — eases as the emotional moment resolves
  if (sfxCache.rainLight) sfxCache.rainLight.volume = 0.04;

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
      triggerHaptic(15);
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

// ── Cake-cut → butterfly wishes → balloon release (Chapter 5 finale) ──
function triggerCakeCut(cfg) {
  const sliceLine = document.getElementById('cake-slice-line');
  const cakeBody = document.getElementById('cake-body');
  sliceLine.classList.remove('ui-hidden');
  sliceLine.classList.add('cut');
  triggerHaptic(25);
  sfxPlay('sparkleChime', 0.3);

  const wishWords = ['May your dreams always find you.', 'Joy', 'Hope', 'Forever'];
  setTimeout(() => {
    const rect = cakeBody.getBoundingClientRect();
    for (let i = 0; i < 3; i++) {
      setTimeout(() => spawnButterflyWish(
        rect.left + rect.width / 2,
        rect.top,
        wishWords[i % wishWords.length]
      ), i * 500);
    }
  }, 600);

  setTimeout(() => releaseBalloons(), 2600);
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

function releaseBalloons() {
  const container = document.getElementById('balloon-release');
  const words = ['Joy', 'Dream', 'Hope', 'Smile', 'Forever', 'Love'];
  const colors = ['#ff8fab', '#ffd166', '#8b6fff', '#52b788', '#f4a261', '#ff6b9d'];
  words.forEach((word, i) => {
    setTimeout(() => {
      const b = document.createElement('div');
      b.className = 'release-balloon';
      const leftPct = 10 + Math.random() * 80;
      b.style.left = `${leftPct}%`;
      b.style.setProperty('--drift', `${(Math.random() - 0.5) * 120}px`);
      b.style.animationDuration = `${7 + Math.random() * 3}s`;
      b.innerHTML = `<div class="balloon-shape" style="background:${colors[i % colors.length]}"></div><span class="balloon-word">${word}</span>`;
      container.appendChild(b);
      setTimeout(() => b.remove(), 11000);
    }, i * 350);
  });
}

// ── Rain drops that spell a word (Chapter 3) — tap to dissolve ──
function scheduleRainWord() {
  const delay = 5000 + Math.random() * 5000;
  setTimeout(() => {
    if (currentChapter !== 2) return;
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
  document.getElementById('ch3').appendChild(el);
  setTimeout(() => { if (el.parentNode) el.remove(); }, 7000);
}

// ── Hidden rose garden (Chapter 3) ──────────────────────────
function initRoseGarden() {
  const garden = document.getElementById('rose-garden');
  const counterEl = document.getElementById('rose-counter');
  garden.innerHTML = '';
  counterEl.classList.remove('ui-hidden', 'complete');
  const total = 6;
  let found = 0;
  counterEl.textContent = `🌹 0 / ${total}`;

  // Spread positions across the viewport, spaced apart, avoiding exact center clutter
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
      unlockAchievement('first_rose', 'Found First Rose');
      const rect = spot.getBoundingClientRect();
      burstSpark(rect.left + rect.width / 2, rect.top + rect.height / 2);
      if (found === total) {
        triggerHaptic(30);
        counterEl.classList.add('complete');
        counterEl.textContent = `🌹 Poora bagicha khil gaya! ✨`;
        burstConfetti(window.innerWidth / 2, window.innerHeight * 0.3, 20);
      }
    });
    garden.appendChild(spot);
  });
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

  // Rain fades out as we leave the rain chapter; a slow lonely heartbeat begins
  sfxStopLoop('rainLight', 1500);
  setHeartbeatTempo('slow');

  const distWrap = document.getElementById('dist-moments');
  distWrap.innerHTML = '';
  cfg.moments.forEach((m, i) => {
    const item = document.createElement('div');
    item.className = 'dist-item';
    item.style.animationDelay = `${i * 0.12}s`;
    item.textContent = m;
    distWrap.appendChild(item);
  });

  // Reset reveal state each time chapter is (re)entered
  const letterWrap = document.getElementById('letter-wrap');
  const nextBtn = document.getElementById('ch4-next');
  const caption = document.getElementById('reunion-caption');
  letterWrap.classList.remove('revealed');
  nextBtn.classList.add('ui-hidden');
  caption.classList.remove('visible');
  caption.textContent = cfg.moments[cfg.moments.length - 1] || '';

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

  // Two soul lights — start far apart, drift toward each other over time,
  // and merge into one warm glow: a visual metaphor for the distance closing.
  const soulA = { x: 0.14, y: 0.42 };
  const soulB = { x: 0.86, y: 0.42 };
  let merged = false;
  const mergeStart = Date.now() + 1200;
  const mergeDuration = 6500;

  // Tiny bridge-stars scattered along the path between the two souls —
  // as the souls get closer, more of them twinkle to life, like the
  // universe quietly building a path between them.
  const bridgeStars = Array.from({ length: 40 }, (_, i) => ({
    t: i / 39,
    yOffset: (Math.random() - 0.5) * 0.1,
    twinkle: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.03 + Math.random() * 0.03
  }));

  function updateSouls() {
    if (merged) return;
    const t = Math.max(0, Math.min(1, (Date.now() - mergeStart) / mergeDuration));
    const eased = t * t * (3 - 2 * t); // smoothstep
    soulA.x = 0.14 + (0.5 - 0.14) * eased;
    soulB.x = 0.86 - (0.86 - 0.5) * eased;
    if (t >= 1 && !merged) {
      merged = true;
      onSoulsMerged();
    }
  }

  function onSoulsMerged() {
    burstSpark(window.innerWidth / 2, window.innerHeight * 0.42);
    burstConfetti(window.innerWidth / 2, window.innerHeight * 0.42, 22);
    sfxPlay('sparkleChime', 0.35);
    setHeartbeatTempo('normal');
    setTimeout(() => {
      caption.classList.add('visible');
      setTimeout(() => {
        document.getElementById('no-distance-line').classList.add('visible');
      }, 700);
      setTimeout(() => {
        letterWrap.classList.add('revealed');
        nextBtn.classList.remove('ui-hidden');
      }, 1600);
    }, 300);
  }

  function drawBridgeStars(ctx, W, H) {
    if (merged) return;
    const ax = soulA.x, bx = soulB.x, y = soulA.y;
    // Only draw stars that currently fall between the two souls
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

  // Celebration — heartbeat rests, let the music and fireworks carry the moment
  setHeartbeatTempo('off');

  const wishesWrap = document.getElementById('wishes-wrap');
  wishesWrap.innerHTML = '';
  cfg.wishes.forEach((w, i) => {
    const b = document.createElement('div');
    b.className = 'wish-bubble';
    b.style.animationDelay = `${i * 0.1}s`;
    b.textContent = w;
    wishesWrap.appendChild(b);
  });

  // Candle-blow interaction — tap each candle to blow it out; all blown = confetti + hint fades
  const candleWrap = document.getElementById('cake-candles');
  const cakeHint = document.getElementById('cake-hint');
  candleWrap.innerHTML = '';
  const totalCandles = 5;
  let blownCount = 0;
  for (let i = 0; i < totalCandles; i++) {
    const candle = document.createElement('div');
    candle.className = 'candle-item';
    candle.innerHTML = '<div class="candle-flame"></div><div class="candle-smoke"></div>';
    const flame = candle.querySelector('.candle-flame');
    flame.style.animationDuration = `${0.3 + Math.random() * 0.35}s`;
    flame.style.animationDelay = `${Math.random() * 0.4}s`;
    candle.addEventListener('click', () => {
      if (candle.classList.contains('blown')) return;
      candle.classList.add('blown');
      triggerHaptic(15);
      sfxPlay('candleBlow', 0.35);
      blownCount++;
      const rect = candle.getBoundingClientRect();
      burstSpark(rect.left + rect.width / 2, rect.top);
      if (blownCount === totalCandles) {
        cakeHint.classList.add('done');
        triggerHaptic(30);
        burstConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 30);
        setTimeout(() => triggerCakeCut(cfg), 500);
      }
    });
    candleWrap.appendChild(candle);
  }

  const envelope = document.getElementById('envelope');
  const fullLetter = document.getElementById('full-letter');
  envelope.onclick = (e) => {
    triggerHaptic(20);
    sfxPlay('waxSeal', 0.4);
    envelope.classList.add('ui-hidden');
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

  document.getElementById('finale-trigger').addEventListener('click', startGrandFinale);

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

// Confetti burst — used at key emotional climax points across chapters.
// Lightweight: fixed count, short-lived, no continuous loop (mobile-safe).
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

// ═══════════════════════════════════════════════════════════
// GRAND FINALE SEQUENCE
// ═══════════════════════════════════════════════════════════
function startGrandFinale() {
  const cfg = BIRTHDAY_CONFIG.finale;
  const overlay = document.getElementById('grand-finale');
  document.getElementById('chapter-footer').classList.add('ui-hidden');
  document.getElementById('music-player').classList.add('ui-hidden');
  document.getElementById('chapter-nav').classList.add('ui-hidden');
  document.getElementById('collectibles-hud').classList.add('ui-hidden');
  overlay.classList.remove('ui-hidden');
  setHeartbeatTempo('slow');
  unlockAchievement('finale_reached', 'Completed Love Story');

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

// ── Scene 1: Tiny planet — all chapters, now small enough to hold ──
function finaleScenePlanet(cfg) {
  document.getElementById('planet-line').textContent = cfg.planetLine;
  const canvas = document.getElementById('planet-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H * 0.38;
  const planetR = Math.min(W, H) * 0.16;
  const icons = ['🌳', '🌙', '🏠', '🎂', '⭐', '🦟'];
  let rot = 0;
  let running = true;

  function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    rot += 0.006;

    // Planet body
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, planetR);
    grd.addColorStop(0, 'rgba(120,150,190,0.9)');
    grd.addColorStop(1, 'rgba(60,80,120,0.9)');
    ctx.beginPath();
    ctx.arc(cx, cy, planetR, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // Orbiting icons (drawn as emoji text around the planet)
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

// ── Scene 2: Falling star credits ──
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
    requestAnimationFrame(() => { lineEl.style.transition = 'opacity 0.8s ease'; lineEl.style.opacity = 1; });
    i++;
    setTimeout(() => {
      lineEl.style.opacity = 0;
      setTimeout(nextCredit, 600);
    }, 1800);
  }
  nextCredit();
}

// ── Scene 3: Long-press heart → "I Love You" ──
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
      triggerHaptic(30);
      reveal.classList.remove('ui-hidden');
      burstConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 24);
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

// ── Scene 4: 365 Nights Under The Same Moon — heart-shaped dot field ──
function finaleScene365(cfg) {
  document.getElementById('finale-365-line').textContent = cfg.nights365Line;
  const canvas = document.getElementById('dots-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H * 0.36, scale = Math.min(W, H) * 0.018;

  // Generate 365 points along a parametric heart curve, slightly jittered
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

// ── Scene 5: Infinity loop — fireworks fade back into the opening sky, in color ──
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

// ── Scene 6: Final secret ending — black, silence, letter-by-letter, P❤️A ──
function finaleSceneSecret(cfg) {
  setHeartbeatTempo('off');
  const quoteEl = document.getElementById('secret-quote');
  const finalEl = document.getElementById('secret-final');
  document.getElementById('secret-tagline').textContent = cfg.finalTagline;
  quoteEl.textContent = '';

  // 5 seconds of near-silence before anything appears
  setTimeout(() => {
    setHeartbeatTempo('slow');
    const text = cfg.secretQuote;
    let i = 0;
    function typeChar() {
      if (i >= text.length) {
        setTimeout(() => {
          finalEl.classList.remove('ui-hidden');
          burstConfetti(window.innerWidth / 2, window.innerHeight * 0.5, 30);
          sfxPlay('sparkleChime', 0.35);
        }, 900);
        return;
      }
      quoteEl.textContent += text[i];
      i++;
      setTimeout(typeChar, 55);
    }
    typeChar();
  }, 5000);
}