const Discord = require("discord.js");
const client = new Discord.Client();
require("dotenv").config();
const smhi = require("./smhi.js");
const fs = require("fs");
const dBModule = require("./dbModule.js");
const User = require("./user");

connectToMongo("discord-weather");

let rainedUsers = [];

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  runEveryFullHours(() => {
    sendMessages();
  });
});

client.on("message", async (msg) => {
  if (msg.content.startsWith("try ")) {
    smhi
      .willItRain(msg.toString().substring(4))
      .then((data) => {
        let tmp = data;

        if (tmp) {
          msg.reply("It will rain in the next hour there");
        } else {
          msg.reply("It won't rain in the next hour there");
        }
      })
      .catch(() => {
        msg.reply("Unknown error");
      });
  }

  if (msg.content.startsWith("regloc ")) {
    console.log(await dBModule.findUserWithID(User, msg.author.id));
    if (!(await dBModule.findUserWithID(User, msg.author.id))) {
      let user = new User({ id: msg.author.id, loc: msg.content.substring(7) });
      dBModule.saveToDB(user);
      console.log(user);
    }
  }

  if (msg.content.startsWith("pucko")) {
    sendMessages();
  }
});

const runEveryFullHours = (callbackFn) => {
  const Hour = 60 * 60 * 1000;
  const currentDate = new Date();
  const firstCall =
    Hour -
    (currentDate.getMinutes() * 60 + currentDate.getSeconds()) * 1000 -
    currentDate.getMilliseconds();
  setTimeout(() => {
    callbackFn();
    setInterval(callbackFn, Hour);
  }, firstCall);
};

function connectToMongo(dbName) {
  dBModule.cnctDB(dbName);
}

async function sendMessages() {
  const channel = client.channels.cache.get("707597727516590090");
  let users = await dBModule.findInDB(User);
  users.forEach(async (element) => {
    let rain = await smhi.willItRain(element.loc);

    if (rain && !rainedUsers.includes(element.id)) {
      rainedUsers.push(element.id);
      channel.send(
        "<@" + element.id + ">, it will rain in the next hour in your city"
      );
    } else if (rainedUsers.includes(element.id)) {
      console.log("Already rained");

      if (!rain) {
        let index = rainedUsers.indexOf(element.id);
        rainedUsers.splice(index, 1);
        console.log("Removed");
      }
    }
  });

  console.log("Sent messages at " + new Date());
}

client.login(process.env.TOKEN);
