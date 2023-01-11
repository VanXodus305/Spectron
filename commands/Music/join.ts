import { getVoiceConnection } from "@discordjs/voice";
import { ChannelType, EmbedBuilder, Interaction } from "discord.js";
import { CommandObject, CommandType } from "wokcommands";

export default {
  description: "Joins a Voice/Stage Channel",
  type: CommandType.SLASH,
  testOnly: false,
  guildOnly: true,
  callback: async ({ interaction }: { interaction: Interaction }) => {
    let int = interaction as any;
    int.client.lastInt?.set(int.guild?.id, int);

    try {
      if (!int.member?.voice?.channel) {
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

      const oldConnection = getVoiceConnection(int.guild.id);

      if (oldConnection) {
        return await int
          .reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `**⚠️ I'm already connected in <#${oldConnection.joinConfig.channelId}>**`
                )
                .setColor(11553764),
            ],
            ephemeral: true,
          })
          .catch(() => null);
      }

      if (
        int.member.voice.channel?.type == ChannelType.GuildStageVoice &&
        !int.member.voice.channel
          ?.permissionsFor(int.guild?.members?.me)
          ?.has("RequestToSpeak")
      ) {
        return await int
          .reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `**⚠️ I need the \`Request to Speak\` permission in <#${int.member?.voice?.channel?.id}>**`
                )
                .setColor(11553764),
            ],
            ephemeral: true,
          })
          .catch(() => null);
      }

      if (
        int.member.voice.channel?.type == ChannelType.GuildStageVoice &&
        !int.member.voice.channel
          ?.permissionsFor(int.guild?.members?.me)
          ?.has("MuteMembers")
      ) {
        return await int
          .reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `**⚠️ I need the \`Mute Members\` permission in <#${int.member?.voice?.channel?.id}>**`
                )
                .setColor(11553764),
            ],
            ephemeral: true,
          })
          .catch(() => null);
      }

      if (
        !int.member.voice.channel
          ?.permissionsFor(int.guild?.members?.me)
          ?.has("Connect")
      ) {
        return await int
          .reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `**⚠️ I need the \`Connect\` permission in <#${int.member?.voice?.channel?.id}>**`
                )
                .setColor(11553764),
            ],
            ephemeral: true,
          })
          .catch(() => null);
      }

      if (
        !int.member.voice.channel
          ?.permissionsFor(int.guild?.members?.me)
          ?.has("Speak")
      ) {
        return await int
          .reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `**⚠️ I need the \`Speak\` permission in <#${int.member?.voice?.channel?.id}>**`
                )
                .setColor(11553764),
            ],
            ephemeral: true,
          })
          .catch(() => null);
      }

      await int.client.joinVoiceChannel(int.member?.voice?.channel);

      await int
        .reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `**✅ Successfully joined <#${int.member?.voice?.channel?.id}>**`
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
              .setDescription(
                `**❌ Something went wrong while executing that command**`
              )
              .setColor(11553764),
          ],
          ephemeral: true,
        })
        .catch(() => null);
    }
  },
} as CommandObject;
