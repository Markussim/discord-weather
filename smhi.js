const fetch = require("node-fetch");
const round = require("@qc/date-round");

main("Kungsbacka");

async function main(place) {
  let posFetch = await fetch(
    "https://nominatim.openstreetmap.org/search?q=135+" +
      encodeURIComponent(place) +
      "&format=json&polygon=1&addressdetails=1"
  );

  let posJson;

  if (posFetch.ok) {
    posJson = await posFetch.json();
  }

  //console.log(parseFloat(posJson[0].lat).toFixed(4));

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
        console.log(element.parameters[param].values[0] > 0);

        return element.parameters[param].values[0] > 0;
      }
    });
  } else {
    console.log("HTTP-Error: " + response.status);
  }
}

function roundMinutes(date) {
  date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
  date.setMinutes(0, 0, 0); // Resets also seconds and milliseconds

  return date;
}
