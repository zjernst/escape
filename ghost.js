const MovingObject = require('./MovingObject.js');
const Util = require('./util.js');
const util = new Util();

const COLOR = "#ccffff";
let RADIUS = 20;
let VEL = [0,0];

function Ghost(pos, game) {
  MovingObject.call(this, pos, VEL, RADIUS, COLOR, game);
};

Ghost.prototype.findPlayer = function () {
  let player = this.game.player.pos
  
};

module.exports = Ghost;
