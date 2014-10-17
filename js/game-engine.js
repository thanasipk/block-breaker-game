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
    if (this.speedY > 0) {
      this.speedY += acceleration_factor;
    } else {
      this.speedY -= acceleration_factor;
    }
  },
  handleBoundaryCollision: function () {
    // hit left or right side
    if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
      this.speedX *= -1;
    }
    // hit top
    if (this.y - this.radius < 0) {
      this.speedY *= -1;
    }
    // hit bottom
    if (this.y  + this.radius > canvas.height) {
      gameOver();
    }
  }
};

// Object containing the blocks
function Blocks() {
  this.height = 20;
}

Blocks.prototype = {
  reset: function () {
    // put the blocks back into place
    // this.loc = [
    //   [0, 0, 0, 0, 0, 0, 0, 0],
    //   [1, 1, 1, 1, 1, 1, 1, 1],
    //   [1, 1, 1, 1, 1, 1, 1, 1],
    //   [1, 1, 1, 1, 1, 1, 1, 1],
    //   [1, 1, 1, 1, 1, 1, 1, 1],
    //   [1, 1, 1, 1, 1, 1, 1, 1]
    // ]
    this.loc = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1]
    ]
    this.colors = [[], [], [], [], [], []];
    this.width = Math.floor(canvas.width / this.loc[0].length);

    for (var row = 0; row < this.loc.length; row++){
      for (var col = 0; col < this.loc[row].length; col++) {
        this.colors[row][col] = "rgb(" +
          randomFromTo(100, 255) + "," +
          randomFromTo(100, 255) + "," +
          randomFromTo(100, 255) + ")";
      }
    }
  },
  draw: function () {
    for (var row = 0; row < this.loc.length; row++){
      for (var col = 0; col < this.loc[row].length; col++) {
        this.drawSingleBlock(col, row, this.loc[row][col]);
      }
    }
  },
  drawSingleBlock: function (x, y, existence) {
    // check if a block still exist at that location
    if (!existence) return;

    context.save();
    context.beginPath();

    context.fillStyle = this.colors[y][x];

    context.fillRect(
      x * this.width,
      y * this.height,
      this.width,
      this.height
    );

    context.closePath();
    context.stroke();
    context.restore();
  },
  hasCollide: function (block_x, block_y) {
    var has_collide = false;

    has_collide =
      ball.x + ball.radius >= block_x * this.width &&
      ball.x - ball.radius <= (block_x + 1) * this.width &&
      ball.y + ball.radius >= block_y * this.height &&
      ball.y - ball.radius <= (block_y + 1) * this.height

    // has collide from side
    if (has_collide &&
        !(ball.x + ball.radius + ball.speedX >= block_x * this.width &&
          ball.x - ball.radius - ball.speedX <= (block_x + 1) * this.width)) {
      ball.speedX *= -1;
    }

    // has collide from top or bottom
    if (has_collide &&
        !(ball.y + ball.radius + ball.speedY >= block_y * this.height &&
          ball.y - ball.radius - ball.speedY <= (block_y + 1) * this.height)) {
      ball.speedY *= -1;
    }

    return has_collide;
  },
	allCleared: function() {
		// check if all blocks are gone
		for (var blockRow = 0; blockRow < blocks.loc.length; blockRow++) {
			// if the row is empty, stop checking
			if (eval(blocks.loc[blockRow].join("+")) > 0) {
				return false;
			}
		}
		return true;
	},
  detectCollision: function () {
    for (var row = 0; row < this.loc.length; row++){
      for (var col = 0; col < this.loc[row].length; col++) {
        if (this.loc[row][col] && this.hasCollide(col, row)) {
          this.loc[row][col] = 0;
          points += 100;
        }
      }
    }
  }
};

// Player - the paddle
function Player() {
  this.height = 25;
  this.width  = 150;
}

Player.prototype = {
  reset: function () {
    /* center the paddle */
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height;
  },
  draw: function () {
    context.fillStyle = "#66ccff";
    context.fillRect(
      this.x,
      this.y,
      this.width,
      this.height
    );
  },
  hasCollide: function () {
    // test if the ball touches the paddle
    return ball.x + ball.radius >= this.x &&
      ball.x - ball.radius <= this.x + this.width &&
      ball.y + ball.radius >= this.y
  },
  detectCollision: function () {
    // detect collision and handle it
    if (this.hasCollide()) {
      // basic implementation - just bounce it back
      ball.speedY = -Math.abs(ball.speedY);
    }
  },
  updatePosition: function () {
    // check keyboard input
    if (input.isDown('LEFT') || input.isDown('a')) {
      if (this.x >= 0)
        this.x -= 10;
    }
    if (input.isDown('RIGHT') || input.isDown('d')) {
      if (this.x + this.width <= canvas.width)
        this.x += 10;
    }
  }
};

// Other game elements
var currentLevel = 1;
var points;
var gameLoop;
var ball;
var blocks;
var player;
var gameoverEl;
var gameoverButton;

// initialize the default global parameters
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

  // also start the game
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
  // start game loop
  gameLoop = setInterval(draw, 10);
}

// Update the canvas
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();

  // Draw game objects
  blocks.draw();
  player.draw();
  ball.draw();
  context.closePath();

  // Update game objects
  ball.updateSpeed(0);
  ball.updatePosition();

  player.detectCollision();
  blocks.detectCollision();
  ball.handleBoundaryCollision();

  player.updatePosition();
  document.getElementById("points").innerHTML = points++;
  
  // Current game finished
  if (blocks.allCleared()) {
  	gameOver();
 }
}

function randomFromTo(from, to) {
  return Math.floor(Math.random() * (to + 1 - from) + from);
}

function gameOverPopup() {
  clearInterval(gameLoop);
  gameoverEl.style.display = "block";
  gameoverButton.focus();
}

function gameOver() {

  // Player beat level 1
 	if (currentLevel == 1 && blocks.allCleared()) {
    // Start game with increased acceleration ball
  	gameoverButton.innerHTML = "Hurray! Try the second level";
		gameoverButton.onclick = startLevel(2, 3);
  }

  // Player lost normally on level 1
 	else if (currentLevel == 1) {
 		// Just restart the first level
 		gameoverButton.innerHTML = "first level, try again!";
 		gameoverButton.onclick = startLevel(1, 0);
  }

  // Player beat level 2
 	else if (currentLevel == 2 && blocks.allCleared()) {
  	gameoverEl.innerHTML = "You beat the game! :D";
  }

  // Player lost normally on level 2
 	else if (currentLevel == 2) {
 		// Start level 2 again
 		gameoverButton.innerHTML = "second level, try again!";
    gameoverButton.onclick = startLevel(2, 0);
  }
  gameOverPopup();
}

function startLevel(new_level, ball_speed) {
	currentLevel = new_level;
	startGame();
	ball.updateSpeed(ball_speed);
}