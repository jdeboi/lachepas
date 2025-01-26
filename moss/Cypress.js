function getTreeSzFactor(level, maxLevel) {
  const treeSzFactor = map(level, 0, maxLevel - 1, 0.5, 0.1);
  return treeSzFactor;
}

function getPositionScaleFactor(level, maxLevel) {
  const xScaleFactor = map(level, 0, maxLevel - 1, 1, 0.3);
  return xScaleFactor;
}

function getTreeDim(column, level, maxLevel) {
  const treeSzFactor = getTreeSzFactor(level, maxLevel);
  const spacing = 100 * treeSzFactor;
  const w = treeImg.width * treeSzFactor;
  const h = treeImg.height * treeSzFactor;
  const x = column * (w + spacing);
  const y = level * 100 - 30;
  return { w, h, x, y, spacing, treeSzFactor };
}

class Cypress {
  constructor(column, level, maxLevel = 3) {
    this.level = level;
    this.maxLevel = maxLevel;
    const { x, y, w, h, treeSzFactor } = getTreeDim(column, level, maxLevel);
    this.treeWidth = w;
    this.treeHeight = h;
    this.column = column;
    this.x = x;
    this.y = y;
    this.mossBushes = [];
    this.mossBushes.push(
      new MossBush(400 * treeSzFactor, 200 * treeSzFactor, 10, treeSzFactor)
    );
    this.mossBushes.push(
      new MossBush(1200 * treeSzFactor, 80 * treeSzFactor, 15, treeSzFactor)
    );
    this.mossBushes.push(
      new MossBush(1400 * treeSzFactor, 990 * treeSzFactor, 5, treeSzFactor)
    );
  }

  display(xPosition, displayMoss = true) {
    push();
    const xScaleFactor = getPositionScaleFactor(this.level, this.maxLevel);
    translate(-xPosition * xScaleFactor, 0);

    translate(this.x, this.y);
    image(treeImg, 0, 0, this.treeWidth, this.treeHeight);

    if (displayMoss) {
      this.mossBushes.forEach((mossBush) => {
        mossBush.display();
        mossBush.update(0.5);
      });
    }

    fill(255, 0, 0);
    noStroke();
    text(this.column, 0, 100);
    pop();
  }

  // Mouse interaction handlers
  handleMousePressed() {
    for (const mossBush of this.mossBushes) {
      mossBush.handleMousePressed();
    }
  }

  handleMouseDragged() {
    for (const mossBush of this.mossBushes) {
      mossBush.handleMouseDragged();
    }
  }

  handleMouseReleased() {
    for (const mossBush of this.mossBushes) {
      mossBush.handleMouseReleased();
    }
  }

  isOffScreen(dir) {
    if (dir < 0) {
      return this.x < -this.treeWidth;
    } else {
      return this.x > width + this.treeWidth;
    }
  }

  recyclePosition(dir, treesInLevel) {
    if (dir < 0) {
      // get tree that has lowest x value
      const lowestTree = treesInLevel.reduce((prev, curr) => {
        return prev.x < curr.x ? prev : curr;
      });
      this.x = lowestTree.x + lowestTree.treeWidth;
    } else {
      // get tree that has highest x value
      const highestTree = treesInLevel.reduce((prev, curr) => {
        return prev.x > curr.x ? prev : curr;
      });
      this.x = highestTree.x - highestTree.treeWidth;
    }
  }
}
