# Photos Folder Structure & Count Guide

Apni photos ko high quality me load karne ke liye `images/` directory me niche diye gaye folders me replace karein:

## Folders & Recommended Counts:

1. **`images/kid/`** (Bachi 🧸 Era)
   - *Photos count*: 2
   - *File names*: `1.jpg`, `2.jpg`

2. **`images/teeth/`** (Chulbuli ✨ Era)
   - *Photos count*: 2
   - *File names*: `1.jpg`, `2.jpg`

3. **`images/bossy/`** (Ladki 🌸 Era)
   - *Photos count*: 2
   - *File names*: `1.jpg`, `2.jpg`

4. **`images/saree/`** (Saree 🥻 Era)
   - *Photos count*: 2
   - *File names*: `1.jpg`, `2.jpg`

5. **`images/final/`** (Us Together 🫂 & Married Dream 💍)
   - *Photos count*: 4
   - *File names*: `1.jpg`, `2.jpg`, `3.jpg`, `4.jpg`

---

### Note:
- Agar kisi folder me aap photos badhana chahte hain, to simply us folder me photo daalein (e.g. `images/kid/3.jpg`) aur use `config.js` ki corresponding list me append kar dein:
  ```javascript
  photos: {
    kid: ["images/kid/1.jpg", "images/kid/2.jpg", "images/kid/3.jpg"],
    ...
  }
  ```
- **Image Resolution Tip**: Quality kharab na ho isliye polaroid borders coordinate kiye gaye hain taaki image responsive fit ho. Fir bhi behtar clarity ke liye images ka size 800x800 px se zyada rakhein!
