const pretty = require("pretty");
var assert = require("assert");
const renderPage = require("./render-page");
var { fillTable, fillBruitParHeure, fillData, checkCreateChart, createDataChar } = require("./function");

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

describe("function", () => {

    before(function () {
      this.jsdom = require("jsdom-global")();
      document.body.innerHTML = `<div id="table"></div>`;
    });
    it("fillTable ", () => {
      renderPage(data, false);  
      assert.equal(
        pretty(fillTable().innerHTML), pretty("<thead>\
                              <tr>\
                              <th>date</th>\
                              <th>capteur</th>\
                              <th>valeur</th>\
                            </tr>\
                          </thead>"))
    });  
    it("fillBruitParHeure ", () => {
      renderPage(data, false);
      assert.equal(
        JSON.stringify(fillBruitParHeure(data[2])),JSON.stringify({'08:30:59': 10}))
    });
    it("fillData ", () => {
      renderPage(data, false);
      let table = fillTable();
      fillData(data[2], table);
      assert.equal(
        pretty(table.innerHTML), pretty('<thead>\
          <tr>\
              <th>date</th>\
              <th>capteur</th>\
              <th>valeur</th>\
          </tr>\
          </thead>\
          <tr data-id="3"><td>2022-02-09T08:30:59</td><td>noise</td><td>10</td></tr>'))
    });
    it("checkCreateChart ", () => {
      let graphData = createDataChar({ '08:30:59': 10 });
      let chart = checkCreateChart("myChartTest", graphData);
      assert.equal(
        chart.id, 0);
      chart.destroy();
    });
});
  