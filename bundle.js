(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Dot = require("./dot");
const Side = require("./side");
const Box = require("./box");

class Board {
  constructor(size, x0, y0, width) {
    const margin = 10;
    this.debugMode = false;
    this.size = size;
    this.dim = { x0, y0, width, margin };
    const boxWidth = (width - margin * 2) / size;
    this.dots = [];
    for (let j = 0; j < this.size + 1; j++) {
      const y = y0 + margin + j * boxWidth;
      for (let i = 0; i < this.size + 1; i++) {
        const x = x0 + margin + i * boxWidth;
        this.dots.push(new Dot(x, y, this.dots.length));
      }
    }
    this.sides = [];
    for (let i = 0; i < this.size * 2 + 1; i++) {
      const p = Math.floor(i / 2) * (this.size + 1);
      if (i % 2 == 0) {
        for (let j = 0; j < this.size; j++) {
          this.sides.push(
            new Side(this.dots[j + p], this.dots[j + p + 1], this.sides.length)
          );
        }
      } else {
        for (let j = 0; j < this.size + 1; j++) {
          this.sides.push(
            new Side(
              this.dots[j + p],
              this.dots[j + p + 1 + this.size],
              this.sides.length
            )
          );
        }
      }
    }
    this.boxes = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const id = this.boxes.length;
        const a =
          Math.floor(id / this.size) * (2 * this.size + 1) + (id % this.size);
        const d = a + this.size;
        const b = a + this.size + 1;
        const c = a + this.size * 2 + 1;
        const box = new Box(
          this.sides[a],
          this.sides[b],
          this.sides[c],
          this.sides[d]
        );
        this.boxes.push(box);
        this.sides[a].boxes.push(box);
        this.sides[b].boxes.push(box);
        this.sides[c].boxes.push(box);
        this.sides[d].boxes.push(box);
      }
    }
  }

  containsMousePointer(x, y) {
    const { x0, y0, width } = this.dim;
    return x0 <= x && x <= x0 + width && y0 <= y && y <= y0 + width;
  }

  nearestSide(x, y) {
    for (const box of this.boxes) {
      if (box.containsMousePointer(x, y, this.dim.margin)) {
        const side = box.nearestSide(x, y);
        if (!side?.owner) {
          return side;
        }
        break;
      }
    }
  }

  handleMouseMove(x, y) {
    for (const box of this.boxes) {
      if (box.containsMousePointer(x, y, this.dim.margin)) {
        const side = box.nearestSide(x, y);
        if (side) {
          side.highlighted = true;
          document.body.style.cursor = "pointer";
        }
        break;
      }
    }
  }

  draw(ctx) {
    for (const dot of this.dots) {
      dot.draw(ctx, this.debugMode);
    }
    for (const side of this.sides) {
      side.draw(ctx, this.debugMode);
    }
    for (const box of this.boxes) {
      box.draw(ctx, this.debugMode);
    }
  }
}
module.exports = Board;

},{"./box":2,"./dot":4,"./side":7}],2:[function(require,module,exports){
class Box {
  constructor(sideA, sideB, sideC, sideD, id) {
    this.sides = [sideA, sideB, sideC, sideD];
    this.sideA = sideA;
    this.sideB = sideB;
    this.sideC = sideC;
    this.sideD = sideD;
    this.x0 = sideA.dotA.x;
    this.y0 = sideA.dotA.y;
    this.width = sideB.dotB.x - this.x0;
    this.height = sideB.dotB.y - this.y0;
    this.id = id;
    this.owner = undefined;
  }

  containsMousePointer(x, y, margin = 0) {
    const { x0, y0, width, height } = this;
    return (
      x >= x0 - margin &&
      y >= y0 - margin &&
      x < x0 + width + margin &&
      y < y0 + height + margin
    );
  }

  nearestSide(x, y) {
    // recenter vector
    x -= this.x0 + this.width / 2;
    y -= this.y0 + this.width / 2;
    // apply 45 degree rotation matrix
    const sqrt2 = 1.41421356237;
    const rotatedY = (x + y) / sqrt2;
    const rotatedX = (y - x) / sqrt2;
    // detect quadrant with threshold
    if (Math.abs(rotatedX) + Math.abs(rotatedY) > this.width / 3) {
      if (rotatedX < 0 && rotatedY > 0) {
        return !this.sideB.taken && this.sideB;
      } else if (rotatedX > 0 && rotatedY > 0) {
        return !this.sideC.taken && this.sideC;
      } else if (rotatedX > 0 && rotatedY < 0) {
        return !this.sideD.taken && this.sideD;
      } else return !this.sideA.taken && this.sideA;
    }
  }

  isCompleted() {
    return this.sides.every((side) => side.taken);
  }

  draw(ctx, debugMode) {
    const {
      x0,
      y0,
      width,
      height,
      sideA: { dotA },
    } = this;

    const borderWidth = 0;
    const margin = dotA.radius;

    const x = x0 + margin + borderWidth;
    const y = y0 + margin + borderWidth;
    const h = height - (margin + borderWidth) * 2;
    const w = width - (margin + borderWidth) * 2;
    const r = 10; // border radius

    if (debugMode) {
      ctx.fillText(this.id, x + w / 2, y + h / 2);
    } else {
      const { owner } = this;
      if (owner) {
        ctx.globalAlpha = owner.color.alpha ?? 1;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fillStyle = owner.color.rgb;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = "white";
        ctx.font = "bolder 48px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(owner.symbol, x + w / 2, y + (1.1 * h) / 2);
      }
    }
  }
}
module.exports = Box;

},{}],3:[function(require,module,exports){
class Color {
  constructor(rgb, alpha) {
    this.rgb = rgb;
    this.alpha = alpha;
  }
}
module.exports = Color;

},{}],4:[function(require,module,exports){
class Dot {
  constructor(x, y, id) {
    this.x = x;
    this.y = y;
    this.radius = 5;
    this.id = id;
  }
  draw(ctx, debugMode) {
    ctx.fillStyle = "black";
    if (debugMode) {
      ctx.fillText(this.id, this.x, this.y);
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}
module.exports = Dot;

},{}],5:[function(require,module,exports){
const Board = require("./board");
const Player = require("./player");
const Color = require("./color");

class Game {
  constructor(canvas, options) {
    this.options = options;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.height = canvas.height;
    this.width = canvas.width;
    this.canvas.onmousemove = this.handleMouseMove.bind(this);
    this.canvas.onmousedown = this.handleMouseDown.bind(this);
    this.marginTop = 150;
    this.margin = 40;
    this.play = this.play.bind(this);
    this.restart = this.restart.bind(this);
    this.undoMove = this.undoMove.bind(this);
    this.redoMove = this.redoMove.bind(this);
    this.initialize(options);
  }

  initialize() {
    const { size } = this.options;
    this.size = size;
    this.unclaimedBoxCount = this.size * this.size;
    this.board = new Board(
      this.size,
      this.margin,
      this.marginTop,
      this.width - this.margin * 2
    );
    this.players = [
      new Player("Player A", "A", new Color("orange", 0.8)),
      new Player("Player B", "B", new Color("blue", 0.4)),
    ];
    this.currentPlayerId = 0;
    this.moves = [];
    this.redos = [];
    document.getElementById("undo").classList.add("disabled");
    document.getElementById("redo").classList.add("disabled");
  }

  isOver() {
    return this.unclaimedBoxCount === 0;
  }

  redoMove() {
    if (this.redos.length > 0) {
      const { playerId, side, points } = this.redos.pop();
      if (this.redos.length === 0) {
        document.getElementById("redo").classList.add("disabled");
      }
      this.moves.push({ playerId, side, points });
      document.getElementById("undo").classList.remove("disabled");
      side.taken = true;
      side.highlighted = false;
      if (points > 0) {
        this.unclaimedBoxCount -= points;
        this.players[playerId].score += points;
        for (const box of side.boxes) {
          if (box.owner === undefined && box.isCompleted()) {
            box.owner = this.players[playerId];
          }
        }
        this.currentPlayerId = playerId;
      } else {
        this.currentPlayerId = 1 - playerId;
      }
    }
  }

  undoMove() {
    if (this.moves.length > 0) {
      const { playerId, side, points } = this.moves.pop();
      if (this.moves.length === 0) {
        document.getElementById("undo").classList.add("disabled");
      }
      this.redos.push({ playerId, side, points });
      document.getElementById("redo").classList.remove("disabled");
      side.taken = false;
      side.highlighted = false;
      if (points > 0) {
        this.unclaimedBoxCount += points;
        this.players[playerId].score -= points;
        for (const box of side.boxes) {
          box.owner = undefined;
        }
      }
      this.currentPlayerId = playerId;
    }
  }

  handleMouseDown(e) {
    if (!this.isOver()) {
      const { offsetX, offsetY } = e;
      if (this.board.containsMousePointer(offsetX, offsetY)) {
        const side = this.board.nearestSide(offsetX, offsetY);
        if (side && !side.taken) {
          side.taken = true;
          side.highlighted = false;
          let points = 0;
          for (const box of side.boxes) {
            if (box.owner === undefined && box.isCompleted()) {
              box.owner = this.players[this.currentPlayerId];
              points += 1;
              this.unclaimedBoxCount -= 1;
            }
          }
          this.moves.push({ playerId: this.currentPlayerId, side, points });
          document.getElementById("undo").classList.remove("disabled");
          this.redos.length = 0;
          document.getElementById("redo").classList.add("disabled");
          this.players[this.currentPlayerId].score += points;
          if (points === 0) {
            // switch player
            this.currentPlayerId = 1 - this.currentPlayerId;
          }
        }
      }
    }
  }

  handleMouseMove(e) {
    document.body.style.cursor = "default";
    if (!this.isOver()) {
      const { offsetX, offsetY } = e;
      for (const side of this.board.sides) {
        side.highlighted = false;
      }
      if (this.board.containsMousePointer(offsetX, offsetY)) {
        this.board.handleMouseMove(offsetX, offsetY);
      }
    }
  }

  drawMessage(ctx) {
    let msg;
    if (this.isOver()) {
      if (this.players[0].score === this.players[1].score) {
        msg = "It's a draw!";
      } else if (this.players[0].score > this.players[1].score) {
        msg = this.players[0].name + " wins!";
      } else {
        msg = this.players[1].name + " wins!";
      }
    } else {
      const name = this.players[this.currentPlayerId].name;
      let moveAgain = false;
      if (this.moves.length > 0) {
        if (this.moves[this.moves.length - 1].points > 0) {
          moveAgain = true;
        }
      }
      msg = name + (moveAgain ? " can move again" : " to move");
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "black";
    ctx.font = "bolder 24px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(msg, this.width / 2, 120);
  }

  draw(ctx) {
    this.board.draw(ctx);
  }

  play() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.draw(this.ctx);
    this.drawMessage(this.ctx);
    [this.margin, this.width - this.margin - 200].forEach((x, id) => {
      this.players[id].drawScore(
        this.ctx,
        x,
        20,
        this.isOver() || this.currentPlayerId === id
      );
    });
    this.timeOutId = setTimeout(this.play, 16);
  }

  restart() {
    clearTimeout(this.timeOutId);
    this.initialize();
    this.play();
  }
}

module.exports = Game;

},{"./board":1,"./color":3,"./player":6}],6:[function(require,module,exports){
class Player {
  constructor(name, symbol, color) {
    this.name = name;
    this.color = color;
    this.symbol = symbol;
    this.score = 0;
  }

  drawScore(ctx, x, y, active, h = 70, w = 200, r = 10) {
    const {
      name,
      score,
      color: { rgb, alpha },
    } = this;
    const alphaMultiplier = active ? 1 : 0.3;
    ctx.globalAlpha = 1 * alphaMultiplier;
    ctx.fillStyle = "black";
    ctx.font = "bolder 16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name + " Score", x + w / 2, y + 10);
    y += 20;
    h -= 20;
    ctx.globalAlpha = (alpha ?? 1) * alphaMultiplier;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fillStyle = rgb;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.font = "bolder 36px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(score, x + w / 2, y + (1.1 * h) / 2);
  }
}
module.exports = Player;

},{}],7:[function(require,module,exports){
class Side {
  constructor(dotA, dotB, id) {
    this.dotA = dotA;
    this.dotB = dotB;
    this.id = id;
    this.taken = false;
    this.highlighted = false;
    this.boxes = [];
  }
  draw(ctx, debugMode) {
    ctx.fillStyle = "black";
    if (debugMode) {
      ctx.fillText(
        this.id,
        (this.dotA.x + this.dotB.x) / 2,
        (this.dotA.y + this.dotB.y) / 2
      );
    } else {
      if (this.taken || this.highlighted) {
        ctx.beginPath();
        if (!this.taken && this.highlighted) {
          ctx.globalAlpha = 0.25;
        }
        ctx.lineWidth = this.dotA.radius;
        ctx.moveTo(this.dotA.x, this.dotA.y);
        ctx.lineTo(this.dotB.x, this.dotB.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}
module.exports = Side;

},{}],8:[function(require,module,exports){
const Game = require("./lib/game");

const SIZE_LIMIT = 6;
const options = { size: 3 };

let game;

function startGame() {
  game = new Game(document.getElementById("canvas"), options);
  game.play();
}

window.onload = function () {
  startGame();
  document.getElementById("undo").addEventListener("click", game.undoMove);
  document.getElementById("redo").addEventListener("click", game.redoMove);
  document.getElementById("reset").addEventListener("click", game.restart);
  document.getElementById("upsize").addEventListener("click", () => {
    if (options.size < SIZE_LIMIT) {
      options.size += 1;
      document.getElementById("downsize").classList.remove("disabled");
      if (options.size === SIZE_LIMIT) {
        document.getElementById("upsize").classList.add("disabled");
      }
      game.restart();
    }
  });
  document.getElementById("downsize").addEventListener("click", () => {
    if (options.size > 2) {
      options.size -= 1;
      document.getElementById("upsize").classList.remove("disabled");
      if (options.size === 2) {
        document.getElementById("downsize").classList.add("disabled");
      }
      game.restart();
    }
  });
};

},{"./lib/game":5}]},{},[8]);
