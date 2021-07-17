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
