const Board = require("./board");
const Player = require("./player");
const Color = require("./color");

class Game {
  constructor(canvas, size = 3) {
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
    this.initialize({ size });
  }

  initialize(options) {
    const { size } = options || {};
    this.size = size || this.size || 4;
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
    this.switched = true;
  }

  isOver() {
    return this.unclaimedBoxCount === 0;
  }

  handleMouseDown(e) {
    if (!this.isOver()) {
      const { offsetX, offsetY } = e;
      if (this.board.containsMousePointer(offsetX, offsetY)) {
        const side = this.board.nearestSide(offsetX, offsetY);
        if (side && !side.taken) {
          side.taken = true;
          let points = 0;
          for (const box of side.boxes) {
            if (box.owner === undefined && box.isCompleted()) {
              box.owner = this.players[this.currentPlayerId];
              points += 1;
              this.unclaimedBoxCount -= 1;
            }
          }
          this.players[this.currentPlayerId].score += points;
          if (points === 0) {
            // switch player
            this.switched = true;
            this.currentPlayerId = 1 - this.currentPlayerId;
          } else {
            this.switched = false;
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
      msg = name + (this.switched ? " to move" : " can move again");
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
    if (!this.isOver()) {
      this.timeOutId = setTimeout(this.play, 16);
    }
  }

  restart() {
    clearTimeout(this.timeOutId);
    this.initialize();
    this.play();
  }
}

module.exports = Game;
