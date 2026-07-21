# 📸 Photo Guide — Monsoon Diaries

## Folder Structure

Sabhi photos `images/` folder ke andar rakho:

```
images/
  kid/       → Bachi era (bachpan ki photos)
  bossy/     → Bossy era (confident phase)
  teeth/     → Chulbuli era (smiling/naughty photos)
  saree/     → Saree era (graceful, traditional)
  final/     → Hum Dono (tumhare saath ki photos)
```

## Photo Count Update

Jab bhi naye photos add karo, `config.js` mein `photoCounts` object update karo:

```js
photoCounts: {
  kid: 4,      // images/kid/ mein 4 photos hain (1.jpg to 4.jpg)
  bossy: 5,    // images/bossy/ mein 5 photos hain
  teeth: 2,    // images/teeth/ mein 2 photos hain
  saree: 4,    // images/saree/ mein 4 photos hain
  final: 4     // images/final/ mein 4 photos hain
}
```

## Naming Convention

Photos ka naam sirf numbers mein rakho:
- `1.jpg`, `2.jpg`, `3.jpg`, ...

## Image Tips (Quality)

- **Phone pe acchi dikhne ke liye:** Portrait orientation (vertical) photos zyada achhi lagti hain
- **Compress karo:** https://squoosh.app use karo to compress without quality loss
- **Minimum resolution:** 800×1000px ya usse zyada

## Journey Order

Site pe jo journey dikhegi:
1. 🧸 **Bachi** — kid folder
2. ✨ **Bossy** — bossy folder  
3. 😄 **Chulbuli** — teeth folder
4. 🥻 **Saree** — saree folder
5. 🫂 **Hum Dono** — final folder
6. 💍 **Dream Frame** (auto, koi photo nahi chahiye)

## After Adding Photos

```bash
git add images/
git commit -m "✨ Add new photos"
git push origin main
```

GitHub Pages pe 1-2 minute mein live ho jaayega!
