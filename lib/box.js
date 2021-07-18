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

  completeness() {
    return this.sides.reduce((acc, side) => acc + (side.taken ? 1 : 0), 0);
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
