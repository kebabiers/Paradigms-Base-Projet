const createChart = require("./graph");
const {toCelsius} = require("./temperature");

function createTable() {
    return document.createElement("table");
}

function fillTable() {
    const divTable = document.getElementById("table");
    divTable.innerHTML = "";

    let table = createTable();
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

    return table;
}

function fillBruitParHeure(mesure) {
    // console.log(mesure.filter((elem) => elem.type == "noise"));
    // return Object.entries(mesure).filter((elem) => elem.type == "noise").map(
    //     (bruitParHeure) => bruitParHeure[new Date(mesure.timestamp).toLocaleTimeString("fr")] = elem.valeur
    // );
    let bruitParHeure ={}
    if (mesure.type === "noise") {
        var heure = new Date(mesure.timestamp).toLocaleTimeString("fr");
        bruitParHeure[heure] = mesure.valeur;
        return bruitParHeure;
    }
    return false
}

function fillData(data, table) {
    const mesure = data;
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
}



function checkCreateChart(id, graphData, withGraph) {
    if (withGraph && window.chart) {
        window.chart.destroy();
    }
    
    return createChart(id, graphData, "bruit");
}

function createDataChar(bruitsParHeure) {;
    return Object.entries(bruitsParHeure).reduce((acc, val) => acc + val) / Object.entries(bruitsParHeure).length;
}

function addDateProps({
    timestamp
}) {
    let date = new Date(timestamp);
    return  {
        frDate : date.toLocaleDateString('fr-FR'),
        jour: date.getDay(),
        mois : date.getMonth(),
        annee : date.getFullYear(),
        heure : date.getHours()
    }
}

const mapValue = (func, data) => 
Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, func(value)] )
)


function somme(x) {
    return (x.reduce((prev, curr) => prev + curr));
}
  
function average(x) {
    return somme(x) / x.length;
}


const convert = (({type, valeur}) => type === "temperature" ? toCelsius(valeur) : "")

const group = ({valeur}) => valeur.groupBy(valeur => `${valeur.date.heure}h`);

exports.somme = somme;
exports.average = average;
exports.group = group;
exports.convert = convert;
exports.mapValue = mapValue;
exports.fillTable = fillTable;
exports.fillBruitParHeure = fillBruitParHeure;
exports.fillData = fillData;
exports.checkCreateChart = checkCreateChart;
exports.createDataChar = createDataChar;
exports.addDateProps = addDateProps;

/*
const data = {
    "hero": "batman",
    "mechant": "harley queen",
}
mapValue(x => "hello" + x, data)
let res = {
    "hero": "hellobatman",
    "mechant": "helloharley queen"
}
*/