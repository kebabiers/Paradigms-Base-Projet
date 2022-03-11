const { Chart } = require("chart.js");
let delayed;

/**
 * Crée un histogramme
 * @param {string} canevasId l'id du caneva où afficher l'histogramme
 * @param {{[string]: number}[]} data un dictionnaire [valeur axe x] => valeur axe
 * @param {string} caption la légende
 */
function graph(canevasId, data, caption) {
  let barColors = [];
  for (const key in data) {
    const value = data[key];
    const color = toColor(value);
    barColors.push(color);
  }

  return new Chart(canevasId, {
    type: "bar",
    data: {
      labels: Object.keys(data),
      datasets: [
        {
          label: caption,
          backgroundColor: barColors,
          data: Object.values(data),
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
      animation: {
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (
            context.type === "data" &&
            context.mode === "default" &&
            !delayed
          ) {
            delay = context.dataIndex * 300 + context.datasetIndex * 100;
          }
          return delay;
        },
      },
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });
}

function toColor(value) {
  return value < 30
    ? "blue"
    : value < 80
    ? "green"
    : value < 100
    ? "yellow"
    : value < 110
    ? "orange"
    : "red";
}

module.exports = graph;
