// ============================================================
//  BIRTHDAY CONFIG — Master Configuration File
//  Photo folders: images/kid/, images/bossy/, images/teeth/,
//                 images/saree/, images/final/
// ============================================================

const BIRTHDAY_CONFIG = {

  // --- Her identity ---
  name: "Pratibha Pareek",
  nickname: "Pranu",
  nicknameOrigin: "Pran + U = Meri Pranu",
  senderName: "Tumhara",
  birthday: "2003-08-02",
  anniversaryMessage: "Pehla Saal • Pehli Anniversary",

  // --- Cold open (very first thing shown, before the loader) ---
  coldOpen: [
    "Kuch kahaniyaan likhi jaati hain...",
    "Kuch jee li jaati hain...",
    "Yeh wali... humne jee li."
  ],

  // --- Cinematic chapter title cards, quotes, and signatures ---
  chapterMeta: [
    {
      roman: "I",
      name: "Pehle",
      tagline: "Har kahani ki ek shuruaat hoti hai jo use khud yaad nahi rehti."
    },
    {
      roman: "II",
      name: "Teri Kahani",
      tagline: "Har rani kabhi ek bachi thi."
    },
    {
      roman: "III",
      name: "Baarish Mein",
      tagline: "Kuch yaadein baarish mein bhi kabhi geeli nahi hotin."
    },
    {
      roman: "IV",
      name: "Jab Tum Gayi",
      tagline: "Doori pyaar ko test nahi karti, dil ko sabr sikhati hai."
    },
    {
      roman: "V",
      name: "Aaj Aur Hamesha",
      tagline: "Kuch kahaniyaan khatam nahi hotin, woh bas shuruu hoti rehti hain."
    }
  ],
  chapterSignature: "— Tumhara, Hamesha",

  // --- Chapter 1: Pehle ---
  chapter1: {
    title: "Chapter I",
    subtitle: "Pehle...",
    description: "Ek waqt tha jab zindagi bahut zyada khali lagti thi.",
    counterDays: 365,
    memoryFragments: [
      "Roz same office jaana, same raasta...",
      "Akela baithke khana khana...",
      "Phone bas scroll karte rehna, kuch samajh na aana...",
      "Raat ko so jaana, bina kisi se baat kiye..."
    ],
    poems: [
      "Roz uthna, roz so jaana,",
      "Koi rang nahi tha zindagi mein.",
      "Tab tum nahi the."
    ],
    openingLine: "Ek baar ki baat hai..."
  },

  // --- Chapter 2: Teri Kahani (Photo Journey) ---
  // Each era maps to a folder in images/
  // Add as many photos as you want — the site will auto-cycle through all of them
  chapter2: {
    title: "Chapter II",
    subtitle: "Teri Kahani"
  },

  // --- Chapter 3: Baarish Mein ---
  chapter3: {
    title: "Chapter III",
    subtitle: "Baarish Mein",
    mainMemory: {
      title: "Woh Garden, Woh Baarish",
      description: "Usi garden mein jahan hum pehli baar gaye the. Baarish ho rahi thi. Tumne mujhe blanket se dhaka. Apna scarf mujhe lapet diya. Do baar — sirf do baar — tumhare lips ne mujhe chhua. Woh pal aaj bhi dil mein taze hain.",
      shayari: [
        "Baarish ki har boond mein, tera hi ek naam tha,",
        "Us garden ki khamoshi mein, bas apna kaam tha —",
        "Thoda sa bheegna, thoda tumse lipatna,",
        "Woh pal na hota kabhi, agar na hota tera saath. 🌧️❤️"
      ]
    },

    // Moments — each carries a tag used by the quiz below for matching
    moments: [
      { text: "Birla Mandir ki seedhiyaan pe baithna, shanti se 🛕", icon: "🛕", tag: "mandir" },
      { text: "Office se pehle milna, intezaar karna ❤️", icon: "🌅", tag: "wait" },
      { text: "Ek doosre ko har update dena, har roz 💬", icon: "💬", tag: "updates" },
      { text: "Chats delete hone par saath rona 🥺", icon: "🥺", tag: "unspoken" },
      { text: "Periods mein paas rehna, comforting karna 🫂", icon: "🫂", tag: "comfort" },
      { text: "Pineapple juice with masala — kyunki pata tha tumhe pasand hai 🍍", icon: "🍍", tag: "food" },
      { text: "Haath se khilana, fries with schezwan chutney 🍟", icon: "🍟", tag: "food" },
      { text: "Tumhari hasi — jo meri kamzori bhi hai aur meri jaan bhi 😊", icon: "✨", tag: "smile" }
    ],

    // 5-question quiz — each option carries a tag that maps to a moment above.
    // Top 3 highest-scoring tags across the 5 answers become the reveal cards.
    quiz: [
      {
        q: "Rainy evening ho aur tum dono free ho — sabse pehle kya karoge?",
        options: [
          { text: "Kahin shaanti wali jagah baith jaayenge", icon: "🛕", tag: "mandir" },
          { text: "Ek dusre ko din bhar ka update denge", icon: "💬", tag: "updates" },
          { text: "Kuch chatpata khayenge saath mein", icon: "🍟", tag: "food" }
        ]
      },
      {
        q: "Jab mood thoda off ho, tumhe sabse zyada kya chahiye hota hai?",
        options: [
          { text: "Bas paas koi ho, comfort kare", icon: "🫂", tag: "comfort" },
          { text: "Koi hasa de", icon: "😊", tag: "smile" },
          { text: "Koi samjhe bina kahe", icon: "🥺", tag: "unspoken" }
        ]
      },
      {
        q: "Ek perfect date mein kya zaroor hona chahiye?",
        options: [
          { text: "Milne ka wait wala excitement", icon: "🌅", tag: "wait" },
          { text: "Koi khaas favourite cheez", icon: "🍍", tag: "food" },
          { text: "Peaceful jagah, bheed se door", icon: "🛕", tag: "mandir" }
        ]
      },
      {
        q: "Mushkil waqt aaye (jaise chats delete hona), tum kya chahoge partner se?",
        options: [
          { text: "Saath feel kare, akela na chhode", icon: "🥺", tag: "unspoken" },
          { text: "Chup-chaap paas rahe, comfort de", icon: "🫂", tag: "comfort" },
          { text: "Baat kare, sab share kare", icon: "💬", tag: "updates" }
        ]
      },
      {
        q: "Tumhare liye \"care\" ka sabse cute tareeka kya hai?",
        options: [
          { text: "Haath se khilana", icon: "🍟", tag: "food" },
          { text: "Wo hasi jo sab theek kar de", icon: "😊", tag: "smile" },
          { text: "Roz milna, wait karna", icon: "🌅", tag: "wait" }
        ]
      }
    ],

    reasonsILoveYou: [
      { text: "Teri cute smile jo poora din roshan kar deti hai.", emoji: "😄" },
      { text: "Tera vo mere liye bina kahe hi sab samajh jana.", emoji: "🥹" },
      { text: "Jab bhi main stress me hota hu, teri aawaz sunke sukoon milta hai.", emoji: "😌" },
      { text: "Periods ke time tumhara chid-chida hona aur mera tumhe comfort karna.", emoji: "🫂" },
      { text: "Deleted chats ke waqt hamara vo ek doosre ke liye rona.", emoji: "🥺" },
      { text: "Pineapple juice me chatpata masala daal ke pina.", emoji: "🍍" },
      { text: "Birla Mandir ki seedhiyon pe bitaaye vo peaceful pal.", emoji: "🕊️" },
      { text: "Office jaane se pehle milne ki vo sweet excitement.", emoji: "🌅" },
      { text: "Mujhe apna partner chunne ka tera vo pyaara sa pride.", emoji: "🥰" }
    ]
  },

  // --- Chapter 4: Doori ---
  chapter4: {
    title: "Chapter IV",
    subtitle: "Jab Tum Gayi",
    description: "Sab kuch chhodkar ghar jaana pada tumhe. Kuch waqt ke liye — khamoshi si aa gayi. Par pyaar nahi gaya.",
    moments: [
      "Woh pehle jaisa baat nahi ho paata tha",
      "Par dil se door nahi hue kabhi",
      "Tumhare liye Yojee's Net app banwaya — taaki padh sako achhe se",
      "Dheere dheere — hum phir wahi aa gaye"
    ],
    letter: "Yeh waqt mushkil tha. Par tum jaanti ho — tumhari mushkil meri mushkil hai. Jab tumhe padhai par dhyan dena tha, maine tumhari taraf se ek kadam uthaya. Net app isliye banwaya kyunki main chahta tha ki tum apna sapna poora karo. Tumhara sapna, mera sapna hai."
  },

  // --- Chapter 5: Aaj Aur Hamesha ---
  chapter5: {
    title: "Chapter V",
    subtitle: "Aaj Aur Hamesha",
    wishes: [
      "Agle 100 saal aise hi saath rahein 🌟",
      "Har baarish mein woh garden yaad rahe 🌧️",
      "Teri hasi kabhi kam na ho ✨",
      "NET clear karo — mujhe pata hai kar logi 🎓",
      "Har khushi mein main pehla ho ❤️",
      "Har takleef mein main pehla hoon 🫂",
      "Pineapple juice hamesha ready rahe 🍍",
      "Humari kahani aur khoobsurat bane 📖"
    ],
    endingLetter: `Pranu,

Ek sabzi ki galti se shuruu hua tha yeh sab. Tumne hasa tha — aur us hasi ne meri duniya badal di.

Tumse milne se pehle, zindagi mein koi rang nahi tha. Tumne aake ek-ek rang bhara — khushi ka, intezaar ka, baarish ka, doori ka, aur pyaar ka bhi.

Aaj tumhara birthday hai. Aur yeh humari pehli anniversary bhi hai. Dono ek saath — jaise tum keh rahi ho ki yeh sab sirf tumhare liye tha.

Yeh ek saal mein humne itna jeya hai — woh baarish, woh scarf, woh kisses, woh jhagde, woh mandir ki seedhiyaan, woh deleted chats, woh doori...

Aur phir bhi — hum yahan hain. Saath.

Main yeh wada karta hoon: chahe koi bhi waqt aaye, main wahi rahoon ga. Tumhare periods mein, tumhare exams mein, tumhari haar mein, tumhari jeet mein — main wahan hoon.

Tumhari hasi meri sabse badi kamzori hai. Aur main chahta hoon ki yeh kamzori hamesha bani rahe.

Pranu — tum meri jaan ho. Literally. Pran + U = Pranu. Tum meri saans ho.

Happy Birthday. Happy Anniversary.

Yeh sirf shuruwaat hai. ❤️

— Tumhara`,
    closingLine: "Yeh sirf shuruwaat hai...",
    finalLine: "Agli zindagi ke chapter mein bhi — saath. ❤️"
  },

  // ============================================================
  //  PHOTO JOURNEY — ERA DEFINITIONS
  //  Each era has:
  //    folder: the images/ subfolder name
  //    name: display title
  //    desc: caption shown on the photo
  //    emoji: era icon
  //    mood: controls particle color theme (pink/gold/purple/green/rose/warm)
  //  Add as many photo files to each folder as you want!
  //  Naming: 1.jpg, 2.jpg, 3.jpg ... (any count)
  // ============================================================
  eras: [
    {
      folder: "kid",
      name: "Bachi 🧸",
      desc: "Masoom savera aur cute bachpan",
      emoji: "🧸",
      mood: "pink"
    },
    {
      folder: "bossy",
      name: "Bossy ✨",
      desc: "Teen spirit aur confidence",
      emoji: "✨",
      mood: "gold"
    },
    {
      folder: "teeth",
      name: "Chulbuli 😄",
      desc: "Naughty smiles aur mastiyaan",
      emoji: "😄",
      mood: "purple"
    },
    {
      folder: "saree",
      name: "Saree 🥻",
      desc: "Graceful aur bilkul khoobsurat",
      emoji: "🥻",
      mood: "rose"
    },
    {
      folder: "final",
      name: "Hum Dono 🫂",
      desc: "Dheere se kandhe par pehla haath",
      emoji: "🫂",
      mood: "warm"
    }
  ],

  // How many photos in each folder (auto-detected at runtime, but fallback counts)
  photoCounts: {
    kid: 4,
    bossy: 5,
    teeth: 2,
    saree: 4,
    final: 4
  }

};