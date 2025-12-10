const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let xp = 0;
let throwsCount = 0;

// 🎳 Ball
let ball = null;

// 🧴 Pins
let pins = [];
const PIN_RADIUS = 10;

// Physics
const gravity = 0.2;
const friction = 0.99;

// Create pins (triangle)
function createPins() {
  pins = [];
  let startX = 420;
  let startY = 200;
  let rows = 4;
  let gap = 26;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c <= r; c++) {
      pins.push({
        x: startX + c * gap - r * gap / 2,
        y: startY + r * gap,
        vx: 0,
        vy: 0,
        fallen: false
      });
    }
  }
}

// Create ball
function throwBall() {
  if (ball) return;

  ball = {
    x: 80,
    y: 320,
    vx: 8,
    vy: -1,
    r: 12
  };

  throwsCount++;
  document.getElementById("throws").textContent = throwsCount;
}

// Collision
function collide(ball, pin) {
  const dx = pin.x - ball.x;
  const dy = pin.y - ball.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return dist < pin.r + ball.r;
}

// Update physics
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Ball movement
  if (ball) {
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vy += gravity;

    // Draw ball
    ctx.fillStyle = "#f1c40f";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();

    // Remove ball if out
    if (ball.x > canvas.width || ball.y > canvas.height) {
      ball = null;
    }
  }

  // Pins
  pins.forEach(pin => {
    if (ball && !pin.fallen && collide(ball, { ...pin, r: PIN_RADIUS })) {
      pin.vx = ball.vx * 0.6;
      pin.vy = -4;
      pin.fallen = true;
      xp += 10;
      document.getElementById("xp").textContent = xp;
    }

    pin.vy += gravity;
    pin.x += pin.vx;
    pin.y += pin.vy;

    pin.vx *= friction;
    pin.vy *= friction;

    // Draw pin
    ctx.fillStyle = pin.fallen ? "#555" : "#ffffff";
    ctx.beginPath();
    ctx.arc(pin.x, pin.y, PIN_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(update);
}

// Button
document.getElementById("throwBtn").addEventListener("click", throwBall);

// Init
createPins();
update();
