const createChart = require("./graph");
var { fillTable, fillBruitParHeure, fillData, checkCreateChart, createDataChar, addDateProps, mapValue, average} = require("./function");
const { toCelsius } = require("./temperature");
const { forkJoin } = require("rxjs");

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

const data = [
  {
    id: 1,
    valeur: 1.11,
    type: "cod",
    timestamp: "2022-02-09T08:30:59",
  },
  {
    id: 2,
    valeur: 50,
    type: "temperature",
    timestamp: "2022-02-09T08:30:59",
  },
  {
    id: 3,
    valeur: 10,
    type: "noise",
    timestamp: "2022-02-09T08:30:59",
  },
];

function transform(array) {
  let [{valeur, ...rest}] = array;
  valeur = toCelsius(valeur)
  return {
    valeur, 
    ...rest
  };
}

function filter (objet) {
  return objet.filter(x => x.type === 'temperature');
}

const convert = (filter, transform) => (value) => {
  let res = filter(value)
  if(! filter(value)) {
    return value;
  }

  let [first, second, ...rest] = value;
  second = transform(res);


  return [
    first,
    second,
    ...rest
  ]
}

console.log(convert(filter, transform)(data))

module.exports = renderPage;
