const Game = require("./lib/game");

let game;

function startGame() {
  game = new Game(document.getElementById("canvas"));
  game.play();
}

window.onload = function () {
  startGame();
  document.getElementById("reset").addEventListener("click", game.restart);
};
