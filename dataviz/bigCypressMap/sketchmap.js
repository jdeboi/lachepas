let mapleaflet;

function setup() {
  // Initialize Leaflet map
  mapleaflet = L.map("map").setView([30.5, -91.0], 7);

  // Load OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(mapleaflet);

  // Add tree markers
  trees.forEach((tree) => {
    let size = tree.circumference / 2; // Scale circle size
    let circle = L.circleMarker(tree.coordinates, {
      radius: size,
      color: "#006400",
      fillColor: "#32CD32",
      fillOpacity: 0.6,
    }).addTo(mapleaflet);

    circle.bindPopup(
      `<b>${tree.label}</b><br>Circumference: ${tree.circumference} ft`
    );
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //  parseKMLTrees();
}

function draw() {}
