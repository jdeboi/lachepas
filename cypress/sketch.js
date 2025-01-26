// let mossBushes = [];
let xPosition = 0;
let treeImg;
const mossFactor = 0.5;
const maxLevel = 3;
const trees = [[], [], [], []];

function preload() {
  treeImg = loadImage("../shared/assets/tree.png");
}

function setup() {
  const canvasW = min(1920, windowWidth);
  const canvasH = min(1080, windowHeight);
  createCanvas(canvasW, canvasH);

  for (let z = 0; z < maxLevel; z++) {
    let column = 0;
    let x = 0;
    const { w, spacing } = getTreeDim(0, z, maxLevel);
    const treeW = w + spacing;
    while (x < width) {
      trees[z].push(new Cypress(column, z, maxLevel));
      x += treeW;
      column++;
    }
  }
}

function draw() {
  background(0);

  for (let z = maxLevel - 1; z >= 0; z--) {
    displayTreeLevel(z, xPosition, false);
  }

  displayWaves();
  displayFrameRate();
}

function moveTrees() {
  xPosition = mouseX;
  const dir = pMouseX - mouseX;
  updateTrees(dir);
}

function updateTrees(dir) {
  for (let z = maxLevel - 1; z >= 0; z--) {
    for (let tree of trees[z]) {
      if (tree.isOffScreen(dir)) {
        tree.recyclePosition(dir, trees[z]);
        return;
      }
    }
  }
}

function displayFrameRate() {
  fill(255, 0, 0);
  noStroke();
  textSize(30);
  text(round(frameRate()), 20, 20);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    xPosition -= 10;
    updateTrees(-1);
  } else if (keyCode === RIGHT_ARROW) {
    xPosition += 10;
    updateTrees(1);
  }
}

function displayTreeLevel(level, xPosition, displayMoss = true) {
  for (const tree of trees[level]) {
    tree.display(xPosition, displayMoss);
  }
}
function displayWaves() {
  colorMode(HSB, 360);
  noStroke();
  let waveCount = 4;

  for (let i = 0; i < waveCount; i++) {
    const waveHue = map(i, 0, waveCount, 220, 250);
    const waveBrightness = map(i, 0, waveCount, 200, 100);
    const waveY = height * 0.75 + pow(i, 2.5);
    const waveSpeed = map(i, 0, waveCount, 0.1, 0.75);
    const waveAmp = map(i, 0, waveCount, 4, 15);
    wave(waveHue, waveBrightness, waveY, waveSpeed, waveAmp);
  }
  colorMode(RGB, 255);
}

function wave(waveHue, waveBrightness, waveY, speed, amp) {
  push();
  //   translate(-width / 2, -height / 2);
  fill(waveHue, 255, waveBrightness);

  let count = 25;

  beginShape();

  vertex(0, waveY);
  vertex(0, waveY);

  for (let x = 0; x < width; x += width / count) {
    let y = waveY + sin(frameCount * 0.02 - x * speed) * amp;
    curveVertex(x, y);
  }

  vertex(width, waveY);
  vertex(width, waveY);
  vertex(width, height);
  vertex(0, height);
  vertex(0, waveY);

  endShape();
  pop();
}
