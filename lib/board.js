const Dot = require("./dot");
const Side = require("./side");
const Box = require("./box");

class Board {
  constructor(size, x0, y0, width) {
    const margin = 10;
    this.debugMode = false;
    this.size = size;
    this.dim = { x0, y0, width, margin };
    const boxWidth = (width - margin * 2) / size;
    this.dots = [];
    for (let j = 0; j < this.size + 1; j++) {
      const y = y0 + margin + j * boxWidth;
      for (let i = 0; i < this.size + 1; i++) {
        const x = x0 + margin + i * boxWidth;
        this.dots.push(new Dot(x, y, this.dots.length));
      }
    }
    this.sides = [];
    for (let i = 0; i < this.size * 2 + 1; i++) {
      const p = Math.floor(i / 2) * (this.size + 1);
      if (i % 2 == 0) {
        for (let j = 0; j < this.size; j++) {
          this.sides.push(
            new Side(this.dots[j + p], this.dots[j + p + 1], this.sides.length)
          );
        }
      } else {
        for (let j = 0; j < this.size + 1; j++) {
          this.sides.push(
            new Side(
              this.dots[j + p],
              this.dots[j + p + 1 + this.size],
              this.sides.length
            )
          );
        }
      }
    }
    this.boxes = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const id = this.boxes.length;
        const a =
          Math.floor(id / this.size) * (2 * this.size + 1) + (id % this.size);
        const d = a + this.size;
        const b = a + this.size + 1;
        const c = a + this.size * 2 + 1;
        const box = new Box(
          this.sides[a],
          this.sides[b],
          this.sides[c],
          this.sides[d]
        );
        this.boxes.push(box);
        this.sides[a].boxes.push(box);
        this.sides[b].boxes.push(box);
        this.sides[c].boxes.push(box);
        this.sides[d].boxes.push(box);
      }
    }
  }

  containsMousePointer(x, y) {
    const { x0, y0, width } = this.dim;
    return x0 <= x && x <= x0 + width && y0 <= y && y <= y0 + width;
  }

  nearestSide(x, y) {
    for (const box of this.boxes) {
      if (box.containsMousePointer(x, y, this.dim.margin)) {
        const side = box.nearestSide(x, y);
        if (!side?.owner) {
          return side;
        }
        break;
      }
    }
  }

  handleMouseMove(x, y) {
    for (const box of this.boxes) {
      if (box.containsMousePointer(x, y, this.dim.margin)) {
        const side = box.nearestSide(x, y);
        if (side) {
          side.highlighted = true;
          document.body.style.cursor = "pointer";
        }
        break;
      }
    }
  }

  draw(ctx) {
    for (const dot of this.dots) {
      dot.draw(ctx, this.debugMode);
    }
    for (const side of this.sides) {
      side.draw(ctx, this.debugMode);
    }
    for (const box of this.boxes) {
      box.draw(ctx, this.debugMode);
    }
  }
}
module.exports = Board;
