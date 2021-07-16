(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.height = canvas.height;
    this.width = canvas.width;
    this.canvas.onmousemove = this.handleMouseMove.bind(this);
    this.size = 4;
    this.marginTop = 200;
    this.margin = 70;
    this.boxWidth = (this.width - this.margin * 2) / this.size;

    this.drawGrid(this.ctx);
  }

  handleMouseDown(e) {}

  handleMouseMove(e) {
    // console.log(e.offsetX, e.offsetY);
  }

  drawGrid(ctx) {
    for (let i = 0; i < this.size + 1; i++) {
      for (let j = 0; j < this.size + 1; j++) {
        const y = this.height - this.margin - j * this.boxWidth;
        const x = this.margin + i * this.boxWidth;
        this.drawDot(ctx, x, y);
      }
    }
  }

  drawDot(ctx, x, y) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fill();
  }
}

module.exports = Game;

},{}],2:[function(require,module,exports){
const Game = require("./lib/game");

window.onload = function () {
  new Game(document.getElementById("canvas"));
};

},{"./lib/game":1}]},{},[2]);
