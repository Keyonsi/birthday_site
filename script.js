const sections = [
  {
    name: "kid",
    images: [
      "images/kid/1.jpg",
      "images/kid/2.jpg",
      "images/kid/3.jpg",
      "images/kid/4.jpg"
    ],
    poem: "From baby giggles to eyes so wide,<br>In every picture, innocence hides.<br>My little sunshine, oh so bright,<br>You lit my world with just your light."
  },
  {
    name: "bossy",
    images: [
      "images/bossy/1.jpg",
      "images/bossy/2.jpg",
      "images/bossy/3.jpg",
      "images/bossy/4.jpg",
      "images/bossy/5.jpg"
    ],
    poem: "With every stance and hands on hips,<br>You rule my world with those witty quips.<br>A queen in her own, fearless and fine,<br>Even your anger is a poetic sign."
  },
  {
    name: "teeth",
    images: [
      "images/teeth/1.jpg",
      "images/teeth/2.jpg"
    ],
    poem: "Your laugh is my melody,<br>That crooked smile, my remedy.<br>Each tooth a tale, a memory so sweet,<br>Your grin alone makes my day complete."
  },
  {
    name: "saree",
    images: [
      "images/saree/1.jpg",
      "images/saree/2.jpg",
      "images/saree/3.jpg",
      "images/saree/4.jpg"
    ],
    poem: "Wrapped in elegance, you shine and sway,<br>A saree queen who takes breath away.<br>Grace in folds, charm in every line,<br>How did I get this love divine?"
  },
  {
    name: "final",
    images: [
      "images/final/1.jpg",
      "images/final/2.jpg",
      "images/final/3.jpg",
      "images/final/4.jpg"
    ],
    poem: "Through every frame, you’re my art,<br>A canvas etched deep in my heart.<br>This journey ends but love remains,<br>Forever flowing in our veins."
  }
];

const startBtn = document.getElementById("startBtn");
const splash = document.getElementById("splash");
const mainContent = document.getElementById("mainContent");
const sectionTitle = document.querySelector(".section-title");
const poetry = document.querySelector(".poetry");
const background = document.querySelector(".background");
const nextBtn = document.getElementById("nextBtn");
const muteBtn = document.getElementById("muteBtn");
const music = document.getElementById("bgMusic");
const endMessage = document.querySelector(".end-message");
const balloonContainer = document.getElementById("balloons");

let sectionIndex = 0;
let imageIndex = 0;

function showSection(index) {
  const section = sections[index];
  sectionTitle.innerHTML = section.name.toUpperCase();
  poetry.innerHTML = section.poem;
  imageIndex = 0;
  updateBackground(section.images[imageIndex]);
}

function updateBackground(imagePath) {
  background.style.backgroundImage = `url(${imagePath})`;
}

startBtn.addEventListener("click", () => {
  splash.classList.add("hidden");
  mainContent.classList.remove("hidden");
  music.play().catch(() => {});
  showSection(sectionIndex);
});

nextBtn.addEventListener("click", () => {
  const current = sections[sectionIndex];
  imageIndex++;
  if (imageIndex < current.images.length) {
    updateBackground(current.images[imageIndex]);
  } else {
    sectionIndex++;
    if (sectionIndex < sections.length) {
      showSection(sectionIndex);
    } else {
      showFinalMessage();
    }
  }
});

muteBtn.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    muteBtn.textContent = "🔊";
  } else {
    music.pause();
    muteBtn.textContent = "🔇";
  }
});

function showFinalMessage() {
  mainContent.classList.add("hidden");
  endMessage.classList.remove("hidden");
  createFloatingImages();
}

function createFloatingImages() {
  const allImages = sections.flatMap(s => s.images);
  allImages.forEach((src, idx) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "balloon";
    img.style.left = `${Math.random() * 90}%`;
    img.style.animationDelay = `${idx * 0.3}s`;
    balloonContainer.appendChild(img);
  });
}
