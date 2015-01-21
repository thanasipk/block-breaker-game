# README #

### Apache Instructions
None

### How to Start it
Start `index.html` in the Chromium browser (or Google Chrome)

### How it Works
The game is structured into a few core functions:
-`init()`

-`startGame()`

-`update()`

Now we will detail how these functions interact to 
create the game:

### `init()`
	-Called via an event listener when the DOM is loaded.
	-Initializes game variables and objects, including
	the Ball, Player and Blocks.
	-Calls `startGame()` to begin a single game.

### `startGame()`
	-Calls `resetStates()` to initialize the Ball, Player and Blocks objects with their default values and start positions on the canvas.
	-Creates an interval which calls `update()` every 10 milliseconds, effectively drawing the frames for the game.

### `update()`
	-Draws the position of each object, Ball, Player and Blocks.
	-Detects collision between any of the entities and the canvas dimensions.
	-Handles special scenarios such as any collisions that end the game,  deducting lives from the player when they lose a game and starting a new level when they beat the first level.

### Data Structures Used
	In order to make the game extensible for further modifications, we have
	created each object, Player, Ball and Blocks, as a prototype object that we can treat in an obect oriented way. Below are details for the implementation of each prototype object.

##### Ball
	The player is simply a prototype object with several methods to 
	update its speed, position collision with other game elements such as
	the Player and canvas dimensions.

##### Player
	The player is simply a prototype object with several methods to 
	update its size and position.

##### Blocks
	The blocks are represented as a 2d bit-array matrix.
	Each block is a single integer in the array for that row. 
	A single block in the array is a 1 or 0.

	When a block is hit by the Ball, the block's index in its row for the bit-array becomes a 0 and is removed from the canvas.

	Having the bit-array matrix data-structure allowed us to implement
	high-level ideas very efficiently by calculating the sum of the array
	and making choices based on that sum of that array as a row on the canvas.
