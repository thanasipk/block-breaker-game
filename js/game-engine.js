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
  this.hasSpeedBonus = false;
}

Ball.prototype = {
  reset: function () {
    this.x = this.startX;
    this.y = this.startY;
    this.hasSpeedBonus = false;
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
  updateSpeed: function (accelerationFactor) {
    if (this.speedX > 0) {
      this.speedX += accelerationFactor;
    } else {
      this.speedX -= accelerationFactor;
    }
    if (this.speedY > 0) {
      this.speedY += accelerationFactor;
    } else {
      this.speedY -= accelerationFactor;
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
  },
  giveBonusSpeed: function() {
  	// Prevents repeated speed increases
  	if (!this.hasSpeedBonus) {
		this.updateSpeed(1);	
  	}
  	this.hasSpeedBonus = true;
  }
};

// Object containing the blocks
function Blocks() {
  this.height = 20;
  this.colors = [[], [], [], [], [], [], [], 
  				 [], [], [], [], [], [], []];
  this.givenColors = {};
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
  },
  draw: function () {
    for (var row = 0; row < this.loc.length; row++){
      for (var col = 0; col < this.loc[row].length; col++) {
        // Draw and colour each block.
        this.drawSingleBlock(col, row, this.loc[row][col]);
        this.colors[row][col] = this.givenColors[row];
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
  hasCollide: function (blockX, blockY) {
    var has_collide = false;

    has_collide =
      ball.x + ball.radius >= blockX * this.width &&
      ball.x - ball.radius <= (blockX + 1) * this.width &&
      ball.y + ball.radius >= blockY * this.height &&
      ball.y - ball.radius <= (blockY + 1) * this.height

    // has collide from side
    if (has_collide &&
        !(ball.x + ball.radius + ball.speedX >= blockX * this.width &&
          ball.x - ball.radius - ball.speedX <= (blockX + 1) * this.width)) {
      ball.speedX *= -1;
    }

    // has collide from top or bottom
    if (has_collide &&
        !(ball.y + ball.radius + ball.speedY >= blockY * this.height &&
          ball.y - ball.radius - ball.speedY <= (blockY + 1) * this.height)) {
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
          this.detectPointValue(this.colors[row][col]);
          this.loc[row][col] = 0;
          totalHits++;
        }
      }
    }
  },
  initGivenColors: function () {
    red    = this.givenColors[1] = this.givenColors[2] = "rgb(231, 76, 60)";
    orange = this.givenColors[3] = this.givenColors[4] = "rgb(230, 126, 34)";
    green  = this.givenColors[5] = this.givenColors[6] = "rgb(39, 174, 96)";
    yellow = this.givenColors[7] = this.givenColors[8] = "rgb(241, 196, 15)";

  },
  rowRevealed: function (rowNumber) {
  	// Where rowNumber=1 is the top-most visible row
  	// If the row below rowNumber has a block missing, return true
	if (eval(this.loc[rowNumber + 1].join("+")) < this.loc[0].length) {
		return true;
	}
	return false;
  },
  detectPointValue: function (singleBlock) {
  	switch (singleBlock) {
  	  case red:
  	    points += 7;
  	  	break;
  	  case orange:
  	  	points += 5;
  	  	break;
  	  case green:
  	  	points += 3;
  	  	break;
  	  case yellow:
  	    points += 1;
  	  	break;
  	}
  }
};

// Player - the paddle
function Player() {
  this.lives = 3;
  this.height = 25;
  this.width  = 200;
  this.hasShrunk = false;
}

Player.prototype = {
  reset: function () {

  	/* Reset lost lives */
  	this.lives = 3;

    /* Reset width shrinking */
    this.width  = 200;
    this.hasShrunk = false;

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
  	if (!this.hasShrunk) {
		this.width /= 2;	
  	}
  	this.hasShrunk = true;
  },
  resetLives: function() {
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
var points = 0;
var gameLoop;
var ball;
var blocks;
var player;
var gameoverEl;
var gameoverButton;
var totalHits = 0;

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
  document.getElementById("points").innerHTML = points;

  console.log(ball.speedX);
  console.log(ball.speedY);
  console.log(totalHits);

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
  	player.loseLife();
    points = 0;

    redraw(); // draw the new frame
    setPopup("game-over-popup", "Lemme try again!");   

    gameoverButton.onclick = function(){startLevel(1, 5, 3)};
  }

  // Player beat level 1
  else if (currentLevel == 1 && blocks.allCleared()) {
    // Start game with increased acceleration ball
    redraw();
    setPopup("game-level-won-popup", "Play the second level");   
    gameoverButton.onclick = function(){startLevel(2, 6, player.lives)};
    //document.getElementById("level").innerHTML = currentLevel;
  }

  // Player lost normally on level 1
  else if (currentLevel == 1) {
  	player.loseLife();
    // Restart the first level
    setPopup("game-lost-popup", "1st level, try again!");
    gameoverButton.onclick = function(){startLevel(1, 5, player.lives)};
  }

  // Player beat level 2
  else if (currentLevel == 2 && blocks.allCleared()) {
    redraw(); // draw the new frame
    setPopup("game-won-popup", "Reset game"); 
    gameoverButton.onclick = function(){startLevel(1, 5, 3)};
    //document.getElementById("level").innerHTML = currentLevel;
  }

  // Player lost normally on level 2
  else if (currentLevel == 2) {
  	player.loseLife();
    // Start level 2 again
    setPopup("game-lost-popup", "2nd level, try again!"); 
    gameoverButton.onclick = function(){startLevel(2, 5, player.lives)};
  }
  gameOverPopup();
}

function startLevel(newLevel, ballSpeed, playerLivesLeft) {
	currentLevel = newLevel;
	startGame();
	ball.speedX = ball.speedY = ballSpeed;
	player.lives = playerLivesLeft;
	player.resetLives();
}

function checkSpecialScenarios() {
  // Increase ball speed every 4 and 12 hits
  if (totalHits % 4 == 0 || totalHits % 12 == 0) {
	  ball.updateSpeed(0.05);
  	totalHits++;
  }

  // If the orange row is revealed, shrink the player
  if (blocks.rowRevealed(4)) {
  	player.shrinkPaddle();
  }

  // If the red row is revealed, increase the ball speed
  if (blocks.rowRevealed(2)) {
    ball.giveBonusSpeed();
  }

  // Check if the player has beat the level
  if (blocks.allCleared()) {
  	gameOver();
  }
}

function setPopup(popupID, popupContent) {
	gameoverEl.children[0].innerHTML = document.getElementById(popupID).innerHTML;
	gameoverButton.innerHTML = popupContent;
}