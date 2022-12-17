import { Client, CommandInteraction, EmbedBuilder, Interaction } from "discord.js";
import { CommandObject, CommandType } from "wokcommands";

export default {
  description: "Provides the latency of the bot and the API",
  testOnly: false,
  type: CommandType.SLASH,
  callback: async ({ client, interaction }: { client: Client, interaction: Interaction }) => {
    let int = interaction as unknown as CommandInteraction;
    try {
      let embed = new EmbedBuilder();
      embed.setTitle("Pong! 🏓");
      embed.setColor(11553764);
      embed.setFields([
        { name: "🤖 Bot Latency", value: "```Calculating...```" },
        { name: "💓 API Latency", value: "```Calculating...```" },
      ]);
      await int
        .reply({ embeds: [embed], ephemeral: true, fetchReply: true })
        .then(async (resultMessage: any) => {
          const ping = resultMessage.createdTimestamp - int.createdTimestamp;
          embed.setFields([
            { name: "🤖 Bot Latency", value: `\`\`\`${ping} ms\`\`\`` },
            { name: "💓 API Latency", value: `\`\`\`${client.ws.ping} ms\`\`\`` },
          ]);
          embed.setTimestamp(int.createdTimestamp);
          await int.editReply({ embeds: [embed] }).catch(() => null);
        })
        .catch(() => null);
    }
    catch (error) {
      console.error(error);
      await int.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(11553764)
            .setTitle("❌ Something went wrong while executing that command")
        ],
      }).catch(() => null);
    }
  }
} as CommandObject;