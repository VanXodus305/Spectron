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
  description: "Automatically play Recommended Songs after the Queue ends",
  type: CommandType.SLASH,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: 'choice',
      type: ApplicationCommandOptionType.Boolean,
      description: 'Enable/Disable Autoplay for the Currrent Queue',
      required: true
    }
  ],
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

      if (int.options?.get("choice")?.value == true) {
        if (queue.autoplay.state == true) {
          return await int.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(11553764)
                .setDescription("**⚠️ Autoplay is already enabled for the current queue**")
            ],
            ephemeral: true
          }).catch(() => null);
        }
        queue.autoplay.state = true;
        queue.autoplay.interaction = int;
        queue.autoplay.requester = int.user;
        return await int.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(11553764)
              .setDescription("**✅ Autoplay has been enabled for the current queue**")
          ]
        }).catch(() => null);
      }

      if (int.options?.get("choice")?.value == false) {
        if (queue.autoplay.state == false) {
          return await int.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(11553764)
                .setDescription("**⚠️ Autoplay is already disabled for the current queue**")
            ],
            ephemeral: true
          }).catch(() => null);
        }
        queue.autoplay.state = false;
        return await int.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(11553764)
              .setDescription("**✅ Autoplay has been disabled for the current queue**")
          ]
        }).catch(() => null);
      }
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