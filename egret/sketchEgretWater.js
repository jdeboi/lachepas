let grid;
let pBuffer;
let circleSize = 0;
let phraseY = 0;
let stars = [];

let moon = {
  img: null,
  x: 0,
  y: 0,
  szFactor: 0.12,
  w: 0,
  h: 0,
  init: function () {
    if (this.img) {
      this.w = this.img.width * this.szFactor;
      this.h = this.img.height * this.szFactor;
    }
    this.y = -height / 2 + this.h / 2 + 50;
    this.x = width / 2 - this.w / 2 - 100;
  },
  display: function (pg) {
    const y = this.y + 10 * sin(frameCount * 0.01);
    pg.push();
    pg.noStroke();
    pg.fill(255, 255, 255, 0); // Side effect = Sets gl.BLEND
    if (this.img) pg.texture(this.img);
    pg.translate(this.x, y, 0);
    pg.plane(this.w, this.h);
    pg.pop();
  },
};

let egret = {
  img: null,
  x: 0,
  y: 0,
  szFactor: 0.2,
  w: 0,
  h: 0,
  init: function () {
    // Draw on pBuffer
    // pBuffer.clear(); // Clear the buffer to reset
    // pBuffer.background(255, 0, 0);
    // this.display(pBuffer);
    if (this.img) {
      this.w = this.img.width * this.szFactor;
      this.h = this.img.height * this.szFactor;
    }
    this.y = -height / 2 + this.h / 2 + 130;
    this.x = -width / 2 + this.w / 2 + width * 0.1;
  },
  display: function (pg) {
    pg.push();
    pg.noStroke();
    pg.fill(0, 0, 0, 0); // Side effect = Sets gl.BLEND

    if (this.img) pg.texture(this.img);
    pg.translate(this.x, this.y, 0);
    pg.plane(this.w, this.h);

    // pg.noFill();
    // pg.strokeWeight(4);
    // pg.stroke("#8BB3EC");
    // pg.ellipse(0, 0, this.h * 1.2);
    pg.pop();
  },
  isOver: function (x, y) {
    let d = dist(x, y, this.x, this.y);
    return d < this.h * 0.6;
  },
  isOverSQ: function (x, y) {
    return (
      x > this.x - this.w / 2 &&
      x < this.x + this.w / 2 &&
      y > this.y - this.h / 2 &&
      y < this.y + this.h / 2
    );
  },
};

let font;

const ripples = [];

function preload() {
  egret.img = loadImage("../shared/assets/egret.png");
  moon.img = loadImage("../shared/assets/moon.png");
  // font = loadFont("../shared/assets/Orleans City.otf");
  // font = loadFont("../shared/assets/LESNOIR.ttf");
  font = loadFont("../shared/assets/PARISREBEL.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pBuffer = createGraphics(windowWidth, windowHeight, WEBGL);

  textFont(font, 14);

  // gridSize, spacing, noiseScale, zOffsetSpeed
  grid = new PerlinGrid(30, 20, 0.1, 0.02);

  egret.init();
  moon.init();
  initStars();

  phraseY = egret.y + egret.h / 2 - 10;
  addRipple();
  setInterval(addRipple, 5000);
}

function draw() {
  background(0);

  push();
  circleSize += 0.5; // += operator adds two values together and assigns the result to a variable
  circleSize = constrain(circleSize, 0, 3000);
  displayStars();
  displayWaves();

  // displayWaves();

  for (const ripple of ripples) {
    ripple.display();
  }

  // grid.update(); // Update the z-offset for animation
  // grid.display(); // Display the Perlin Noise grid

  // displaySubmission("hello world");
  // displayPath();
  // displayTextAlongPath("hello world", points);
  // displayTextOnSineWaveWithRotation("Sinusoidal Path with Tangent Rotation", 5, frameCount*.02, 15);

  // fill(255);
  // displayTextAroundCircle("Circular Text Wrap", circleSize/10, 15);
  // displayCircleText();

  egret.display(this);
  moon.display(this);
  pop();

  // displayFramerate();
}

function displayPath() {
  noFill();
  stroke(255);
  beginShape();
  for (let p of points) {
    vertex(p.x, p.y);
  }
  endShape();
}

function mousePressed() {
  circleSize = 0; // starts circle size off as 0 so slate appears empty before you press the mouse
}

function addRipple() {
  if (phraseY > height) return;
  const ripple = new Ripple(
    phrases[ripples.length % phrases.length],
    -width / 2 + 30,
    phraseY,
    300
  );
  const spacing = 15;
  phraseY += ripple.txtSize + spacing;
  ripples.push(ripple);
}

function initStars() {
  let x = 10;
  while (x < width) {
    x += random(10, 20);
    let y = random(0, height * 0.3);
    let maxSize = random(3, 5);
    let minSize = random(2, 3);
    stars.push(new TwinklingStar(x, y, maxSize, minSize));
  }
}

function displayStars() {
  push();
  translate(-width / 2, -height / 2);
  for (let star of stars) {
    star.update();
    star.display();
  }
  pop();
}

function displayWaves() {
  colorMode(HSB, 360);
  noStroke();
  let waveCount = 10;

  for (let i = 0; i < waveCount; i++) {
    wave(
      map(i, 0, waveCount, 220, 250),
      map(i, 0, waveCount, 200, 100),
      height / 2 + pow(i, 2.5) + 0 * (i + 1),
      map(i, 0, waveCount, 0.1, 0.75),
      map(i, 0, waveCount, 4, 15)
    );
  }
  colorMode(RGB, 255);
}

function wave(waveHue, waveBrightness, waveHeight, speed, amp) {
  push();
  translate(-width / 2, -height / 2);
  fill(waveHue, 255, waveBrightness);

  let count = 25;

  beginShape();

  vertex(0, waveHeight / 2);
  vertex(0, waveHeight / 2);

  for (let x = 0; x < width; x += width / count) {
    let y = waveHeight / 2 + sin(frameCount * 0.02 - x * speed) * amp;
    curveVertex(x, y);
  }

  vertex(width, waveHeight / 2);
  vertex(width, waveHeight / 2);
  vertex(width, height);
  vertex(0, height);
  vertex(0, waveHeight / 2);

  endShape();
  pop();
}
