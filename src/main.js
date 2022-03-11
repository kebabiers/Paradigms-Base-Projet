const fetchData = require("./fetch-data");
const renderPage = require("./render-page");

document.addEventListener("DOMContentLoaded", function () {
  update();
  setInterval(update, 10000); // Toutes les 10s, on récupère les dernières données et recrée la page.
});

async function update() {
  const data = await fetchData();
  renderPage(data, true);
}
