// let mossBushes = [];
let xPosition = 0;
let treeImg;
const mossFactor = 0.5;
const trees = [[], [], []];

function preload() {
  treeImg = loadImage("../shared/assets/tree.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let z = 0; z < 3; z++) {
    for (let x = 0; x < 3; x++) {
      trees[z].push(new Cypress(x, z));
    }
  }
}

function draw() {
  background(0);
  xPosition = mouseX;
  displayTreeLevel(2, xPosition);
  displayTreeLevel(1, xPosition);
  displayTreeLevel(0, xPosition);
  // image(tree, 0, -30, tree.width * 0.5, tree.height * 0.5);

  // for (const mossBush of mossBushes) {
  //   mossBush.update(0.5); // Update physics
  //   mossBush.display(); // Render the chain
  // }

  displayFrameRate();
}

function displayFrameRate() {
  fill(255, 0, 0);
  noStroke();
  textSize(30);
  text(round(frameRate()), 20, 20);
}

// Mouse interaction handlers
function mousePressed() {
  for (let z = 0; z < trees.length; z++) {
    for (const tree of trees[z]) {
      tree.handleMousePressed();
    }
  }
}

function mouseDragged() {
  for (let z = 0; z < trees.length; z++) {
    for (const tree of trees[z]) {
      tree.handleMouseDragged();
    }
  }
}

function mouseReleased() {
  for (let z = 0; z < trees.length; z++) {
    for (const tree of trees[z]) {
      tree.handleMouseReleased();
    }
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    xPosition -= 10;
  } else if (keyCode === RIGHT_ARROW) {
    xPosition += 10;
  }
}

function displayTreeLevel(level, xPosition, displayMoss = true) {
  for (const tree of trees[level]) {
    tree.display(xPosition, displayMoss);
  }
}
