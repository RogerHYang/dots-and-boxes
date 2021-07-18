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
