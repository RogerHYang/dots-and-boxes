const Game = require("./lib/game");

window.onload = function () {
  new Game(document.getElementById("canvas"));
};
