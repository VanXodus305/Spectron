import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  Interaction,
} from "discord.js";
import { CommandObject, CommandType } from "wokcommands";
import { config } from "dotenv";
import { getVoiceConnection } from "@discordjs/voice";
config();

export default {
  category: "Music",
  description: "View or Clear the Current Queue",
  type: CommandType.SLASH,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: "clear",
      description: "Removes All Tracks from the Current Queue",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "view",
      description: "Provides the List of Tracks in the Current Queue",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  callback: async ({ interaction }: { interaction: Interaction }) => {
    let int = interaction as any;
    try {
      if (
        !int.member.voice.channelId &&
        int.options?.getSubcommand() == "clear"
      ) {
        return await int
          .reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "**⚠️ You must be in a Voice/Stage Channel to use this command**"
                )
                .setColor(11553764),
            ],
            ephemeral: true,
          })
          .catch(() => null);
      }

      const oldConnection: any = getVoiceConnection(int.guild?.id);
      if (!oldConnection) {
        return await int
          .reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "**⚠️ There are no tracks currently playing on the server**"
                )
                .setColor(11553764),
            ],
            ephemeral: true,
          })
          .catch(() => null);
      }

      if (
        oldConnection &&
        oldConnection.joinConfig.channelId != int.member.voice?.channelId &&
        int.options?.getSubcommand() == "clear"
      ) {
        return await int
          .reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `**⚠️ You must be in <#${oldConnection.joinConfig.channelId}> to use this command**`
                )
                .setColor(11553764),
            ],
            ephemeral: true,
          })
          .catch(() => null);
      }

      const queue = int.client.queues.get(int.guild.id);
      if (!queue || !queue.tracks || !queue.tracks[0]) {
        return await int
          .reply({
            embeds: [
              new EmbedBuilder()
                .setColor(11553764)
                .setDescription(
                  "**⚠️ There are no tracks currently playing on the server**"
                ),
            ],
            ephemeral: true,
          })
          .catch(() => null);
      }

      if (!queue.tracks[1]) {
        return await int
          .reply({
            embeds: [
              new EmbedBuilder()
                .setColor(11553764)
                .setDescription(
                  "**⚠️ There are no tracks currently added to the queue**"
                ),
            ],
            ephemeral: true,
          })
          .catch(() => null);
      }

      if (int.options?.getSubcommand() == "clear") {
        queue.tracks = [queue.tracks[0]];
        return await int
          .reply({
            embeds: [
              new EmbedBuilder()
                .setColor(11553764)
                .setDescription("**✅ Successfully cleared the queue**"),
            ],
          })
          .catch(() => null);
      }

      if (int.options?.getSubcommand() == "view") {
        let description = ">>> ";
        let position = "";
        let requester = "";
        let name = "";
        queue.tracks?.slice(1).forEach((song: any) => {
          position = `\`${queue.tracks?.indexOf(song)}\``;
          requester = `<@${song.requester?.id}>`;
          name = `\`${song.name}\``;
          if (queue.tracks?.indexOf(song) <= 20) {
            description += `**#${position}: ${name} - ${requester}**\n`;
          }
        });
        return await int
          .reply({
            embeds: [
              new EmbedBuilder()
                .setColor(11553764)
                .setDescription(`${description}`)
                .setTitle("List of Queued Tracks"),
            ],
            ephemeral: true,
          })
          .catch(() => null);
      }
    } catch (error) {
      console.error(error);
      await int
        .reply({
          embeds: [
            new EmbedBuilder()
              .setColor(11553764)
              .setDescription(
                "**❌ Something went wrong while executing that command**"
              ),
          ],
          ephemeral: true,
        })
        .catch(() => null);
    }
  },
} as CommandObject;
