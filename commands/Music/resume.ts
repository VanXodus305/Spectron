import { EmbedBuilder, Interaction } from "discord.js";
import { CommandObject, CommandType } from "wokcommands";
import { config } from "dotenv";
import { getVoiceConnection } from "@discordjs/voice";
config();

export default {
  category: "Music",
  description: "Resumes the Currently Playing Track on the Server",
  type: CommandType.SLASH,
  testOnly: false,
  guildOnly: true,
  callback: async ({ interaction }: { interaction: Interaction }) => {
    let int = interaction as any;
    try {
      if (!int.member.voice.channelId) {
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
                  "**⚠️ There are no songs currently playing on the server**"
                )
                .setColor(11553764),
            ],
            ephemeral: true,
          })
          .catch(() => null);
      }

      if (
        oldConnection &&
        oldConnection.joinConfig.channelId != int.member.voice?.channelId
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
                  "**⚠️ There are no songs currently playing on the server**"
                ),
            ],
            ephemeral: true,
          })
          .catch(() => null);
      }

      if (!queue.paused) {
        return await int
          .reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `**⚠️ \`${int.client.decodeHTMLEntities(
                    oldConnection?.state.subscription.player.state.resource
                      .metadata.details?.name
                  )}\` is already playing**`
                )
                .setColor(11553764),
            ],
            ephemeral: true,
          })
          .catch(() => null);
      }

      queue.paused = false;
      queue.resumed = true;
      oldConnection.state.subscription.player.unpause();

      return await int
        .reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `**✅ Successfully resumed \`${int.client.decodeHTMLEntities(
                  oldConnection?.state.subscription.player.state.resource
                    .metadata.details?.name
                )}\`**`
              )
              .setColor(11553764),
          ],
        })
        .catch(() => null);
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
