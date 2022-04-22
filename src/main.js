const fetchData = require("./fetch-data");
const renderPage = require("./render-page");
const { fromEvent, throttleTime, scan, from, interval, timer } = require("rxjs")

fromEvent(document, "DOMContentLoaded")
  .pipe(
    () => timer(0, 10000).subscribe(() => update())
  )

// document.addEventListener("DOMContentLoaded", function () {
//   update();
//   setInterval(update, 10000); // Toutes les 10s, on récupère les dernières données et recrée la page.
// });

async function update() {
  const data = await fetchData();
  renderPage(data, true);
}
