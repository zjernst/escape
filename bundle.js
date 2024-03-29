/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const GameView = window.GameView = __webpack_require__(1);
	const GameOfLife = window.GameOfLife = __webpack_require__(6);
	// const mazeWidth = 482;
	// const mazeHeight = 482;
	
	const canvasEl = document.getElementById("world");
	
	
	canvasEl.height = window.innerHeight;
	canvasEl.width = window.innerWidth;
	
	const ctx = canvasEl.getContext('2d');
	const gameView = new GameView(ctx);
	
	const el = document.getElementsByTagName('body')[0];
	
	
	function randomStart(size, weight) {
	  const board = new Array(size);
	  for (let i = 0; i < board.length; i++) {
	    board[i] = new Array(size);
	  }
	  for (let j = 0; j < board.length; j++) {
	    for (let k = 0; k < board[0].length; k++) {
	      if (Math.random() < weight) {
	        board[j][k] = 1;
	      } else {
	        board[j][k] = 0;
	      }
	    }
	  }
	  return board;
	};
	
	const params = {
	  canvas_id:    "world",
	  cell_width:   20,
	  cell_height:  20,
	  init_cells:   randomStart(70, .2),
	  colorful: true
	}
	
	const board = new GameOfLife(params)
	
	// let count = 0;
	// const interval = setInterval(board.step, 1000);
	// var interval = setInterval(() => {
	//   board.step();
	//   count += 1;
	// }, 1000)
	
	// if (count === 100) {
	//   clearInterval(interval);
	// }
	
	// for (var i = 0; i < 100; i++) {
	//   board.step();
	// }
	gameView.start(ctx, board);
	
	
	
	//
	// canvasEl.height = window.innerHeight;
	// canvasEl.width = window.innerWidth;
	//
	// const img = new Image();
	// img.src = "maze.gif";
	//
	// ctx.drawImage(img, 0, 0);
	// const gameView = new GameView(canvasEl.width, canvasEl.height);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(2);
	const Player = window.Player = __webpack_require__(3);
	
	
	function GameView(ctx) {
	  // this.dimX = dimX;
	  // this.dimY = dimY;
	  this.ctx = ctx;
	}
	
	GameView.prototype.start = function(ctx, board) {
	  this.game = new Game(board);
	  this.board = board;
	  this.player = this.game.player;
	  this.keyHandlers();
	
	  this.game.setup(ctx);
	
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.animate = function () {
	  this.game.step();
	  this.game.draw(this.ctx);
	
	  requestAnimationFrame(this.animate.bind(this))
	};
	
	GameView.MOVES = {
	  "w": [ 0, -0.5],
	  "a": [-0.5,  0],
	  "s": [ 0,  0.5],
	  "d": [ 0.5,  0],
	  "up": [ 0, -0.5],
	  "left": [-0.5,  0],
	  "right": [ 0.5,  0],
	  "down": [ 0,  0.5]
	};
	
	GameView.prototype.keyHandlers = function() {
	  const player = this.player;
	  Object.keys(GameView.MOVES).forEach((k) => {
	    let move = GameView.MOVES[k];
	    key(k, () => {
	      player.direct(move);
	    })
	  });
	};
	
	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Player = __webpack_require__(3);
	const Exit = __webpack_require__(7);
	
	function Game(board, maze=4) {
	  this.dimY = window.innerHeight;
	  this.dimX = window.innerWidth;
	  this.board = board;
	  let playerPos = [(this.dimX / 2), (this.dimY / 2)];
	  this.mouse = playerPos;
	  this.player = new Player(playerPos, this);
	  this.exit = new Exit (this);
	  this.mazeImg = new Image ();
	
	  this.allObjects = [this.player];
	};
	
	Game.prototype.setup = function(ctx) {
	  ctx.clearRect(0, 0, this.dimX, this.dimY);
	  console.log(this.board);
	  console.log(this.board.display);
	  this.board.render();
	  // this.mazeImg.onload = function () {
	  //   ctx.drawImage(this.mazeImg, 0, 0);
	  // }.bind(this)
	  this.player.draw(ctx);
	  this.exit.draw(ctx);
	  // this.mazeImg.src = `maps/maze${this.maze}.gif`
	  window.addEventListener('mousemove', (e) => {
	    this.mouse = [e.clientX, e.clientY]
	  });
	  for (var i = 0; i < 10; i++) {
	    this.board.step();
	  }
	  this.interval = setInterval(() => {
	    this.stepping = true;
	  }, 10000)
	};
	
	Game.prototype.draw = function(ctx) {
	  ctx.clearRect(0, 0, this.dimX, this.dimY);
	  if (this.stepping) {
	    this.board.step();
	    this.stepping = false;
	  } else {
	    this.board.render();
	  }
	  // ctx.drawImage(this.mazeImg, 0, 0);
	  if (this.hitWall(ctx, this.player)) {
	    console.log('hit wall');
	    this.player.moveBack();
	    // this.stepping = true;
	  }
	  this.fog(ctx);
	  this.player.draw(ctx);
	  this.exit.draw(ctx);
	  this.sight(ctx);
	};
	
	Game.prototype.fog = function (ctx) {
	  let pX = this.player.pos[0];
	  let pY = this.player.pos[1];
	  let gradient = ctx.createRadialGradient(pX, pY, 100, pX, pY, 500);
	  gradient.addColorStop(0, "rgba(0,0,0,0)");
	  gradient.addColorStop(1, "rgba(0,0,0,1)");
	  ctx.save();
	  ctx.fillStyle = gradient;
	  ctx.fillRect(0,0,this.dimX,this.dimY)
	  ctx.restore();
	};
	
	Game.prototype.sight = function(ctx) {
	  ctx.fillStyle = 'black';
	  ctx.beginPath();
	  ctx.moveTo(0,0);
	  ctx.lineTo(0, window.innerHeight);
	  ctx.lineTo(window.innerWidth, window.innerHeight);
	  ctx.lineTo(window.innerWidth, 0);
	  ctx.lineTo(0,0);
	  // ctx.moveTo(this.player.pos[0], this.player.pos[1]);
	
	  let playerX = this.player.pos[0];
	  let playerY = this.player.pos[1];
	  let mouseX = this.mouse[0];
	  let mouseY = this.mouse[1];
	
	  ctx.save();
	  ctx.translate(playerX, playerY);
	
	  let angle = Math.atan2((playerY - mouseY), playerX - mouseX)
	
	  ctx.rotate(angle + Math.PI/1.33);
	  ctx.moveTo(-20,-20);
	  // ctx.arc(20, 20, 40, Math.PI * (3/4), Math.PI*(7/4), false)
	  ctx.lineTo(250, 100);
	  ctx.lineTo(100, 250);
	  ctx.lineTo(-20,-20);
	  ctx.fill();
	  ctx.restore();
	
	  // console.log(playerY - mouseY);
	  // console.log(playerX - mouseX);
	  //
	  // let distance = Math.sqrt(Math.pow((playerY - mouseY), 2) +
	  //                           Math.pow((playerX - mouseX), 2));
	  //
	  // // console.log(distance);
	  // // console.log(this.mouse);
	  // let ratio = 200 / distance;
	  // // console.log(ratio);
	  // let newMouseX = ratio * mouseX;
	  // let newMouseY = ratio * mouseY;
	  //
	  // let slope = ((this.player.pos[1] - this.mouse[1]) / (this.player.pos[0] - this.mouse[0]))
	  //
	  // let perpendicular = ( -1 / slope);
	  //
	  // // ctx.lineTo(newMouseX, newMouseY);
	  // ctx.stroke();
	};
	
	Game.prototype.moveObjects = function () {
	  this.allObjects.forEach((object) => {
	    object.move();
	  });
	};
	
	Game.prototype.step = function () {
	  this.moveObjects();
	  this.win();
	};
	
	Game.prototype.hitWall = function (ctx, player) {
	  let x = player.pos[0] - player.radius/2;
	  let y = player.pos[1] - player.radius/2;
	  const imgData = ctx.getImageData(x, y, player.radius, player.radius);
	  const pix = imgData.data;
	  for (let i = 0; i < pix.length; i++) {
	    if (pix[i] !== 0) {
	      return true
	    }
	  }
	  return false
	};
	
	Game.prototype.win = function () {
	  if (((this.player.pos[0] > this.exit.pos[0]) &&
	      (this.player.pos[0] < this.exit.pos[0] + 40)) &&
	     ((this.player.pos[1] > this.exit.pos[1]) &&
	      (this.player.pos[1] < this.exit.pos[1] + 40))) {
	        window.alert("YOU FOUND THE EXIT")
	      }
	};
	
	// function drawMaze() {
	//   // makeWhite(0, 0, canvas.width, canvas.height);
	//   const mazeImg = new Image ();
	//   mazeImg.onload = function () {
	//     ctx.drawImage(mazeImg, 0, 0);
	//   };
	//   let maze = 4
	//   mazeImg.src = `./maps/maze${maze}.gif`;
	// }
	
	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Util = __webpack_require__(5);
	const util = new Util();
	
	const COLOR = "#3e0013";
	let RADIUS = 7.5;
	let VEL = [0,0];
	
	function Player(pos, game) {
	  MovingObject.call(this, pos, VEL, RADIUS, COLOR, game);
	};
	
	util.inherits(MovingObject, Player)
	
	Player.prototype.direct = function(direction) {
	  this.vel[0] += direction[0];
	  this.vel[1] += direction[1];
	};
	
	
	
	
	module.exports = Player;


/***/ },
/* 4 */
/***/ function(module, exports) {

	function MovingObject(pos, vel, radius, color, game) {
	  this.pos = pos;
	  this.prevPos = pos;
	  this.vel = vel;
	  this.radius = radius;
	  this.color = color;
	  this.game = game;
	}
	
	MovingObject.prototype.draw = function (ctx) {
	  // ctx.clearRect(this.prevPos[0], this.prevPos[1], this.radius * 2, this.radius * 2)
	
	  ctx.fillStyle = this.color;
	  ctx.beginPath();
	
	  ctx.arc(
	    this.pos[0],
	    this.pos[1],
	    this.radius,
	    0,
	    2 * Math.PI,
	    false
	  );
	
	  ctx.fill();
	};
	
	MovingObject.prototype.decelerate = function() {
	  if (this.vel[0] > 0) {
	    this.vel[0] -= .01
	  } else if (this.vel[0] < 0) {
	    this.vel[0] += .01
	  }
	
	  if (this.vel[1] > 0) {
	    this.vel[1] -= .01
	  } else if (this.vel[1] < 0) {
	    this.vel[1] += .01
	  }
	};
	
	MovingObject.prototype.move = function () {
	  this.prevPos = this.pos
	  this.decelerate();
	  this.pos[0] = this.pos[0] + this.vel[0];
	  this.pos[1] = this.pos[1] + this.vel[1];
	};
	
	MovingObject.prototype.moveBack = function () {
	  this.pos[0] = this.prevPos[0];
	  this.pos[1] = this.prevPos[1];
	  this.vel[0] = 0;
	  this.vel[1] = 0;
	}
	
	module.exports = MovingObject;


/***/ },
/* 5 */
/***/ function(module, exports) {

	function Util() {}
	
	Util.prototype.inherits = function(Parent, Child) {
	  function Surrogate () {}
	
	  Surrogate.prototype = Parent.prototype;
	  Child.prototype = new Surrogate();
	  Child.prototype.constructor = Child;
	};
	
	module.exports = Util;


/***/ },
/* 6 */
/***/ function(module, exports) {

	/* Author:
	            Matthew Ruten, 2012
	*/
	
	var GameOfLife = function(params){
	  // User-set params
	  var num_cells_y = params["init_cells"].length,
	      num_cells_x = params["init_cells"][0].length,
	      cell_width  = params["cell_width"]  || 10,
	      cell_height = params["cell_height"] || 10,
	      init_cells  = params["init_cells"]  || [],
	      canvas_id   = params["canvas_id"]   || "life",
	
	      colourful   = params["colourful"] || params["colorful"] || false,
	
	      cell_array = [],
	      display     = new GameDisplay(num_cells_x, num_cells_y, cell_width, cell_height, canvas_id, colourful),
	      interval = null,    // Will store reference to setInterval method -- this should maybe be part of GameDisplay
	      init        = function() {
	        // Convert init_cells array of 0's and 1's to actual Cell objects
	        var length_y = init_cells.length,
	            length_x,
	            y, x;
	        // each row
	        for (y = 0; y < length_y; y++) {
	          length_x = init_cells[y].length;
	          // each column in rows
	          for (x = 0; x < length_x; x++) {
	            var state = (init_cells[y][x] == 1) ? 'alive' : 'dead';
	            init_cells[y][x] = new Cell(x, y, state);
	          }
	        }
	        cell_array = init_cells;
	        display.update(cell_array);
	      },
	      // Function to calculate the next generation of cells, based
	      //  on the rules of the Game of Life
	      nextGenCells = function() {
	        // Implement the Game of Life rules
	        // Simple algorithm:
	        //  - For each cell:
	        //      - Check all of its neighbours
	        //      - Based on the rules, set the next gen cell to alive or dead
	
	        var current_gen = cell_array,
	            next_gen = [],      // New array to hold the next gen cells
	            length_y = cell_array.length,
	            length_x,
	            y, x;
	        // each row
	        for (y = 0; y < length_y; y++) {
	          length_x = current_gen[y].length;
	          next_gen[y] = []; // Init new row
	          // each column in rows
	          for (x = 0; x < length_x; x++) {
	            //var state = (init_cells[y][x] == 1) ? 'alive' : 'dead';
	            var cell = current_gen[y][x];
	            // Calculate above/below/left/right row/column values
	            var row_above = (y-1 >= 0) ? y-1 : length_y-1; // If current cell is on first row, cell "above" is the last row (stitched)
	            var row_below = (y+1 <= length_y-1) ? y+1 : 0; // If current cell is in last row, then cell "below" is the first row
	            var column_left = (x-1 >= 0) ? x-1 : length_x - 1; // If current cell is on first row, then left cell is the last row
	            var column_right = (x+1 <= length_x-1) ? x+1 : 0; // If current cell is on last row, then right cell is in the first row
	
	            var neighbours = {
	              top_left: current_gen[row_above][column_left].clone(),
	              top_center: current_gen[row_above][x].clone(),
	              top_right: current_gen[row_above][column_right].clone(),
	              left: current_gen[y][column_left].clone(),
	              right: current_gen[y][column_right].clone(),
	              bottom_left: current_gen[row_below][column_left].clone(),
	              bottom_center: current_gen[row_below][x].clone(),
	              bottom_right: current_gen[row_below][column_right].clone()
	            };
	
	            var alive_count = 0;
	            var dead_count = 0;
	            for (var neighbour in neighbours) {
	              if (neighbours[neighbour].getState() == "dead") {
	                dead_count++;
	              } else {
	                alive_count++;
	              }
	            }
	
	            // Set new state to current state, but it may change below
	            var new_state = cell.getState();
	            if (cell.getState() == "alive") {
	              if (alive_count < 2 || alive_count > 3) {
	                // new state: dead, overpopulation/ underpopulation
	                new_state = "dead";
	              } else if (alive_count === 2 || alive_count === 3) {
	                // lives on to next generation
	                new_state = "alive";
	              }
	            } else {
	              if (alive_count === 3) {
	                // new state: live, reproduction
	                new_state = "alive";
	              }
	            }
	
	            //console.log("Cell at x,y: " + x + "," + y + " has dead_count: " + dead_count + "and alive_count: " + alive_count);
	
	            next_gen[y][x] = new Cell(x, y, new_state);
	            //console.log(next_gen[y][x]);
	          }
	        }
	        //console.log(next_gen);
	/*
	        next_gen = cell_array;
	        next_gen[0][0].setState("dead");
	        next_gen[0][1].setState("alive");
	        next_gen[1][0].setState("alive");
	        next_gen[1][1].setState("dead");
	*/
	        return next_gen;
	      }
	  ;
	  init();
	  return {
	    // Returns the next generation array of cells
	    step: function(){
	      var next_gen = nextGenCells();
	      // Set next gen as current cell array
	      cell_array = next_gen;
	      //console.log(next_gen);
	      display.update(cell_array);
	    },
	    // Returns the current generation array of cells
	    getCurrentGenCells: function() {
	      return cell_array;
	    },
	    // Add "The" to function name to reduce confusion
	    //  (even though we *could* technically use just setInterval)
	    setTheInterval: function(the_interval) {
	      interval = the_interval;
	    },
	    getInterval: function() {
	      return interval;
	    },
	    render: function() {
	      display.update(this.getCurrentGenCells())
	    }
	  };
	};
	
	// This is an object that will take care of all display-related features.
	// Theoretically, you should be able to use any method of display without
	// too much extra code. i.e. if you want to display the game using HTML tables,
	// svg, or whatever other method you feel like. Just create a new <___>Display
	// Object!
	var GameDisplay = function(num_cells_x, num_cells_y, cell_width, cell_height, canvas_id, colourful) {
	  var canvas = document.getElementById(canvas_id),
	      ctx = canvas.getContext && canvas.getContext('2d'),
	      width_pixels = num_cells_x * cell_width,
	      height_pixels = num_cells_y * cell_height,
	      drawGridLines = function() {
	        ctx.lineWidth = 1;
	        ctx.strokeStyle = "rgba(255, 0, 0, 1)";
	        ctx.beginPath();
	        // foreach column
	        for (var i = 0; i <= num_cells_x; i++) {
	          ctx.moveTo(i*cell_width, 0);
	          ctx.lineTo(i*cell_width, height_pixels);
	        }
	        // foreach row
	        for (var j = 0; j <= num_cells_y; j++) {
	          ctx.moveTo(0, j*cell_height);
	          ctx.lineTo(width_pixels, j*cell_height);
	        }
	        ctx.stroke();
	      },
	      updateCells = function(cell_array) {
	        var length_y = cell_array.length,
	            length_x,
	            y, x;
	        // each row
	        for (y = 0; y < length_y; y++) {
	          length_x = cell_array[y].length;
	          // each column in rows
	          for (x = 0; x < length_x; x++) {
	            // Draw Cell on Canvas
	            drawCell(cell_array[y][x]);
	          }
	        }
	      },
	      drawCell = function(cell) {
	        // find start point (top left)
	        var start_x = cell.getXPos() * cell_width,
	            start_y = cell.getYPos() * cell_height;
	        // draw rect from that point, to bottom right point by adding cell_height/cell_width
	        if (cell.getState() == "alive") {
	          //console.log("it's alive!");
	          if (colourful === true) {
	            var r=Math.floor(Math.random()*10),
	                g=Math.floor(Math.random()*10),
	                b=Math.floor(Math.random()*10),
	                a=(Math.floor(Math.random()*3)+8)/10; // rand between 0.5 and 1.0
	            ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
	          }
	          ctx.fillRect(start_x, start_y, cell_width, cell_height);
	        } else {
	          ctx.clearRect(start_x, start_y, cell_width, cell_height);
	        }
	      },
	      init = function() {
	        //console.log("width_pixels: " + width_pixels);
	        //console.log("height_pixels: " + height_pixels);
	
	        // Resize Canvas
	        canvas.width = width_pixels;
	        canvas.height = height_pixels;
	
	        // No grid lines, for now!
	        //drawGridLines();
	      };
	  init();
	  return {
	    update: function(cell_array) {
	      updateCells(cell_array);
	    }
	  };
	
	
	};
	
	var Cell = function(x_pos, y_pos, state) {
	  //console.log("Creating cell at " + x_pos + "," + y_pos + ", and cell state is: " + state);
	  /*var x_pos = 0,        // X Position of Cell in Grid
	      y_pos = 0,        // Y position of cell in Grid
	      state = "dead",   // Cell state: dead or alive.
	      asdf;*/
	  return {
	    x_pos: x_pos,
	    y_pos: y_pos,
	    state: state,
	    getXPos: function() {
	      return x_pos;
	    },
	    getYPos: function() {
	      return y_pos;
	    },
	    getState: function() {
	      return state;
	    },
	    setState: function(new_state) {
	      state = new_state;
	    },
	    clone: function() {
	      return new Cell(x_pos, y_pos, state);
	    }
	  };
	};
	
	module.exports = GameOfLife;


/***/ },
/* 7 */
/***/ function(module, exports) {

	function Exit(game) {
	  this.pos = [Math.random()*game.dimX, Math.random()*game.dimY]
	}
	
	Exit.prototype.draw = function (ctx) {
	  ctx.fillStyle = 'red'
	  ctx.fillRect(this.pos[0], this.pos[1], 40, 40)
	};
	
	module.exports = Exit;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map