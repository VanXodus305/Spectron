import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  Interaction,
  Message,
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
      description: "Removes a Specified or All Tracks from the Current Queue",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "track",
          description: "Index of the Track to Remove from the Queue",
          type: ApplicationCommandOptionType.Number,
          required: false,
        },
      ],
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
        if (!int.options?.getNumber("track")) {
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
        } else if (
          int.options?.getNumber("track") >= 1 &&
          int.options?.getNumber("track") < queue.tracks.length
        ) {
          const removed = queue.tracks?.splice(
            int.options?.getNumber("track"),
            1
          );
          return await int
            .reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(11553764)
                  .setDescription(
                    `**✅ Successfully removed \`${int.client.decodeHTMLEntities(
                      removed[0]?.name
                    )}\` from the queue**`
                  ),
              ],
            })
            .catch(() => null);
        } else {
          return await int
            .reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(11553764)
                  .setDescription(
                    `**⚠️ No track is queued at Position - \`${int.options?.getNumber(
                      "track"
                    )}\`**`
                  ),
              ],
              ephemeral: true,
            })
            .catch(() => null);
        }
      }

      if (int.options?.getSubcommand() == "view") {
        setTimeout(async () => {
          const msg: Message = await int.fetchReply().catch(() => null);
          const disabledRow = new ActionRowBuilder();
          msg.components[0]?.components?.forEach((button: any) => {
            const editedButton = ButtonBuilder.from(button).setDisabled(true);
            disabledRow.addComponents(editedButton);
          });
          await int
            .editReply({
              embeds: msg.embeds,
              components: disabledRow.components[0] ? [disabledRow] : [],
            })
            .catch(() => null);
        }, 1000 * 60 * 5);
        const pages = Math.ceil(queue.tracks?.length / 15);
        const embeds: EmbedBuilder[] = [];
        for (let a = 0; a < pages; ++a) {
          let description = ">>> ";
          let position = "";
          let requester = "";
          let name = "";
          queue.tracks?.slice(a * 15 + 1, a * 15 + 16).forEach((song: any) => {
            position = `\`${queue.tracks?.indexOf(song)}\``;
            requester = `<@${song.requester?.id}>`;
            name = `\`${int.client?.decodeHTMLEntities(song.name)}\``;
            description += `**#${position}: ${name} - ${requester}**\n`;
          });
          embeds.push(
            new EmbedBuilder()
              .setColor(11553764)
              .setDescription(description)
              .setTitle("List of Queued Tracks")
              .setFooter({
                text: `Page: ${a + 1}/${pages} (#${a * 15 + 1} - #${
                  a * 15 + 15
                })`,
              })
          );
        }

        const getRow = (page: number) => {
          const row = new ActionRowBuilder();
          if (page != 0) {
            row.addComponents(
              new ButtonBuilder()
                .setCustomId(`queue_prev_${int.id}`)
                .setStyle(ButtonStyle.Success)
                .setLabel(`Page: ${page}`)
                .setEmoji("⬅️")
            );
          }
          if (page != embeds.length - 1) {
            row.addComponents(
              new ButtonBuilder()
                .setCustomId(`queue_next_${int.id}`)
                .setStyle(ButtonStyle.Success)
                .setLabel(`Page: ${page + 2}`)
                .setEmoji("➡️")
            );
          }
          return row;
        };

        let page = 0;
        const embed = embeds[page];
        const filter = (i: Interaction) => i.user.id == int.user?.id;

        await int
          .reply({
            embeds: [embed],
            components: getRow(page).components[0] ? [getRow(page)] : [],
            ephemeral: true,
          })
          .catch(() => null);

        let collector: any = int.channel?.createMessageComponentCollector({
          filter,
          time: 1000 * 60 * 5,
          idle: 1000 * 60,
          componentType: ComponentType.Button,
        });

        collector.on("collect", async (btnInt: ButtonInteraction) => {
          if (!btnInt) {
            return;
          }
          await btnInt.deferUpdate().catch(() => null);
          if (
            btnInt.customId != `queue_prev_${int.id}` &&
            btnInt.customId != `queue_next_${int.id}`
          ) {
            return;
          }
          if (btnInt.customId == `queue_prev_${int.id}` && page > 0) {
            --page;
          } else if (
            btnInt.customId == `queue_next_${int.id}` &&
            page < embeds.length - 1
          ) {
            ++page;
          }

          await int
            .editReply({
              embeds: [embeds[page]],
              components: [getRow(page)],
            })
            .catch(() => null);
        });
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
