const smhi = require("./smhi.js");

async function test() {
  console.log(await smhi.willItRain("Kungsbacka"));
  console.log(await smhi.willItRain("Kärna"));
  console.log(await smhi.willItRain("Mölndal"));
  console.log(await smhi.willItRain("Bosgården mölndal"));
  console.log(await smhi.willItRain("Billdal"));
}

test();
