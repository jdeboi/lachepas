function parseKML(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  const placemarks = xmlDoc.getElementsByTagName("Placemark");

  let results = [];

  for (let i = 0; i < placemarks.length; i++) {
    let placemark = placemarks[i];

    // Extract label (name)
    let label =
      placemark.getElementsByTagName("name")[0]?.textContent.trim() || null;

    // Extract coordinates (longitude, latitude)
    let coordText =
      placemark.getElementsByTagName("coordinates")[0]?.textContent.trim() ||
      "";
    let [longitude, latitude] = coordText.split(",").map(Number);

    // Extract description
    let description =
      placemark.getElementsByTagName("description")[0]?.textContent.trim() ||
      null;

    // Extract image URL (from <description> if it contains an <img> tag)
    let imgMatch = description
      ? description.match(/<img.*?src=['"](.*?)['"]/i)
      : null;
    let imageUrl = imgMatch ? imgMatch[1] : null;

    // Extract style URL
    let stylurl =
      placemark.getElementsByTagName("styleUrl")[0]?.textContent.trim() || null;

    // Store the parsed data
    results.push({
      label,
      coordinates: [latitude, longitude], // Adjusting to (lat, lon)
      imageUrl,
      description,
      stylurl,
    });
  }

  return results;
}

function parseKMLTrees() {
  fetch("Louisiana Purchase Cypress Legacy Tree Inventory Map.kml")
    .then((response) => response.text())
    .then((xmlString) => {
      let parsedData = parseKML(xmlString);
      console.log(parsedData); // Output parsed data to console
      saveJSON(parsedData, "cypress_trees.json"); // Save as JSON
    })
    .catch((error) => console.error("Error loading KML:", error));
}

function saveJSON(data, filename) {
  const jsonString = JSON.stringify(data, null, 2); // Convert to JSON with indentation
  const blob = new Blob([jsonString], { type: "application/json" }); // Create a Blob object
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
