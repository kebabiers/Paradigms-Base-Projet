const fetchData = require("./fetch-data");
const { renderTable, renderGraph } = require("./render-page");
const { fromEvent, combineLatest, throttleTime, scan, from, interval, timer, Observable, catchError, switchMap, of} = require("rxjs");
const { fromFetch } = require("rxjs/fetch");

const waiting = interval(1000);


// fromEvent(document, "DOMContentLoaded")
//   .pipe(
//     () => console.log('coucou'),
//     () => waiting.subscribe(fetchData().then((data) => {
//       console.log(data);
//       update(data)
//     })
//   ))


function update(data) {
  console.log('coucou');
  renderGraph(data);
  renderTable(data);
}

async function unpackdata(subscriber){
  const data = await fetchData();
  subscriber.next(data);
}

const observable = new Observable( subscriber => {
    unpackdata(subscriber);
});

const observer = {
  next: ([_,data]) => update(data)
}

observable.subscribe({
  next(data) {
    renderTable(data);
    renderGraph(data); 
  }
});

document.addEventListener("DOMContentLoaded", function () {
  combineLatest(waiting,observable).subscribe(observer)
});

// async function update() {
//   const data = await fetchData();
// }

// async function fillData() {
//   data = await fetchData();
// }


