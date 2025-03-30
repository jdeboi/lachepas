/*
The average size of a Louisiana bald cypress tree (\(Taxodiumdistichum\)) 
is 50–70 feet tall and 25 feet wide, but older trees can be much taller. 
Most Bald Cypress Trees found in the Atchafalaya Basin today are between 
95 and 140 years old. They are what we call “new-growth” Cypress Trees 
because they were cut down around the 1880s following the collapse of 
Louisiana's plantation-based economy.

The National Champion Bald Cypress is in the Cat Island National Wildlife 
Refuge, near St. Francisville, Louisiana, and it is 96 feet (29 m) tall, 
56 feet (17 m) in circumference, and is estimated to be approximately 
1,500 years old.
*/

let trees = [];
let championImg;
let smallCypressImg;
const factor = 8;

function preload() {
  championImg = loadImage("cypress2.jpg");
  smallCypressImg = loadImage("tree3.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create two cypress tree objects
  trees.push(
    // x, baseY, heightFt, circumferenceFt, age, name
    new CypressTree(150, height - 50, 70, 25, 120, "New-Growth Bald Cypress")
  );
  trees.push(
    // x, baseY, heightFt, circumferenceFt, age, name
    new CypressTree(450, height - 50, 96, 56, 1500, "Champion Bald Cypress")
  );
}

function draw() {
  background(220);

  push();
  let factorT = 0.155;
  translate(390, height - 50 - championImg.height * factorT + 129 * factorT);
  image(
    championImg,
    0,
    0,
    championImg.width * factorT,
    championImg.height * factorT
  );
  pop();

  push();
  factorT = 0.35;
  translate(120, height - 50 - smallCypressImg.height * factorT + 86 * factorT);
  image(
    smallCypressImg,
    0,
    0,
    smallCypressImg.width * factorT,
    smallCypressImg.height * factorT
  );
  pop();

  // Draw the trees
  for (let tree of trees) {
    tree.display();
  }

  // draw person
  noStroke();
  fill("brown");
  rect(100, height - 50 - 6 * factor, 1.5 * factor, 6 * factor);

  // draw small base stick
  fill("red");
  rect(mouseX, height - 50, 4.5 * factor, 10);

  // draw small base stick
  fill("red");
  rect(mouseX + 150, height - 50, 14 * factor, 10);
}

// Cypress Tree Class
class CypressTree {
  constructor(x, baseY, heightFt, circumferenceFt, age, name) {
    this.x = x;
    this.baseY = baseY;

    this.height = heightFt * factor;
    this.width = (circumferenceFt / Math.PI) * factor;
    this.age = age;
    this.name = name;
  }

  display() {
    // Draw tree trunk
    fill(139, 69, 19, 100);
    rect(
      this.x - this.width / 6,
      this.baseY - this.height / 1.2,
      this.width / 3,
      this.height / 1.2
    );

    // Draw foliage (cone shape)
    fill(34, 139, 34);
    triangle(
      this.x - this.width / 2,
      this.baseY - this.height,
      this.x + this.width / 2,
      this.baseY - this.height,
      this.x,
      this.baseY - this.height - this.width
    );

    // Draw label
    fill(0);
    textAlign(CENTER);
    textSize(12);
    text(this.name + "\n" + this.age + " years old", this.x, this.baseY + 20);
  }
}
