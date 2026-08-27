# Brunanburh Word Match

A browser drag-and-drop game for learning the Old English near-synonyms in
*The Battle of Brunanburh*. Each word is dragged onto the image that
illustrates its meaning — several words are true synonyms and share the same
image (e.g. ten different words all mean "warrior").

## Running it

No build step — just open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## How it works

- **Setup screen** — pick how many words to play with (a slider + presets),
  drawn at random from the full pool.
- **Game screen** — drag a word tile onto the image you think matches its
  meaning (or tap a word, then tap an image, as a touch/click-friendly
  alternative). Tap a placed word to send it back to the word bank.
- **Check Answers** — scores the round, then snaps any wrong or unanswered
  word onto its correct image and shows the literal Old English meaning for
  every word. Words you got right yourself are marked solid green; words
  that got auto-corrected show a dashed outline, so a missed round doubles
  as a study pass.
- **Try Again** replays the same word set; **New Words** returns to setup
  for a fresh random draw.

## Replacing the placeholder images

`images/*.svg` are placeholder illustrations (colored cards with an emoji
and a label). To use real images:

1. Replace the file for a concept (e.g. `images/warrior.svg`) with your own
   image, **keeping the same filename**, or
2. Point to a different file by editing the `src` field for that image in
   `words.js` (see the `IMAGES` array at the bottom of the file).

## Word data

All words, their literal senses, and their target image are defined in
`words.js` (`WORD_POOL`). The clusters are drawn from a lexical study of the
poem: Warrior, Battle, Sword, Falling in Battle, King/Ruler, Ship,
Flight/Fleeing, and the "beasts of battle" triad (raven, eagle, wolf).
