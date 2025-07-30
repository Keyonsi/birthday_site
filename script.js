const sections = [
  {
    theme: "Kid",
    images: [
      "assets/kid1.jpg",
      "assets/kid2.jpg",
      "assets/kid3.jpg"
    ],
    title: "Your Little Spark",
    poem: `In giggles bright and eyes so wide,<br>
           You danced like stars across the tide.<br>
           A heart so pure, a soul so free,<br>
           A world of wonder, you gave to me.`
  },
  {
    theme: "Dreamer",
    images: [
      "assets/dreamer1.jpg",
      "assets/dreamer2.jpg"
    ],
    title: "The Dream in Your Eyes",
    poem: `With books and stars you used to talk,<br>
           Through skies of thought, you'd freely walk.<br>
           Your dreams took flight like paper swans,<br>
           On moonlight wings and hopeful dawns.`
  },
  {
    theme: "Fighter",
    images: [
      "assets/fighter1.jpg",
      "assets/fighter2.jpg"
    ],
    title: "Strength in Your Stride",
    poem: `Life tried to weigh your spirit down,<br>
           But you, my love, you claimed the crown.<br>
           A warrior wrapped in silk and grace,<br>
           You faced the storms with fierce embrace.`
  },
  {
    theme: "Lover",
    images: [
      "assets/lover1.jpg",
      "assets/lover2.jpg"
    ],
    title: "The Way You Love",
    poem: `In every touch, a quiet flame,<br>
           In whispered names, a sacred name.<br>
           You love like fire wrapped in snow,<br>
           A tender warmth the heavens know.`
  },
  {
    theme: "Queen",
    images: [
      "assets/queen1.jpg",
      "assets/queen2.jpg"
    ],
    title: "My Forever Queen",
    poem: `Crowned not by gold but by your light,<br>
           You rule my heart with gentle might.<br>
           No throne compares, no jewel as rare,<br>
           As you—my soul’s eternal heir.`
  }
];

let current = 0;
let imageIndex = 0;
let bgSlide, overlay, poemBox;

// DOM Ready
window.onload = () => {
  bgSlide = document.getElementById("bgSlide");
  overlay = document.getElementById("overlay");
  poemBox = document.getElementById("poemBox");

  document.getElementById("startBtn").onclick = startJourney;
};

function startJourney() {
  document.getElementById("splash").classList.add("hidden");
  document.getElementById("themed").classList.remove("hidden");
  playMusic();
  showSection(current);
}

function showSection(index) {
  const section = sections[index];
  imageIndex = 0;
  updateBackground(section.images[imageIndex]);
  updatePoem(section.title, section.poem);
}

function updatePoem(title, poem) {
  poemBox.innerHTML = `
    <h1>${title}</h1>
    <p>${poem}</p>
    <button onclick="nextSection()">Next ➡️</button>
  `;
}

function updateBackground(img) {
  bgSlide.style.backgroundImage = `url(${img})`;
}

function nextSection() {
  const section = sections[current];
  imageIndex++;

  if (imageIndex < section.images.length) {
    updateBackground(section.images[imageIndex]);
  } else {
    current++;
    if (current < sections.length) {
      showSection(current);
    } else {
      finishJourney();
    }
  }
}

function finishJourney() {
  document.getElementById("themed").classList.add("hidden");
  document.getElementById("conclusion").classList.remove("hidden");
  startBalloons();
}

// Music control
function playMusic() {
  const music = document.getElementById("bgMusic");
  const muteBtn = document.getElementById("muteBtn");
  music.play();

  muteBtn.onclick = () => {
    music.muted = !music.muted;
    muteBtn.textContent = music.muted ? "🔇" : "🔊";
  };
}

// Balloon logic (basic floating animation)
function startBalloons() {
  const canvas = document.getElementById("balloonsCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const balloons = Array.from({ length: 20 }, () => createBalloon());

  function createBalloon() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 200,
      speed: 1 + Math.random() * 2,
      size: 30 + Math.random() * 40,
      color: `hsl(${Math.random() * 360}, 80%, 70%)`
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balloons.forEach((b) => {
      ctx.beginPath();
      ctx.fillStyle = b.color;
      ctx.moveTo(b.x, b.y);
      ctx.arc(b.x, b.y, b.size / 2, 0, Math.PI * 2);
      ctx.fill();

      // Heart-shape curve effect
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x, b.y + 30);
      ctx.stroke();

      b.y -= b.speed;
    });
    requestAnimationFrame(draw);
  }

  draw();
}

