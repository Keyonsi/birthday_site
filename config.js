const BIRTHDAY_CONFIG = {

  name: "Pratibha Pareek",
  nickname: "Pranu",
  birthday: "2003-08-02",
  anniversaryMessage: "Pehla Saal • Pehli Anniversary ❤️",

  // Testing controls — set to true before sending the real link so nobody sees the
  // quick-nav bar (🃏 Decoy / 🌸 Intro / etc.) or the "Skip ⏩" button in the cinema scene.
  // Set back to false whenever you want those testing shortcuts visible again.
  hideQuickNav: false,

  decoy: {
    title: "Happy Birthday! 🎂",
    subtitle: "Wishing you a wonderful day!",
    buttonText: "Open Card 🎁"
  },

  revealMsg: "Tumko kya laga... ye bas itna sa tha? 😏",

  scenes: [
    {
      title: "Pehle...",
      text: "Ek waqt tha jab zindagi mein koi rang nahi tha.",
      caption: "Tab tum nahi the.",
      photos: ["images/kid/1.jpg", "images/kid/2.jpg"],
      durationMs: 7000
    },
    {
      title: "Bachi thi tum... 🧸",
      text: "Masoom aankhein, chhupa hua poora aasman in mein.",
      caption: "Bachpan ka wo innocent savera...",
      photos: ["images/kid/3.jpg", "images/kid/4.jpg"],
      durationMs: 7000
    },
    {
      title: "Phir badi hui... ✨",
      text: "Attitude aa gaya, style aa gaya — lekin woh pyaari naughtiness gayi nahi.",
      caption: "Bossy era 😤",
      photos: ["images/bossy/1.jpg", "images/bossy/2.jpg", "images/bossy/3.jpg"],
      durationMs: 9000
    },
    {
      title: "Woh smile... 😄",
      text: "Jab tum hansti ho, duniya thodi aur sundar ho jaati hai.",
      caption: "Meri sabse kamzori.",
      photos: ["images/teeth/1.jpg", "images/teeth/2.jpg", "images/teeth/WhatsApp Image 2026-07-07 at 7.19.17 AM (4).jpeg"],
      durationMs: 9000
    },
    {
      title: "Saree mein... 🥻",
      text: "Graceful. Khoobsurat. Bilkul tum jaisi.",
      caption: "Aur main bas dekhta hi reh gaya.",
      photos: ["images/saree/1.jpg", "images/saree/2.jpg", "images/saree/WhatsApp Image 2026-07-07 at 7.19.16 AM (4).jpeg", "images/saree/WhatsApp Image 2026-07-07 at 7.19.17 AM (6).jpeg"],
      durationMs: 10000
    },
    {
      title: "Hum dono... 🫂",
      text: "Ek sabzi ki galti. Tumhari ek hasi. Meri poori duniya badal gayi.",
      caption: "Yeh shuruwaat thi.",
      photos: ["images/us/WhatsApp Image 2026-07-07 at 7.19.17 AM (7).jpeg", "images/us/WhatsApp Image 2026-07-07 at 7.19.17 AM (8).jpeg", "images/us/WhatsApp Image 2026-07-07 at 7.19.17 AM (9).jpeg"],
      durationMs: 10000
    },
    {
      title: "Yaadon ki khushboo... 🌧️",
      text: "Woh baarish, woh garden, woh pal — dil mein hamesha ke liye bas gaya.",
      caption: "Do baar tumhare lips ne chhua mujhe. Sirf do baar.",
      photos: ["images/collages/WhatsApp Image 2026-07-07 at 7.19.17 AM (1).jpeg", "images/collages/WhatsApp Image 2026-07-07 at 7.19.17 AM (2).jpeg", "images/collages/WhatsApp Image 2026-07-07 at 7.19.17 AM (5).jpeg"],
      durationMs: 10000
    },
    {
      title: "Ek din... 💍",
      text: "Agar taqdeer mujhe hazaar zindagiyaan de...",
      caption: "Main phir bhi tumhein hi dhoondh loonga. Har baar. Har janam.",
      photos: ["images/dream.jpeg", "images/final/3.jpg"],
      durationMs: 9000
    }
  ],

  moments: [
    { title: "Birla Mandir", icon: "🛕", text: "Seedhiyon par saath baithna, shanti se duniya ko dekhna, bina kuch bole ek doosre ko feel karna, apne moments enjoy karna... aur shayad yahi woh jagah thi jahan tumne mujhe janwar se insaan bante hue dekha tha. ❤️" },
    { title: "Office Morning Waits", icon: "🌅", text: "Office se pehle milna, ek doosre ka intezaar karna aur woh chhote-chhote morning moments jo poore din ko special bana dete the." },
    { title: "Daily Updates", icon: "💬", text: "Har chhoti-badi baat share karna... 'Khaana khaya?', 'Pahunch gaye?', 'Thik ho na?' ❤️" },
    { title: "Deleted Chats", icon: "🥺", text: "Chats delete ho jaati thi, aur hum dono un yaadon ke chale jaane par sach mein udaas ho jaate the." },
    { title: "Periods Comfort", icon: "🫂", text: "Un mushkil dino mein bas tumhare paas rehna, tumhe comfort dena aur tumhara dard thoda sa kam karne ki koshish karna." },
    { title: "Pineapple Juice", icon: "🍍", text: "Rama wale ka masala Pineapple Juice... kyunki usse bhi zyada sweet tumhari smile hua karti thi." },
    { title: "Fries Date", icon: "🍟", text: "Haath se fries khilana, Schezwan chutney ke saath apna favourite combo... aur har bite ke saath ek nayi smile churana. ❤️" },
    { title: "Lassi Habit", icon: "😊", text: "Tumhe lassi pilana... aur dheere-dheere usse hamari ek chhoti si tradition bana dena." },
    { title: "Abandoned Building", icon: "🏚️", text: "Chhodi hui building mein jaana, bina kisi wajah ke bas ek doosre ke saath waqt bitana aur uss khamoshi mein bhi apni duniya basa lena." },
    { title: "Machhar Wala Garden", icon: "🐶", text: "Garden ka romance, puppies ke saath khelna, unka mere paas aa jaana, tumhare phone par mera tumse milne aa jaana, Vanshi ko sambhalna... aur wahin tumhara form bharna. ❤️" },
    { title: "Suar Wala Garden", icon: "🌳", text: "Pedon ke neeche wali bench, tumhara gussa, mera manana, tumhara chhata maarna, hamara bhaagna, ped ke neeche bitaye lamhe, kone mein chupkar baatein karna... aur sabse pyara woh ek hi sentence — 'Mujhe nahi jaana...' ❤️" },
    { title: "Vitthal Café", icon: "🍝", text: "Tumhare liye Red Sauce Pasta, mere liye Paneer Tikka aur dono ke liye Cold Coffee... hamari perfect date. 😊" },
    { title: "Hotel Moments", icon: "🏨", text: "Kabhi ladna, kabhi samjhana, kabhi ek doosre se comfort lena, kabhi galtiyon se seekhna... aur har baar pehle se zyada close ho jaana." },
    { title: "Hospital Visits", icon: "🏥", text: "Appointment ke baad ek doosre se milna... chahe tum mere paas aao ya main tumhare paas." },
    { title: "Rama Juices", icon: "🥤", text: "Chhoti si juice date... lekin yaadein hamesha ke liye." },
    { title: "Bus Stop Goodbyes", icon: "🚌", text: "Tumhe bus tak chhodne jaana... phir akela wapas aana, sirf tumhare baare mein sochte hue." },
    { title: "DMart Shopping", icon: "🛒", text: "Shopping kam, masti zyada... har aisle mein ek nayi memory." },
    { title: "Goodbye to the Past", icon: "🌅", text: "Saath milkar apne purane dard ko alvida kehna aur naye sapno ki taraf chalna." },
    { title: "Khari Dari Sabzi Mandi", icon: "🥬", text: "Bheed mein bhi sirf tum nazar aati thi." },
    { title: "Vitthal Ludo Streak", icon: "🎲", text: "Tumne mujhe lagataar 7 baar haraya, aur main tumhare liye 3 lassi lekar aaya. ❤️😂" },
    { title: "Devgara Hospital", icon: "🏥", text: "Ek aur chhota sa milna... jo hamesha yaad rahega." },
    { title: "Mummy's Operation Day", icon: "👩‍👦", text: "Dr. Virendra Laser Phaco Surgery Centre Eye Hospital mein mummy ke operation ke beech sirf tumhe 2 second dekhne ke liye bhaag kar aana... aur operation ke waqt tumhara mere paas hona. ❤️" },
    { title: "Exam Days", icon: "📚", text: "Tumhe paper dilane le jaana aur safely wapas chhod kar aana." },
    { title: "Always Drop You", icon: "🚶", text: "Tum jab bhi milne aayi... tumhe chhodne jaana kabhi nahi bhoola." },
    { title: "One Last Meet", icon: "🤍", text: "Kahin bhi jaana ho... bina ek baar mile kabhi nahi jaana." },
    { title: "Vrindavan Locket", icon: "🧿", text: "Andheri raat mein gali ke paas tumhe Vrindavan ka locket pehnana... aur tumhara sirf 10 minute ke liye aa jaana bhi meri poori raat bana deta tha." },
    { title: "Train Fight", icon: "🚆", text: "Train mein jhagda... aur Jaipur pahunchte hi seedha park mein tumse milkar sab theek kar dena." },
    { title: "Chhoti Diwali", icon: "🩹", text: "Tumhe protect karte hue mera pair lag jaana... phir Suar Wale Garden mein saath baithna aur sab kuch bhool jaana." },
    { title: "Karwa Chauth", icon: "💍", text: "Meri life ke sabse khoobsurat dino mein se ek... tumhara halka sa makeup, woh surprise, meri ungli mein pehnayi hui ring aur uss din tumhara sabse pyara lagna. ❤️" },
    { title: "Puchku Shopping", icon: "🛍️", text: "Market mein ghoomna, kurtiyan dekhna aur bina kisi wajah ke poora bazaar saath ghoom lena." },
    { title: "Hidden Garden", icon: "🌿", text: "Naye garden ki khoj aur neeche jaati tunnel mein tumhe chhedna." },
    { title: "Waiting Corner", icon: "⏳", text: "Ek kone mein khade hokar sirf tumhari raah dekhna aur tumhare aane ka intezaar karna." },
    { title: "Raj Pan Wala", icon: "🚬", text: "Raj Pan ke bahar wait karna aur wahin ki chhoti-chhoti baatein." },
    { title: "Bus Stand Talks", icon: "🚌", text: "Suar Wale Garden se nikal kar bus stand ke paas baithna, future discuss karna aur saath mein lassi peena." },
    { title: "PG & Coaching Rounds", icon: "🏠", text: "Tumhare PG aur coaching ke aas-paas bina kisi kaam ke rounds lagana... bas tumhare thoda aur paas rehna ke liye." },
    { title: "Patasi Date", icon: "🥟", text: "Tumhe patasi khilana aur logon ka hume dekhte reh jaana. 😂" },
    { title: "Nehru Garden", icon: "🌸", text: "Hamari pehli mulaqat... aur uske baad ke saare unforgettable kand. ❤️" },
    { title: "Birla Mandir Again", icon: "🛕", text: "Photos, lambi discussions aur har baar pehle se thoda aur pyaar." },
    { title: "Office Return", icon: "🚗", text: "Office se wapas aate hue sirf ek baar tumhe dekh lena... ya mil lena, bas itna hi kaafi hota tha." },
    { title: "The Most Precious Memory", icon: "🌕", text: "Jab tumne pehli baar meri aankhon mein dekhkar kaha...\n\n\"Koustoobh... I Love You.\" ❤️", isMoonClimax: true }
  ],

  hearts: [
    { emoji: "😊", reason: "Teri smile sirf khoobsurat nahi hai... woh meri har tension ka shortcut hai. Kitna bhi bura din ho, bas ek baar tujhe haste dekh loon, sab theek sa lagne lagta hai." },
    { emoji: "🥹", reason: "Mujhe tumhari sabse pyari baat ye lagti hai ki tum bina mere kuch kahe meri khamoshi bhi padh leti ho. Shayad isi ko apna hona kehte hain." },
    { emoji: "😌", reason: "Teri awaaz mere liye sirf ek awaaz nahi hai... woh meri favourite jagah hai, jahan har baar jaakar mujhe sukoon milta hai." },
    { emoji: "🫂", reason: "Jab tum periods mein chid-chidi ho jaati ho na... tab mujhe tum aur bhi zyada apni lagti ho. Bas mann karta hai tumhe hug karke bolun... 'Main hoon na.'" },
    { emoji: "🥺", reason: "Chats delete hone ka dukh messages ka nahi tha... unmein chhupe un lamhon ka tha jo sirf hum dono ke the." },
    { emoji: "🍍", reason: "Rama wale pineapple juice ka taste shayad kabhi bhool jaaun... par us waqt tumhari aankhon ki chamak kabhi nahi." },
    { emoji: "🛕", reason: "Birla Mandir ki seedhiyon par baithkar mujhe sirf ek cheez samajh aayi thi... sukoon kisi jagah mein nahi, kisi insaan mein hota hai. Aur mera sukoon tum ho." },
    { emoji: "🌅", reason: "Office jaane se pehle tumse milna mere liye routine nahi tha... woh meri har subah ka favourite reason tha." },
    { emoji: "🥰", reason: "Jab tum mujhe proudly apna partner bolti ho... us ek pal mein mujhe lagta hai ki maine poori duniya jeet li." },
    { emoji: "🌙", reason: "Good Night bolne ke baad bhi tumhara 'Ek aur baat...' likhna mujhe hamesha ye feel karata tha ki tum bhi meri tarah baat khatam hi nahi karna chahti." },
    { emoji: "🌧️", reason: "Baarish mein bheegna mujhe kabhi itna pasand nahi tha... jab tak us baarish mein tum mere saath chalna shuru nahi kiya." },
    { emoji: "🍟", reason: "Ek plate fries aur thodi si Schezwan chutney... aur tumhare saath woh kisi five-star dinner se bhi zyada special lagti thi." },
    { emoji: "✨", reason: "Tumhari aankhon mein dekhkar mujhe kabhi words ki zarurat mehsoos hi nahi hui... kyunki wahan har jawab pehle se likha hota hai." },
    { emoji: "🧸", reason: "Tumhara gussa mujhe kabhi daraata nahi... kyunki mujhe pata hota hai ki do minute baad wahi chehra phir se meri favourite smile mein badal jaayega." },
    { emoji: "💖", reason: "Mujhe tumhari perfection se pyaar nahi hua... mujhe tumhari har chhoti si imperfection se pyaar hua hai." },
    { emoji: "🚶", reason: "Tumhare saath chalna itna pasand hai ki destination kabhi matter hi nahi karti... bas tumhara saath hona zaroori hota hai." },
    { emoji: "💬", reason: "Tum jab apni chhoti-chhoti baatein share karti ho na... tab lagta hai duniya ka sabse precious trust mujhe mila hai." },
    { emoji: "🎵", reason: "Tumhari hasi meri favourite song hai... aur main usse lifetime repeat par sun sakta hoon." },
    { emoji: "🌟", reason: "Tumne mujhe kabhi badalne ki koshish nahi ki... lekin tumhare pyaar ne mujhe khud hi ek better insaan bana diya." },
    { emoji: "💍", reason: "Mera favourite future woh hai jisme har festival, har Sunday, har safar aur har subah tumhare saath shuru aur tumhare saath hi khatam ho." },
    { emoji: "🤝", reason: "Tum mera haath pakadti ho to sirf haath nahi pakadti... tum meri saari pareshaaniyan thodi der ke liye apne saath le leti ho." },
    { emoji: "💗", reason: "Main tumse isliye pyaar nahi karta kyunki tum perfect ho... main tumse isliye pyaar karta hoon kyunki tumhari har kami bhi mujhe utni hi pyari lagti hai jitni tumhari har khoobi." },
    { emoji: "🏡", reason: "Agar kabhi mujhe 'Home' ki definition likhni padi... to main sirf tumhara naam likhunga." },
    { emoji: "🌸", reason: "Har baar tumse milna aaj bhi utna hi exciting lagta hai jitna pehli baar Nehru Garden mein tumse milna laga tha." },
    { emoji: "❤️", reason: "Aur agar koi mujhse pooche ki main tumse itna pyaar kyun karta hoon... to shayad main kabhi poora jawab de hi nahi paunga. Kyunki jitne reasons aaj bata raha hoon, usse kahin zyada reasons abhi hum dono ko saath jeete hue milne baaki hain. Aur agar ek zindagi kam pad gayi tumhe batane ke liye... to main agla janam bhi tumhare saath hi loonga. Sirf isliye... taaki phir se tumse pyaar kar sakoon, phir se tumhe paa sakoon, aur phir se poori zindagi laga doon tumhe ye samjhane mein... ki main tumse kitna, kitna aur kitna zyada pyaar karta hoon. ❤️♾️", isHeartClimax: true }
  ],

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