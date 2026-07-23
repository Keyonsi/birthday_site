// ============================================================
//  BIRTHDAY CONFIG — Master Configuration File
//
//  📸 HOW TO ADD / REMOVE PHOTOS:
//  Each scene in movieScenes has a `photos` array.
//  Add any number of image paths to that array.
//  The cinema engine will cycle through them automatically.
//  Example:
//    photos: ["images/kid/1.jpg", "images/kid/2.jpg", "images/kid/3.jpg"]
//
//  Photo folder guide:
//    images/kid/      — childhood photos
//    images/bossy/    — teenage / attitude era photos
//    images/teeth/    — fun / laughing photos
//    images/saree/    — graceful / traditional photos
//    images/final/    — couple / recent photos
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
  coldOpen: [
    "Kuch kahaniyaan likhi jaati hain...",
    "Kuch jee li jaati hain...",
    "Yeh wali... humne jee li."
  ],

  // --- Chapter meta (used by title cards in acts) ---
  chapterMeta: [
    {
      roman: "I", name: "Pehle",
      tagline: "Har kahani ki ek shuruaat hoti hai jo use khud yaad nahi rehti.",
      taglineVariants: [
        "Har kahani ki ek shuruaat hoti hai jo use khud yaad nahi rehti.",
        "Jab tum nahi the, waqt bas ghadi ki tik-tik tha.",
        "Ujaale se pehle ki khamoshi bhi kitni gehri hoti hai."
      ]
    },
    {
      roman: "II", name: "Teri Kahani",
      tagline: "Har rani kabhi ek bachi thi.",
      taglineVariants: [
        "Har rani kabhi ek bachi thi.",
        "Nanhin aakhon mein chhupa tha poora aasman.",
        "Bachpan ki haseen yaadon ka silsila."
      ]
    },
    {
      roman: "III", name: "Baarish Mein",
      tagline: "Kuch yaadein baarish mein bhi kabhi geeli nahi hotin.",
      taglineVariants: [
        "Kuch yaadein baarish mein bhi kabhi geeli nahi hotin.",
        "Us garden ki mehak aaj bhi fizaon mein hai.",
        "Boond boond mein base hain tumhare aur mere lamhe."
      ]
    },
    {
      roman: "IV", name: "Jab Tum Gayi",
      tagline: "Doori pyaar ko test nahi karti, dil ko sabr sikhati hai.",
      taglineVariants: [
        "Doori pyaar ko test nahi karti, dil ko sabr sikhati hai.",
        "Faasle jism ke ho sakte hain, rooh ke nahi.",
        "Har raat taaron se tumhare aane ki baat hoti thi."
      ]
    },
    {
      roman: "V", name: "Aaj Aur Hamesha",
      tagline: "Kuch kahaniyaan khatam nahi hotin, woh bas shuruu hoti rehti hain.",
      taglineVariants: [
        "Kuch kahaniyaan khatam nahi hotin, woh bas shuruu hoti rehti hain.",
        "Yeh toh bas shuruaat hai humare forever ki.",
        "Har janam mein, har mod par... tum hi ho."
      ]
    }
  ],
  chapterSignature: "— Tumhara, Hamesha",

  // --- Star whispers (hidden tap zones in Act 1) ---
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

  rainWords: ["Hope", "Love", "Pranu", "Forever", "Miss You", "Yaad Hai"],

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

  hiddenMemories: [
    "Wo pehli baar jab tumne mujhe apni favourite gaana bheja tha.",
    "Jab tumne mujhe raat ko so jaane se pehle 'good night' bola tha, pehli baar.",
    "Wo photo jo tumne bina bataye click ki thi, aur main hass raha tha.",
    "Jab hum dono ne ek hi cheez order ki thi bina ek dusre ko bataye.",
    "Wo din jab tumhari hasi ne mera pura din theek kar diya tha."
  ],

  // ============================================================
  //  ACT 1 — CINEMATIC MOVIE SLIDES
  //
  //  📸 PHOTO GUIDE:
  //  `photos` is an array — add as many photos as you want.
  //  If multiple photos are present, they will cross-fade automatically.
  //  If a photo file doesn't exist, slide shows a dark gradient instead.
  //  durationMs = total time this slide shows (shared across all photos)
  // ============================================================
  movieScenes: [
    {
      title: "Pehle...",
      subtitle: "Jab tum nahi the",
      text: "Ek waqt tha jab zindagi mein koi rang nahi tha. Roz same office jaana, same raasta, bas waqt bitana... Zindagi bas ghadi ki tik-tik chal rahi thi.",
      photos: ["images/kid/1.jpg"],
      caption: "Ujaale se pehle ki khamoshi... 🌌",
      durationMs: 8000
    },
    {
      title: "Pehla Kadam",
      subtitle: "Ek sabzi ki galti...",
      text: "Ek chhotisi sabzi ki galti se shuruu hua tha yeh sab. Tumne hasa tha — aur us ek minute ki hasi ne meri poori duniya badal di.",
      photos: ["images/kid/2.jpg", "images/kid/1.jpg"],
      caption: "Masoom savera aur cute bachpan 🧸",
      durationMs: 8000
    },
    {
      title: "Teri Kahani",
      subtitle: "Har rani kabhi ek bachi thi",
      text: "Tumhari nanhin aakhon mein chhupa tha poora aasman. Tumhari har ek ada ne mera dil chura liya tha bina bataye.",
      photos: ["images/bossy/1.jpg"],
      caption: "Teen spirit aur woh cute bossy look ✨",
      durationMs: 8000
    },
    {
      title: "Chulbuli Yaadein",
      subtitle: "Woh aawaz, woh sukoon",
      text: "Jab tumne mujhe pehli baar raat ko 'Good Night' bola tha... us raat mujhe pehli baar sukoon ki neend aayi thi.",
      photos: ["images/teeth/1.jpg"],
      caption: "Naughty smile jo mera poora din theek kar de 😄",
      durationMs: 8000
    },
    {
      title: "Baarish Mein",
      subtitle: "Woh garden, woh baarish",
      text: "Usi garden mein jahan hum gaye the... baarish ho rahi thi. Tumne mujhe blanket se dhaka, apna scarf lapet diya... do baar lips ne chhua. Woh pal dil mein amar hain.",
      photos: ["images/saree/1.jpg"],
      caption: "Kuch yaadein baarish mein bhi kabhi geeli nahi hotin 🌧️",
      durationMs: 9000
    },
    {
      title: "Chhoti Chhoti Cheezein",
      subtitle: "Pineapple juice & Fries",
      text: "Pineapple juice mein masala daal ke pina, Fries with schezwan chutney, Birla Mandir ki seedhiyon pe shaanti se baithna... Har chhota moment tumhare saath jannat lagta hai.",
      photos: ["images/saree/2.jpg", "images/saree/1.jpg"],
      caption: "Har roz tumse milna ek naya tohfa lagta tha 🍍🍟",
      durationMs: 8500
    },
    {
      title: "Jab Tum Gayi...",
      subtitle: "Doori pyaar ko test nahi karti",
      text: "Jab padhai ke liye ghar jaana pada, khamoshi aa gayi thi. Par tum jaanti ho — tumhari mushkil meri mushkil hai. Isliye Yojee's Net App banwaya, taaki tum apna sapna poora karo.",
      photos: ["images/teeth/2.jpg", "images/teeth/1.jpg"],
      caption: "Faasle jism ke ho sakte hain, rooh ke nahi 📖✨",
      durationMs: 9000
    },
    {
      title: "Caring Moments",
      subtitle: "Har mushkil mein saath",
      text: "Periods mein tumhara chid-chida hona aur mera tumhe comfort karna, deleted chats par saath rona... Humne har haal mein ek doosre ka haath thama rakha.",
      photos: ["images/final/1.jpg"],
      caption: "Tumhari har takleef aur har khushi mein main pehla hoon 🫂",
      durationMs: 8500
    },
    {
      title: "Hum Dono",
      subtitle: "Pehla Saal • Pehli Anniversary",
      text: "365 din sirf calendar par guzre. Mere liye har din tum tak pahunchne ka ek aur kadam tha. Aaj humari pehli anniversary bhi hai aur birthday bhi!",
      photos: ["images/final/2.jpg", "images/final/1.jpg"],
      caption: "Hum dono — hamesha ke liye ❤️",
      durationMs: 8500
    },
    {
      title: "Ek Sapna...",
      subtitle: "Jo sach hone wala hai",
      text: "Agar taqdeer mujhe hazaar zindagiyaan de... main phir bhi har ek zindagi mein tumhein hi dhoondh loonga.",
      photos: ["images/final/3.jpg", "images/final/2.jpg"],
      caption: "Chahe zindagi kisi bhi taraf mudh jaaye... 💍",
      durationMs: 9000
    }
  ],

  // ============================================================
  //  ACT 4 — PROPOSAL SCENE
  // ============================================================
  proposal: {
    dialogueLines: [
      "Pranu...",
      "Chahe zindagi kisi bhi taraf mudh jaaye...",
      "Main tumhe hi chununga.",
      "Har baar. Har janam. Hamesha."
    ],
    finalQuote: "I love you today, tomorrow, and forever.",
    ringInitial: "K",
    ringSubtitle: "Pran + U = Meri Pranu ❤️"
  },

  // ============================================================
  //  ACT 2 — RAIN WORLD
  // ============================================================
  chapter3: {
    description: "Baarish ho rahi thi. Garden mein, dono chup the. Kuch alfaaz nahi the — bas woh pal tha.",
    reasonsILoveYou: [
      { emoji: "😄", text: "Teri cute smile jo poora din roshan kar deti hai." },
      { emoji: "🥹", text: "Tera bina kahe sab samajh jaana — woh meri favourite cheez hai." },
      { emoji: "😌", text: "Jab bhi main stress mein hota hoon, teri aawaz sunke sukoon milta hai." },
      { emoji: "🫂", text: "Periods ke time tumhara chid-chida hona aur mera tumhe comfort karna." },
      { emoji: "🥺", text: "Deleted chats ke waqt hamara ek doosre ke liye rona." },
      { emoji: "🍍", text: "Pineapple juice mein chatpata masala daal ke pina." },
      { emoji: "🕊️", text: "Birla Mandir ki seedhiyon pe bitaaye vo peaceful pal." },
      { emoji: "🌅", text: "Office jaane se pehle milne ki vo sweet excitement." },
      { emoji: "🥰", text: "Mujhe apna partner chunne ka tera vo pyaara sa pride." }
    ]
  },

  // ============================================================
  //  ACT 3 — DOORI
  // ============================================================
  chapter4: {
    description: "Jab tum chali gayi... waqt jaise ruk sa gaya. Har raat taaron se tumhare aane ki baat hoti thi.",
    letter: "Meri Pranu, tum door gayi ho — par mera dil ek pal bhi nahi bhata tumhe. Yeh doori mujhe aur samjha deti hai ki tum kitni zaroori ho mere liye. Jaldi aao...",
    moments: [
      "Tumhare bina subah adhoori lagti hai.",
      "Call pe tumhari aawaz, bas itna hi kaafi hai.",
      "Teri yaadein hi aajkal meri neend hain.",
      "Wapas aao. Ghar wahi hai jahan tum ho."
    ]
  },

  // ============================================================
  //  ACT 5 — BIRTHDAY SCENE
  // ============================================================
  chapter5: {
    wishes: [
      "Tumhari hasi hamesha aise hi chamakti rahe 🌟",
      "Har sapna poora ho, har khwaish mile 🌸",
      "Zindagi mein bas khushiyan hi khushiyan hon 🎉",
      "Tum hamesha yaise hi cute rehna 🥰",
      "Love you to the moon and back 🌙"
    ],
    endingLetter: "Meri Pranu, aaj tumhara janamdin hai — aur yeh din mere liye bhi utna hi khaas hai jitna tumhare liye. Kyunki tum aayi thi is duniya mein 2 August ko — aur usi din se duniya thodi aur sundar ho gayi thi. Happy Birthday Pranu. Hamesha meri rehna.",
    closingLine: "Tumhara apna,",
    finalLine: "P ❤️ A — Hamesha"
  },

  // ============================================================
  //  GRAND FINALE — 6-scene sequence
  // ============================================================
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
  //  LOVE SHOWER MESSAGES
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
    "Teri naughty aankhen jo sab bol deti hain bina kuch kahe. 👀",
    "Woh baar jab baarish mein tum bheeg gayi thi aur mujhe blame kiya tha. 🌧️😂",
    "Tujhse pyaar karna meri sabse best decision hai. ❤️",
    "Happy Birthday Meri Jaan! ❤️🎂"
  ]

};