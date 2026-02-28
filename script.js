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

function goToNextScene(nextIndex) {
  const index = typeof nextIndex === "number" ? nextIndex : currentScene + 1;
  const currentSceneEl = $("#scene-" + currentScene);
  const nextSceneEl = $("#scene-" + index);

  if (!nextSceneEl || index === currentScene) return;

  // Fade out current scene
  if (currentSceneEl) {
    currentSceneEl.classList.add("fade-out");
  }

  // Wait for fade out animation (400ms defined in CSS)
  setTimeout(() => {
    // Hide old scene completely
    if (currentSceneEl) {
      currentSceneEl.classList.remove("active", "fade-out");
    }

    // Prepare and show new scene
    nextSceneEl.classList.add("active");
    currentScene = index;

    // Instantly jump to top securely after the display: block layout calculation completes
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    });

    // Trigger animations if needed
    if (index === 6 && !nextSceneEl.dataset.animated) {
      startTypedLines();
      nextSceneEl.dataset.animated = "true";
    }
    if (index === 7 && !nextSceneEl.dataset.animated) {
      startLoveLetterTypewriter();
      nextSceneEl.dataset.animated = "true";
    }
    if (index === 11 && !nextSceneEl.dataset.animated) {
      startCinematicFinale();
      nextSceneEl.dataset.animated = "true";
    }
  }, 400); // 400ms matches CSS fadeOutScene duration
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

function setupPromises() {
  const wrappers = $$(".promise-flip-wrapper");
  const continueWrapper = $(".promise-continue-wrapper");
  const continueBtn = $("#promise-continue");

  if (!wrappers.length || !document.querySelector('#scene-9')) return;

  const viewedPromises = new Set();

  wrappers.forEach((wrapper) => {
    const flipBtn = $(".promise-flip-btn", wrapper);
    const flipBackBtn = $(".promise-flip-back-btn", wrapper);
    const cardId = wrapper.dataset.card;

    if (flipBtn) {
      flipBtn.addEventListener("click", () => {
        wrapper.classList.add("flipped");
        viewedPromises.add(cardId);

        if (viewedPromises.size === wrappers.length && continueWrapper) {
          continueWrapper.classList.add("continue-visible");
        }
      });
    }

    if (flipBackBtn) {
      flipBackBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        wrapper.classList.remove("flipped");
      });
    }
  });

  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      const next = Number(continueBtn.dataset.next || 10);
      goToNextScene(next);
    });
  }
}

// ============================
// FINAL SCENE (SCENE 11)
// ============================

let finalStarted = false;


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
    if (scene11 && scene11.classList.contains("active") && !isPlaying) {
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
// SCENE 11 - FINAL CINEMATIC ENDING
// ============================

function startCinematicFinale() {
  const pretitle = $(".cine-pretitle");
  const title = $(".cine-title");
  const subtitle = $(".cine-subtitle");
  const paras = $$(".cine-para p");
  const signoff = $(".cine-signoff");

  spawnCinematicHearts();

  // 1. Pretitle: 500ms
  setTimeout(() => {
    if (pretitle) pretitle.classList.add("visible-soft");
  }, 500);

  // 2. Main Heading: 1.2s
  setTimeout(() => {
    if (title) title.classList.add("visible-soft");
  }, 1200);

  // 3. Subheading: 2.0s
  setTimeout(() => {
    if (subtitle) subtitle.classList.add("visible-soft");
  }, 2000);

  // 4. Paragraphs sequentially: Starts at 2.8s, +800ms per line
  setTimeout(() => {
    paras.forEach((p, index) => {
      setTimeout(() => {
        p.classList.add("visible-soft");
      }, index * 800);
    });
  }, 2800);

  // 5. Signoff: 4.0s (after paragraphs start, adjust if paras take longer) 
  // 5 paragraphs * 800 = 4000ms. So 2800 + 4000 = 6800. Let's make it 7.5s total.
  setTimeout(() => {
    if (signoff) signoff.classList.add("visible-soft");
  }, 7500);
}

function spawnCinematicHearts() {
  const container = $("#cinematic-hearts-bg");
  if (!container) return;

  const maxHearts = 20;

  for (let i = 0; i < maxHearts; i++) {
    const heart = document.createElement("div");
    heart.className = "cine-heart-particle";
    heart.innerHTML = `❤️`;

    const left = Math.random() * 100;
    const delay = Math.random() * 10; // Staggered start widely
    const duration = 15 + Math.random() * 20; // Extremely slow (15-35s falling upwards)
    const scale = 0.5 + Math.random() * 1;

    heart.style.left = `${left}vw`;
    heart.style.transform = `scale(${scale})`;
    heart.style.animationDelay = `${delay}s`;
    heart.style.animationDuration = `${duration}s`;

    container.appendChild(heart);
  }
}

// ============================
// INIT
// ============================

window.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0);

  // Clean up any remaining classes and set scene 1 active
  const scenes = $$(".scene");
  scenes.forEach(s => s.classList.remove("active", "fade-out"));

  const scene1 = $("#scene-1");
  if (scene1) scene1.classList.add("active");

  setupLoaderScene();
  setupIdentityScene();
  setupPromises();
  setupMemoryCards();
  setupParticles();
  setupHeartCursor();
  setupNextButtons();
  setupMusic();
});

