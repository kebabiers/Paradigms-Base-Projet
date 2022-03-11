var { fillTable, fillBruitParHeure, fillData, checkCreateChart, createDataChar } = require("./function");

/**
 * Génère le rendu de la page.
 * @param {import("../types").Mesure[]} data
 * @param {boolean} withGraph Pour les tests
 * withgraph = booleen
 */

function renderPage(data, withGraph) {

  let bruitParHeure = {}
  let graphData = {}
  let table = fillTable();

  for (let i = 0; i < data.length; i++) {
    fillData(data[i], table);
    bruitParHeure = fillBruitParHeure(data[i]);
    // console.log(bruitParHeure)
    if (bruitParHeure.length) {
      graphData[i] = createDataChar(bruitParHeure);
    }
  }
  if(withGraph) window.chart = checkCreateChart("myChar", graphData, withGraph);
}
module.exports = renderPage;
