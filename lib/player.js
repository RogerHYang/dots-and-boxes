class Player {
  constructor(name, symbol, color) {
    this.name = name;
    this.color = color;
    this.symbol = symbol;
    this.score = 0;
  }

  drawScore(ctx, x, y, active, h = 70, w = 200, r = 10) {
    const {
      name,
      score,
      color: { rgb, alpha },
    } = this;
    const alphaMultiplier = active ? 1 : 0.3;
    ctx.globalAlpha = 1 * alphaMultiplier;
    ctx.fillStyle = "black";
    ctx.font = "bolder 16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name + " Score", x + w / 2, y + 10);
    y += 20;
    h -= 20;
    ctx.globalAlpha = (alpha ?? 1) * alphaMultiplier;
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
    ctx.fillStyle = rgb;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.font = "bolder 36px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(score, x + w / 2, y + (1.1 * h) / 2);
  }
}
module.exports = Player;
