let currentYearIndex = 1600;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  incrementYear();

  displayOriginalTrees(20, 50);
  displayAcres(20, 50);
  displayYear(20, 10);
}

function incrementYear() {
  // if ((frameCount % 60) * 8 === 0) {
  currentYearIndex++;
  // currentYearIndex %= timeline.length;
  if (currentYearIndex >= 2025) {
    // currentYearIndex = 1600;
    currentYearIndex = 2025;
  }
  // }
}

function mousePressed() {
  currentYearIndex = 1600;
}

function displayOriginalTrees(x, y) {
  displayAcres(x, y, 0, false);
}

function displayAcres(x, y, year = currentYearIndex, isFilled = true) {
  push();
  translate(x, y);
  const numAcres = interpolateCypressTrees(year) / 1000;
  for (let i = 0; i < numAcres; i++) {
    const acreSize = 10;
    const spacing = 2;
    const numAcresWidth = (width - 2 * x) / (acreSize + spacing);
    const xR = (i % numAcresWidth) * (acreSize + spacing);
    const yR = floor(i / numAcresWidth) * (acreSize + spacing);

    if (isFilled) {
      fill("green");
    } else {
      noFill();
    }
    stroke("green");
    strokeWeight(1);
    rect(xR, yR, acreSize, acreSize);
  }
  pop();
}

function displayYear(x, y) {
  push();
  translate(x, y);
  fill(255);
  textSize(30);
  noStroke();
  text(currentYearIndex, 0, 30);

  textSize(10);
  text("click to reset", 80, 30);
  pop();
}
