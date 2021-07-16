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
