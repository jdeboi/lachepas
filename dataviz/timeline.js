const timeline = [
  {
    yearLabel: "Pre-1600s",
    year: 1600,
    estimated_acres: 3000000,
    context:
      "Before European settlement, cypress swamps covered an estimated 2.5-3 million acres in Louisiana, with minimal human impact.",
  },
  {
    yearLabel: "1700s",
    year: 1700,
    estimated_acres: 2500000,
    context:
      "During the colonial era, cypress forests remained mostly intact, as logging was limited to small-scale use by settlers and Native Americans.",
  },
  {
    yearLabel: "Late 1800s",
    year: 1880,
    estimated_acres: 2000000,
    context:
      "Industrial logging began in earnest, reducing cypress coverage to about 2 million acres. Steam-powered sawmills enabled large-scale operations.",
  },
  {
    yearLabel: "1920s",
    year: 1920,
    estimated_acres: 1500000,
    context:
      "At the peak of industrial logging, most old-growth cypress forests were harvested, leaving a fraction of the original coverage.",
  },
  {
    yearLabel: "1930s-1950s",
    year: 1940,
    estimated_acres: 1000000,
    context:
      "Logging declined as old-growth trees were exhausted. Regrowth began, but hydrological changes and sedimentation hindered recovery.",
  },
  {
    yearLabel: "1980s",
    year: 1980,
    estimated_acres: 750000,
    context:
      "Conservation efforts increased to protect remaining cypress forests and encourage reforestation, but challenges persisted.",
  },
  {
    yearLabel: "2020s",
    year: 2020,
    estimated_acres: 500000,
    context:
      "Remaining cypress forests are primarily secondary growth. Conservation efforts continue to address issues like saltwater intrusion and climate change.",
  },
];

function interpolateCypressTrees(year) {
  // If the year is before 1600, return 3,000,000
  if (year < 1600) {
    return 3000000;
  }

  // If the year is beyond 2020, return the last known value (500,000)
  if (year > 2020) {
    return 500000;
  }

  // Interpolate between data points
  for (let i = 0; i < timeline.length - 1; i++) {
    const startYear = timeline[i].year;
    const startValue = timeline[i].estimated_acres;
    const endYear = timeline[i + 1].year;
    const endValue = timeline[i + 1].estimated_acres;

    if (startYear <= year && year <= endYear) {
      // Linear interpolation formula
      const fraction = (year - startYear) / (endYear - startYear);
      return Math.round(startValue + fraction * (endValue - startValue));
    }
  }

  return null; // This should never be reached
}
