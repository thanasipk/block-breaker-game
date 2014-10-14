// IE 9+
document.addEventListener('DOMContentLoaded', init);

// Canvas parameters
var canvas;
var context;
var canvasHeight = 500;
var canvasWidth  = 800;

// Ball properties
var ballX;
var ballY;
var ballRadius;

//Player start dimensions
var playerHeight = 25;
var playerWidth  = 150;
var playerX = canvasWidth / 2 - playerWidth / 2;
var playerY = canvasHeight - playerHeight;

// Movement speed
var dx;
var dy;

// Other game elements
var currentLevel = 1;
var timer;
var blocks;
var gameoverEl;

// initialize the default parameters
function init() {
  canvas = document.getElementById("gameCanvas");
  context = canvas.getContext('2d');
  canvas.height = canvasHeight;
  canvas.width  = canvasWidth;
  gameoverEl = document.getElementById("gameover");
  startGame();
}

// Common setup before start of every game
function resetGameState() {
  // ball start dimensions
  ballX = 100;
  ballY = 200;
  // 3 rows of blocks
  blocks = [[1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]];
  // hide game over notice
  gameoverEl.style.display = "none";
}

// Start the very first game
function startGame() {
  resetGameState();
  // initial settings
  ballRadius = 15;
  // movement speed
  dx = 5;
  dy = 5;
  // start game timer
  timer = setInterval(draw, 10);
}

// Update the canvas
function draw() {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.beginPath();

  // Draw game objects
  drawBall();
  drawPlayer(); // TODO

  context.closePath();

  // Update game objects
  updateBallAcceleration(dx, dy, 0);
  checkCollision(ballX, ballY);
  updateBallPosition();
  updatePlayerPosition(); //TODO
}

/********* Helper functions *********/

function updatePlayerPosition() {
  // TODO
}

function drawPlayer() {
  // TODO: colour this
  context.fillRect(
    playerX,
    playerY,
    playerWidth,
    playerHeight
  );
}

function drawBall() {
  context.fillStyle = "#00c39c";
  context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  context.fill();
}

/* Update the ball's position. */
function updateBallPosition() {
  ballX += dx;
  ballY += dy;
}

/* Keep the ball within the canvas dimensions. */
function checkCollision(ballX, ballY) {

  // boundary
  if (ballX - ballRadius < 0 || ballX + ballRadius > canvasWidth) {
    dx *= -1;
  }
  if (ballY - ballRadius < 0 || ballY  + ballRadius > canvasHeight) {
    dy *= -1;
  }
}

function gameOver() {
  clearInterval(timer);
  gameoverEl.style.display = "block";
}

/* Needed for second level, when acceleration increases */
function updateBallAcceleration(dx, dy, acceleration_factor) {
	dx += acceleration_factor;
	dy += acceleration_factor;
}
