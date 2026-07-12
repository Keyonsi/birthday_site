/* ============================================================
   MONSOON DIARIES — Script Engine Overhaul
   ============================================================ */

'use strict';

const bgAudio = document.getElementById('bg-audio');
let currentChapter = -1;
let bgMusicPlaying = false;

// ── PHOTO JOURNEY SEQUENCE CONFIG ───────────────────────────
const ERA_PHOTOS = [
  { id: 1, name: "Bachi 🧸", desc: "Zindagi ka sabse pehla aur masoom savera", folder: "kid", emoji: "🧸" },
  { id: 2, name: "Chulbuli ✨", desc: "Masti, hasi aur thodi natkhat shararatein", folder: "teeth", emoji: "✨" },
  { id: 3, name: "Ladki 🌸", desc: "Dheere dheere bade hona aur khud ko pehchanna", folder: "bossy", emoji: "🌸" },
  { id: 4, name: "Saree 🥻", desc: "Pehli baar saree mein ek khoobsurat ehsaas", folder: "saree", emoji: "🥻" },
  { id: 5, name: "Us Together 🫂", desc: "Mera haath, tumhare kandhe par pehli baar", folder: "final", emoji: "🫂" },
  { id: 6, name: "Married Dream 💍", desc: "Ek din ye sapna sach hoga, hamesha ke liye", folder: "final", emoji: "💍" }
];

let currentEraIndex = 0;
let currentPhotoIndexInEra = 0;

// Fade music helpers
function fadeAudio(audio, target, duration = 1000) {
  const step = (target - audio.volume) / (duration / 50);
  const timer = setInterval(() => {
    audio.volume = Math.max(0, Math.min(1, audio.volume + step));
    if ((step > 0 && audio.volume >= target) || (step < 0 && audio.volume <= target)) {
      audio.volume = target;
      clearInterval(timer);
      if (target === 0) audio.pause();
    }
  }, 50);
}

// ── LOADER AND GESTURE TO START MUSIC ─────────────────────────
document.getElementById('loader').addEventListener('click', () => {
  // Autoplay workaround: start music on user gesture
  bgAudio.volume = 0;
  bgAudio.play().then(() => {
    fadeAudio(bgAudio, 0.5, 2000);
    bgMusicPlaying = true;
    document.getElementById('music-icon').textContent = '❚❚';
  }).catch(err => console.log("Audio autoplay fail:", err));

  // Fade out loader
  gsap.to('#loader', { opacity: 0, duration: 0.8, onComplete: () => {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('music-player').classList.remove('ui-hidden');
    document.getElementById('chapter-nav').classList.remove('ui-hidden');
    showChapter(0);
  }});
});

// Music controls
document.getElementById('music-btn').addEventListener('click', () => {
  if (bgMusicPlaying) {
    fadeAudio(bgAudio, 0, 800);
    bgMusicPlaying = false;
    document.getElementById('music-icon').textContent = '▶';
  } else {
    bgAudio.play();
    fadeAudio(bgAudio, 0.5, 1000);
    bgMusicPlaying = true;
    document.getElementById('music-icon').textContent = '❚❚';
  }
});

// ── NAVIGATION DOTS ──────────────────────────────────────────
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
  initChapterEffects(idx);
}

// ── INITIALIZE EFFECTS FOR CURRENT CHAPTER ───────────────────
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

  // Background stars canvas
  const canvas = document.getElementById('ch1-canvas');
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

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

  // Gentle rain
  createRain('rain1', 40);

  document.getElementById('begin-btn').onclick = () => {
    showChapter(1);
  };
}

// ── CHAPTER 2: TERI KAHANI (Overhauled Photo Journey) ───
function initChapter2() {
  currentEraIndex = 0;
  currentPhotoIndexInEra = 0;
  loadEra(0);

  const ch2 = document.getElementById('ch2');
  // Click on background to progress
  ch2.onclick = (e) => {
    // Avoid triggering if clicked on next elements (not applicable here, screen is tap-based)
    if (document.getElementById('dream-frame').classList.contains('ui-hidden') === false) {
      // If dream frame is open, close it and go to next chapter
      document.getElementById('dream-frame').classList.add('ui-hidden');
      showChapter(2);
      return;
    }
    progressPhotoJourney();
  };

  // Setup Era particle canvas background
  const canvas = document.getElementById('ps-canvas');
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();

  const particles = [];
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      vy: -(Math.random() * 0.8 + 0.2),
      vx: (Math.random() - 0.5) * 0.5,
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
      ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.4})`;
      ctx.fill();
    });
    animationFrameId = requestAnimationFrame(loop);
  }
  loop();
}

function loadEra(index) {
  const era = ERA_PHOTOS[index];
  if (!era) return;

  // Set text
  document.getElementById('ps-era-name').textContent = era.name;
  document.getElementById('ps-emoji').textContent = era.emoji;
  document.getElementById('ps-subtitle').textContent = era.desc;

  // Get active photo file from config based on folder mapping
  const photos = BIRTHDAY_CONFIG.photos[era.folder] || [];
  const photoPath = photos[currentPhotoIndexInEra % photos.length] || "images/final/1.jpg";

  // Double layer transition for smooth fade
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

  // Adjust background overlays to change color mood per era
  const overlays = [
    "linear-gradient(rgba(12,12,30,0.4), rgba(12,12,30,0.85))", // Bachi
    "linear-gradient(rgba(43,24,0,0.3), rgba(43,24,0,0.85))",    // Chulbuli
    "linear-gradient(rgba(26,10,0,0.4), rgba(26,10,0,0.9))",     // Ladki
    "linear-gradient(rgba(13,36,22,0.3), rgba(13,36,22,0.85))",   // Saree
    "linear-gradient(rgba(20,10,40,0.4), rgba(20,10,40,0.9))",    // Us together
    "linear-gradient(rgba(255,215,0,0.2), rgba(10,5,25,0.95))"   // Married dream
  ];
  document.getElementById('ps-overlay').style.background = overlays[index] || overlays[0];

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
  // If we have viewed at least 2 photos from this folder, or reached max photos, go to next Era
  if (currentPhotoIndexInEra >= Math.min(photos.length, 2)) {
    currentPhotoIndexInEra = 0;
    currentEraIndex++;

    if (currentEraIndex >= ERA_PHOTOS.length) {
      // Reached the end! Trigger dream frame
      document.getElementById('dream-frame').classList.remove('ui-hidden');
    } else {
      loadEra(currentEraIndex);
    }
  } else {
    loadEra(currentEraIndex);
  }
}

// ── CHAPTER 3: BAARISH MEIN ──────────────────────────────
function initChapter3() {
  const cfg = BIRTHDAY_CONFIG.chapter3;
  document.getElementById('rain-text').textContent = cfg.mainMemory.description;

  // Stagger reveal moments
  const list = document.getElementById('moments-list');
  list.innerHTML = "";
  cfg.moments.forEach(m => {
    const item = document.createElement('div');
    item.className = 'moment-item';
    item.innerHTML = `<span class="moment-icon">${m.icon}</span><span>${m.text}</span>`;
    list.appendChild(item);
  });

  // Hearts logic
  const wrap = document.getElementById('hearts-wrap');
  wrap.innerHTML = "";
  let count = 0;

  cfg.reasonsILoveYou.forEach((reason, i) => {
    const bubble = document.createElement('div');
    bubble.className = 'heart-bubble';
    bubble.innerHTML = `❤️<div class="heart-tooltip">${reason}</div>`;
    bubble.onclick = (e) => {
      e.stopPropagation();
      if (!bubble.classList.contains('revealed')) {
        bubble.classList.add('revealed');
        count++;
        document.getElementById('hearts-count').textContent = `${count} / ${cfg.reasonsILoveYou.length} raazein khuli...`;
        burstSpark(e.clientX, e.clientY);
      }
    };
    wrap.appendChild(bubble);
  });
  document.getElementById('hearts-count').textContent = `0 / ${cfg.reasonsILoveYou.length} raazein khuli...`;

  // Canvas fireflies background
  const canvas = document.getElementById('ch3-canvas');
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();

  const fireflies = [];
  for (let i = 0; i < 30; i++) {
    fireflies.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.5 + 0.2
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
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#f4a261";
      ctx.fill();
    });
    animationFrameId = requestAnimationFrame(loop);
  }
  loop();

  // Heavy rain
  createRain('rain3', 80);

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

  // Canvas floating dust clouds background
  const canvas = document.getElementById('ch4-canvas');
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();

  const dust = [];
  for (let i = 0; i < 40; i++) {
    dust.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5,
      alpha: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.005 + 0.002
    });
  }

  function loop() {
    if (currentChapter !== 3) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    dust.forEach(d => {
      d.alpha += d.speed;
      if (d.alpha > 0.7 || d.alpha < 0.1) d.speed = -d.speed;
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

// ── CHAPTER 5: AAJ AUR HAMESHA ──────────────────────────
function initChapter5() {
  const cfg = BIRTHDAY_CONFIG.chapter5;
  document.getElementById('bday-name').textContent = BIRTHDAY_CONFIG.name;
  document.getElementById('anni-tag').textContent = BIRTHDAY_CONFIG.anniversaryMessage;

  // Wishes
  const wishesWrap = document.getElementById('wishes-wrap');
  wishesWrap.innerHTML = "";
  cfg.wishes.forEach(w => {
    const bubble = document.createElement('div');
    bubble.className = 'wish-bubble';
    bubble.textContent = w;
    wishesWrap.appendChild(bubble);
  });

  // Letter reveal
  const envelope = document.getElementById('envelope');
  const fullLetter = document.getElementById('full-letter');
  const letterBody = document.getElementById('letter-body-ch5');

  envelope.onclick = () => {
    envelope.classList.add('ui-hidden');
    fullLetter.classList.remove('ui-hidden');
    letterBody.textContent = cfg.endingLetter;

    // Show closing signature block after 3s
    setTimeout(() => {
      document.getElementById('close1').textContent = cfg.closingLine;
      document.getElementById('close2').textContent = cfg.finalLine;
      document.getElementById('closing').classList.remove('ui-hidden');
      triggerCelebrationFireworks();
    }, 3000);
  };

  // Sparkles canvas & lanterns background
  const canvas = document.getElementById('ch5-canvas');
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();

  const particles = [];
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5,
      color: Math.random() > 0.5 ? '#8b6fff' : '#ffd700',
      alpha: Math.random()
    });
  }

  function loop() {
    if (currentChapter !== 4) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => {
      p.alpha += 0.01;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    animationFrameId = requestAnimationFrame(loop);
  }
  loop();

  // Floating paper lanterns
  createLanterns();
  // Auto burst single firework every 3s
  setInterval(() => {
    if (currentChapter === 4) {
      launchSingleFirework();
    }
  }, 3000);
}

// ── UTILITIES & DECORATIONS ───────────────────────────────────

function createRain(containerId, count) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  wrap.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const drop = document.createElement('div');
    drop.className = 'drop';
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.height = `${10 + Math.random() * 15}px`;
    drop.style.animationDuration = `${0.8 + Math.random() * 1.2}s`;
    drop.style.animationDelay = `${Math.random() * 2}s`;
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
    l.style.fontSize = `${1 + Math.random() * 0.8}rem`;
    l.style.animationDuration = `${6 + Math.random() * 6}s`;
    container.appendChild(l);
    setTimeout(() => l.remove(), 12000);
  }, 1800);
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

function triggerCelebrationFireworks() {
  for (let i = 0; i < 6; i++) {
    setTimeout(launchSingleFirework, i * 400);
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
