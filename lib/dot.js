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
