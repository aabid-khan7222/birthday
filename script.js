// ============================
// UTILITIES
// ============================

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) =>
  Array.from(scope.querySelectorAll(selector));

// ============================
// SCENE MANAGEMENT
// ============================

let currentScene = 1;

function setupIntersectionObserver() {
  const scenes = $$(".scene");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.25
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        const sceneIndex = Number(entry.target.dataset.scene);
        currentScene = Math.max(currentScene, sceneIndex);

        if (sceneIndex === 6 && !entry.target.dataset.animated) {
          startTypedLines();
          entry.target.dataset.animated = "true";
        }
        if (sceneIndex === 7 && !entry.target.dataset.animated) {
          startLoveLetterTypewriter();
          entry.target.dataset.animated = "true";
        }
        if (sceneIndex === 11 && !entry.target.dataset.animated) {
          startFinalScene();
          startConfetti();
          startHeartRain();
          entry.target.dataset.animated = "true";
        }
      }
    });
  }, observerOptions);

  scenes.forEach(scene => observer.observe(scene));
}

function goToNextScene(nextIndex) {
  const index = typeof nextIndex === "number" ? nextIndex : currentScene + 1;
  const nextSceneEl = $("#scene-" + index);
  if (nextSceneEl) {
    nextSceneEl.scrollIntoView({ behavior: 'smooth' });
  }
}

// ============================
// LOADER (SCENE 1) AUTO ADVANCE
// ============================

function setupLoaderScene() {
  // Total loader sequence ~5.5s, then fade to scene 2
  setTimeout(() => {
    goToNextScene(2);
  }, 5500);
}

// ============================
// IDENTITY CHECK (SCENE 3)
// ============================

function setupIdentityScene() {
  const buttons = $$(".btn-option");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Clear previous selection
      buttons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");

      const identity = btn.dataset.identity;

      // Tiny personalised detail for console (debug only)
      console.info(`Identity confirmed: ${identity} (aka Universal Butkii)`); // eslint-disable-line no-console

      // Soft delay for card zoom-out effect via CSS animation class
      const card = btn.closest(".card");
      if (card) {
        card.style.animation = "softPopIn 600ms ease forwards";
      }

      setTimeout(() => {
        const next = Number(btn.dataset.next || 4);
        goToNextScene(next);
      }, 700);
    });
  });
}

// ============================
// TYPED LINES (SCENE 6)
// ============================

let typedStarted = false;

function startTypedLines() {
  if (typedStarted) return;
  typedStarted = true;

  const lines = $$(".typed-line", $("#scene-6"));
  const nextBtn = $(".typed-next", $("#scene-6"));
  const typingDelay = 1000;

  lines.forEach((line, index) => {
    setTimeout(() => {
      line.style.transition = "opacity 800ms ease, transform 800ms ease";
      line.style.opacity = "1";
      line.style.transform = "translateY(0)";
    }, index * typingDelay);
  });

  setTimeout(() => {
    if (!nextBtn) return;
    nextBtn.style.transition = "opacity 900ms ease, transform 900ms ease";
    nextBtn.style.opacity = "1";
    nextBtn.style.transform = "translateY(0)";
  }, lines.length * typingDelay + 500);
}

// ============================
// LOVE LETTER TYPEWRITER (SCENE 7)
// ============================

let loveLetterStarted = false;

function startLoveLetterTypewriter() {
  if (loveLetterStarted) return;
  loveLetterStarted = true;

  const el = $("#love-letter");
  if (!el) return;

  const fullText = el.textContent.trim();
  el.textContent = "";

  let index = 0;
  const speed = 40;

  const tick = () => {
    if (index <= fullText.length) {
      el.textContent = fullText.slice(0, index);
      index += 1;
      requestAnimationFrame(() => setTimeout(tick, speed));
    }
  };

  setTimeout(tick, 300);
}

// ============================
// PROMISES (SCENE 9)
// ============================

const promiseCopy = {
  home:
    "One day, my Butkii, we will build a little world of our own. A warm home filled with your laughter, sleepy hugs, and silly arguments that always end with you in my arms.",
  trips:
    "Every city, every beach, every random chai stop — I promise, I’ll keep choosing places where your eyes shine more than the view, and where our memories feel bigger than the destination.",
  dreams:
    "Your dreams are my mission now. Big ones, tiny ones, even the ridiculous ‘what if’ ones — I’ll be there, cheering, pushing, holding you when it’s hard, celebrating you when it works.",
  forever:
    "In every version of tomorrow I can imagine, there is you — my Alfiya, my Butkii, my Puchukudii, my Kuchupuchuu — always next to me, slightly annoyed but deeply loved, for as long as this life lets me.",
};

function setupPromises() {
  const cards = $$(".promise-card");
  const modal = $("#promise-modal");
  const modalTitle = $("#modal-title");
  const modalText = $("#modal-text");
  const closeBtn = $("#modal-close");
  const nextBtn = $("#modal-next");

  function openModal(kind, title) {
    if (!modal || !modalTitle || !modalText) return;
    modalTitle.textContent = title || "";
    modalText.textContent = promiseCopy[kind] || "";
    modal.classList.add("active");
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("active");
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const kind = card.dataset.promise;
      const title = card.dataset.title;
      openModal(kind, title);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      closeModal();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      closeModal();
      const next = Number(nextBtn.dataset.next || 10);
      goToNextScene(next);
    });
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }
}

// ============================
// FINAL SCENE (SCENE 11)
// ============================

let finalStarted = false;

function startFinalScene() {
  if (finalStarted) return;
  finalStarted = true;

  const seq1 = $(".seq-1", $("#scene-11"));
  const seq2 = $(".seq-2", $("#scene-11"));
  const seq3 = $(".seq-3", $("#scene-11"));
  const seqGroup = $(".seq-final-group", $("#scene-11"));
  const finalWish = $(".zoom-in-text", $("#scene-11"));

  // 1. "Alfiya..."
  setTimeout(() => {
    if (seq1) seq1.classList.add("visible");
  }, 1000);

  // 1.5s pause, then hide "Alfiya..." and show "On this beautiful day..."
  setTimeout(() => {
    if (seq1) {
      seq1.classList.remove("visible");
      seq1.classList.add("hidden");
    }
    if (seq2) seq2.classList.add("visible");
  }, 2500 + 1500); // 1s start + 1.5s visible + 1.5s pause

  // 2s pause, hide seq2, show seq3 "You are my peace..."
  setTimeout(() => {
    if (seq2) {
      seq2.classList.remove("visible");
      seq2.classList.add("hidden");
    }
    if (seq3) seq3.classList.add("visible");
  }, 5500 + 2000); // previous total + 2s

  // Show final group
  setTimeout(() => {
    if (seq3) {
      seq3.classList.remove("visible");
      seq3.classList.add("hidden");
    }
    if (seqGroup) {
      seqGroup.classList.add("visible");
      if (finalWish) finalWish.classList.add("visible"); // triggers cinematic zoom
    }
  }, 11500 + 3500); // Accounts for all paragraphs in seq3 fading in
}

// ============================
// BACKGROUND MUSIC
// ============================

function setupMusic() {
  const audio = $("#bg-music");
  const toggle = $("#music-toggle");
  if (!audio || !toggle) return;

  let isPlaying = false;

  function play() {
    audio
      .play()
      .then(() => {
        isPlaying = true;
        toggle.classList.remove("off");
      })
      .catch(() => {
        // Ignore autoplay restrictions
      });
  }

  function pause() {
    audio.pause();
    isPlaying = false;
    toggle.classList.add("off");
  }

  toggle.addEventListener("click", () => {
    if (isPlaying) pause();
    else play();
  });

  // Small nudge: auto-try when entering scene 11
  const observer = new MutationObserver(() => {
    const scene11 = $("#scene-11");
    if (scene11 && scene11.classList.contains("is-visible") && !isPlaying) {
      play();
    }
  });

  observer.observe(document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: ["class"],
  });
}

// ============================
// PARTICLES
// ============================

function setupParticles() {
  const container = $(".particles");
  if (!container) return;

  const particleCount = 45;

  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";

    const left = Math.random() * 100;
    const delay = Math.random() * 10;
    const duration = 18 + Math.random() * 10;
    const size = 4 + Math.random() * 5;

    particle.style.left = `${left}vw`;
    particle.style.bottom = "-20px";
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;

    container.appendChild(particle);
  }
}

// ============================
// HEART CURSOR
// ============================

function setupHeartCursor() {
  const cursor = $(".heart-cursor");
  if (!cursor) return;

  const move = (event) => {
    const { clientX, clientY } = event;
    cursor.style.transform = `translate(${clientX}px, ${clientY}px)`;

    // Create a soft trailing dot occasionally
    if (Math.random() < 0.4) {
      const trail = cursor.cloneNode(true);
      trail.classList.add("trail");
      document.body.appendChild(trail);
      trail.style.transform = `translate(${clientX}px, ${clientY}px)`;
      setTimeout(() => trail.remove(), 650);
    }
  };

  document.addEventListener("mousemove", move);
}

// ============================
// CONFETTI
// ============================

function startConfetti() {
  const container = $("#confetti-container");
  if (!container) return;

  const colors = [
    "#ff85c2",
    "#ffb3e6",
    "#fff0f8",
    "#ffe066",
    "#a8e6ff",
  ];

  const pieces = 120;

  for (let i = 0; i < pieces; i += 1) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";

    const left = Math.random() * 100;
    const xOffset = `${(Math.random() - 0.5) * 40}vw`;
    const delay = Math.random() * 2.5;
    const duration = 3 + Math.random() * 2.2;
    const color = colors[Math.floor(Math.random() * colors.length)];

    piece.style.left = `${left}vw`;
    piece.style.setProperty("--x-offset", xOffset);
    piece.style.background = color;
    piece.style.animationDelay = `${delay}s`;
    piece.style.animationDuration = `${duration}s`;

    container.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, (delay + duration + 0.5) * 1000);
  }
}

// ============================
// MEMORY CARDS (SCENE 10)
// ============================

function setupMemoryCards() {
  const flipBtns = $$(".memory-flip-btn-integrated");
  const flipBackBtns = $$(".memory-flip-back-btn");
  const continueWrapper = $(".continue-wrapper");
  const flippedCards = new Set();

  flipBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cardWrapper = btn.closest(".memory-card-wrapper");
      const card = $(".memory-card", cardWrapper);
      const cardId = cardWrapper.dataset.card;

      if (!card.classList.contains("flipped")) {
        card.classList.add("flipped");

        flippedCards.add(cardId);

        if (flippedCards.size === 4 && continueWrapper) {
          setTimeout(() => {
            continueWrapper.classList.add("continue-visible");
          }, 800); // Wait for the last flip to finish
        }
      }
    });
  });

  flipBackBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const cardWrapper = btn.closest(".memory-card-wrapper");
      const card = $(".memory-card", cardWrapper);

      if (card.classList.contains("flipped")) {
        card.classList.remove("flipped");
      }
    });
  });
}

// ============================
// HEART RAIN
// ============================

function startHeartRain() {
  const container = $("#heart-rain-container");
  if (!container) return;

  const pieces = 30; // Very low density so it's not chaotic

  for (let i = 0; i < pieces; i += 1) {
    const heart = document.createElement("div");
    heart.className = "heart-particle";
    heart.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

    const left = Math.random() * 100;
    const delay = Math.random() * 15; // Staggered start widely
    const duration = 15 + Math.random() * 15; // Extremely slow (15-30s falling)
    const size = 15 + Math.random() * 20; // Varying sizes for depth

    heart.style.left = `${left}vw`;
    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;
    heart.style.animationDelay = `${delay}s`;
    heart.style.animationDuration = `${duration}s`;

    container.appendChild(heart);
  }
}

// ============================
// GLOBAL NEXT BUTTONS
// ============================

function setupNextButtons() {
  const buttons = $$(".next-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = Number(btn.dataset.next || currentScene + 1);
      goToNextScene(next);
    });
  });
}

// ============================
// INIT
// ============================

window.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0);
  setupIntersectionObserver();
  setupLoaderScene();
  setupIdentityScene();
  setupPromises();
  setupMemoryCards();
  setupParticles();
  setupHeartCursor();
  setupNextButtons();
  setupMusic();
});

