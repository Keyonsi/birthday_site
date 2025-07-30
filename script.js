const sectionThemes = [
"#ffeef2", // Landing
"#fff8e1", // Kid
"#ffebee", // Bossy
"#e0f7fa", // Teeth
"#f3e5f5", // Saree
"#ede7f6", // Final
"#fbe9e7"  // Outro
];

const music = document.getElementById("bgMusic");
const muteBtn = document.getElementById("muteBtn");

muteBtn.addEventListener("click", () => {
if (music.paused) {
  music.play();
  muteBtn.innerText = "🔊";
} else {
  music.pause();
  muteBtn.innerText = "🔇";
}
});

const slides = [
  {
    message: `🌟 On August 2, 2003, at exactly 4:50 PM, under the warm skies of Ajmer...\n\nThe universe whispered: “Let there be magic.”\n\nAnd you were born. My miracle. My muse.\n\nHappy Birthday, my love. 💫`,
    images: []
  },
  {
    message: `Tiny fingers. Wild giggles. A smile that could disarm fate itself.\n\nLittle did the world know… this playful sparkle from Ajmer would grow into a queen.\n\nAnd somehow… she’d be mine. 🧁👶`,
    images: ["images/kid/1.jpg", "images/kid/2.jpg", "images/kid/3.jpg", "images/kid/4.jpg"]
  },
  {
    message: `From soft lullabies to fierce fire… You never just walked—you stormed.\n\nBossy. Bold. A rebel with elegance. A leader with heart.\n\nYou weren’t made to fit in. You were born to stand out. 👑💥`,
    images: ["images/bossy/1.jpg", "images/bossy/2.jpg", "images/bossy/3.jpg", "images/bossy/4.jpg", "images/bossy/5.jpg"]
  },
  {
    message: `Those teeth. That grin. That criminally adorable laugh.\n\nYou don’t just smile—you radiate. You disarm. You undo me in seconds.\n\nYou're the most beautiful kind of trouble. 😬💓`,
    images: ["images/teeth/1.jpg", "images/teeth/2.jpg"]
  },
  {
    message: `Draped in a saree, you are poetry—alive, divine, timeless.\n\nEach fold tells a story, every glance halts time.\n\nYou are not just beautiful. You are breathtaking. 🌺👸`,
    images: ["images/saree/1.jpg", "images/saree/2.jpg", "images/saree/3.jpg", "images/saree/4.jpg"]
  },
  {
    message: `Somehow the universe decided... you and I? We’re it.\n\nEach picture of us holds laughter, chaos, calm, and a thousand lifetimes.\n\nI found my person. I found home. With you. 🏡💑`,
    images: ["images/final/1.jpg", "images/final/2.jpg", "images/final/3.jpg", "images/final/4.jpg"]
  },
  {
    message: `To the girl born on a golden August evening in Ajmer…\n\nYou turned 4:50 PM into the start of my forever.\n\nI love you—madly, deeply, entirely. And I always will.\n\nHappy Birthday, my heart. 🎂❤️`,
    images: []
  }
];


let current = 0;
const messageDiv = document.getElementById("message");
const collageDiv = document.getElementById("image-collage");
const nextBtn = document.getElementById("nextBtn");

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

function loadSlide(index) {
  const slide = slides[index];
  const lines = slide.message.split("\n");
  let currentLine = 0;

  messageDiv.innerHTML = "";
  collageDiv.innerHTML = "";
  messageDiv.className = "fade-in message";

  function showNextLine() {
    if (currentLine < lines.length) {
      const p = document.createElement("p");
      p.textContent = "";
      p.className = "line fade-in";
      messageDiv.appendChild(p);

      let charIndex = 0;
      function typeChar() {
        if (charIndex < lines[currentLine].length) {
          p.textContent += lines[currentLine][charIndex++];
          setTimeout(typeChar, 25);
        } else {
          currentLine++;
          setTimeout(showNextLine, 400);
        }
      }
      typeChar();
    }
  }

  showNextLine();

  slide.images.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.classList.add("fade-in");
    collageDiv.appendChild(img);
  });

  if (index === slides.length - 1) {
    nextBtn.innerText = "❤️ Done";
  } else {
    nextBtn.innerText = "Next ➡️";
  }

  document.body.style.backgroundColor = sectionThemes[index] || "#fff";
}
