const startYear = 1600;
const endYear = new Date().getFullYear();
const boxSpacing = 2;
const boxSize = 10;
let currentYear = startYear;
let louisianaImg;
let forestImg;

function preload() {
  louisianaImg = loadImage("../louisiana.png");
  forestImg = loadImage("../laforest.png");
}
function setup() {
  createCanvas(windowWidth, windowHeight);

  const factor = 0.5;
  louisianaImg.resize(
    louisianaImg.width * factor,
    louisianaImg.height * factor
  );
  forestImg.resize(louisianaImg.width, louisianaImg.height);
}

function draw() {
  background(0, 80, 100);

  // incrementYear();

  const w = louisianaImg.width;
  const h = louisianaImg.height;
  const x = (width - w) / 2;
  const y = (height - h) / 2;

  currentYear = floor(map(mouseX, x, x + w, startYear, endYear));
  currentYear = constrain(currentYear, startYear, endYear);

  noStroke();
  // image(louisianaImg, x, y);

  //
  //
  // displayTerrainBoxes(x, y);
  displayLouisianaAcreBoxes(x, y);
  displayOriginalAcreBoxes(x, y);
  displayAcreBoxes(x, y, interpolateCypressTrees(currentYear));
  displayGraph(x, y + h / 2, w, h / 2);
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

function displayLouisianaAcreBoxes(x, y) {
  const louisianaAcres = 33520320;
  displayAcreBoxes(x, y, louisianaAcres, false, true);
}

function displayOriginalAcreBoxes(x, y) {
  const numAcres = interpolateCypressTrees(1600);
  displayAcreBoxes(x, y, numAcres, false, false);
}

function getNumberOfBoxes() {
  // const screenArea = width * height;
  const percentageBlackPixels = 0.5443;
  const louisianaImgArea = louisianaImg.width * louisianaImg.height;
  const pixelAreaLouisiana = louisianaImgArea * percentageBlackPixels;

  const numBoxes = pixelAreaLouisiana / (boxSize + boxSpacing) ** 2;
  // const numBoxesPerRow = floor(numBoxes / width);
  // const numBoxesPerCol = floor(numBoxes / height);
  // return numBoxesPerRow * numBoxesPerCol;
  return numBoxes;
}

function getAcresPerBox() {
  const louisianaAcres = 33520320;
  const acresPerBox = louisianaAcres / getNumberOfBoxes();

  return acresPerBox;
}

function displayTerrainBoxes(x, y) {
  forestImg.loadPixels();
  push();
  translate(x, y);
  translate(-5, -5);

  const greenMapCol = color(13, 131, 74);
  const orangeMapCol = color(239, 114, 71);
  const yellowMapCol = color(245, 223, 67);
  const redMapCol = color(226, 67, 71);

  const terrain = {
    OakPine: {
      count: 0,
      color: orangeMapCol,
    },
    LoblollyShortleafPine: {
      count: 0,
      color: yellowMapCol,
    },
    OakGumCypress: {
      count: 0,
      color: greenMapCol,
    },
    LongleafSlashPine: {
      count: 0,
      color: redMapCol,
    },
  };
  let totalBoxes = 0;

  for (let _x = 0; _x < forestImg.width; _x += boxSize + boxSpacing) {
    for (let _y = 0; _y < forestImg.height; _y += boxSize + boxSpacing) {
      const col = forestImg.get(_x, _y);
      const laCol = louisianaImg.get(_x, _y);

      // fill red, yellow, green, or no fill based on col
      if (isCloseToColor(terrain.OakPine.color, col)) {
        fill(terrain.OakPine.color);
        terrain.OakPine.count++;
      } else if (isCloseToColor(terrain.LoblollyShortleafPine.color, col)) {
        fill(terrain.LoblollyShortleafPine.color);
        terrain.LoblollyShortleafPine.count++;
      } else if (isCloseToColor(terrain.OakGumCypress.color, col)) {
        fill(terrain.OakGumCypress.color);
        terrain.OakGumCypress.count++;
      } else if (isCloseToColor(terrain.LongleafSlashPine.color, col)) {
        fill(terrain.LongleafSlashPine.color);
        terrain.LongleafSlashPine.count++;
      } else if (alpha(laCol) > 50) {
        fill(0);
      } else {
        noFill();
      }

      totalBoxes++;
      rect(_x, _y, boxSize, boxSize);
    }
  }
  pop();

  // console.log(terrain.OakGumCypress.count / totalBoxes);
}

function isCloseToColor(targetCol, col) {
  const r = red(targetCol);
  const g = green(targetCol);
  const b = blue(targetCol);
  const d = dist(r, g, b, red(col), green(col), blue(col));
  if (d < 30) {
    return true;
  }
  return false;
}

function displayAcreBoxes(
  x,
  y,
  numAcres,
  isFilled = true,
  isLouisiana = false
) {
  push();
  translate(x, y);
  // Ensure image is properly loaded
  louisianaImg.loadPixels();

  const numBoxesToDisplay = floor(numAcres / getAcresPerBox());
  const numBoxesWidth = floor(louisianaImg.width / (boxSize + boxSpacing));

  let drawnBoxes = 0;
  let i = 0;

  while (drawnBoxes < numBoxesToDisplay && i < numBoxesToDisplay * 2) {
    const xR = (i % numBoxesWidth) * (boxSize + boxSpacing);
    const yR = floor(i / numBoxesWidth) * (boxSize + boxSpacing);

    // Get the pixel color at (xR, yR) in the Louisiana image
    const col = louisianaImg.get(xR + boxSize / 2, yR + boxSize / 2); // Sample from center of box
    const alphaVal = alpha(col); // Convert to brightness value
    // Only draw if the pixel is black (or close to black)
    if (alphaVal > 50) {
      if (isFilled) {
        fill("green");
      } else {
        noFill();
      }

      if (isLouisiana) {
        stroke(0, 0, 0, 50);
      } else {
        stroke("green");
      }

      strokeWeight(1);
      rect(xR, yR, boxSize, boxSize);
      drawnBoxes++;
    }

    i++; // Move to next possible box position
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
