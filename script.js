/* =========================
   Hearts Canvas Animation
   ========================= */
const canvas = document.getElementById("hearts");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const hearts = [];
function rand(min, max) { return Math.random() * (max - min) + min; }

function drawHeart(x, y, size, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size, size);
  ctx.globalAlpha = alpha;

  ctx.beginPath();
  // Heart shape path
  ctx.moveTo(0, 0.35);
  ctx.bezierCurveTo(0, 0.15, -0.25, 0, -0.45, 0);
  ctx.bezierCurveTo(-0.8, 0, -0.8, 0.45, -0.8, 0.45);
  ctx.bezierCurveTo(-0.8, 0.75, -0.55, 1.0, 0, 1.2);
  ctx.bezierCurveTo(0.55, 1.0, 0.8, 0.75, 0.8, 0.45);
  ctx.bezierCurveTo(0.8, 0.45, 0.8, 0, 0.45, 0);
  ctx.bezierCurveTo(0.25, 0, 0, 0.15, 0, 0.35);
  ctx.closePath();

  // soft glow fill
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.shadowColor = "rgba(255,255,255,0.45)";
  ctx.shadowBlur = 18;
  ctx.fill();

  ctx.restore();
}

function spawnHeart(burst = false) {
  const count = burst ? 30 : 2;
  for (let i = 0; i < count; i++) {
    hearts.push({
      x: rand(0, canvas.width),
      y: canvas.height + rand(10, 120),
      s: rand(10, 22) / 50,
      vy: rand(0.7, 1.8),
      vx: rand(-0.35, 0.35),
      a: rand(0.35, 0.9),
      rot: rand(-0.03, 0.03),
      t: rand(0, 1000)
    });
  }
}

// steady hearts
setInterval(() => spawnHeart(false), 180);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = hearts.length - 1; i >= 0; i--) {
    const h = hearts[i];
    h.t += 1;
    h.y -= h.vy;
    h.x += h.vx + Math.sin(h.t / 40) * 0.2;
    h.a -= 0.0009;

    drawHeart(h.x, h.y, h.s, Math.max(h.a, 0));

    if (h.y < -60 || h.a <= 0) hearts.splice(i, 1);
  }

  requestAnimationFrame(animate);
}
animate();

/* =========================
   Modals + Buttons
   ========================= */
const openLetter = document.getElementById("openLetter");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");

const successModal = document.getElementById("successModal");
const closeSuccess = document.getElementById("closeSuccess");

const yesBtn = document.getElementById("yesBtn");
const proposal = document.getElementById("proposal");
const pYes = document.getElementById("pYes");
const moreHearts = document.getElementById("moreHearts");

openLetter.addEventListener("click", () => modal.classList.add("show"));
closeModal.addEventListener("click", () => modal.classList.remove("show"));

yesBtn.addEventListener("click", () => {
  proposal.scrollIntoView({ behavior: "smooth", block: "center" });
});

pYes.addEventListener("click", () => {
  successModal.classList.add("show");
  spawnHeart(true);
});

closeSuccess.addEventListener("click", () => successModal.classList.remove("show"));

const ummaMessage = document.getElementById("ummaMessage");

moreHearts.addEventListener("click", () => {
  spawnHeart(true); // keep your heart effect

  ummaMessage.classList.add("show");

  setTimeout(() => {
    ummaMessage.classList.remove("show");
  }, 2200);
});



// click outside modal closes (optional)
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("show");
});
successModal.addEventListener("click", (e) => {
  if (e.target === successModal) successModal.classList.remove("show");
});

/* =========================
   Teasing NO Button (Run Away)
   ========================= */
const pNo = document.getElementById("pNo");
const pBox = document.getElementById("pBox");
const pHint = document.getElementById("pHint");

const teaseLines = [
  "Are you sure? 🥺",
  "Think again 😭",
  "My heart is breaking 💔",
  "No option not available 😤💞",
  "Hehe nice try 😌",
  "Click Yes pls 😭❤️"
];

let teaseIndex = 0;

function moveNo() {
  const box = pBox.getBoundingClientRect();
  const btn = pNo.getBoundingClientRect();

  const pad = 8;
  const maxX = box.width - btn.width - pad;
  const maxY = box.height - btn.height - pad;

  const x = Math.random() * (maxX - pad) + pad;
  const y = Math.random() * (maxY - pad) + pad;

  pNo.style.left = `${x}px`;
  pNo.style.top = `${y}px`;

  pHint.textContent = teaseLines[teaseIndex % teaseLines.length];
  teaseIndex++;
}

pNo.addEventListener("mouseenter", moveNo);
pNo.addEventListener("click", (e) => {
  e.preventDefault();
  moveNo();
});

/* =========================
   YouTube Music Toggle
   ========================= */
/*
  IMPORTANT:
  Replace VIDEO_ID with your song video id.
  Example:
  https://www.youtube.com/watch?v=VIDEO_ID
*/
// =========================
// YouTube Music (Robust)
// =========================
const YT_VIDEO_ID = "kd72ieB82WA";

const toggleMusic = document.getElementById("toggleMusic");

let player = null;
let playerReady = false;
let isPlaying = false;

// Disable until ready (prevents click-too-early issues)
toggleMusic.disabled = true;
toggleMusic.textContent = "⏳ Loading song...";

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player("ytplayer", {
    height: "1",
    width: "1",
    videoId: YT_VIDEO_ID,
    playerVars: {
      autoplay: 0,
      controls: 0,
      playsinline: 1,
      loop: 1,
      playlist: YT_VIDEO_ID
    },
    events: {
      onReady: () => {
        playerReady = true;
        toggleMusic.disabled = false;
        toggleMusic.textContent = "🎵 Play song";
      },
      onError: (e) => {
        console.log("YouTube Player Error:", e.data);
        alert("This YouTube song can't be played on websites (embed blocked). Try another YouTube upload of the same song 😭");
        toggleMusic.disabled = false;
        toggleMusic.textContent = "🎵 Play song";
      }
    }
  });
};

toggleMusic.addEventListener("click", () => {
  if (!player || !playerReady) {
    console.log("Player not ready yet...");
    return;
  }

  if (!isPlaying) {
    player.unMute();
    player.setVolume(50);
    player.playVideo();
    isPlaying = true;
    toggleMusic.textContent = "⏸ Pause song";
  } else {
    player.pauseVideo();
    isPlaying = false;
    toggleMusic.textContent = "🎵 Play song";
  }
});

const giftBox = document.getElementById("giftBox");

if (giftBox) {
  giftBox.addEventListener("click", () => {
    giftBox.classList.add("open");

    // BIG SURPRISE: kisses everywhere
    const count = 28; // increase to 40 if you want more boom

    for (let i = 0; i < count; i++) {
      const kiss = document.createElement("div");
      kiss.className = "kiss";
      kiss.textContent = "😘";

      // Start from center of screen (like burst)
      const startX = window.innerWidth / 2;
      const startY = window.innerHeight / 2;

      kiss.style.left = startX + "px";
      kiss.style.top = startY + "px";

      // Random direction / distance
      const dx = (Math.random() - 0.5) * 900;   // spread width
      const dy = (Math.random() - 0.5) * 700;   // spread height
      const rot = (Math.random() - 0.5) * 120 + "deg";

      kiss.style.setProperty("--dx", dx + "px");
      kiss.style.setProperty("--dy", dy + "px");
      kiss.style.setProperty("--rot", rot);

      // Random size variation (still big)
      kiss.style.fontSize = (38 + Math.random() * 24) + "px";

      document.body.appendChild(kiss);
      setTimeout(() => kiss.remove(), 1800);
    }

    setTimeout(() => giftBox.classList.remove("open"), 450);
  });
}




