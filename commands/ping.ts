import Discord, { EmbedBuilder } from "discord.js";
import { ICommand } from "wokcommands";

export default {
  category: "Info",
  description: "Provides the latency of the bot and the API",
  slash: true,
  testOnly: false,
  callback: async ({ client, interaction }) => {
    let int = interaction as unknown as Discord.CommandInteraction;

    let embed = new EmbedBuilder();
    embed.setTitle('Pong! 🏓');
    embed.setColor(11553764);
    embed.setFields([{ name: '🤖 Bot Latency', value: '\`\`\`Calculating...\`\`\`' }, { name: '💓 API Latency', value: '\`\`\`Calculating...\`\`\`' }]);
    int.reply({ embeds: [embed], fetchReply: true }).then(async (resultMessage: any) => {
      const ping = resultMessage.createdTimestamp - int.createdTimestamp;
      embed.setFields([{ name: '🤖 Bot Latency', value: `\`\`\`${ping} ms\`\`\`` }, { name: '💓 API Latency', value: `\`\`\`${client.ws.ping} ms\`\`\`` }]);
      embed.setTimestamp(int.createdTimestamp);
      await int.editReply({ embeds: [embed] });
    });
  }
} as ICommand