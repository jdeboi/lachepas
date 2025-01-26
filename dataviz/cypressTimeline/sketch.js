const startYear = 1600;
const endYear = new Date().getFullYear();
let currentYear = startYear;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  // incrementYear();

  const x = 20;

  currentYear = floor(map(mouseX, x, width - x, startYear, endYear));
  currentYear = constrain(currentYear, startYear, endYear);
  displayOriginalTrees(x, x);
  displayAcreBoxes(x, x);
  displayGraph(x, height / 2, width - 2 * x, height / 2 - x);
}

function incrementYear() {
  currentYear++;
  if (currentYear >= endYear) {
    currentYear = endYear;
  }
}

function mousePressed() {
  currentYear = startYear;
}

function displayOriginalTrees(x, y) {
  displayAcreBoxes(x, y, 0, false);
}

function displayAcreBoxes(x, y, year = currentYear, isFilled = true) {
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

function displayYearText(x, y) {
  push();
  translate(x, y);
  fill(255);
  textSize(30);
  noStroke();
  text(currentYear, 0, 0);
  pop();
}

function displayAcresText(acres, x, y) {
  push();
  translate(x, y);
  fill(255);
  textSize(14);
  noStroke();
  const millionAcres = round(acres / 1000000, 1);
  const acresWithCommas = millionAcres
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  text(acresWithCommas + " million acres", 0, 0);
  pop();
}

function displayGraph(x, y, w, h) {
  push();
  translate(x, y);
  strokeWeight(1);

  // axes
  stroke(150);
  line(0, 0, 0, h);
  line(0, h, w, h);

  // data graph
  stroke(255);

  const maxAcres = interpolateCypressTrees(1500) + 100000;
  for (let i = 0; i < w; i++) {
    const year0 = map(i, 0, w, startYear, endYear);
    const year1 = map(i + 1, 0, w, startYear, endYear);
    const numAcres0 = interpolateCypressTrees(year0);
    const numAcres1 = interpolateCypressTrees(year1);
    const yAcres0 = map(numAcres0, 0, maxAcres, h, 0);
    const yAcres1 = map(numAcres1, 0, maxAcres, h, 0);
    // console.log(year0, numAcres0, yAcres0);
    line(i, yAcres0, i + 1, yAcres1);
    // 1931.2666076173605 1218.335 368.10086877
  }

  stroke(255, 0, 0);
  let currentYearX = map(currentYear, startYear, endYear, 0, w);
  const currentYearAcres = interpolateCypressTrees(currentYear);
  const currentYearY = map(currentYearAcres, 0, maxAcres, h, 0);
  line(currentYearX, 0, currentYearX, h);

  push();
  if (currentYearX > width - 300) {
    currentYearX -= 100;
  }
  translate(currentYearX, currentYearY);
  displayYearText(10, 10);
  displayAcresText(currentYearAcres, 10, 30);
  pop();
}
