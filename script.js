const slides = [
  {
    message: "🎉 Happy Birthday, my love! Get ready for a memory lane trip. Click next 👉",
    images: []
  },
  {
    message: "From a cute little kid to the queen of my world 💖",
    images: ["images/kid/1.jpg", "images/kid/2.jpg", "images/kid/3.jpg", "images/kid/4.jpg"]
  },
  {
    message: "Then came the bossy rebel with unmatched fire 🔥",
    images: ["images/bossy/1.jpg", "images/bossy/2.jpg", "images/bossy/3.jpg", "images/bossy/4.jpg", "images/bossy/5.jpg"]
  },
  {
    message: "The smile... those teeth! You melt me every time 🦷✨",
    images: ["images/teeth/1.jpg", "images/teeth/2.jpg"]
  },
  {
    message: "Saree not sorry – elegance level: Goddess 👑",
    images: ["images/saree/1.jpg", "images/saree/2.jpg", "images/saree/3.jpg", "images/saree/4.jpg"]
  },
  {
    message: "And finally... us. My heart, my person. Forever yours ❤️",
    images: ["images/final/1.jpg", "images/final/2.jpg", "images/final/3.jpg", "images/final/4.jpg"]
  },
  {
    message: "I love you endlessly. Thank you for being you. Happy Birthday again, my queen 👸",
    images: []
  }
];

let current = 0;
const messageDiv = document.getElementById("message");
const collageDiv = document.getElementById("image-collage");
const nextBtn = document.getElementById("nextBtn");

function loadSlide(index) {
  const slide = slides[index];
  messageDiv.innerText = slide.message;
  collageDiv.innerHTML = "";

  slide.images.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    collageDiv.appendChild(img);
  });

  if (index === slides.length - 1) {
    nextBtn.innerText = "❤️ Done";
  }
}

nextBtn.addEventListener("click", () => {
  current++;
  if (current < slides.length) {
    loadSlide(current);
  } else {
    nextBtn.disabled = true;
    nextBtn.innerText = "🎉 Enjoy!";
  }
});

loadSlide(current);
