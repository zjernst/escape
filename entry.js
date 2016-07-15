const GameView = window.GameView = require('./gameView.js');
const GameOfLife = window.GameOfLife = require('./gameOfLife.js');
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
