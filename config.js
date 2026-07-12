// ============================================================
//  BIRTHDAY CONFIG — Sab kuch yahan se control karo
//  UI code kabhi mat chhuo — sirf yeh file edit karo
// ============================================================

const BIRTHDAY_CONFIG = {

  // --- Her identity ---
  name: "Pratibha Pareek",
  nickname: "Pranu",
  nicknameOrigin: "Pran + U = Meri Pranu", // "My pran in you"
  senderName: "Tumhara",
  birthday: "2003-08-02",
  anniversaryMessage: "Pehla Saal • Pehli Anniversary",

  // --- Music ---
  music: {
    src: "yourmusic.mp3",
    rainSoundsEnabled: true, // rain ambience in chapter 1-3
  },

  // --- Chapter 1: Akele The (Before Her) ---
  chapter1: {
    title: "Chapter I",
    subtitle: "Pehle...",
    description: "Ek waqt tha jab zindagi bahut zyada khali lagti thi.",
    poems: [
      "Roz uthna, roz so jaana,",
      "Koi rang nahi tha zindagi mein.",
      "Tab tum nahi the.",
    ],
    openingLine: "Ek baar ki baat hai...",
  },

  // --- Chapter 2: Woh Pehli Baar (How it began) ---
  chapter2: {
    title: "Chapter II",
    subtitle: "Jab Tum Mile",
    memories: [
      {
        id: 1,
        title: "Woh Sabzi Wali Galti 🥄",
        description: "Family function mein ek gadbad ho gayi — katori mein zyada sabzi ghus gayi. Tumne jo hasa... us hasi ne sab badal diya.",
        emoji: "🥄",
        folder: "kid",
      },
      {
        id: 2,
        title: "Instagram Ka Pehla Kadam 📱",
        description: "Ek follow request. 'Hum ek hi family mein hain' — bas yahi soch ke bheja tha. Jawab tumhari ek story se aaya, aur maine ek heart reaction diya.",
        emoji: "📱",
        folder: "kid",
      },
      {
        id: 3,
        title: "Best of Luck ✨",
        description: "Padhte hue tumhari story thi. Maine likha — 'Best of luck.' Woh do lafz ek poori kahani ka shuruwaat the.",
        emoji: "✨",
        folder: "teeth",
      },
      {
        id: 4,
        title: "Chaddar Aur Loose T-Shirt ☀️",
        description: "Pehli baar dekha tha subah subah — PG se seedhi aayi thi, chaddar mein, loose t-shirt mein. Sabse cute cheez thi jo maine kabhi dekhi thi.",
        emoji: "☀️",
        folder: "teeth",
      },
      {
        id: 5,
        title: "Pehli Baar Park Mein 🌳",
        description: "Baatein huin. Kafi baatein. Kandhe par pehla haath rakha — dheere se, darte darte. Kuch aisa tha hawa mein us roz.",
        emoji: "🌳",
        folder: "saree",
      },
      {
        id: 6,
        title: "Pehla Birthday, Pehla Ikraar 🛕",
        description: "Tumne kaha 'yeh rishta chalta hua nahi lag raha.' Maine kaha 'maine 200% diya — agar jaana hai to aaj jao.' Patties... Govind Dev Ji... Birla Mandir ki seedhiyaan. Aur phir — kaan mein, pass bulake — tumne bola: I love you.",
        emoji: "❤️",
        folder: "bossy",
      },
    ],
  },

  // --- Chapter 3: Baarish Mein (Monsoon moments) ---
  chapter3: {
    title: "Chapter III",
    subtitle: "Baarish Mein",
    mainMemory: {
      title: "Woh Garden, Woh Baarish",
      description: "Usi garden mein jahan hum pehli baar gaye the. Baarish ho rahi thi. Tumne mujhe blanket se dhaka. Apna scarf mujhe lapet diya. Do baar — sirf do baar — tumhare lips ne mujhe chhua. Woh pal aaj bhi dil mein taze hain.",
    },
    moments: [
      { text: "Birla Mandir ki seedhiyaan pe baithna, shanti se 🛕", icon: "🛕" },
      { text: "Office se pehle milna, intezaar karna ❤️", icon: "🌅" },
      { text: "Ek doosre ko har update dena, har roz 💬", icon: "💬" },
      { text: "Chats delete hone par saath rona 🥺", icon: "🥺" },
      { text: "Periods mein paas rehna, comforting karna 🫂", icon: "🫂" },
      { text: "Pineapple juice with masala — kyunki pata tha tumhe pasand hai 🍍", icon: "🍍" },
      { text: "Haath se khilana, fries with schezwan chutney 🍟", icon: "🍟" },
      { text: "Tumhari hasi — jo meri kamzori bhi hai aur meri jaan bhi 😊", icon: "✨" },
    ],
    reasonsILoveYou: [
      "Teri hasi — jo duniya roshni kar de",
      "Tera dard dekha tha maine, aur us dard se pyaar hua",
      "Tu jo chaddar mein aati hai subah, sab cute lagti hai",
      "Baarish mein blanket orhana — yeh teri hi fitrat hai",
      "Tu gussa karti hai tab bhi teri parwah lagti hai",
      "Khana skip karti hai — isliye juice laata hoon",
      "Teri mehnat, teri padhai, tujhpe garv hai mujhe",
      "Deleted chats ke baad bhi saath the hum",
      "Teri awaaz mein sukoon hai",
      "Tu meri zindagi ka rang hai — pehle kuch nahi tha",
    ],
  },

  // --- Chapter 4: Doori (Distance and longing) ---
  chapter4: {
    title: "Chapter IV",
    subtitle: "Jab Tum Gayi",
    description: "Sab kuch chhodkar ghar jaana pada tumhe. Kuch waqt ke liye — khamoshi si aa gayi. Par pyaar nahi gaya.",
    moments: [
      "Woh pehle jaisa baat nahi ho paata tha",
      "Par dil se door nahi hue kabhi",
      "Tumhare liye Yojee's Net app banwaya — taaki padh sako achhe se",
      "Dheere dheere — hum phir wahi aa gaye",
    ],
    letter: "Yeh waqt mushkil tha. Par tu jaanti hai — teri mushkil meri mushkil hai. Jab tujhe padhai par dhyan dena tha, maine teri taraf se ek kadam uthaya. Net app isliye banwaya kyunki main chahta tha ki tu apna sapna poora kare. Tera sapna, mera sapna hai.",
  },

  // --- Chapter 5: Aaj Aur Aage (Present and future) ---
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
      "Humari kahani aur khoobsurat bane 📖",
    ],
    futureDreams: [
      "Saath travel karna — ek baar toh puri duniya dekhni hai 🌍",
      "Ghar banana — tumhara, mera, humara 🏠",
      "Baarish mein phir us garden mein jaana 🌧️",
      "Har birthday yaise celebrate karna 🎂",
    ],
    endingLetter: `Pranu,

Ek sabzi ki galti se shuruu hua tha yeh sab. Tumne hasa tha — aur us hasi ne meri duniya badal di.

Tumse milne se pehle, zindagi mein koi rang nahi tha. Tumne aake ek-ek rang bhara — khushi ka, intezaar ka, baarish ka, doori ka, aur pyaar ka bhi.

Aaj tumhara birthday hai. Aur yeh humari pehli anniversary bhi hai. Dono ek saath — jaise tum keh rahi ho ki yeh sab sirf tumhare liye tha.

Yeh ek saal mein humne itna jeya hai — woh baarish, woh scarf, woh kisses, woh jhagde, woh mandir ki seedhiyaan, woh deleted chats, woh doori...

Aur phir bhi — hum yahan hain. Saath.

Main yeh wada karta hoon: chahe koi bhi waqt aaye, main wahi rahoon ga. Tumhare periods mein, tumhare exams mein, tumhari haar mein, tumhari jeet mein — main wahan hoon.

Tumhari hasi meri sabse badi kamzori hai. Aur main chahta hoon ki yeh kamzori hamesha bani rahe.

Pranu — tu meri jaan hai. Literally. Pran + U = Pranu. Tu meri saans hai.

Happy Birthday. Happy Anniversary.

Yeh sirf shuruwaat hai. ❤️

— Tumhara`,

    closingLine: "Yeh sirf shuruwaat hai...",
    finalLine: "Agli zindagi ke chapter mein bhi — saath. ❤️",
  },

  // --- Photos mapping ---
  // Add more photos by adding to the arrays below
  // Format: "images/folder/filename.jpg"
  photos: {
    kid: ["images/kid/1.jpg", "images/kid/2.jpg", "images/kid/3.jpg", "images/kid/4.jpg"],
    teeth: ["images/teeth/1.jpg", "images/teeth/2.jpg"],
    saree: ["images/saree/1.jpg", "images/saree/2.jpg", "images/saree/3.jpg", "images/saree/4.jpg"],
    bossy: ["images/bossy/1.jpg", "images/bossy/2.jpg", "images/bossy/3.jpg", "images/bossy/4.jpg", "images/bossy/5.jpg"],
    final: ["images/final/1.jpg", "images/final/2.jpg", "images/final/3.jpg", "images/final/4.jpg"],
  },

};
