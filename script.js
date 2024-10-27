// script.js

let currentNumber, startTime, timer, countdownTimer;
let attempts = 0;
let totalResponseTime = 0;
let responseCount = 0;
let digitCount = 5;
let timeLimit = 10;
let volume = 0.5;
let isPaused = false;

const correctSound = document.getElementById("correctSound");
const incorrectSound = document.getElementById("incorrectSound");

correctSound.volume = volume;
incorrectSound.volume = volume;

function generateRandomNumber() {
  const max = Math.pow(10, digitCount) - 1;
  const min = Math.pow(10, digitCount - 1);
  const number = Math.floor(Math.random() * (max - min + 1) + min).toString();
  document.getElementById("prompt").innerText = `Hva er den digitale roten av tallet: ${number}`;
  startTime = new Date().getTime();
  startTimer();
  return number;
}

function startTimer() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    stopGame();
    alert("Tiden er ute! Spillet er stoppet.");
  }, timeLimit * 1000);
}

function calculateDigitalRoot(number) {
  let sum = 0;
  while (number > 0 || sum > 9) {
    if (number === 0) {
      number = sum;
      sum = 0;
    }
    sum += number % 10;
    number = Math.floor(number / 10);
  }
  return sum;
}

function handleInput(event) {
  if (isPaused) return; // Unngå inputbehandling hvis spillet er pauset

  const userGuess = parseInt(event.target.value);
  const feedback = document.getElementById("feedback");
  const correctAnswer = calculateDigitalRoot(parseInt(currentNumber));
  
  const endTime = new Date().getTime();
  const responseTime = endTime - startTime;

  if (userGuess === correctAnswer) {
    correctSound.play();
    feedback.innerText = "Riktig! Går videre til neste tall.";
    
    document.getElementById("responseTime").innerText = `Svartid: ${Math.round(responseTime)} ms`;
    totalResponseTime += responseTime;
    responseCount++;
    document.getElementById("averageTime").innerText = `Gjennomsnittlig svartid: ${Math.round(totalResponseTime / responseCount)} ms`;
    
    resetGame();
  } else {
    incorrectSound.play();
    feedback.innerText = `Feil! Prøv igjen.`;
    document.getElementById("userGuess").value = ""; // Tøm svarfeltet
  }
}

function resetGame() {
  clearTimeout(timer);
  attempts = 0;
  currentNumber = generateRandomNumber();
  document.getElementById("userGuess").value = "";
}

function startGame() {
  isPaused = false; // Nullstill pause-status
  document.getElementById("pauseButton").innerText = "Pause"; // Sett knappen tilbake til Pause
  document.body.style.backgroundColor = "red";
  document.body.style.color = "black";

  clearInterval(countdownTimer);
  let countdown = 4;
  document.getElementById("feedback").innerText = `Starter om ${countdown}`;
  countdownTimer = setInterval(() => {
    countdown--;
    if (countdown <= 0) {
      clearInterval(countdownTimer);
      document.getElementById("feedback").innerText = "Startet!";
      currentNumber = generateRandomNumber();
    } else {
      document.getElementById("feedback").innerText = `Starter om ${countdown}`;
    }
  }, 1000);
}

function pauseGame() {
  isPaused = !isPaused; // Veksle mellom pauset og gjenopptatt status
  document.getElementById("feedback").innerText = isPaused ? "Spillet er pauset." : "";
  document.body.style.backgroundColor = isPaused ? "yellow" : "red";

  // Oppdater knappeetiketten til "Fortsett" hvis pauset, ellers "Pause"
  document.getElementById("pauseButton").innerText = isPaused ? "Fortsett" : "Pause";

  if (!isPaused) startTimer(); // Hvis gjenopptatt, start timeren igjen
}

function stopGame() {
  clearTimeout(timer);
  clearInterval(countdownTimer);
  document.getElementById("feedback").innerText = "Spillet er stoppet.";
  document.body.style.backgroundColor = "white";
  document.body.style.color = "black";
}

function showInstructions(event) {
  const isShiftPressed = event.shiftKey;
  const instructionsPanel = document.getElementById("instructions-panel");
  const instructionsText = document.getElementById("instructions-text");

  instructionsPanel.style.display = "block";
  instructionsText.readOnly = !isShiftPressed;
}

function closeInstructions() {
  document.getElementById("instructions-panel").style.display = "none";
}

function increaseVolume() {
  volume = Math.min(volume + 0.1, 1);
  correctSound.volume = volume;
  incorrectSound.volume = volume;
}

function decreaseVolume() {
  volume = Math.max(volume - 0.1, 0);
  correctSound.volume = volume;
  incorrectSound.volume = volume;
}

function resetAverageTime() {
  totalResponseTime = 0;
  responseCount = 0;
  document.getElementById("averageTime").innerText = "Gjennomsnittlig svartid: 0 ms";
}

function openSettings() {
  document.getElementById("settings-panel").style.display = "block";
}

function closeSettings() {
  document.getElementById("settings-panel").style.display = "none";
}

function applySettings() {
  const newDigitCount = parseInt(document.getElementById("digitCount").value);
  if (newDigitCount >= 2 && newDigitCount <= 8) {
    digitCount = newDigitCount;
  }

  const bgColor = document.getElementById("bgColor").value;
  document.body.style.backgroundColor = bgColor;

  const fontSize = document.getElementById("fontSize").value;
  document.getElementById("game-container").style.fontSize = `${fontSize}px`;

  timeLimit = parseInt(document.getElementById("timeLimit").value);

  closeSettings();
}