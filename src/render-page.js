const createChart = require("./graph");
var { fillTable, fillBruitParHeure, fillData, checkCreateChart, createDataChar, addDateProps, mapValue, average} = require("./function");
const { toCelsius } = require("./temperature");
const { forkJoin, Observable, timer, onErrorResumeNext } = require("rxjs");

/**
 * Génère le rendu de la page.
 * @param {import("../types").Mesure[]} data
 * @param {boolean} withGraph Pour les tests
 */

function renderTable(data) {
  let table = fillTable();

  for (let i = 0; i < data.length; i++) {
    fillData(data[i], table);
  }
}

function renderGraph(data) {
  let bruitParHeure = {}
  let graphData = {}

  for (let i = 0; i < data.length; i++) {
    bruitParHeure = fillBruitParHeure(data[i]);
    if (bruitParHeure) {
      graphData[i] = createDataChar(bruitParHeure);
    }
  }
  window.chart = checkCreateChart("myChart", graphData, true);
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
//convert(filter, transform)(data)

const map2 = (tab, fn, finalTab = [], cmpt = 0) => {
  if(finalTab.length >= tab.length) return finalTab;
  finalTab.push(fn(tab[cmpt]));
  cmpt ++;
  return map2(tab, fn, finalTab, cmpt);
}

function map3([first, ...rest], fn) {
  if(rest.length === 1) {
    return [fn(first), fn(rest)];
  }
  
  return [
    fn(first),
    ...map3(rest)
  ]
}

const filter2 = (tab, fn, finalTab = [], cmpt = 0) => {
  if(cmpt >= tab.length) return finalTab;
  if(fn(tab[cmpt])) finalTab.push(tab[cmpt]);
  cmpt ++;
  return filter2(tab, fn, finalTab, cmpt);
}

const reduce2 = (tab, fn, cmpt = 0, prev = tab[0]) => {
  if(cmpt >= tab.length) return prev;
  if (cmpt) {
    prev = fn(prev, tab[cmpt]);
  }
  cmpt ++;

  return reduce2(tab, fn, cmpt, prev);
}



// console.log(map2([1,2,3,4,5,12], x =>  x+1))
// console.log(filter2([1,2,3,4,5,12], x => x > 2))
// console.log(reduce2([4,2,3], (prev, curr) => prev * curr));

exports.renderTable = renderTable;
exports.renderGraph = renderGraph;
