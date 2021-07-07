const { MessageEmbed } = require('discord.js')

module.exports = {
  slash: 'both',
  testOnly: true,
  description: 'A simple ping pong!!!',
  callback: ({ message, args }) => {
    const embed = new MessageEmbed().setTitle('PingPong!').setDescription('pong')
    if (message) {
      console.log(message)
      message.reply('', { embed })
    }

    return embed
  },
}