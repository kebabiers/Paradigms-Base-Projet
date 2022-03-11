/**
 * Récupère et agrège les données des capteurs
 * @returns {import("../types").Mesure[]} les mesures des capteurs
 */
async function fetchData() {
  let result = [];

  const codResponse = await fetch("/api/cod.json");
  const cod = await codResponse.json();
  for (let index = 0; index < cod.length; index++) {
    let mesure = cod[index];
    mesure.type = "cod";
    result.push(mesure);
  }

  const temperatureResponse = await fetch("/api/temperature.json");
  const temperature = await temperatureResponse.json();
  for (let index = 0; index < temperature.length; index++) {
    let mesure = temperature[index];
    mesure.type = "temperature";
    result.push(mesure);
  }

  const noiseResponse = await fetch("/api/noise.json");
  const noise = await noiseResponse.json();
  for (let index = 0; index < noise.length; index++) {
    let mesure = noise[index];
    mesure.type = "noise";
    result.push(mesure);
  }

  return result;
}
module.exports = fetchData;
