const DiscordJS = require('discord.js')
const WOKCommands = require('wokcommands')
require('dotenv').config()

const guildId = '554977304665784325'
const client = new DiscordJS.Client()
const mongoURL = process.env.MONGOURL || "mongodb://localhost:27017/";

client.on('ready', () => {
  new WOKCommands(client, {
    commandsDir: 'commands',
    testServers: [guildId],
    showWarns: true,
  }).setMongoPath(mongoURL)
})

client.login(process.env.TOKEN)