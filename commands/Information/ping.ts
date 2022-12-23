import { Client, CommandInteraction, EmbedBuilder, Interaction } from "discord.js";
import { CommandObject, CommandType } from "wokcommands";

export default {
  description: "Provides the Bot's Latency and Uptime",
  testOnly: false,
  type: CommandType.SLASH,
  callback: async ({ interaction }: { interaction: Interaction }) => {
    let int = interaction as any;

    try {
      let embed = new EmbedBuilder();
      embed.setTitle("Pong! 🏓");
      embed.setColor(11553764);
      embed.setFields([
        { name: "🤖 Bot Latency", value: "```Calculating...```", inline: true },
        { name: "💓 API Latency", value: "```Calculating...```", inline: true },
        { name: "⏳ Uptime", value: "```Calculating...```" }
      ]);
      await int
        .reply({ embeds: [embed], ephemeral: true, fetchReply: true })
        .then(async (resultMessage: any) => {
          const ping = resultMessage.createdTimestamp - int.createdTimestamp;
          embed.setFields([
            { name: "🤖 Bot Latency", value: `\`\`\`${ping} ms\`\`\``, inline: true },
            { name: "💓 API Latency", value: `\`\`\`${int.client.ws.ping} ms\`\`\``, inline: true },
            { name: "⏳ Uptime", value: `\`\`\`${int.client.formatDuration(Math.floor(int.client.uptime as number / 1000))}\`\`\`` }
          ]);
          await int.editReply({ embeds: [embed] }).catch(() => null);
        })
        .catch(() => null);
    }
    catch (error) {
      console.error(error);
      await int.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(11553764)
            .setDescription("**❌ Something went wrong while executing that command**")
        ],
        ephemeral: true
      }).catch(() => null);
    }
  }
} as CommandObject;