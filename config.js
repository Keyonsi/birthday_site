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
  // Multiple variations for Phase 9 Memory Engine quote rotation
  coldOpenVariants: [
    [
      "Kuch kahaniyaan likhi jaati hain...",
      "Kuch jee li jaati hain...",
      "Yeh wali... humne jee li."
    ],
    [
      "Duniya mein hazaaron shahr hain...",
      "Par meri saari raatein...",
      "Tumhare khayal par aakar rukti hain."
    ],
    [
      "Baarish ki har ek boond ne...",
      "Bas ek hi naam pukara...",
      "Meri Pranu..."
    ]
  ],
  // Fallback / active cold open line set
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
      tagline: "Har kahani ki ek shuruaat hoti hai jo use khud yaad nahi rehti.",
      taglineVariants: [
        "Har kahani ki ek shuruaat hoti hai jo use khud yaad nahi rehti.",
        "Jab tum nahi the, waqt bas ghadi ki tik-tik tha.",
        "Ujaale se pehle ki khamoshi bhi kitni gehri hoti hai."
      ]
    },
    {
      roman: "II",
      name: "Teri Kahani",
      tagline: "Har rani kabhi ek bachi thi.",
      taglineVariants: [
        "Har rani kabhi ek bachi thi.",
        "Nanhin aakhon mein chhupa tha poora aasman.",
        "B बचपन ki haseen yaadon ka silsila."
      ]
    },
    {
      roman: "III",
      name: "Baarish Mein",
      tagline: "Kuch yaadein baarish mein bhi kabhi geeli nahi hotin.",
      taglineVariants: [
        "Kuch yaadein baarish mein bhi kabhi geeli nahi hotin.",
        "Us garden ki mehak aaj bhi fizao mein hai.",
        "Boond boond mein base hain tumhare aur mere lamhe."
      ]
    },
    {
      roman: "IV",
      name: "Jab Tum Gayi",
      tagline: "Doori pyaar ko test nahi karti, dil ko sabr sikhati hai.",
      taglineVariants: [
        "Doori pyaar ko test nahi karti, dil ko sabr sikhati hai.",
        "Faasle jism ke ho sakte hain, rooh ke nahi.",
        "Har raat taaron se tumhare aane ki baat hoti thi."
      ]
    },
    {
      roman: "V",
      name: "Aaj Aur Hamesha",
      tagline: "Kuch kahaniyaan khatam nahi hotin, woh bas shuruu hoti rehti hain.",
      taglineVariants: [
        "Kuch kahaniyaan khatam nahi hotin, woh bas shuruu hoti rehti hain.",
        "Yeh toh bas shuruaat hai humare forever ki.",
        "Har janam mein, har mod par... tum hi ho."
      ]
    }
  ],
  chapterSignature: "— Tumhara, Hamesha",

  // --- Small hidden memories, unlocked via the Ch2 butterfly and Ch3 rain words ---
  hiddenMemories: [
    "Wo pehli baar jab tumne mujhe apni favourite gaana bheja tha.",
    "Jab tumne mujhe raat ko so jaane se pehle 'good night' bola tha, pehli baar.",
    "Wo photo jo tumne bina bataye click ki thi, aur main hass raha tha.",
    "Jab hum dono ne ek hi cheez order ki thi bina ek dusre ko bataye.",
    "Wo din jab tumhari hasi ne mera pura din theek kar diya tha."
  ],
  rainWords: ["Hope", "Love", "Pranu", "Forever", "Miss You"],

  // --- Hidden collectibles (Phase 7) ---
  starWhispers: [
    "Aaj bhi tumhari hasi yaad aa gayi.",
    "Yeh pal, sirf tumhare liye rukta hai.",
    "Kahin na kahin, universe tumhari smile se jealous hai.",
    "Tum nahi jaanti, yeh yaad meri favourite hai.",
    "Har baar jab main upar dekhta hoon, tum yaad aati ho.",
    "Kuch cheezein bina kahe hi samajh aati hain — tum ho unmein se ek.",
    "Yeh tara bhi tumhari tarah chamak raha hai.",
    "Kabhi socha nahi tha koi itna khaas ho sakta hai.",
    "Tumhari aankhon mein woh hi roshni hai jo in taaron mein hai.",
    "Yeh raaz sirf tumhare liye hai.",
    "Duniya so rahi hai, bas hum jaag rahe hain is pal mein.",
    "Kabhi kabhi lagta hai tum khud ek sitara ho.",
    "Yeh khaamoshi bhi tumhare saath khoobsurat lagti hai.",
    "Har din tumse milna, ek naya tohfa lagta hai.",
    "Is duniya mein, tum meri sabse pyaari khoj ho."
  ],
  hiddenLetters: ["T", "U", "M", "E", "R", "I", "J", "A", "A", "N"],
  hiddenLettersMessage: "Tum Meri Jaan Ho ❤️",
  fireflyWishes: [
    "Har subah tumhari muskurahat se shuru ho.",
    "Zindagi ki har mushkil mein, main tumhare saath rahoon.",
    "Tumhare sapne, meri zimmedari bhi bane.",
    "Hum dono buddhe ho jayein, par pyaar wahi jawaan rahe.",
    "Har Diwali, har Holi, har chhota moment — hum saath karein.",
    "Tumhari hasi kabhi na ruke.",
    "Jo bhi tum chaho, woh sab mile.",
    "Hum jahan bhi ho, saath ho."
  ],

  // --- Grand Finale sequence (after Chapter 5's letter & fireworks) ---
  finale: {
    planetLine: "Har chapter... ab tumhari hatheli mein samaa gaya.",
    credits: [
      "Har muskurahat ke liye.",
      "Har gale milne ke liye.",
      "Har jhagde ke liye.",
      "Har intezaar ke liye.",
      "Har aane wale kal ke liye."
    ],
    heartHint: "Dabaye rakho...",
    heartReveal: "I Love You",
    nights365Line: "365 din sirf calendar par guzre.\nMere liye har din tum tak pahunchne ka ek aur kadam tha.",
    loopLine: "Har ant bas ek aur raat hai, usi aasman ke neeche... tumhare saath.",
    secretQuote: "Agar taqdeer mujhe hazaar zindagiyaan de...\nMain phir bhi 2 August 2003 ko paida hui us ladki ko\nhar ek zindagi mein dhoondh loonga.",
    finalTagline: "Yeh sirf ek website nahi thi. Yeh har woh dhadkan thi jo main shabdon mein nahi bata paaya."
  },

  // ============================================================
  //  PART 1 — MOVIE STORY ENGINE SCENES
  //  Auto-plays sequentially like a romantic mini-movie
  // ============================================================
  movieScenes: [
    {
      title: "Pehle...",
      subtitle: "Jab tum nahi the",
      text: "Ek waqt tha jab zindagi mein koi rang nahi tha. Roz same office jaana, same raasta, bas waqt bitana. Par phir... tum aayi.",
      photo: "images/kid/1.jpg",
      caption: "Masoom savera aur cute bachpan 🧸",
      durationMs: 7000
    },
    {
      title: "Teri Kahani",
      subtitle: "Har rani kabhi ek bachi thi",
      text: "Tumhari nanhin aakhon mein chhupa tha poora aasman. Tumhari har ek ada ne dil ko dheere dheere churana shuru kiya.",
      photo: "images/bossy/1.jpg",
      caption: "Teen spirit aur woh cute bossy look ✨",
      durationMs: 7000
    },
    {
      title: "Baarish Mein",
      subtitle: "Woh garden, woh baarish",
      text: "Baarish ho rahi thi. Tumne mujhe blanket se dhaka. Apna scarf mujhe lapet diya. Do baar — sirf do baar — tumhare lips ne mujhe chhua. Woh pal aaj bhi dil mein taze hain.",
      photo: "images/saree/1.jpg",
      caption: "Graceful aur bilkul khoobsurat 🥻",
      durationMs: 8000
    },
    {
      title: "Jab Tum Gayi",
      subtitle: "Faasle jism ke ho sakte hain, rooh ke nahi",
      text: "Jab tumhe padhai ke liye ghar jaana pada... waqt ruk sa gaya tha. Par maine tumhari taraf ek kadam uthaya — Net App banwaya, kyunki tumhara sapna mera sapna hai.",
      photo: "images/teeth/1.jpg",
      caption: "Naughty smile jo mera poora din theek kar de 😄",
      durationMs: 7500
    },
    {
      title: "Hum Dono",
      subtitle: "Aaj aur hamesha",
      text: "Dheere se kandhe par pehla haath... Ek sabzi ki galti se shuruu hua yeh safar aaj humari anniversary aur birthday tak pahunch gaya.",
      photo: "images/final/1.jpg",
      caption: "Hum dono — hamesha ke liye 🫂",
      durationMs: 8000
    }
  ],

  // ============================================================
  //  PART 2 — PROPOSAL SCENE & HALF-MOON EMERALD RING
  // ============================================================
  proposal: {
    dialogue: "Chahe zindagi kisi bhi taraf mudh jaaye...",
    finalQuote: "I love you today, tomorrow, and forever.",
    ringInitial: "K",
    ringSubtitle: "Pran + U = Meri Pranu ❤️"
  },

  // ============================================================
  //  PART 3 & 4 — BIRTHDAY SCENE & LOVE SHOWER MESSAGES
  // ============================================================
  heartShowerMessages: [
    "Teri cute smile jo poora din roshan kar deti hai! 😄",
    "Tera vo mere liye bina kahe hi sab samajh jana. 🥹",
    "Jab bhi main stress me hota hu, teri aawaz sunke sukoon milta hai. 😌",
    "Periods ke time tumhara chid-chida hona aur mera tumhe comfort karna. 🫂",
    "Deleted chats ke waqt hamara vo ek doosre ke liye rona. 🥺",
    "Pineapple juice me chatpata masala daal ke pina. 🍍",
    "Birla Mandir ki seedhiyon pe bitaaye vo peaceful pal. 🕊️",
    "Office jaane se pehle milne ki vo sweet excitement. 🌅",
    "Mujhe apna partner chunne ka tera vo pyaara sa pride. 🥰",
    "Happy Birthday Meri Jaan! ❤️"
  ]

};