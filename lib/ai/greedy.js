const Player = require("../player");

class AiGreedy extends Player {
  constructor(board, name, symbol, color) {
    super(board, name, symbol, color, true);
  }

  timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async makeMove() {
    const priority = { extraHigh: [], high: [], medium: [], low: [] };
    for (const side of this.board.availableSides()) {
      let totalCompleteness = 0;
      let maxCompleteness = 0;
      for (const box of side.boxes) {
        const completeness = box.completeness();
        totalCompleteness += completeness;
        maxCompleteness = Math.max(maxCompleteness, completeness);
      }
      if (maxCompleteness === 2) {
        priority.low.push(side);
      } else if (maxCompleteness === 3) {
        if (totalCompleteness === 6) {
          priority.extraHigh.push(side);
        } else {
          priority.high.push(side);
        }
      } else {
        priority.medium.push(side);
      }
    }
    let side;
    for (let level of ["extraHigh", "high", "medium", "low"]) {
      const candidates = priority[level];
      if (candidates.length > 0) {
        side = candidates[Math.floor(Math.random() * candidates.length)];
        break;
      }
    }
    await this.timeout(250);
    return side;
  }
}

module.exports = AiGreedy;
