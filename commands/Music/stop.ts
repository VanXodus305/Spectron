import {
  EmbedBuilder,
  Interaction,
} from "discord.js";
import { CommandObject, CommandType } from "wokcommands";
import { config } from "dotenv";
import { getVoiceConnection } from "@discordjs/voice";
config();

export default {
  category: "Music",
  description: "Stops Playing Music and Clears the Queue",
  type: CommandType.SLASH,
  testOnly: false,
  guildOnly: true,
  callback: async ({ interaction }: { interaction: Interaction }) => {
    let int = interaction as any;
    try {
      if (!int.member.voice.channelId) {
        return await int.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription('**⚠️ You must be in a Voice/Stage Channel to use this command**')
              .setColor(11553764)
          ],
          ephemeral: true
        }).catch(() => null);
      }

      const oldConnection: any = getVoiceConnection(int.guild?.id);
      if (!oldConnection) {
        return await int.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription('**⚠️ There are no songs currently playing on this server**')
              .setColor(11553764)
          ],
          ephemeral: true
        }).catch(() => null);
      }

      if (oldConnection && oldConnection.joinConfig.channelId != int.member.voice?.channelId) {
        return await int.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`**⚠️ You must be in <#${oldConnection.joinConfig.channelId}> to use this command**`)
              .setColor(11553764)
          ],
          ephemeral: true
        }).catch(() => null);
      }

      const queue = int.client.queues.get(int.guild.id);
      if (!queue || !queue.tracks || !queue.tracks[0]) {
        return await int.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(11553764)
              .setDescription("**⚠️ There are no songs currently playing on this server**")
          ],
          ephemeral: true
        }).catch(() => null);
      }

      queue.tracks = [];
      oldConnection.state.subscription.player.stop();

      return await int.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`**✅ Successfully stopped playing and cleared the queue**`)
            .setColor(11553764)
        ],
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
        ephemeral: true
      }).catch(() => null);
    }
  }
} as CommandObject;