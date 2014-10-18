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
    context.fillStyle = "#34495e";
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
  this.colors = [[], [], [], [], [], [], [], 
  				 [], [], [], [], [], [], []];
  this.given_colors = {};
}



Blocks.prototype = {
  reset: function () {
    //put the blocks back into place
    this.loc = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
	]

    this.width = Math.floor(canvas.width / this.loc[0].length);
    this.initGivenColors(); // Establish the block colours

    // Assign the block colours according to their given row color.
    for (var row = 0; row < this.loc.length; row++) {
      for (var col = 0; col < this.loc[row].length; col++) {
        this.colors[row][col] = this.given_colors[row];
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
  },
  initGivenColors: function() {
  	// Red block row
    this.given_colors[1] = "rgb(231, 76, 60)";
    this.given_colors[2] = this.given_colors[1];

    // Orange block row
    this.given_colors[3] = "rgb(230, 126, 34)";
    this.given_colors[4] = this.given_colors[3];

    // Green block row
    this.given_colors[5] = "rgb(39, 174, 96)";
    this.given_colors[6] = this.given_colors[5];

    // Yellow block row
    this.given_colors[7] = "rgb(241, 196, 15)";
    this.given_colors[8] = this.given_colors[7];
  },
  rowRevealed: function(row_number) {
  	// Where row_number=1 is the top-most visible row
  	// If the row below row_number has a block missing, return true
	if (eval(this.loc[row_number + 1].join("+")) < this.loc[0].length) {
		return true;
	}
	return false;
  }
};

// Player - the paddle
function Player() {
  this.lives = 3;
  this.height = 25;
  this.width  = 200;
  this.has_shrunk = false;
}

Player.prototype = {
  reset: function () {

  	/* Reset lost lives */
  	this.lives = 3;

    /* Reset width shrinking */
    this.width  = 200;
    this.has_shrunk = false;

    /* center the paddle */
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height;
  },
  draw: function () {
    context.fillStyle = "#34495e";
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
  },
  shrinkPaddle: function() {
  	// Prevents repeated paddle shrinking
  	if (!this.has_shrunk) {
		this.width /= 2;	
  	}
  	this.has_shrunk = true;
  },
  reset_lives: function() {
  	for (var hearts = 0; hearts < this.lives; hearts++) {
	  playerLives.children[hearts].style.display = "inline";  		
  	}
  },
  loseLife: function() {
    playerLives.children[this.lives - 1].style.display = "none";
    this.lives -= 1;
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
  canvas.width  = 1280;

  // setup objects
  ball = new Ball(100, 200, 15);
  blocks = new Blocks();
  player = new Player();

  // game over screen setup
  playerLives = document.getElementById("player-lives-row")
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
  gameLoop = setInterval(update, 10);
}

// Update the canvas
function update() {
  // Update game objects
  ball.updatePosition();

  redraw();

  player.detectCollision();
  blocks.detectCollision();
  ball.handleBoundaryCollision();

  player.updatePosition();
  document.getElementById("points").innerHTML = points++;

  checkSpecialScenarios();
}

function redraw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();

  // Draw game objects
  blocks.draw();
  player.draw();
  ball.draw();

  context.closePath();
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

  // Player ran out of lives
  if (player.lives == 1 && !blocks.allCleared()) {
    playerLives.children[player.lives - 1].style.display = "none";
    player.lives -= 1;

    redraw(); // draw the new frame
    setPopup("game-over-popup", "Lemme try again!");   

    // Default ball speed
    if (currentLevel == 1) var ball_speed = 0;
    if (currentLevel == 2) var ball_speed = -2;

    gameoverButton.onclick = function(){startLevel(1, ball_speed, 3)};
  }

  // Player beat level 1
  else if (currentLevel == 1 && blocks.allCleared()) {
    // Start game with increased acceleration ball
    redraw(); // draw the new frame
    setPopup("game-level-won-popup", "Play the second level");   
    gameoverButton.onclick = function(){startLevel(2, 2, player.lives)};
    //document.getElementById("level").innerHTML = currentLevel;
  }

  // Player lost normally on level 1
  else if (currentLevel == 1) {
  	player.loseLife();
    // Restart the first level
    setPopup("game-lost-popup", "1st level, try again!"); 
    gameoverButton.onclick = function(){startLevel(1, 0, player.lives)};
  }

  // Player beat level 2
  else if (currentLevel == 2 && blocks.allCleared()) {
    redraw(); // draw the new frame
    setPopup("game-won-popup", "Reset game"); 
    gameoverButton.onclick = function(){startLevel(1, -2, 3)};
    //document.getElementById("level").innerHTML = currentLevel;
  }

  // Player lost normally on level 2
  else if (currentLevel == 2) {
  	player.loseLife();
    // Start level 2 again
    setPopup("game-lost-popup", "2nd level, try again!"); 
    gameoverButton.onclick = function(){startLevel(2, 0, player.lives)};
  }
  gameOverPopup();
}

function startLevel(new_level, ball_speed, player_lives) {
	currentLevel = new_level;
	startGame();
	ball.updateSpeed(ball_speed);
	player.lives = player_lives;
	player.reset_lives();
}

function checkSpecialScenarios() {
  // Check if the player needs to shrink
  if (blocks.rowRevealed(4)) {
    // If the orange row is revealed, shrink the player
  	player.shrinkPaddle();
  	// INCREASE SPEED HERE TOO
  }

  // Check if the player has beat the level
  if (blocks.allCleared()) {
  	gameOver();
 }
}

function setPopup(popup_id, popup_content) {
	gameoverEl.children[0].innerHTML = document.getElementById(popup_id).innerHTML;
	gameoverButton.innerHTML = popup_content;
}