const fetchData = require("./fetch-data");
const { renderTable, renderGraph } = require("./render-page");
const { fromEvent, throttleTime, scan, from, interval, timer, Observable, catchError, switchMap, of} = require("rxjs");
const { fromFetch } = require("rxjs/fetch");


fromEvent(document, "DOMContentLoaded")
  .pipe(
    () => timer(0, 10000).subscribe(fetchData().then((data) => update(data)))
  )


function update(data) {
  renderGraph(data);
  renderTable(data);
}

// observable.subscribe({
//   next(data) {
//     console.log('pouet')
//     renderTable(data);
//     renderGraph(data); 
//   }
// });

// document.addEventListener("DOMContentLoaded", function () {
//   update();
//   setInterval(update, 10000); // Toutes les 10s, on récupère les dernières données et recrée la page.
// });

// async function update() {
//   const data = await fetchData();
// }

// async function fillData() {
//   data = await fetchData();
// }
