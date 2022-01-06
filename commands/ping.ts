import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
  category: "Test Commands",
  description: "Provides the latency of the bot and the API",
  slash: 'both',
  testOnly: true,
  callback: async ({ client, interaction, message }) => {
    let embed = new MessageEmbed();
    embed.setTitle('Pong!');
    embed.setColor('GREEN');
    if (message) {
      embed.setTitle('Pong! 🏓');
      embed.setColor(11553764);
      embed.setFields([{ name: '🤖 Bot Latency', value: '\`\`\`Calculating...\`\`\`' }, { name: '💓 API Latency', value: '\`\`\`Calculating...\`\`\`' }]);
      message.channel.send({ embeds: [embed] }).then(resultMessage => {
        const ping = resultMessage.createdTimestamp - message.createdTimestamp;
        embed.setFields([{ name: '🤖 Bot Latency', value: `\`\`\`${ping} ms\`\`\`` }, { name: '💓 API Latency', value: `\`\`\`${client.ws.ping} ms\`\`\`` }]);
        embed.setTimestamp(resultMessage.createdTimestamp);
        resultMessage.edit({ embeds: [embed] });
      });
    }
    else if (interaction) {
      embed.setTitle('Pong! 🏓');
      embed.setColor(11553764);
      embed.setFields([{ name: '🤖 Bot Latency', value: '\`\`\`Calculating...\`\`\`' }, { name: '💓 API Latency', value: '\`\`\`Calculating...\`\`\`' }]);
      await interaction.reply({ embeds: [embed], fetchReply: true }).then(resultMessage => {
        // const ping = resultMessage.createdTimestamp - interaction.createdTimestamp;
        // embed.setFields([{ name: '🤖 Bot Latency', value: `\`\`\`${ping} ms\`\`\`` }, { name: '💓 API Latency', value: `\`\`\`${client.ws.ping} ms\`\`\`` }]);
        // embed.setTimestamp(resultMessage.createdTimestamp);
        // resultMessage.edit({ embeds: [embed] });
      });
    }
  }
} as ICommand