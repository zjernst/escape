const Player = require('./player.js');
const Exit = require('./exit.js');

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
