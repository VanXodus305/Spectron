import { ApplicationCommand, EmbedBuilder, Interaction } from "discord.js";
import { CommandObject, CommandType } from "wokcommands";

export default {
  description: "Provides the List of Commands and their Details",
  testOnly: false,
  type: CommandType.SLASH,
  callback: async ({ interaction }: { interaction: Interaction }) => {
    let int = interaction as any;
    try {
      let description = '>>> '; 
      int.client.commands?.forEach((cmd: ApplicationCommand) => {
        description += `**</${cmd.name}:${cmd.id}> - \`${cmd.description}\`**\n`;
      });
      await int.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`ℹ️ List of Commands`)
            .setDescription(description)
            .setColor(11553764)
        ],
        ephemeral: true
      }).catch(() => null);
    }
    catch (error) {
      console.error(error);
      await int.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(11553764)
            .setDescription("**❌ Something went wrong while executing that command**")
        ],
      }).catch(() => null);
    }
  }
} as CommandObject;