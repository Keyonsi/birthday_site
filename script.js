/* ============================================================
   MONSOON DIARIES — Overhauled Script Engine
   ============================================================ */

'use strict';

// Chapter to Audio elements mapping
const chapterAudios = {
  0: document.getElementById('music-sad'),
  1: document.getElementById('music-happy'),
  2: document.getElementById('music-romantic'),
  3: document.getElementById('music-longing'),
  4: document.getElementById('music-festive')
};

let currentChapter = -1;
let currentPlayingAudio = null;
let bgMusicPlaying = false;

// Crossfade Audio Logic
function switchChapterAudio(newIdx) {
  const targetAudio = chapterAudios[newIdx];
  if (!targetAudio || !bgMusicPlaying) return;

  // Fade out current audio
  if (currentPlayingAudio && currentPlayingAudio !== targetAudio) {
    fadeAudio(currentPlayingAudio, 0, 1500, true);
  }

  // Fade in new audio
  currentPlayingAudio = targetAudio;
  targetAudio.volume = 0;
  targetAudio.play().then(() => {
    fadeAudio(targetAudio, 0.45, 2000, false);
  }).catch(err => console.log("Audio play blocked/failed:", err));
}

function fadeAudio(audio, targetVol, duration, pauseOnComplete) {
  const steps = 25;
  const interval = duration / steps;
  const volStep = (targetVol - audio.volume) / steps;
  let count = 0;

  const timer = setInterval(() => {
    audio.volume = Math.max(0, Math.min(1, audio.volume + volStep));
    count++;
    if (count >= steps) {
      audio.volume = targetVol;
      clearInterval(timer);
      if (pauseOnComplete && targetVol === 0) {
        audio.pause();
      }
    }
  }, interval);
}

// ── LOADER & INITIAL AUDIO UNLOCK ───────────────────────────
document.getElementById('loader').addEventListener('click', () => {
  bgMusicPlaying = true;
  document.getElementById('music-icon').textContent = '❚❚';

  // Fade out loader
  gsap.to('#loader', { opacity: 0, duration: 0.8, onComplete: () => {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('music-player').classList.remove('ui-hidden');
    document.getElementById('chapter-nav').classList.remove('ui-hidden');
    showChapter(0);
  }});
});

// Play/Pause Control
document.getElementById('music-btn').addEventListener('click', () => {
  if (bgMusicPlaying) {
    if (currentPlayingAudio) {
      fadeAudio(currentPlayingAudio, 0, 800, true);
    }
    bgMusicPlaying = false;
    document.getElementById('music-icon').textContent = '▶';
  } else {
    bgMusicPlaying = true;
    document.getElementById('music-icon').textContent = '❚❚';
    if (currentChapter >= 0) {
      switchChapterAudio(currentChapter);
    }
  }
});

// ── NAVIGATION & CHAPTER TRANSITIONS ─────────────────────────
const CHAPTER_IDS = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5'];
document.querySelectorAll('.chapter-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const targetIdx = parseInt(dot.dataset.chapter);
    if (targetIdx <= currentChapter || dot.classList.contains('done')) {
      showChapter(targetIdx);
    }
  });
});

function showChapter(idx) {
  CHAPTER_IDS.forEach((id, cIdx) => {
    const el = document.getElementById(id);
    if (cIdx === idx) {
      el.classList.remove('ch-hidden');
    } else {
      el.classList.add('ch-hidden');
    }
  });

  document.querySelectorAll('.chapter-dot').forEach((dot, dIdx) => {
    dot.classList.remove('active', 'done');
    if (dIdx < idx) dot.classList.add('done');
    if (dIdx === idx) dot.classList.add('active');
  });

  currentChapter = idx;
  switchChapterAudio(idx);
  initChapterEffects(idx);
}

let animationFrameId = null;

function initChapterEffects(idx) {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  if (idx === 0) {
    initChapter1();
  } else if (idx === 1) {
    initChapter2();
  } else if (idx === 2) {
    initChapter3();
  } else if (idx === 3) {
    initChapter4();
  } else if (idx === 4) {
    initChapter5();
  }
}

// ── CHAPTER 1: PEHLE ─────────────────────────────────────────
function initChapter1() {
  const tw = document.getElementById('tw');
  const lines = [
    "Ek waqt tha...",
    "Sab kuch boring aur khali tha.",
    "Par phir...",
    "Tum meri life mein aayi! ❤️"
  ];
  let lineIdx = 0, charIdx = 0, isDeleting = false;
  tw.textContent = "";

  function handleTypewriter() {
    if (currentChapter !== 0) return;
    const current = lines[lineIdx];
    if (!isDeleting) {
      tw.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(handleTypewriter, 1800);
        return;
      }
    } else {
      tw.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        isDeleting = false;
        lineIdx = (lineIdx + 1) % lines.length;
      }
    }
    setTimeout(handleTypewriter, isDeleting ? 40 : 80);
  }
  setTimeout(handleTypewriter, 800);

  // Background stars
  const canvas = document.getElementById('ch1-canvas');
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();

  const stars = [];
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5,
      opacity: Math.random(),
      speed: Math.random() * 0.02 + 0.005
    });
  }

  function loop() {
    if (currentChapter !== 0) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    stars.forEach(s => {
      s.opacity += s.speed;
      if (s.opacity > 1 || s.opacity < 0) s.speed = -s.speed;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(200, 200, 255, ${Math.abs(s.opacity)})`;
      ctx.fill();
    });
    animationFrameId = requestAnimationFrame(loop);
  }
  loop();

  createRain('rain1', 40);

  document.getElementById('begin-btn').onclick = () => {
    showChapter(1);
  };
}

// ── CHAPTER 2: TERI KAHANI (Framed Polaroid Journey) ─────────
const ERA_PHOTOS = [
  { name: "Bachi 🧸", desc: "Masoom savera aur cute bachpan", folder: "bachi", emoji: "🧸" },
  { name: "Chulbuli ✨", desc: "Naughty smiles aur mastiyaan", folder: "chulbuli", emoji: "✨" },
  { name: "Ladki 🌸", desc: "Zindagi ko naye dhang se jeena", folder: "ladki", emoji: "🌸" },
  { name: "Saree 🥻", desc: "Graceful aur bilkul khoobsurat", folder: "saree", emoji: "🥻" },
  { name: "Us Together 🫂", desc: "Dheere se kandhe par pehla haath", folder: "us", emoji: "🫂" },
  { name: "Married Dream 💍", desc: "Ek din ye sapna sach hoga!", folder: "married", emoji: "💍" }
];
let currentEraIndex = 0;
let currentPhotoIndexInEra = 0;

function initChapter2() {
  currentEraIndex = 0;
  currentPhotoIndexInEra = 0;
  loadEra(0);

  const ch2 = document.getElementById('ch2');
  ch2.onclick = (e) => {
    if (!document.getElementById('dream-frame').classList.contains('ui-hidden')) {
      document.getElementById('dream-frame').classList.add('ui-hidden');
      showChapter(2);
      return;
    }
    progressPhotoJourney();
  };

  // Era Canvas Particles (Rising petals style)
  const canvas = document.getElementById('ps-canvas');
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();

  const particles = [];
  for (let i = 0; i < 35; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      vy: -(Math.random() * 0.7 + 0.1),
      vx: (Math.random() - 0.5) * 0.4,
      alpha: Math.random()
    });
  }

  function loop() {
    if (currentChapter !== 1) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => {
      p.y += p.vy;
      p.x += p.vx;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255, 182, 193, ${p.alpha * 0.35})`;
      ctx.fill();
    });
    animationFrameId = requestAnimationFrame(loop);
  }
  loop();
}

function loadEra(index) {
  const era = ERA_PHOTOS[index];
  if (!era) return;

  document.getElementById('ps-era-name').textContent = era.name;
  document.getElementById('ps-emoji').textContent = era.emoji;
  document.getElementById('ps-subtitle').textContent = era.desc;

  const photos = BIRTHDAY_CONFIG.photos[era.folder] || [];
  const photoPath = photos[currentPhotoIndexInEra % photos.length] || "images/final/1.jpg";

  const layerA = document.getElementById('ps-layer-a');
  const layerB = document.getElementById('ps-layer-b');

  if (layerA.classList.contains('active')) {
    layerB.style.backgroundImage = `url('${photoPath}')`;
    layerB.classList.add('active');
    layerA.classList.remove('active');
  } else {
    layerA.style.backgroundImage = `url('${photoPath}')`;
    layerA.classList.add('active');
    layerB.classList.remove('active');
  }

  // Tilt the polaroid card gently on photo change
  const frame = document.getElementById('ps-frame');
  const randomTilt = (Math.random() - 0.5) * 6; // between -3deg and 3deg
  frame.style.transform = `rotate(${randomTilt}deg)`;

  // Dots progress
  const dotsContainer = document.getElementById('ps-progress-dots');
  dotsContainer.innerHTML = "";
  ERA_PHOTOS.forEach((_, dIdx) => {
    const dot = document.createElement('div');
    dot.className = `ps-dot ${dIdx === index ? 'active' : ''}`;
    dotsContainer.appendChild(dot);
  });
}

function progressPhotoJourney() {
  const era = ERA_PHOTOS[currentEraIndex];
  const photos = BIRTHDAY_CONFIG.photos[era.folder] || [];

  currentPhotoIndexInEra++;
  if (currentPhotoIndexInEra >= Math.min(photos.length, 2)) {
    currentPhotoIndexInEra = 0;
    currentEraIndex++;

    if (currentEraIndex >= ERA_PHOTOS.length) {
      document.getElementById('dream-frame').classList.remove('ui-hidden');
    } else {
      loadEra(currentEraIndex);
    }
  } else {
    loadEra(currentEraIndex);
  }
}

// ── CHAPTER 3: BAARISH MEIN ──────────────────────────────
let activeHearts = [];

function initChapter3() {
  const cfg = BIRTHDAY_CONFIG.chapter3;
  document.getElementById('rain-text').textContent = cfg.mainMemory.description;

  const list = document.getElementById('moments-list');
  list.innerHTML = "";
  cfg.moments.forEach(m => {
    const item = document.createElement('div');
    item.className = 'moment-item';
    item.innerHTML = `<span class="moment-icon">${m.icon}</span><span>${m.text}</span>`;
    list.appendChild(item);
  });

  // Modal setup
  const modal = document.getElementById('heart-popup');
  const modalClose = document.getElementById('heart-popup-close');
  modalClose.onclick = () => modal.classList.add('ui-hidden');

  // Floating Winking Hearts logic
  const wrap = document.getElementById('hearts-wrap');
  wrap.innerHTML = "";
  activeHearts = [];
  let count = 0;

  cfg.reasonsILoveYou.forEach((reason, i) => {
    const bubble = document.createElement('div');
    bubble.className = 'heart-bubble';
    bubble.innerHTML = `❤️`;
    
    // Random placement & drift properties
    const bubbleData = {
      el: bubble,
      x: Math.random() * 80 + 10, // percent
      y: Math.random() * 100 + 100, // starting below bottom
      speed: Math.random() * 0.8 + 0.4,
      wobble: Math.random() * 100,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
      reason: reason,
      revealed: false
    };

    bubble.onclick = (e) => {
      e.stopPropagation();
      if (!bubbleData.revealed) {
        bubbleData.revealed = true;
        bubble.classList.add('revealed', 'wink');
        bubble.innerHTML = `😉`;
        count++;
        document.getElementById('hearts-count').textContent = `${count} / ${cfg.reasonsILoveYou.length} raazein khuli...`;
        
        // Show reason popup modal
        document.getElementById('heart-popup-msg').textContent = reason;
        modal.classList.remove('ui-hidden');
        
        burstSpark(e.clientX, e.clientY);

        // Reset wink emoji back to normal heart/wink state after anim
        setTimeout(() => {
          bubble.innerHTML = `💖`;
          bubble.classList.remove('wink');
        }, 600);
      } else {
        // Re-show reason if already clicked
        document.getElementById('heart-popup-msg').textContent = reason;
        modal.classList.remove('ui-hidden');
      }
    };
    
    wrap.appendChild(bubble);
    activeHearts.push(bubbleData);
  });

  document.getElementById('hearts-count').textContent = `0 / ${cfg.reasonsILoveYou.length} raazein khuli...`;

  // Dynamic Floating Hearts Canvas/Frame Loop
  function updateHearts() {
    if (currentChapter !== 2) return;
    activeHearts.forEach(h => {
      h.y -= h.speed;
      // Wobble left-to-right
      const currentX = h.x + Math.sin(h.y * h.wobbleSpeed) * 8;
      
      h.el.style.left = `${currentX}%`;
      h.el.style.top = `${h.y}px`;

      // Reset to bottom if off-screen top
      if (h.y < -50) {
        h.y = 280; // wrap height is 250px
        h.x = Math.random() * 80 + 10;
      }
    });
    requestAnimationFrame(updateHearts);
  }
  updateHearts();

  // Fireflies Canvas Loop
  const canvas = document.getElementById('ch3-canvas');
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();

  const fireflies = [];
  for (let i = 0; i < 25; i++) {
    fireflies.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.4 + 0.1
    });
  }

  function loop() {
    if (currentChapter !== 2) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    fireflies.forEach(f => {
      f.angle += (Math.random() - 0.5) * 0.2;
      f.x += Math.cos(f.angle) * f.speed;
      f.y += Math.sin(f.angle) * f.speed;
      if (f.x < 0 || f.x > canvas.width) f.angle = Math.PI - f.angle;
      if (f.y < 0 || f.y > canvas.height) f.angle = -f.angle;

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(244, 162, 97, ${0.4 + Math.random()*0.5})`;
      ctx.fill();
    });
    animationFrameId = requestAnimationFrame(loop);
  }
  loop();

  createRain('rain3', 75);
  document.getElementById('ch3-next').onclick = () => showChapter(3);
}

// ── CHAPTER 4: DOORI ─────────────────────────────────────
function initChapter4() {
  const cfg = BIRTHDAY_CONFIG.chapter4;
  document.getElementById('ch4-desc').textContent = cfg.description;
  document.getElementById('letter-text').textContent = cfg.letter;

  const distWrap = document.getElementById('dist-moments');
  distWrap.innerHTML = "";
  cfg.moments.forEach(m => {
    const item = document.createElement('div');
    item.className = 'dist-item';
    item.textContent = m;
    distWrap.appendChild(item);
  });

  const canvas = document.getElementById('ch4-canvas');
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();

  const dust = [];
  for (let i = 0; i < 30; i++) {
    dust.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.4 + 0.1,
      speed: Math.random() * 0.004 + 0.001
    });
  }

  function loop() {
    if (currentChapter !== 3) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    dust.forEach(d => {
      d.alpha += d.speed;
      if (d.alpha > 0.6 || d.alpha < 0.1) d.speed = -d.speed;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(212, 132, 154, ${Math.abs(d.alpha)})`;
      ctx.fill();
    });
    animationFrameId = requestAnimationFrame(loop);
  }
  loop();

  document.getElementById('ch4-next').onclick = () => showChapter(4);
}

// ── CHAPTER 5: AAJ & FOREVER ────────────────────────────────
function initChapter5() {
  const cfg = BIRTHDAY_CONFIG.chapter5;
  document.getElementById('bday-name').textContent = BIRTHDAY_CONFIG.name;
  document.getElementById('anni-tag').textContent = BIRTHDAY_CONFIG.anniversaryMessage;

  const wishesWrap = document.getElementById('wishes-wrap');
  wishesWrap.innerHTML = "";
  cfg.wishes.forEach(w => {
    const bubble = document.createElement('div');
    bubble.className = 'wish-bubble';
    bubble.textContent = w;
    wishesWrap.appendChild(bubble);
  });

  const envelope = document.getElementById('envelope');
  const fullLetter = document.getElementById('full-letter');
  const letterBody = document.getElementById('letter-body-ch5');

  envelope.onclick = () => {
    envelope.classList.add('ui-hidden');
    fullLetter.classList.remove('ui-hidden');
    letterBody.textContent = cfg.endingLetter;

    setTimeout(() => {
      document.getElementById('close1').textContent = cfg.closingLine;
      document.getElementById('close2').textContent = cfg.finalLine;
      document.getElementById('closing').classList.remove('ui-hidden');
      triggerCelebrationFireworks();
    }, 2500);
  };

  const canvas = document.getElementById('ch5-canvas');
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();

  const stars = [];
  for (let i = 0; i < 40; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5,
      alpha: Math.random()
    });
  }

  function loop() {
    if (currentChapter !== 4) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    stars.forEach(s => {
      s.alpha += 0.01;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255, 215, 0, ${Math.abs(Math.sin(s.alpha))})`;
      ctx.fill();
    });
    animationFrameId = requestAnimationFrame(loop);
  }
  loop();

  createLanterns();
}

function createRain(containerId, count) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  wrap.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const drop = document.createElement('div');
    drop.className = 'drop';
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.height = `${12 + Math.random() * 18}px`;
    drop.style.animationDuration = `${0.7 + Math.random() * 0.9}s`;
    drop.style.animationDelay = `${Math.random() * 1.5}s`;
    wrap.appendChild(drop);
  }
}

function createLanterns() {
  const container = document.getElementById('lanterns');
  if (!container) return;
  container.innerHTML = "";
  const items = ['🏮', '🪔', '✨', '💛'];
  setInterval(() => {
    if (currentChapter !== 4) return;
    const l = document.createElement('div');
    l.className = 'lantern';
    l.textContent = items[Math.floor(Math.random() * items.length)];
    l.style.left = `${Math.random() * 90 + 5}%`;
    l.style.fontSize = `${1.1 + Math.random() * 0.7}rem`;
    l.style.animationDuration = `${7 + Math.random() * 6}s`;
    container.appendChild(l);
    setTimeout(() => l.remove(), 12000);
  }, 2000);
}

function triggerCelebrationFireworks() {
  for (let i = 0; i < 5; i++) {
    setTimeout(launchSingleFirework, i * 400);
  }
}

function launchSingleFirework() {
  const container = document.getElementById('fw5');
  if (!container) return;
  const x = Math.random() * 80 + 10;
  const y = Math.random() * 40 + 10;
  const colors = ['#ffd700', '#ff6b9d', '#8b6fff', '#52b788', '#f4a261'];
  const burstCount = 18;

  for (let i = 0; i < burstCount; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    s.style.left = `${x}%`;
    s.style.top = `${y}%`;
    s.style.background = colors[Math.floor(Math.random() * colors.length)];
    const angle = (i / burstCount) * Math.PI * 2;
    const dist = 30 + Math.random() * 50;
    s.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    s.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    s.style.animationDuration = `${0.6 + Math.random() * 0.4}s`;
    container.appendChild(s);
    setTimeout(() => s.remove(), 1000);
  }
}

function burstSpark(x, y) {
  const container = document.body;
  const colors = ['#ff6b9d', '#ffd700', '#8b6fff'];
  for (let i = 0; i < 10; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    s.style.position = 'fixed';
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    s.style.background = colors[Math.floor(Math.random() * colors.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = 20 + Math.random() * 30;
    s.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    s.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    s.style.animationDuration = `${0.5 + Math.random() * 0.3}s`;
    container.appendChild(s);
    setTimeout(() => s.remove(), 800);
  }
}
