class MossBush {
  constructor(x, y, numChains, szFactor) {
    this.mossChains = [];
    this.szFactor = szFactor;
    for (let i = 0; i < numChains; i++) {
      const dx = i * 3 * szFactor;
      const dy = random(-5, 5) * szFactor;
      const minLen = 100 * szFactor;
      const maxLen = 400 * szFactor;
      let len = map(i, 0, numChains / 2, minLen, maxLen);
      if (i > numChains / 2) {
        len = map(i, numChains / 2, numChains, maxLen, minLen);
      }
      len += random(-10, 10) * szFactor;
      this.mossChains.push(new MossChain(x + dx, y + dy, len, szFactor));
    }
  }

  display() {
    this.mossChains.forEach((mossChain) => {
      mossChain.display();
    });
  }

  update(growthRate) {
    this.mossChains.forEach((mossChain) => {
      // remove current mossChain from this.mossChains
      const otherChains = this.mossChains.filter(
        (chain) => chain !== mossChain
      );
      mossChain.update(otherChains);
      mossChain.grow(growthRate);
    });
  }

  handleMouseDragged() {
    this.mossChains.forEach((mossChain) => {
      mossChain.handleMouseDragged();
    });
  }

  handleMousePressed() {
    this.mossChains.forEach((mossChain) => {
      mossChain.handleMousePressed();
    });
  }

  handleMouseReleased() {
    this.mossChains.forEach((mossChain) => {
      mossChain.handleMouseReleased();
    });
  }
}

class MossChain {
  constructor(x, y, terminalLength, szFactor) {
    this.nodes = [];
    this.szFactor = szFactor;
    this.constraints = [];
    this.draggingNode = null;
    this.col = this.getColor();
    this.nodeSpacing = random(10, 30) * szFactor;
    this.growthLength = 0; // Tracks the total growth length
    this.terminalLength = terminalLength * szFactor;
    this.isGrowing = true;
    // Add the first node
    this.nodes.push({
      x: x,
      y: y,
      prevX: x,
      prevY: y,
      isFixed: true, // First node is fixed
      leaves: this.createLeaves(), // No leaves on the root node
    });

    // this.tip = {
    //   x: x,
    //   y: y,
    //   leaves: this.createLeaves(), // Tip has its own leaves
    // };
    this.createNode();
  }

  getColor() {
    const colors = [color(127, 141, 127), color(53, 62, 44), color(255)];
    const col = lerpColor(colors[0], random(colors), random(0, 1));
    return color(red(col), green(col), blue(col), 200);
  }

  // Generate random leaves
  createLeaves() {
    const leafCount = int(random(1, 4)); // 1 to 3 leaves
    let leaves = [];
    for (let i = 0; i < leafCount; i++) {
      leaves.push(new Leaf(i, this.szFactor));
    }
    return leaves;
  }

  // Grow the moss
  grow(growthRate) {
    if (!this.isGrowing) {
      return; // Moss has reached its terminal length
    }
    if (this.growthLength >= this.terminalLength) {
      this.isGrowing = false;
      return;
    }
    if (this.draggingNode) {
      return;
    }

    this.growthLength += growthRate;

    // Get the last node and calculate the tip's target position
    const lastNode = this.nodes[this.nodes.length - 2];
    const tipNode = this.nodes[this.nodes.length - 1];
    // let targetX = lastNode.x;
    // let targetY = lastNode.y + this.nodeSpacing;

    // // Interpolate the tip position toward the target
    // let dx = targetX - tipNode.x;
    // let dy = targetY - tipNode.y;
    // let distance = sqrt(dx * dx + dy * dy);

    let distance = dist(lastNode.x, lastNode.y, tipNode.x, tipNode.y);
    if (distance < this.nodeSpacing) {
      tipNode.y += growthRate; //(dy / distance) * growthRate;
      const lastContraint = this.constraints[this.constraints.length - 1];
      lastContraint.length += growthRate; //growthRate;
    } else {
      this.createNode();
    }

    this.growLeaves(growthRate);
  }

  growLeaves(growthRate) {
    // Grow the leaves on existing nodes
    for (const node of this.nodes) {
      for (let leaf of node.leaves) {
        leaf.grow(growthRate * 0.4);
      }
    }
  }

  createNode() {
    this.nodeSpacing = random(10, 30) * this.szFactor;
    let tipNode = this.nodes[this.nodes.length - 1];
    this.nodes.push({
      x: tipNode.x,
      y: tipNode.y,
      prevX: tipNode.x,
      prevY: tipNode.y,
      isFixed: false,
      leaves: this.createLeaves(), // Transfer leaves to the new node
    });

    tipNode = this.nodes[this.nodes.length - 1];
    const lastNode = this.nodes[this.nodes.length - 2];

    // Add a new constraint
    this.constraints.push({
      nodeA: lastNode,
      nodeB: tipNode,
      length: 0,
    });
  }

  // Apply attractive and repulsive forces between nodes
  applyForces(otherChains) {
    const otherNodes = otherChains.flatMap((chain) => chain.nodes);
    const attractStrength = 0.05; // Strength of attraction
    const repelStrength = 0.1; // Strength of repulsion
    const distanceThreshold = 100; // Max distance for interactions

    for (let i = 0; i < otherNodes.length; i++) {
      let nodeA = otherNodes[i];
      for (let j = i + 1; j < otherNodes.length; j++) {
        let nodeB = otherNodes[j];
        let dx = nodeB.x - nodeA.x;
        let dy = nodeB.y - nodeA.y;
        let distance = sqrt(dx * dx + dy * dy);
        if (distance === 0 || distance > distanceThreshold) continue;

        // Normalize the vector
        let nx = dx / distance;
        let ny = dy / distance;

        // Attractive force (Hooke's Law)
        let attractForce = -attractStrength * (distance - this.nodeSpacing);

        // Repulsive force (Inverse-square law)
        let repelForce = repelStrength / (distance * distance);

        // Combine forces
        let totalForce = attractForce + repelForce;

        // Apply forces to nodes
        if (!nodeA.isFixed) {
          nodeA.x -= totalForce * nx;
          nodeA.y -= totalForce * ny;
        }
        if (!nodeB.isFixed) {
          nodeB.x += totalForce * nx;
          nodeB.y += totalForce * ny;
        }
      }
    }
  }

  update(otherNodes) {
    // this.applyForces(otherNodes);
    this.applyPhysics();
    this.applyKinks();
    this.enforceConstraints();
  }

  applyKinks() {
    // const time = 0;
    let time = frameCount * 0.01; // Slow time progression
    for (let i = 0; i < this.nodes.length; i++) {
      let node = this.nodes[i];
      if (!node.isFixed && node !== this.draggingNode) {
        let noiseX = noise(i * 1, time) * 2 - 1; // Smooth horizontal noise
        let noiseY = noise(i * 0.2 + 100, time) * 2 - 1; // Smooth vertical noise
        node.x += noiseX * 0.2; // Subtle horizontal offset
        node.y += noiseY * 0.05; // Subtle vertical offset
      }
    }
  }

  applyPhysics() {
    for (let node of this.nodes) {
      if (!node.isFixed && node !== this.draggingNode) {
        let vx = node.x - node.prevX;
        let vy = node.y - node.prevY;

        node.prevX = node.x;
        node.prevY = node.y;

        // Apply velocity, gravity, and damping
        node.x += vx * 0.99;
        node.y += vy * 0.99 + 0.2; // Gravity
      }
    }
  }

  enforceConstraints() {
    for (let constraint of this.constraints) {
      let dx = constraint.nodeB.x - constraint.nodeA.x;
      let dy = constraint.nodeB.y - constraint.nodeA.y;
      let distance = dist(
        constraint.nodeA.x,
        constraint.nodeA.y,
        constraint.nodeB.x,
        constraint.nodeB.y
      );
      let diff = (distance - constraint.length) / distance;

      if (!constraint.nodeA.isFixed && constraint.nodeA !== this.draggingNode) {
        constraint.nodeA.x += dx * diff * 0.5;
        constraint.nodeA.y += dy * diff * 0.5;
      }
      if (!constraint.nodeB.isFixed && constraint.nodeB !== this.draggingNode) {
        constraint.nodeB.x -= dx * diff * 0.5;
        constraint.nodeB.y -= dy * diff * 0.5;
      }
    }
  }

  display() {
    // Draw constraints
    stroke(this.col);
    strokeWeight(1);
    for (let constraint of this.constraints) {
      line(
        constraint.nodeA.x,
        constraint.nodeA.y,
        constraint.nodeB.x,
        constraint.nodeB.y
      );
    }

    // Draw nodes and their leaves
    for (let node of this.nodes) {
      // Display leaves
      for (let leaf of node.leaves) {
        leaf.display(node.x, node.y, this.col);
      }
    }
  }

  handleMousePressed() {
    for (let node of this.nodes) {
      if (dist(mouseX, mouseY, node.x, node.y) < 10) {
        this.draggingNode = node;
        break;
      }
    }
  }

  handleMouseDragged() {
    if (this.draggingNode) {
      this.draggingNode.x = mouseX;
      this.draggingNode.y = mouseY;
    }
  }

  handleMouseReleased() {
    this.draggingNode = null;
  }
}

class Leaf {
  constructor(id, szFactor) {
    let { angle, terminalLength, curvature, direction } = this.getLeaf(id);
    this.angle = angle;
    this.length = 0; // Current length
    this.curvature = curvature;
    this.direction = direction;
    this.terminalLength = terminalLength * szFactor; // Max length
  }

  getLeaf(id) {
    if (random() < 0.3) {
      return this.getRandomLeaf();
    } else {
      return this.getNormalLeaf(id);
    }
  }

  getRandomLeaf() {
    let angle = random(-PI * 2, PI * 2); // Random angle from the node
    let terminalLength = random(20, 40); // Random length for the leaf
    let curvature = random(0.2, 1); // Amount of curl
    let direction = random([1, -1]); // Curl direction: 1 for right, -1 for left
    return { angle, terminalLength, curvature, direction };
  }

  getNormalLeaf(i) {
    const leafStates = [
      [3, 1],
      [0, -1],
      [random(-PI, PI), random([1, -1])],
    ];
    const leafState = leafStates[i % 2];
    let angle = leafState[0] + random(-0.3, 0.3); //random(-PI * 2, PI * 2); // Random angle from the node
    let terminalLength = random(20, 40); // Random length for the leaf
    let curvature = random(0.2, 1.3); // Amount of curl
    let direction = leafState[1]; //random([1, -1]); // Curl direction: 1 for right, -1 for left
    return { angle, terminalLength, curvature, direction };
  }

  // Grow the leaf until it reaches terminal length
  grow(growthRate) {
    if (this.length < this.terminalLength) {
      this.length += growthRate;
    }
  }

  display(nodeX, nodeY, col) {
    stroke(col);
    strokeWeight(1);

    let startX = nodeX;
    let startY = nodeY;
    let endX = startX + cos(this.angle) * this.length;
    let endY = startY + sin(this.angle) * this.length;

    // Calculate control points for curling
    let midX = startX + cos(this.angle) * (this.length / 2);
    let midY = startY + sin(this.angle) * (this.length / 2);
    let curlX =
      midX + this.curvature * this.direction * sin(this.angle) * this.length;
    let curlY =
      midY - this.curvature * this.direction * cos(this.angle) * this.length;

    // Draw the curled leaf as a quadratic curve
    noFill();
    beginShape();
    vertex(startX, startY);
    quadraticVertex(curlX, curlY, endX, endY);
    endShape();
  }
}
