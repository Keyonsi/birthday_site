const images = [
  // Add all image paths in order here - flatten from folders as needed
  "images/kid/1.jpg",
  "images/kid/2.jpg",
  "images/kid/3.jpg",
  "images/kid/4.jpg",

  "images/bossy/1.jpg",
  "images/bossy/2.jpg",
  "images/bossy/3.jpg",
  "images/bossy/4.jpg",
  "images/bossy/5.jpg",

  "images/teeth/1.jpg",
  "images/teeth/2.jpg",

  "images/saree/1.jpg",
  "images/saree/2.jpg",
  "images/saree/3.jpg",
  "images/saree/4.jpg",

  "images/final/1.jpg",
  "images/final/2.jpg",
  "images/final/3.jpg",
  "images/final/4.jpg"
];

const slideImage = document.getElementById("slide-image");
const caption = document.querySelector(".caption");
const nextBtn = document.getElementById("nextBtn");
const splash = document.getElementById("splash");
const gallery = document.getElementById("gallery");
const startBtn = document.getElementById("startBtn");
const muteBtn = document.getElementById("muteBtn");
const bgMusic = document.getElementById("bgMusic");

let currentIndex = 0;

startBtn.addEventListener("click", () => {
  splash.classList.add("hidden");
  gallery.classList.remove("hidden");
  showSlide(currentIndex);
  bgMusic.play().catch(() => {}); // play may need user gesture
});

nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex >= images.length) {
    currentIndex = 0; // loop back or disable nextBtn
  }
  showSlide(currentIndex);
});

muteBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    muteBtn.textContent = "🔊";
  } else {
    bgMusic.pause();
    muteBtn.textContent = "🔇";
  }
});

function showSlide(i) {
  slideImage.src = images[i];
  caption.textContent = ""; // Placeholder - add messages later
  // Reset animation
  slideImage.style.animation = "none";
  slideImage.offsetHeight; // trigger reflow
  slideImage.style.animation = null;
}
