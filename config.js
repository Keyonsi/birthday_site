// ============================================================
//  BIRTHDAY CONFIG — Monsoon Diaries
//  Linear cinematic experience — no games, pure emotion
// ============================================================

const BIRTHDAY_CONFIG = {

  name: "Pratibha Pareek",
  nickname: "Pranu",
  birthday: "2003-08-02",
  anniversaryMessage: "Pehla Saal • Pehli Anniversary ❤️",

  // ── DECOY WEBSITE ──────────────────────────────────────────
  decoy: {
    title: "Happy Birthday! 🎂",
    subtitle: "Wishing you a wonderful day!",
    buttonText: "Open Card 🎁"
  },

  // ── REVEAL MESSAGE (after decoy) ───────────────────────────
  revealMsg: "Tumko kya laga... ye bas itna sa tha? 😏",

  // ── CINEMATIC SCENES (Act 1 — auto play) ───────────────────
  // Each scene plays for durationMs, photos cycle automatically
  scenes: [
    {
      title: "Pehle...",
      text: "Ek waqt tha jab zindagi mein koi rang nahi tha.",
      caption: "Tab tum nahi the.",
      photos: [
        "images/kid/1.jpg",
        "images/kid/2.jpg"
      ],
      durationMs: 7000
    },
    {
      title: "Bachi thi tum... 🧸",
      text: "Masoom aankhein, chhupa hua poora aasman in mein.",
      caption: "Bachpan ka wo innocent savera...",
      photos: [
        "images/kid/3.jpg",
        "images/kid/4.jpg"
      ],
      durationMs: 7000
    },
    {
      title: "Phir badi hui... ✨",
      text: "Attitude aa gaya, style aa gaya — lekin woh pyaari naughtiness gayi nahi.",
      caption: "Bossy era 😤",
      photos: [
        "images/bossy/1.jpg",
        "images/bossy/2.jpg",
        "images/bossy/3.jpg"
      ],
      durationMs: 9000
    },
    {
      title: "Woh smile... 😄",
      text: "Jab tum hansti ho, duniya thodi aur sundar ho jaati hai.",
      caption: "Meri sabse kamzori.",
      photos: [
        "images/teeth/1.jpg",
        "images/teeth/2.jpg",
        "images/teeth/WhatsApp Image 2026-07-07 at 7.19.17 AM (4).jpeg"
      ],
      durationMs: 9000
    },
    {
      title: "Saree mein... 🥻",
      text: "Graceful. Khoobsurat. Bilkul tum jaisi.",
      caption: "Aur main bas dekhta hi reh gaya.",
      photos: [
        "images/saree/1.jpg",
        "images/saree/2.jpg",
        "images/saree/WhatsApp Image 2026-07-07 at 7.19.16 AM (4).jpeg",
        "images/saree/WhatsApp Image 2026-07-07 at 7.19.17 AM (6).jpeg"
      ],
      durationMs: 10000
    },
    {
      title: "Hum dono... 🫂",
      text: "Ek sabzi ki galti. Tumhari ek hasi. Meri poori duniya badal gayi.",
      caption: "Yeh shuruwaat thi.",
      photos: [
        "images/us/WhatsApp Image 2026-07-07 at 7.19.17 AM (7).jpeg",
        "images/us/WhatsApp Image 2026-07-07 at 7.19.17 AM (8).jpeg",
        "images/us/WhatsApp Image 2026-07-07 at 7.19.17 AM (9).jpeg"
      ],
      durationMs: 10000
    },
    {
      title: "Yaadon ki khushboo... 🌧️",
      text: "Woh baarish, woh garden, woh pal — dil mein hamesha ke liye bas gaya.",
      caption: "Do baar tumhare lips ne chhua mujhe. Sirf do baar.",
      photos: [
        "images/collages/WhatsApp Image 2026-07-07 at 7.19.17 AM (1).jpeg",
        "images/collages/WhatsApp Image 2026-07-07 at 7.19.17 AM (2).jpeg",
        "images/collages/WhatsApp Image 2026-07-07 at 7.19.17 AM (5).jpeg"
      ],
      durationMs: 10000
    },
    {
      title: "Ek din... 💍",
      text: "Agar taqdeer mujhe hazaar zindagiyaan de...",
      caption: "Main phir bhi tumhein hi dhoondh loonga. Har baar. Har janam.",
      photos: [
        "images/dream.jpeg",
        "images/final/3.jpg"
      ],
      durationMs: 9000
    }
  ],

  // ── MOMENTS (auto-display, no interaction needed) ──────────
  moments: [
    { icon: "🛕", text: "Birla Mandir ki seedhiyaan pe baithna, shanti se." },
    { icon: "🌅", text: "Office se pehle milna, intezaar karna." },
    { icon: "💬", text: "Ek doosre ko har update dena, har roz." },
    { icon: "🥺", text: "Chats delete hone par saath rona." },
    { icon: "🫂", text: "Periods mein paas rehna, comforting karna." },
    { icon: "🍍", text: "Pineapple juice with masala — tumhe pasand jo tha." },
    { icon: "🍟", text: "Haath se khilana, fries with schezwan chutney." },
    { icon: "😊", text: "Tumhari hasi — jo meri kamzori bhi hai aur meri jaan bhi." }
  ],

  // ── HEARTS (15 floating hearts — tap to reveal) ────────────
  hearts: [
    { emoji: "😄", reason: "Teri cute smile jo poora din roshan kar deti hai." },
    { emoji: "🥹", reason: "Tera bina kahe sab samajh jaana — woh meri favourite cheez hai." },
    { emoji: "😌", reason: "Jab bhi main stress mein hota hoon, teri aawaz sunke sukoon milta hai." },
    { emoji: "🫂", reason: "Periods ke time tumhara chid-chida hona aur mera tumhe comfort karna." },
    { emoji: "🥺", reason: "Deleted chats ke waqt hamara ek doosre ke liye rona." },
    { emoji: "🍍", reason: "Pineapple juice mein chatpata masala daal ke pina." },
    { emoji: "🕊️", reason: "Birla Mandir ki seedhiyon pe bitaaye vo peaceful pal." },
    { emoji: "🌅", reason: "Office jaane se pehle milne ki vo sweet excitement." },
    { emoji: "🥰", reason: "Mujhe apna partner chunne ka tera vo pyaara sa pride." },
    { emoji: "🌙", reason: "Raat ko aakhri 'good night' ke baad bhi tumhara ek aur message aata tha." },
    { emoji: "🌧️", reason: "Baarish mein tumhara mere paas aana aur chupchap rehna." },
    { emoji: "🍟", reason: "Fries aur schezwan chutney saath mein khana." },
    { emoji: "✨", reason: "Bina bole ek doosre ki aankhon mein dekh kar sab samajhna." },
    { emoji: "🧸", reason: "Tera pyara sa gussa jo 2 minute mein pighal jata hai." },
    { emoji: "💍", reason: "Har kal mein, har sapne mein sirf tera naam hona." }
  ],

  // ── LOVE SHOWER (after hearts) ─────────────────────────────
  showerMessages: [
    "Teri cute smile! 😄",
    "Tera samajh jaana! 🥹",
    "Teri aawaz! 😌",
    "Humara rona! 🥺",
    "Pineapple juice! 🍍",
    "Tumhari pride! 🥰",
    "Humari yaadein! 🌙",
    "Tujhse pyaar! ❤️",
    "Happy Birthday! 🎂",
    "Hamesha saath! 💍"
  ],

  // ── FINAL LETTER ───────────────────────────────────────────
  letter: `Pranu,

Ek sabzi ki galti se shuruu hua tha yeh sab. Tumne hasa tha — aur us hasi ne meri duniya badal di.

Tumse milne se pehle, zindagi mein koi rang nahi tha. Tumne aake ek-ek rang bhara — khushi ka, intezaar ka, baarish ka, doori ka, aur pyaar ka bhi.

Aaj tumhara birthday hai. Aur yeh humari pehli anniversary bhi hai.

Main yeh wada karta hoon — chahe koi bhi waqt aaye, main wahi rahoon ga. Tumhare periods mein, tumhare exams mein, tumhari haar mein, tumhari jeet mein.

Tumhari hasi meri sabse badi kamzori hai. Aur main chahta hoon ki yeh kamzori hamesha bani rahe.

Pranu — tu meri jaan hai. Literally.
Pran + U = Pranu. Tu meri saans hai.

Happy Birthday. Happy Anniversary.

Yeh sirf shuruwaat hai. ❤️

— Tumhara`,


  // ── PROPOSAL SCENE ─────────────────────────────────────────
  proposal: {
    dialogueLines: [
      "Pranu...",
      "Chahe zindagi kisi bhi taraf mudh jaaye...",
      "Main tumhe hi chununga.",
      "Har baar. Har janam. Hamesha."
    ],
    finalQuote: "I love you today, tomorrow, and forever. 💍"
  },

  closingLine: "Agli zindagi ke chapter mein bhi — saath. ❤️"

};