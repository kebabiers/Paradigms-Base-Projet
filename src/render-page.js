const createChart = require("./graph");

/**
 * Génère le rendu de la page.
 * @param {import("../types").Mesure[]} data
 * @param {boolean} withGraph Pour les tests
 */
function renderPage(data, withGraph) {
  const divTable = document.getElementById("table");
  divTable.innerHTML = "";

  if (withGraph && window.chart) {
    window.chart.destroy();
  }

  const table = document.createElement("table");
  divTable.appendChild(table);
  table.innerHTML = `
    <thead>
      <tr>
        <th>date</th>
        <th>capteur</th>
        <th>valeur</th>
      </tr>
    </thead>
    `;

  let bruitParHeure = {};

  for (i = 0; i < data.length; i++) {
    const mesure = data[i];
    let tr = document.createElement("tr");

    tr.setAttribute("data-id", mesure.id);

    let dateCell = document.createElement("td");
    dateCell.innerHTML = mesure.timestamp;
    tr.appendChild(dateCell);

    let capteurCell = document.createElement("td");
    capteurCell.innerHTML = mesure.type;
    tr.appendChild(capteurCell);

    let valeurCell = document.createElement("td");
    valeurCell.innerHTML = mesure.valeur;
    tr.appendChild(valeurCell);

    table.appendChild(tr);

    if (withGraph && mesure.type === "noise") {
      var heure = new Date(mesure.timestamp).toLocaleTimeString("fr");
      if (bruitParHeure[heure]) {
        bruitParHeure[heure].push(mesure.valeur);
      } else {
        bruitParHeure[heure] = [mesure.valeur];
      }
    }
  }

  if (withGraph) {
    var graphData = {};
    for (const key in bruitParHeure) {
      const mesures = bruitParHeure[key];
      let somme = 0;
      for (i = 0; i < mesures.length; i++) {
        somme += mesures[i];
      }
      graphData[key] = somme / mesures.length;
    }

    window.chart = createChart("myChart", graphData, "bruit");
  }
}
module.exports = renderPage;
