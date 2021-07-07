const DiscordJS = require('discord.js')
const WOKCommands = require('wokcommands')
require('dotenv').config()

const guildId = '554977304665784325'
const client = new DiscordJS.Client()

client.on('ready', () => {
  new WOKCommands(client, {
    commandsDir: 'commands',
    testServers: [guildId],
    showWarns: false,
  })
})

client.login(process.env.TOKEN)