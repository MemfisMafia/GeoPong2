const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load sound effect
const paddleSound = new Audio('paddle-hit.mp3');

// Game variables
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
let paddleWidth = 10;
let paddleHeight = 100;
let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = canvas.height / 2 - paddleHeight / 2;
let playerScore = 0;
let aiScore = 0;
const winningScore = 15;

// Game loop
function gameLoop() {
  moveEverything();
  drawEverything();
  if (playerScore === winningScore) {
    document.getElementById('message').textContent = 
      "Congratulations! The geocache coordinates are N 28° 14.980 W 082° 38.140";
    return;
  }
  requestAnimationFrame(gameLoop);
}

// Move ball and paddles
function moveEverything() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Bounce off top and bottom
  if (ballY <= 0 || ballY >= canvas.height) ballSpeedY = -ballSpeedY;

  // Bounce off player paddle
  if (
    ballX <= paddleWidth &&
    ballY > playerY &&
    ballY < playerY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX * 1.1;
    ballSpeedY *= 1.1;
    paddleSound.play();
  }

  // Bounce off AI paddle
  if (
    ballX >= canvas.width - paddleWidth &&
    ballY > aiY &&
    ballY < aiY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX * 1.1;
    ballSpeedY *= 1.1;
    paddleSound.play();
  }

  // Ball out of bounds
  if (ballX < 0) {
    aiScore++;
    resetBall();
  }
  if (ballX > canvas.width) {
    playerScore++;
    resetBall();
  }

  // AI movement
  if (aiY + paddleHeight / 2 < ballY) aiY += 6;
  else if (aiY + paddleHeight / 2 > ballY) aiY -= 6;
}

// Reset ball position and speed
function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = ballSpeedX > 0 ? 5 : -5;
  ballSpeedY = Math.random() > 0.5 ? 5 : -5;
}

// Draw ball, paddles, and scores
function drawEverything() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Ball
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
  ctx.fill();

  // Player paddle
  ctx.fillRect(0, playerY, paddleWidth, paddleHeight);

  // AI paddle
  ctx.fillRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight);

  // Scores
  ctx.font = '20px Arial';
  ctx.fillText(`Player: ${playerScore}`, 50, 30);
  ctx.fillText(`AI: ${aiScore}`, canvas.width - 150, 30);
}

// Player movement
document.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  playerY = e.clientY - rect.top - paddleHeight / 2;
});

// Start the game
gameLoop();
