import {
  EmbedBuilder,
  ApplicationCommandOptionType,
  Interaction,
  ChannelType,
  Message,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ComponentType,
  StringSelectMenuInteraction,
} from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
import { CommandObject, CommandType } from "wokcommands";
import { config } from "dotenv";
config();

export default {
  category: "Music",
  description: "Search and Play Music in a Voice/Stage Channel",
  type: CommandType.SLASH,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: "query",
      description: "The track to search for and play",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "search",
      description: "Pick a track from multiple search results",
      required: false,
      type: ApplicationCommandOptionType.Boolean,
    },
  ],
  callback: async ({ interaction }: { interaction: Interaction }) => {
    let int = interaction as any;

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

    if (
      oldConnection &&
      oldConnection.joinConfig.channelId != int.member.voice?.channelId
    ) {
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

    let song: any = null;
    let playlist: any = null;
    let playlistSongs: any = [];

    if (!oldConnection) {
      try {
        await int.client.joinVoiceChannel(int.member.voice?.channel);
      } catch (e) {
        console.error(e);
        return await int
          .reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `**❌ Could not join <#${int.member?.voice?.channel?.id}>**`
                )
                .setColor(11553764),
            ],
            ephemeral: true,
          })
          .catch(() => null);
      }
    }
    try {
      const m: Message = await int
        .reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `**🔍 Searching for \`${int.options?.get("query")?.value}\`**`
              )
              .setColor(11553764),
          ],
          fetchReply: true,
        })
        .catch(() => null);

      int.client.lastInt?.set(int.guild?.id, m);
      let queue = int.client.queues.get(int.guild.id);
      if (!oldConnection && queue) {
        int.client.queues.delete(int.guild.id);
        queue = undefined;
      }

      let query = int.options?.getString("query");
      if (query.startsWith("http")) {
        if (query.includes("spotify")) {
          if (query.includes("track")) {
            query = await int.client.getSpotifyTrack(query);
          } else if (query.includes("playlist")) {
            playlist = await int.client.getSpotifyPlaylist(query);
            playlistSongs = await int.client.getSpotifyPlaylistTracks(query);
          }
        }
      }

      if (playlist == null) {
        const playSong = async (song: any) => {
          song.requester = int.user;
          song.message = await int.fetchReply().catch(() => null);

          if (!queue || queue.tracks.length == 0) {
            const newQueue = int.client.createQueue(
              song,
              int.member.user,
              int.channelId
            );
            int.client.queues?.set(int.guild?.id, newQueue);
            return await int.client.playSong(int.member.voice?.channel, song);
          }

          queue.tracks.push(int.client.createSong(song, int.member.user));
          return await m
            .edit({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    `**✅ Successfully queued at Position - \`#${
                      queue.tracks.length - 1
                    }\`**`
                  )
                  .setColor(11553764)
                  .addFields({
                    name: "📀 Song",
                    value:
                      "```\n" +
                      int.client.decodeHTMLEntities(song.name) +
                      "```",
                    inline: true,
                  })
                  .addFields({
                    name: "👤 Requester",
                    value: `<@${int.member.user?.id}>`,
                    inline: true,
                  })
                  .setThumbnail(`${song.image[song.image?.length - 1]?.url}`),
              ],
              components: [],
            })
            .catch(() => null);
        };

        if (int.options?.getBoolean("search") == true) {
          const songs = await int.client.searchSong(query);
          if (!songs) {
            return await m
              .edit({
                embeds: [
                  new EmbedBuilder()
                    .setDescription(
                      `**❌ No tracks were found for \`${int.options?.getString(
                        "query"
                      )}\`**`
                    )
                    .setColor(11553764),
                ],
              })
              .catch(() => null);
          }
          let selectMenu = new StringSelectMenuBuilder()
            .setCustomId(`track_select_${int.id}`)
            .setPlaceholder("Select the Track to Play")
            .setMinValues(1)
            .setMaxValues(1);
          const emojis: any = [
            "1️⃣",
            "2️⃣",
            "3️⃣",
            "4️⃣",
            "5️⃣",
            "6️⃣",
            "7️⃣",
            "8️⃣",
            "9️⃣",
            "🔟",
          ];
          setTimeout(async () => {
            const msg: Message = await int.fetchReply().catch(() => null);
            const disabledRow = new ActionRowBuilder();
            msg.components[0]?.components?.forEach((menu: any) => {
              const editedMenu =
                StringSelectMenuBuilder.from(menu).setDisabled(true);
              disabledRow.addComponents(editedMenu);
            });
            await int
              .editReply({
                embeds: msg.embeds,
                components: disabledRow.components[0] ? [disabledRow] : [],
              })
              .catch(() => null);
          }, 1000 * 60 * 1);
          songs.forEach((song: any) => {
            selectMenu.addOptions(
              new StringSelectMenuOptionBuilder()
                .setLabel(
                  int.client?.decodeHTMLEntities(song.name).substring(0, 101)
                )
                .setDescription(
                  int.client
                    ?.decodeHTMLEntities(
                      song.artists.primary
                        .map((artist: any) => artist.name)
                        .join(", ")
                    )
                    .substring(0, 101)
                )
                .setEmoji(emojis[songs.indexOf(song)])
                .setValue(song.id)
            );
          });

          await m.edit({
            components: [
              new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                selectMenu
              ),
            ],
            embeds: [
              new EmbedBuilder()
                .setDescription(`**🔍 Search Results for \`${query}\`**`)
                .setColor(11553764),
            ],
          });

          const filter = (i: Interaction) => i.user.id == int.user?.id;
          let collector: any = int.channel?.createMessageComponentCollector({
            filter,
            time: 1000 * 60 * 1,
            componentType: ComponentType.StringSelect,
            maxComponents: 1,
          });

          await collector.on(
            "collect",
            async (sltInt: StringSelectMenuInteraction) => {
              if (!sltInt) {
                return;
              }
              await sltInt.deferUpdate().catch(() => null);
              if (sltInt.customId != `track_select_${int.id}`) {
                return;
              } else {
                song = songs.find((song: any) => song.id == sltInt.values[0]);
                await playSong(song);
              }
            }
          );
        } else {
          song = await int.client.getSong(query);
          if (!song || !song?.downloadUrl) {
            return await m
              .edit({
                embeds: [
                  new EmbedBuilder()
                    .setDescription(
                      `**❌ No tracks were found for \`${int.options?.getString(
                        "query"
                      )}\`**`
                    )
                    .setColor(11553764),
                ],
              })
              .catch(() => null);
          }
          await playSong(song);
        }
      } else {
        const firstSongIndex = playlistSongs.findIndex(async (s: string) => {
          const track: any = await int.client.getSong(s);
          if (track && track?.downloadUrl) {
            return true;
          } else {
            return false;
          }
        });
        const firstSong = await int.client.getSong(
          playlistSongs[firstSongIndex]
        );
        if (!firstSong) {
          return await m
            .edit({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    `**❌ No tracks were found for \`${int.options?.getString(
                      "query"
                    )}\`**`
                  )
                  .setColor(11553764),
              ],
            })
            .catch(() => null);
        }

        firstSong.requester = int.user;
        firstSong.message = await int.fetchReply().catch(() => null);

        if (!queue || queue.tracks.length == 0) {
          const newQueue = int.client.createQueue(
            firstSong,
            int.member.user,
            int.channelId
          );
          int.client.queues?.set(int.guild?.id, newQueue);
          queue = int.client.queues.get(int.guild.id);
          await int.client.playSong(int.member.voice?.channel, firstSong);
          playlistSongs = playlistSongs.slice(firstSongIndex + 1);
        } else {
          queue.tracks.push(int.client.createSong(firstSong, int.member.user));
          playlistSongs = playlistSongs.slice(firstSongIndex + 1);
          await m
            .edit({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    `**✅ Successfully queued playlist at Position - \`#${
                      queue.tracks.length - 1
                    }\`**`
                  )
                  .setColor(11553764)
                  .addFields({
                    name: "💽 Playlist",
                    value:
                      "```\n" +
                      int.client.decodeHTMLEntities(playlist?.name) +
                      "```",
                    inline: true,
                  })
                  .addFields({
                    name: "👤 Requester",
                    value: `<@${int.member.user?.id}>`,
                    inline: true,
                  })
                  .setThumbnail(`${playlist?.images[0]?.url}`),
              ],
            })
            .catch(() => null);
        }
        await playlistSongs.forEach(async (song: String, index: number) => {
          setTimeout(async () => {
            const track: any = await int.client.getSong(song);
            if (track && track?.downloadUrl) {
              track.requester = firstSong.requester;
              track.message = firstSong.message;
              queue.tracks.push(int.client.createSong(track, int.member.user));
            }
          }, index * 100);
        });
      }
    } catch (e) {
      console.error(e);
      return await int
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
