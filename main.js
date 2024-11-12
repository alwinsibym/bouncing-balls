const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set canvas size to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let balls = [];
let colors = ["orange", "cyan", "lime", "pink", "teal"];
let cursorRadius = 30;
let caughtCounts = { orange: 0, cyan: 0, lime: 0, pink: 0, teal: 0 };
let totalCaught = 0;

let cursor = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: cursorRadius,
};

// Adjust canvas size if the window is resized
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Track cursor position
document.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX;
  cursor.y = e.clientY;
});

class Ball {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dx = Math.random() * 4 - 2;
    this.dy = Math.random() * 4 - 2;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    // Update ball position
    this.x += this.dx;
    this.y += this.dy;

    // Check for collision with canvas borders and reverse direction if needed
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    // Check collision with cursor
    this.checkCollision();

    // Draw the updated ball position
    this.draw();
  }

  checkCollision() {
    let distX = this.x - cursor.x;
    let distY = this.y - cursor.y;
    let distance = Math.sqrt(distX * distX + distY * distY);

    // If the ball is close enough to the cursor, count it as "caught"
    if (distance < this.radius + cursor.radius) {
      caughtCounts[this.color]++;
      totalCaught++;
      updateInfoBox();
      this.respawn();
    }
  }

  respawn() {
    // Move the ball to a new random position
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.dx = Math.random() * 4 - 2;
    this.dy = Math.random() * 4 - 2;
  }
}

function updateInfoBox() {
  // Update displayed counts of caught balls
  document.getElementById("totalCaught").innerText = totalCaught;
  document.getElementById("orangeCaught").innerText = caughtCounts.orange;
  document.getElementById("cyanCaught").innerText = caughtCounts.cyan;
  document.getElementById("limeCaught").innerText = caughtCounts.lime;
  document.getElementById("pinkCaught").innerText = caughtCounts.pink;
  document.getElementById("tealCaught").innerText = caughtCounts.teal;
}

function init() {
  // Initialize the balls array with randomly placed balls
  for (let i = 0; i < 15; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let color = colors[Math.floor(Math.random() * colors.length)];
    balls.push(new Ball(x, y, 20, color));
  }
}

function animate() {
  // Clear the canvas for each new frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update each ball's position and draw it
  balls.forEach((ball) => ball.update());

  // Draw the cursor
  ctx.beginPath();
  ctx.arc(cursor.x, cursor.y, cursor.radius, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();

  // Repeat this function to keep animating
  requestAnimationFrame(animate);
}

// Start the animation
init();
animate();
