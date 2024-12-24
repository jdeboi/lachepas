let mossBushes = [];
let tree;
const mossFactor = 0.5;

function preload() {
  tree = loadImage("../shared/assets/tree.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  mossBushes.push(new MossBush(200, 100, 10));
  mossBushes.push(new MossBush(600, 40, 15));
  mossBushes.push(new MossBush(700, 480, 5));
}

function draw() {
  background(0);

  image(tree, 0, -30, tree.width * 0.5, tree.height * 0.5);

  for (const mossBush of mossBushes) {
    mossBush.update(0.5); // Update physics
    mossBush.display(); // Render the chain
  }

  //   displayFrameRate();
}

function displayFrameRate() {
  fill(255);
  noStroke();
  text(frameRate(), 20, 20);
}

// Mouse interaction handlers
function mousePressed() {
  for (const mossBush of mossBushes) {
    mossBush.handleMousePressed();
  }
}

function mouseDragged() {
  for (const mossBush of mossBushes) {
    mossBush.handleMouseDragged();
  }
}

function mouseReleased() {
  for (const mossBush of mossBushes) {
    mossBush.handleMouseReleased();
  }
}
