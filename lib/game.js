const Board = require("./board");
const Player = require("./player");
const Color = require("./color");

class Game {
  constructor(canvas, settings) {
    this.settings = settings;
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
    this.initialize(settings);
  }

  initialize() {
    const { size } = this.settings;
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
          document.body.style.cursor = "default";
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
