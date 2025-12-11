window.addEventListener("DOMContentLoaded", () => {

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  let xp = 0;
  let throwsCount = 0;
  let ball = null;
  let pins = [];
  const PIN_RADIUS = 10;
  const gravity = 0.2;
  const friction = 0.99;

  // Bowling top görseli
  const ballImg = new Image();
  ballImg.src = "bowling.png"; // repoda olmalı

  // Pinler için daire kullanıyoruz
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

  function throwBall() {
    if (ball) return; // top zaten hareket ediyorsa tekrar atılmasın

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

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Top hareketi ve çizimi
    if (ball) {
      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.vy += gravity;

      ctx.drawImage(ballImg, ball.x - ball.r, ball.y - ball.r, ball.r*2, ball.r*2);

      if (ball.x > canvas.width || ball.y > canvas.height) {
        ball = null;
      }
    }

    // Pinlerin hareketi ve çarpışma
    pins.forEach(pin => {
      const dx = pin.x - (ball?.x ?? -999);
      const dy = pin.y - (ball?.y ?? -999);
      const dist = Math.sqrt(dx*dx + dy*dy);

      if (ball && !pin.fallen && dist < PIN_RADIUS + ball.r) {
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

      ctx.fillStyle = pin.fallen ? "#555" : "#fff";
      ctx.beginPath();
      ctx.arc(pin.x, pin.y, PIN_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(update);
  }

  // Throw butonu
  document.getElementById("throwBtn")
    .addEventListener("click", throwBall);

  // Wallet bağlama simülasyonu (demo)
  document.getElementById("connectWallet")
    .addEventListener("click", () => {
      alert("Wallet connected! (demo)");
    });

  createPins();
  update();
});
