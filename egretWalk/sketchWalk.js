const bird = {
  imgs: [],
  imgIndex: 0,
  x: 0,
  y: 0,
  display: function () {
    if (this.imgs[this.imgIndex]) {
      image(this.imgs[this.imgIndex], this.x, this.y); // 200, 200, 0, 0, 0, 0, CONTAIN);
    }
    fill(255);
    noStroke();
    textSize(24);
    text(this.imgIndex, this.x + 10, this.y + 30);
  },
  update: function () {
    // this.move(2);
    if (this.x < 0) {
      this.x = width;
    } else if (this.x > width) {
      this.x = 0;
    }
    if (frameCount % 8 === 0) {
      // this.moveFrame();
    }
  },
  moveFrame: function (dir) {
    this.imgIndex += dir;
    if (this.imgIndex < 0) {
      this.imgIndex = this.imgs.length - 1;
    } else if (this.imgIndex > this.imgs.length - 1) {
      this.imgIndex = 0;
    }
  },
  move: function (dir) {
    this.x += dir;
  },
};

function preload() {
  for (let i = 1; i < 13; i++) {
    bird.imgs[i - 1] = loadImage("../shared/assets/walk/" + i + ".png");
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  bird.display();
  bird.update();
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    bird.moveFrame(-1);
    bird.move(-10);
  } else if (keyCode === RIGHT_ARROW) {
    bird.moveFrame(1);
    bird.move(10);
  }
}
