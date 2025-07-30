const slides = [
  {
    bg: 'assets/kid.jpg',
    message: "In your giggles I found my peace,\nA kid with dreams that never cease.",
  },
  {
    bg: 'assets/teen.jpg',
    message: "Through teenage storms and rebel cries,\nYou bloomed beneath the open skies.",
  },
  {
    bg: 'assets/adult.jpg',
    message: "With fire and grace, you chase your way,\nA woman fierce, who lights my day.",
  },
  {
    bg: 'assets/us.jpg',
    message: "We laughed, we fell, we rose anew,\nThis love I live because of you.",
  },
  {
    bg: 'assets/heart.jpg',
    message: "I love you.\nMore than poems, more than skies.\nLet every moment whisper why.",
    isFinal: true
  }
];

let currentSlide = 0;
const container = document.querySelector('.container');
const text = document.getElementById('poem');
const nav = document.getElementById('nav-buttons');
const nextBtn = document.getElementById('next');
const backBtn = document.getElementById('back');

function showSlide(index) {
  const slide = slides[index];
  container.style.backgroundImage = `url(${slide.bg})`;
  text.textContent = slide.message;

  // Handle final slide separately
  if (slide.isFinal) {
    launchBalloons();
  }

  // Button control
  backBtn.disabled = index === 0;
  nextBtn.disabled = index === slides.length - 1;

  // Delayed nav visibility
  nav.classList.remove('show');
  setTimeout(() => nav.classList.add('show'), 2000);
}

function launchBalloons() {
  for (let i = 0; i < 10; i++) {
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    balloon.style.left = `${Math.random() * 100}%`;
    balloon.style.animationDelay = `${Math.random() * 2}s`;
    container.appendChild(balloon);

    setTimeout(() => {
      balloon.remove();
    }, 6000); // Clean up after animation
  }
}

nextBtn.addEventListener('click', () => {
  if (currentSlide < slides.length - 1) {
    currentSlide++;
    showSlide(currentSlide);
  }
});

backBtn.addEventListener('click', () => {
  if (currentSlide > 0) {
    currentSlide--;
    showSlide(currentSlide);
  }
});

// Auto start
window.addEventListener('load', () => {
  showSlide(currentSlide);
});
