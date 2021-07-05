const fetch = require("node-fetch");
const round = require("@qc/date-round");

async function test() {
  console.log(await main("Kungsbacka"));
  console.log(await main("Kärna"));
  console.log(await main("Mölndal"));
  console.log(await main("Bosgården mölndal"));
  console.log(await main("Billdal"));
}

test();

async function main(place) {
  return new Promise(async (resolve, reject) => {
    let posFetch = await fetch(
      "https://nominatim.openstreetmap.org/search?q=135+" +
        encodeURIComponent(place + " sweden") +
        "&format=json&polygon=1&addressdetails=1"
    );

    let posJson;

    if (posFetch.ok) {
      posJson = await posFetch.json();
    }

    let response = await fetch(
      "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/" +
        parseFloat(posJson[0].lon).toFixed(4) +
        "/lat/" +
        parseFloat(posJson[0].lat).toFixed(4) +
        "/data.json"
    );

    if (response.ok) {
      let json = await response.json();

      json.timeSeries.forEach((element) => {
        let date = new Date();
        date = roundMinutes(date);
        date.setHours(date.getHours() + 1);

        if (new Date(element.validTime) - date == 0) {
          let param;
          for (let index = 0; index < element.parameters.length; index++) {
            const possibleParam = element.parameters[index];
            if (possibleParam.name == "pmin") param = index;
          }

          resolve(element.parameters[param].values[0] > 0);
        }
      });
    } else {
      console.log("HTTP-Error: " + response.status);
    }
  });
}

function roundMinutes(date) {
  date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
  date.setMinutes(0, 0, 0); // Resets also seconds and milliseconds

  return date;
}
