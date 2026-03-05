// DOM
const board = document.getElementById("board");
const movesText = document.getElementById("moves");
const timeText = document.getElementById("time");
const recordText = document.getElementById("record");
const win = document.getElementById("win");
const levelText = document.getElementById("level");

// Lista de emojis (puedes agregar más)
const emojis = ["🐶","🐱","🐸","🦊","🐼","🐵","🐷","🐯","🐰","🦁","🐔","🐤","🐙","🦄","🐞","🐢","🦋","🦑","🦀","🐳","🐺"];

// 🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐻‍❄️ 🐨 🐯 🦁 🐮 🐷 🐽 🐸 🐵 🙈 🙉 🙊 🐒 🐔 🐧 🐦 🐤 🐣 🐥 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🪱 🐛 🦋 🐌 🐞 🐜 🦟 🦗 🕷 🕸 🦂 🐢 🐍 🦎 🦖 🦕 🐙 🦑 🦐 🦞 🦀 🐡 🐠 🐟 🐬 🐳 🐋 🦈 🐊 🐅 🐆 🦓 🦍 🦧 🦣 🐘 🦛 🦏 🐪 🐫 🦒 🦘 🐃 🐂 🐄 🐎 🐖 🐏 🐑 🦙 🐐 🦌 🐕 🐩 🦮 🐕‍🦺 🐈 🐈‍⬛ 🐓 🦃 🦚 🦜 🦢 🦩 🕊 🐇 🦝 🦨 🦡 🦦 🦦 🦥 🐁 🐀 🐿 🦔

// Colores para los pares (primer y segundo)
const pairColors = ["#123","#123"];

// Colores de fondo por nivel
const levelColors = ["#764ba2","#667eea","#ff6b6b","#f7b32b","#6bcf70","#ff4f81","#00d4ff","#ff9f1c","#8e44ad","#2ecc71"];

let first = null, second = null, lock = false;
let moves = 0, time = 0, timer;
let level = 1;

// Inicia el juego
function startGame(resetLevel = false) {
  if (resetLevel) level = 1;
  levelText.textContent = level;
  win.style.display = "none";
  moves = 0;
  time = 0;
  movesText.textContent = moves;
  timeText.textContent = time;
  clearInterval(timer);
  timer = setInterval(() => { time++; timeText.textContent = time; }, 1000);

  // Fondo dinámico por nivel
  document.body.style.background = levelColors[(level - 1) % levelColors.length];

  board.innerHTML = "";

  // Número de pares según nivel (niveles infinitos)
  const pairs = 2 + level;
  const selected = [];
  for (let i = 0; i < pairs; i++) {
    selected.push(emojis[i % emojis.length]); // repite emojis si se acaban
  }

  // Crear cartas con fondo distinto por par
  const cards = [];
  selected.forEach(emoji => {
    cards.push({emoji: emoji, color: pairColors[0]}); // primer par
    cards.push({emoji: emoji, color: pairColors[1]}); // segundo par
  });

  // Mezclar cartas
  cards.sort(() => 0.5 - Math.random());

  // Insertar cartas en el DOM
  cards.forEach(cardData => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.emoji = cardData.emoji;
    card.innerHTML = `
      <div class="face front" style="background:${cardData.color}"></div>
      <div class="face back">${cardData.emoji}</div>
    `;
    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });
}

// Girar carta
function flipCard() {
  if (lock) return;
  if (this.classList.contains("flip")) return;
  this.classList.add("flip");
  if (!first) { first = this; return; }
  second = this;
  moves++;
  movesText.textContent = moves;
  checkMatch();
}

// Revisar coincidencia
function checkMatch() {
  if (first.dataset.emoji === second.dataset.emoji) {
    first.removeEventListener("click", flipCard);
    second.removeEventListener("click", flipCard);
    resetTurn();
    checkWin();
  } else {
    lock = true;
    setTimeout(() => {
      first.classList.remove("flip");
      second.classList.remove("flip");
      resetTurn();
    }, 800);
  }
}

function resetTurn() {
  [first, second] = [null, null];
  lock = false;
}

// Revisar si ganó el nivel
function checkWin() {
  if (document.querySelectorAll(".flip").length === board.children.length) {
    clearInterval(timer);
    saveRecord();
    win.style.display = "block";
  }
}

function nextLevel() {
  level++;
  startGame();
}

// Guardar récord
function saveRecord() {
  const best = localStorage.getItem("memoryEmojiRecord");
  if (!best || time < best) localStorage.setItem("memoryEmojiRecord", time);
  recordText.textContent = localStorage.getItem("memoryEmojiRecord");
}

// Mostrar récord al inicio
recordText.textContent = localStorage.getItem("memoryEmojiRecord") || "--";

// Registrar Service Worker (requiere servidor local o HTTPS)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js")
    .then(() => console.log("Service Worker registrado"))
    .catch(err => console.log("Error SW:", err));
}

// Iniciar primer nivel
startGame(true);
