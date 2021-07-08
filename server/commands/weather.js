//Dependencies Import
const { MessageEmbed } = require("discord.js");

//Local Dependencies Import
const locationDB = require("../locationDB.js");
const database = require("../database.js");
const User = require("../Models/User");
const { willItRain } = require("../checkWeather");

module.exports = {
  slash: "both",
  testOnly: true,
  description: "Sets your location for use with discord-weather",
  minArgs: 0,
  maxArgs: 1,
  expectedArgs: "[location]",
  callback: async ({ interaction, args }) => {
    //Creates a messageEmbed for reply
    const embed = new MessageEmbed();

    //Gets id of the author of command
    const userID = await interaction.member.user.id;

    //Checks if the user is in Mongo
    let exisitingUser = await locationDB.findUserWithID(userID);
    if (exisitingUser != null || args[0] != undefined) {
      const location = args[0] || exisitingUser.loc;

      embed.setTitle(await willItRain(location) ? `It will rain in the next hour at "${location}"` : `It will not rain in the next hour at "${location}"`);
      embed.setDescription(`Data from SMHI`)
    } else {
      embed.setTitle("You don't have any location set currently!"); //Sets the title for the Embed
      embed.setDescription(
        `You can set a location with the command "/setLocation your_location"`
      );
    }

    return embed;
  },
};
