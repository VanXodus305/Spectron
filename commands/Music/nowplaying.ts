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
  description: "Shows the Currently Playing Track on the Server",
  type: CommandType.SLASH,
  testOnly: false,
  guildOnly: true,
  callback: async ({ interaction }: { interaction: Interaction }) => {
    let int = interaction as any;
    try {
      const queue = int.client.queues.get(int.guild.id);
      if (!queue || !queue.tracks || !queue.tracks[0]) {
        return await int.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(11553764)
              .setDescription("**⚠️ There are no tracks currently playing on the server**")
          ],
          ephemeral: true
        }).catch(() => null);
      }

      const oldConnection: any = getVoiceConnection(int.guild.id);
      const curPos = Math.floor(oldConnection?.state.subscription.player.state.resource.playbackDuration / 1000);
      const song = queue.tracks[0];
      const songEmbed = new EmbedBuilder()
        .setColor(11553764)
        .setTitle(`${int.client.decodeHTMLEntities(song.name)}`)
        .addFields({
          name: "👥 Artists",
          value: "```\n" + int.client.decodeHTMLEntities(song.primaryArtists) + "```",
          inline: false,
        })
        .addFields({
          name: "📀 Album",
          value: "```\n" + int.client.decodeHTMLEntities(song.album?.name) + "```",
          inline: true,
        })
        .addFields({
          name: "🕒 Duration",
          value: "```\n" + int.client.formatDuration(int.client.decodeHTMLEntities(song.duration)) + "```",
          inline: true,
        })
        .addFields({
          name: "👤 Requester",
          value: `<@${song.requester?.id}>`,
          inline: true,
        })
        .addFields({
          name: "⏳ Progress",
          value: "**```\n" + int.client.createBar(song.duration, curPos) + " [" + int.client.formatDuration(curPos, true) + "/" + int.client.formatDuration(song.duration, true) + "]```**",
          inline: false,
        })
        .setThumbnail(song.image[song.image?.length - 1]?.link);
      await int.reply({
        embeds: [songEmbed],
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
        ephemeral: true
      }).catch(() => null);
    }
  }
} as CommandObject;