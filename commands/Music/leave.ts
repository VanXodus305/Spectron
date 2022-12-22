import { getVoiceConnection } from "@discordjs/voice";
import { ApplicationCommandOptionType, ChannelType, EmbedBuilder, Interaction } from "discord.js";
import { CommandObject, CommandType } from "wokcommands";

export default {
  description: "Stops playing music and leaves a Voice/Stage Channel",
  type: CommandType.SLASH,
  testOnly: false,
  guildOnly: true,
  callback: async ({ interaction }: { interaction: Interaction }) => {
    let int = interaction as any;
    try {
      const oldConnection = getVoiceConnection(int.guild.id);
      if (!oldConnection) {
        return await int.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`**⚠️ I'm not connected in any Voice/Stage Channel**`)
              .setColor(11553764)
          ],
          ephemeral: true
        }).catch(() => null);
      }

      await int.client?.leaveVoiceChannel(int.guild.members.me?.voice?.channel);

      await int.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`**👋 Successfully left <#${oldConnection.joinConfig.channelId}>**`)
            .setColor(11553764)
        ],
      }).catch(() => null);
    } catch (e) {
      console.error(e);
      await int.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`**❌ Something went wrong while executing that command**`)
            .setColor(11553764)
        ],
        ephemeral: true
      }).catch(() => null);
    }
  }
} as CommandObject