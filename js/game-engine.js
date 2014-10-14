// IE 9+
document.addEventListener('DOMContentLoaded', init);

// Canvas parameters
var canvas;
var context;

// Ball object
function Ball(x, y, radius) {
  this.startX = this.x = x;
  this.startY = this.y = y;
  this.radius = radius;
  this.speedX = 5;
  this.speedY = 5;
}

Ball.prototype = {
  reset: function () {
    this.x = this.startX;
    this.y = this.startY;
  },
  draw: function () {
    context.fillStyle = "#00c39c";
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
  },
  updatePosition: function () {
    this.x += this.speedX;
    this.y += this.speedY;
  },
  updateSpeed: function (acceleration_factor) {
    if (this.speedX > 0) {
      this.speedX += acceleration_factor;
    } else {
      this.speedX -= acceleration_factor;
    }
    if (this.speedX > 0) {
      this.speedY += acceleration_factor;
    } else {
      this.speedY -= acceleration_factor;
    }
  },
  handleBoundaryCollision: function () {
    if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
      this.speedX *= -1;
    }
    if (this.y - this.radius < 0) {
      this.speedY *= -1;
    }
    if (this.y  + this.radius > canvas.height) {
      gameOver();
    }
  }
};

// Object containing the blocks
function Blocks() {}

Blocks.prototype.reset = function () {
  this.loc = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
  ];
};

// Player - the paddle
function Player() {
  this.height = 25;
  this.width  = 150;
}

Player.prototype = {
  reset: function () {
    /* center the bar */
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height;
  },
  draw: function () {
    context.fillStyle = "#66CCFF";
    context.fillRect(
      this.x,
      this.y,
      this.width,
      this.height
    );
  },
  updatePosition: function () {
    if (input.isDown('LEFT') || input.isDown('a')) {
      this.x -= 10;
    }
    if (input.isDown('RIGHT') || input.isDown('d')) {
      this.x += 10;
    }
  }
};

// Other game elements
var currentLevel;
var points;
var gameLoop;
var ball;
var blocks;
var player;
var gameoverEl;
var gameoverButton;


// initialize the default parameters
function init() {
  // setup canvas
  canvas = document.getElementById("gameCanvas");
  context = canvas.getContext('2d');
  canvas.height = 500;
  canvas.width  = 800;

  // setup objects
  ball = new Ball(100, 200, 15);
  blocks = new Blocks();
  player = new Player();

  // game over screen setup
  gameoverEl = document.getElementById("gameover");
  gameoverButton = document.getElementById("play-again");
  gameoverButton.onclick = startGame;

  startGame();
}

// Common setup before start of every game
function resetStates() {
  // ball start here
  ball.reset();
  // 3 rows of blocks
  blocks.reset();
  // center the player
  player.reset();
  // hide game over notice
  gameoverEl.style.display = "none";
}

// Start the very first game
function startGame() {
  resetStates();
  points = 0;
  currentLevel = 1;
  // start game loop
  gameLoop = setInterval(draw, 10);
}

// Update the canvas
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();

  // Draw game objects
  ball.draw();
  player.draw();

  context.closePath();

  // Update game objects
  ball.updateSpeed(0);
  checkCollision();
  ball.updatePosition();
  player.updatePosition();
  document.getElementById("points").innerHTML = points++;
}

/********* Helper functions *********/

/* Keep the ball within the canvas dimensions. */
function checkCollision() {
  ball.handleBoundaryCollision();
}

function gameOver() {
  clearInterval(gameLoop);
  gameoverEl.style.display = "block";
  gameoverButton.focus();
}
