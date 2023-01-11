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
  description: "Loops the Currently Playing Track/Queue",
  type: CommandType.SLASH,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: "queue",
      description: "Loops the Currently Playing Queue",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "choice",
          type: ApplicationCommandOptionType.Boolean,
          description: "Enable/Disable Loop for the Currrent Queue",
          required: true,
        },
      ],
    },
    {
      name: "track",
      description: "Loops the Currently Playing Track",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "choice",
          type: ApplicationCommandOptionType.Boolean,
          description: "Enable/Disable Loop for the Currrent Track",
          required: true,
        },
      ],
    },
  ],
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
                  "**⚠️ There are no tracks currently playing on the server**"
                ),
            ],
            ephemeral: true,
          })
          .catch(() => null);
      }

      if (int.options?.getBoolean("choice") == true) {
        if (int.options?.getSubcommand() == "track") {
          if (queue.trackloop == true) {
            return await int
              .reply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(11553764)
                    .setDescription(
                      "**⚠️ Loop is already enabled for the current track**"
                    ),
                ],
                ephemeral: true,
              })
              .catch(() => null);
          }
          if (queue.queueloop) queue.queueloop = false;
          queue.trackloop = true;
          return await int
            .reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(11553764)
                  .setDescription(
                    "**✅ Loop has been enabled for the current track**"
                  ),
              ],
            })
            .catch(() => null);
        } else if (int.options?.getSubcommand() == "queue") {
          if (queue.queueloop == true) {
            return await int
              .reply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(11553764)
                    .setDescription(
                      "**⚠️ Loop is already enabled for the current queue**"
                    ),
                ],
                ephemeral: true,
              })
              .catch(() => null);
          }
          if (queue.trackloop) queue.trackloop = false;
          queue.queueloop = true;
          return await int
            .reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(11553764)
                  .setDescription(
                    "**✅ Loop has been enabled for the current queue**"
                  ),
              ],
            })
            .catch(() => null);
        }
      } else if (int.options?.getBoolean("choice") == false) {
        if (int.options?.getSubcommand() == "track") {
          if (queue.trackloop == false) {
            return await int
              .reply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(11553764)
                    .setDescription(
                      "**⚠️ Loop is already disabled for the current track**"
                    ),
                ],
                ephemeral: true,
              })
              .catch(() => null);
          }
          if (queue.queueloop) queue.queueloop = false;
          queue.trackloop = false;
          return await int
            .reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(11553764)
                  .setDescription(
                    "**✅ Loop has been disabled for the current track**"
                  ),
              ],
            })
            .catch(() => null);
        } else if (int.options?.getSubcommand() == "queue") {
          if (queue.queueloop == false) {
            return await int
              .reply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(11553764)
                    .setDescription(
                      "**⚠️ Loop is already disabled for the current queue**"
                    ),
                ],
                ephemeral: true,
              })
              .catch(() => null);
          }
          if (queue.trackloop) queue.trackloop = false;
          queue.queueloop = false;
          return await int
            .reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(11553764)
                  .setDescription(
                    "**✅ Loop has been disabled for the current queue**"
                  ),
              ],
            })
            .catch(() => null);
        }
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
