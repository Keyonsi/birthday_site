const sections = ['kid', 'teeth', 'saree', 'bossy', 'final'];
let current = 0;

const nextBtn = document.getElementById('next');
const backBtn = document.getElementById('back');

const imageCounts = {
  kid: 4,
  teeth: 2,
  saree: 4,
  bossy: 5,
  final: 4
};

function showSection(index) {
  document.querySelectorAll('.section').forEach((sec, i) => {
    sec.classList.remove('active');
    if (i === index) sec.classList.add('active');
  });

  backBtn.hidden = index === 0;
  nextBtn.hidden = true;

  setTimeout(() => {
    if (index < sections.length - 1) nextBtn.hidden = false;
  }, 3000);

  if (sections[index] === 'final') spawnBalloons();
}

function spawnBalloons() {
  const final = document.getElementById('final');
  final.innerHTML += `<p class="poem">You are the love I never knew I needed,<br>In your arms, my soul is completed.</p>`;
  for (let i = 0; i < 20; i++) {
    const b = document.createElement('div');
    b.className = 'balloon';
    b.style.left = `${Math.random() * 90 + 5}%`;
    b.style.animationDelay = `${Math.random() * 5}s`;
    b.style.background = `hsl(${Math.random() * 360}, 80%, 70%)`;
    final.appendChild(b);
  }
}

nextBtn.addEventListener('click', () => {
  if (current < sections.length - 1) {
    current++;
    showSection(current);
  }
});

backBtn.addEventListener('click', () => {
  if (current > 0) {
    current--;
    showSection(current);
  }
});

sections.forEach((id, index) => {
  const sec = document.getElementById(id);
  const poem = {
    kid: "To the silly smile that melts my soul,<br>You're my forever mischief, my little foal.",
    teeth: "Each laugh that flashes those teeth so bright,<br>Lights up my day like morning light.",
    saree: "Wrapped in grace, you take my breath,<br>A vision in silk, more than I could ever guess.",
    bossy: "You rule my world with gentle might,<br>Even your scoldings feel so right.",
    final: ""
  }[id];

  if (poem) {
    sec.innerHTML = `<div class="poem">${poem}</div>`;
  }

  let imgIndex = 1;
  const total = imageCounts[id];
  sec.style.backgroundImage = `url('images/${id}/1.jpg')`;

  setInterval(() => {
    imgIndex = (imgIndex % total) + 1;
    sec.style.backgroundImage = `url('images/${id}/${imgIndex}.jpg')`;
  }, 5000);
});

showSection(0);
