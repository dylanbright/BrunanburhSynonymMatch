(function () {
  "use strict";

  // ---------- state ----------
  let roundWords = [];      // selected words for this round: {oe, lit, image, context, id, placedImage, wasCorrect}
  let roundImages = [];     // distinct IMAGES used this round
  let selectedTileId = null; // id of tile currently selected via click (touch/keyboard fallback)
  let checked = false;

  // ---------- elements ----------
  const setupScreen = document.getElementById("setup-screen");
  const gameScreen = document.getElementById("game-screen");
  const poolSizeEl = document.getElementById("pool-size");
  const rangeEl = document.getElementById("word-count-range");
  const rangeOut = document.getElementById("word-count-out");
  const presetRow = document.getElementById("preset-row");
  const startBtn = document.getElementById("start-btn");

  const imageGrid = document.getElementById("image-grid");
  const wordBank = document.getElementById("word-bank");
  const progressLabel = document.getElementById("progress-label");
  const resultLabel = document.getElementById("result-label");
  const checkBtn = document.getElementById("check-btn");
  const retryBtn = document.getElementById("retry-btn");
  const newWordsBtn = document.getElementById("new-words-btn");

  // ---------- setup screen ----------
  const MAX_WORDS = WORD_POOL.length;
  const MIN_WORDS = Math.min(4, MAX_WORDS);
  const PRESETS = [8, 12, 16, 24, MAX_WORDS].filter((n, i, arr) => n <= MAX_WORDS && arr.indexOf(n) === i);

  poolSizeEl.textContent = MAX_WORDS + " words";
  rangeEl.min = MIN_WORDS;
  rangeEl.max = MAX_WORDS;
  rangeEl.value = Math.min(10, MAX_WORDS);
  rangeOut.textContent = rangeEl.value;

  PRESETS.forEach((n) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "preset-btn";
    b.textContent = n === MAX_WORDS ? "All (" + n + ")" : String(n);
    b.addEventListener("click", () => {
      rangeEl.value = n;
      rangeOut.textContent = n;
      syncPresetActive();
    });
    presetRow.appendChild(b);
  });

  function syncPresetActive() {
    const val = Number(rangeEl.value);
    [...presetRow.children].forEach((b, i) => {
      b.classList.toggle("active", PRESETS[i] === val);
    });
  }

  rangeEl.addEventListener("input", () => {
    rangeOut.textContent = rangeEl.value;
    syncPresetActive();
  });
  syncPresetActive();

  startBtn.addEventListener("click", () => startGame(Number(rangeEl.value)));

  // ---------- helpers ----------
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function imageById(id) {
    return IMAGES.find((im) => im.id === id);
  }

  // ---------- game lifecycle ----------
  function startGame(n) {
    const picked = shuffle(WORD_POOL).slice(0, n);
    roundWords = picked.map((w, i) => ({ ...w, id: i, placedImage: null, wasCorrect: null }));
    const usedImageIds = [...new Set(roundWords.map((w) => w.image))];
    roundImages = shuffle(usedImageIds.map(imageById));

    selectedTileId = null;
    checked = false;

    setupScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    checkBtn.classList.remove("hidden");
    checkBtn.disabled = false;
    retryBtn.classList.add("hidden");
    resultLabel.textContent = "";
    resultLabel.className = "result-label";

    renderAll();
  }

  function resetPlacements() {
    roundWords.forEach((w) => {
      w.placedImage = null;
      w.wasCorrect = null;
    });
    selectedTileId = null;
    checked = false;
    checkBtn.classList.remove("hidden");
    checkBtn.disabled = false;
    retryBtn.classList.add("hidden");
    resultLabel.textContent = "";
    resultLabel.className = "result-label";
    renderAll();
  }

  newWordsBtn.addEventListener("click", () => {
    gameScreen.classList.add("hidden");
    setupScreen.classList.remove("hidden");
  });

  retryBtn.addEventListener("click", resetPlacements);

  // ---------- rendering ----------
  function renderAll() {
    renderImageGrid();
    renderWordBank();
    updateProgressLabel();
  }

  function renderImageGrid() {
    imageGrid.innerHTML = "";
    roundImages.forEach((img) => {
      const zone = document.createElement("div");
      zone.className = "drop-zone";
      zone.dataset.imageId = img.id;
      zone.tabIndex = 0;
      zone.setAttribute("role", "button");
      zone.setAttribute("aria-label", "Drop zone");

      const imgEl = document.createElement("img");
      imgEl.src = img.src;
      imgEl.alt = "";
      imgEl.draggable = false;

      const tray = document.createElement("div");
      tray.className = "zone-tray";
      tray.dataset.imageId = img.id;

      roundWords
        .filter((w) => w.placedImage === img.id)
        .forEach((w) => tray.appendChild(makeTile(w, true)));

      zone.appendChild(imgEl);
      zone.appendChild(tray);

      zone.addEventListener("click", () => handleZoneActivate(img.id));
      zone.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleZoneActivate(img.id);
        }
      });

      imageGrid.appendChild(zone);
    });
  }

  function renderWordBank() {
    wordBank.innerHTML = "";
    roundWords
      .filter((w) => w.placedImage === null)
      .forEach((w) => wordBank.appendChild(makeTile(w, false)));
  }

  function makeTile(word, placed) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "tile" + (placed ? " placed" : "");
    el.dataset.wordId = word.id;

    const label = document.createElement("span");
    label.textContent = word.oe;
    el.appendChild(label);

    if (word.id === selectedTileId) el.classList.add("selected");

    if (checked) {
      el.classList.add("correct");
      if (!word.wasCorrect) el.classList.add("correct-hint");
      const meaning = document.createElement("span");
      meaning.className = "tile-meaning";
      meaning.textContent = word.lit;
      el.appendChild(meaning);
      el.disabled = false; // still clickable to inspect, but placement is locked separately
    }

    el.addEventListener("click", (e) => {
      if (draggedThisPointer) { draggedThisPointer = false; return; }
      onTileActivate(word.id);
    });

    attachDrag(el, word.id);

    return el;
  }

  function onTileActivate(wordId) {
    if (checked) return; // locked after checking until retry
    if (selectedTileId === wordId) {
      selectedTileId = null;
      renderAll();
      return;
    }
    const word = roundWords.find((w) => w.id === wordId);
    if (word.placedImage !== null) {
      // tapping a placed tile sends it back to the bank
      word.placedImage = null;
      selectedTileId = null;
      renderAll();
      return;
    }
    selectedTileId = wordId;
    renderAll();
  }

  function handleZoneActivate(imageId) {
    if (checked) return;
    if (selectedTileId === null) return;
    placeWord(selectedTileId, imageId);
    selectedTileId = null;
  }

  function placeWord(wordId, imageId) {
    const word = roundWords.find((w) => w.id === wordId);
    if (!word) return;
    word.placedImage = imageId;
    renderAll();
  }

  function updateProgressLabel() {
    const placedCount = roundWords.filter((w) => w.placedImage !== null).length;
    progressLabel.textContent = placedCount + " / " + roundWords.length + " placed";
  }

  // ---------- checking ----------
  checkBtn.addEventListener("click", () => {
    checked = true;
    roundWords.forEach((w) => {
      w.wasCorrect = w.placedImage === w.image;
    });
    const correct = roundWords.filter((w) => w.wasCorrect).length;
    const total = roundWords.length;
    resultLabel.textContent = correct + " / " + total + " correct";
    resultLabel.className = "result-label " + (correct === total ? "good" : "bad");

    // snap any wrong or unanswered word onto its correct image
    roundWords.forEach((w) => {
      if (!w.wasCorrect) w.placedImage = w.image;
    });

    checkBtn.classList.add("hidden");
    retryBtn.classList.remove("hidden");

    renderAll();
  });

  // ---------- drag & drop (pointer events, mouse + touch) ----------
  let draggedThisPointer = false; // guards click-after-drag firing a duplicate activate

  function attachDrag(tileEl, wordId) {
    let startX = 0;
    let startY = 0;
    let dragging = false;
    let ghost = null;
    let pointerId = null;

    tileEl.addEventListener("pointerdown", (e) => {
      if (checked) return;
      if (e.button !== undefined && e.button !== 0) return;
      startX = e.clientX;
      startY = e.clientY;
      dragging = false;
      pointerId = e.pointerId;
      draggedThisPointer = false;

      const move = (ev) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (!dragging && Math.hypot(dx, dy) > 6) {
          dragging = true;
          draggedThisPointer = true;
          tileEl.classList.add("dragging");
          ghost = tileEl.cloneNode(true);
          ghost.classList.add("drag-ghost");
          ghost.style.width = tileEl.getBoundingClientRect().width + "px";
          document.body.appendChild(ghost);
        }
        if (dragging && ghost) {
          ghost.style.transform =
            "translate(" + (ev.clientX - 20) + "px," + (ev.clientY - 16) + "px)";
          document.querySelectorAll(".drop-zone.drag-over").forEach((z) =>
            z.classList.remove("drag-over")
          );
          const target = document.elementFromPoint(ev.clientX, ev.clientY);
          const zone = target && target.closest(".drop-zone");
          if (zone) zone.classList.add("drag-over");
        }
      };

      const up = (ev) => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);

        tileEl.classList.remove("dragging");
        document
          .querySelectorAll(".drop-zone.drag-over")
          .forEach((z) => z.classList.remove("drag-over"));

        if (dragging) {
          if (ghost) ghost.remove();
          const target = document.elementFromPoint(ev.clientX, ev.clientY);
          const zone = target && target.closest(".drop-zone");
          const bank = target && target.closest("#word-bank");
          if (zone && !checked) {
            placeWord(wordId, zone.dataset.imageId);
          } else if (bank && !checked) {
            const word = roundWords.find((w) => w.id === wordId);
            if (word) {
              word.placedImage = null;
              renderAll();
            }
          }
        }
        dragging = false;
      };

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
    });
  }
})();
