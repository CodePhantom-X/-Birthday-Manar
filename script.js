const CONFIG = {
  name: "منار",
  englishName: "Manar",
  age: 21,
  targetMonth: 6,
  targetDay: 8,
  targetHour: 0,
  targetMinute: 0,
  typingSpeed: 46,
  message: `كل عام وأنت مصدر النور والفرح لحياتي.
يوم ميلادك ليس مجرد يوم عادي، بل هو ميلاد للأيام الحلوة.
أتمنى أن يحمل عامك الجديد كل ما تتمناه،
وأن تبقى دائمًا الابتسامة التي تضيء عالمي.
سنة مليئة بالحب والنجاح ❤️`
};

const state = {
  celebrated: false,
  particles: [],
  fireworks: [],
  mouseX: window.innerWidth / 2,
  mouseY: window.innerHeight / 2
};

const el = {
  splash: document.getElementById("splash"),
  giftScene: document.getElementById("giftScene"),
  birthdayScene: document.getElementById("birthdayScene"),
  openGiftBtn: document.getElementById("openGiftBtn"),
  countdownPanel: document.getElementById("countdownPanel"),
  messagePanel: document.getElementById("messagePanel"),
  typedMessage: document.getElementById("typedMessage"),
  finalTitle: document.getElementById("finalTitle"),
  floatingLayer: document.getElementById("floatingLayer"),
  profileImage: document.getElementById("profileImage"),
  portraitFallback: document.getElementById("portraitFallback"),
  birthdayMusic: document.getElementById("birthdayMusic"),
  playMusicBtn: document.getElementById("playMusicBtn"),
  stopMusicBtn: document.getElementById("stopMusicBtn"),
  shareBtn: document.getElementById("shareBtn"),
  replayBtn: document.getElementById("replayBtn"),
  cursorGlow: document.getElementById("cursorGlow"),
  nameTitle: document.querySelector(".arabic-name"),
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};

const starCanvas = document.getElementById("starCanvas");
const starCtx = starCanvas.getContext("2d");
const fxCanvas = document.getElementById("fxCanvas");
const fxCtx = fxCanvas.getContext("2d");
let stars = [];
let countdownTimer;

window.addEventListener("load", () => {
  setTimeout(() => el.splash.classList.add("is-hidden"), 850);
});

function getBirthdayTarget() {
  const now = new Date();
  const target = new Date(now.getFullYear(), CONFIG.targetMonth, CONFIG.targetDay, CONFIG.targetHour, CONFIG.targetMinute, 0, 0);
  return target;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function resizeCanvases() {
  const ratio = window.devicePixelRatio || 1;
  [starCanvas, fxCanvas].forEach((canvas) => {
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
  });

  stars = Array.from({ length: Math.min(180, Math.floor(window.innerWidth / 7)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.8 + 0.4,
    speed: Math.random() * 0.35 + 0.08,
    alpha: Math.random() * 0.6 + 0.25
  }));
}

function drawStars() {
  starCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  stars.forEach((star) => {
    star.y += star.speed;
    star.x += Math.sin(star.y * 0.01) * 0.08;
    if (star.y > window.innerHeight + 5) {
      star.y = -5;
      star.x = Math.random() * window.innerWidth;
    }
    starCtx.beginPath();
    starCtx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    starCtx.shadowColor = "rgba(255, 214, 117, 0.75)";
    starCtx.shadowBlur = 12;
    starCtx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    starCtx.fill();
  });
  requestAnimationFrame(drawStars);
}

function createFirework(x = Math.random() * window.innerWidth, y = Math.random() * window.innerHeight * 0.48 + 40) {
  const palette = ["#ffd675", "#ff69c9", "#8d5cff", "#76fff4", "#ffffff"];
  for (let i = 0; i < 58; i += 1) {
    const angle = (Math.PI * 2 * i) / 58;
    const speed = Math.random() * 4.5 + 2.2;
    state.fireworks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 90,
      color: palette[Math.floor(Math.random() * palette.length)]
    });
  }
}

function createConfetti() {
  const palette = ["#ffd675", "#ff69c9", "#8d5cff", "#76fff4", "#ffffff"];
  for (let i = 0; i < 180; i += 1) {
    state.particles.push({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * 200,
      w: Math.random() * 9 + 5,
      h: Math.random() * 15 + 7,
      vx: Math.random() * 2 - 1,
      vy: Math.random() * 3 + 2,
      rot: Math.random() * Math.PI,
      vr: Math.random() * 0.22 - 0.11,
      life: 260,
      color: palette[Math.floor(Math.random() * palette.length)]
    });
  }
}

function drawEffects() {
  fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  state.fireworks = state.fireworks.filter((p) => p.life > 0);
  state.fireworks.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.045;
    p.life -= 1;
    fxCtx.globalAlpha = Math.max(p.life / 90, 0);
    fxCtx.fillStyle = p.color;
    fxCtx.shadowColor = p.color;
    fxCtx.shadowBlur = 18;
    fxCtx.beginPath();
    fxCtx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
    fxCtx.fill();
  });

  state.particles = state.particles.filter((p) => p.life > 0 && p.y < window.innerHeight + 70);
  state.particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life -= 1;
    fxCtx.globalAlpha = Math.min(p.life / 80, 1);
    fxCtx.save();
    fxCtx.translate(p.x, p.y);
    fxCtx.rotate(p.rot);
    fxCtx.fillStyle = p.color;
    fxCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    fxCtx.restore();
  });

  fxCtx.globalAlpha = 1;
  fxCtx.shadowBlur = 0;
  requestAnimationFrame(drawEffects);
}

function startCountdown() {
  const target = getBirthdayTarget();

  const tick = () => {
    const remaining = Math.max(0, target - new Date());
    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    el.days.textContent = pad(days);
    el.hours.textContent = pad(hours);
    el.minutes.textContent = pad(minutes);
    el.seconds.textContent = pad(seconds);

    if (remaining <= 0) {
      clearInterval(countdownTimer);
      celebrate();
    }
  };

  tick();
  countdownTimer = setInterval(tick, 1000);
}

function typeMessage(text) {
  el.typedMessage.textContent = "";
  el.typedMessage.classList.remove("is-done");
  let index = 0;

  const write = () => {
    el.typedMessage.textContent = text.slice(0, index);
    index += 1;

    if (index <= text.length) {
      setTimeout(write, CONFIG.typingSpeed);
      return;
    }

    el.typedMessage.classList.add("is-done");
    setTimeout(() => el.finalTitle.classList.add("is-visible"), 650);
  };

  write();
}

function createFloatingItem(type) {
  const item = document.createElement("span");
  item.className = type;
  item.style.left = `${Math.random() * 100}%`;
  item.style.setProperty("--dur", `${Math.random() * 4 + 6}s`);
  item.style.setProperty("--drift", `${Math.random() * 160 - 80}px`);
  item.style.setProperty("--rot", `${Math.random() * 90 - 45}deg`);

  if (type === "balloon") {
    const colors = ["#ffd675", "#ff69c9", "#8d5cff", "#76fff4"];
    item.style.setProperty("--c", colors[Math.floor(Math.random() * colors.length)]);
  } else {
    item.textContent = type === "heart" ? "❤️" : "✦";
    item.style.setProperty("--size", `${Math.random() * 20 + 20}px`);
  }

  el.floatingLayer.appendChild(item);
  setTimeout(() => item.remove(), 10500);
}

function celebrate() {
  if (state.celebrated) return;
  state.celebrated = true;
  el.countdownPanel.style.display = "none";
  el.messagePanel.classList.add("is-visible");
  el.nameTitle.classList.add("shake");
  createConfetti();
  playMusic();
  typeMessage(CONFIG.message);

  for (let i = 0; i < 7; i += 1) {
    setTimeout(() => createFirework(), i * 360);
  }

  const floatingBurst = setInterval(() => {
    createFloatingItem("balloon");
    createFloatingItem("heart");
    createFloatingItem("sparkle");
  }, 260);

  setTimeout(() => clearInterval(floatingBurst), 7000);
}

function replayCelebration() {
  state.celebrated = false;
  state.fireworks = [];
  state.particles = [];
  el.finalTitle.classList.remove("is-visible");
  el.typedMessage.textContent = "";
  el.typedMessage.classList.remove("is-done");
  el.messagePanel.classList.remove("is-visible");
  setTimeout(celebrate, 120);
}

function revealBirthdayScene() {
  const flash = document.createElement("div");
  flash.className = "transition-flash";
  document.body.appendChild(flash);

  setTimeout(() => {
    el.giftScene.classList.remove("is-active");
    el.birthdayScene.classList.add("is-active");
    document.querySelectorAll(".profile-panel, .countdown-panel").forEach((node, index) => {
      setTimeout(() => node.classList.add("is-visible"), index * 170);
    });
    startCountdown();
  }, 520);

  setTimeout(() => flash.remove(), 1100);
}

function playMusic() {
  el.birthdayMusic.play().catch(() => {
    el.playMusicBtn.classList.add("needs-click");
  });
}

function stopMusic() {
  el.birthdayMusic.pause();
  el.birthdayMusic.currentTime = 0;
}

async function sharePage() {
  const data = {
    title: "Happy Birthday Manar",
    text: "احتفال عيد ميلاد منار",
    url: window.location.href
  };

  if (navigator.share) {
    await navigator.share(data).catch(() => {});
    return;
  }

  await navigator.clipboard?.writeText(window.location.href);
  el.shareBtn.textContent = "✓";
  setTimeout(() => { el.shareBtn.textContent = "↗"; }, 1200);
}

function wireEvents() {
  el.openGiftBtn.addEventListener("click", revealBirthdayScene);
  el.playMusicBtn.addEventListener("click", playMusic);
  el.stopMusicBtn.addEventListener("click", stopMusic);
  el.replayBtn.addEventListener("click", replayCelebration);
  el.shareBtn.addEventListener("click", sharePage);

  el.profileImage.addEventListener("error", () => {
    el.profileImage.style.display = "none";
    el.portraitFallback.style.display = "grid";
  });

  window.addEventListener("mousemove", (event) => {
    state.mouseX = event.clientX;
    state.mouseY = event.clientY;
    el.cursorGlow.style.left = `${state.mouseX}px`;
    el.cursorGlow.style.top = `${state.mouseY}px`;
    el.cursorGlow.style.opacity = "1";
    document.documentElement.style.setProperty("--x", `${(state.mouseX / window.innerWidth) * 100}%`);
    document.documentElement.style.setProperty("--y", `${(state.mouseY / window.innerHeight) * 100}%`);
  });

  window.addEventListener("resize", resizeCanvases);
  window.addEventListener("scroll", () => {
    const offset = window.scrollY * 0.04;
    document.querySelector(".aurora").style.transform = `translateY(${offset}px) scale(1.04)`;
  }, { passive: true });
}

resizeCanvases();
drawStars();
drawEffects();
wireEvents();
