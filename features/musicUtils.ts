import {
  EmbedBuilder,
  Message,
  Snowflake,
  User,
  VoiceBasedChannel,
} from "discord.js";
import {
  joinVoiceChannel,
  getVoiceConnection,
  VoiceConnectionStatus,
  entersState,
  createAudioResource,
  createAudioPlayer,
  NoSubscriberBehavior,
  AudioPlayerStatus,
} from "@discordjs/voice";
import fetch from "cross-fetch";
import WOK from "wokcommands";

export default async (instance: WOK, client: any) => {
  client.getSong = async (query: string) => {
    try {
      const result: any = await fetch(
        `${process.env.Song_API_URL}/search/songs?query=${query}&limit=1`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        }
      ).catch(() => null);

      if (result?.status == 200) {
        const songs = await result.json().catch(() => null);
        if (songs.data?.results[0]) {
          const song = songs.data.results.find(
            (song: any) => song.downloadUrl != false
          );
          if (song != undefined) {
            return song;
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  client.searchSong = async (query: string) => {
    try {
      let result: any = await fetch(
        `${process.env.Song_API_URL}/search/songs?query=${query}&limit=10`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        }
      ).catch(() => null);

      if (result?.status == 200) {
        result = await result.json().catch(() => null);
        if (result.data?.results[0]) {
          let songs: any = [];
          result.data?.results?.forEach((song: any) => {
            if (song.downloadUrl != false) {
              songs.push(song);
            }
          });
          if (songs[0] != undefined) {
            return songs;
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  client.getRecommendedSong = async (reference: any) => {
    try {
      let query = reference?.name + " ";
      query += reference.primaryArtists?.replace(",", "");
      const recommendation: string = await client.getSpotifyRecommendation(
        query
      );
      const result: any = await client.getSong(recommendation);
      if (result != null) {
        return result;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  client.joinVoiceChannel = async (channel: VoiceBasedChannel) => {
    return new Promise(async (res, rej) => {
      const oldConnection = getVoiceConnection(channel.guild.id);
      if (oldConnection) {
        return rej({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `**⚠️ I'm already connected in <#${oldConnection.joinConfig.channelId}>**`
              )
              .setColor(11553764),
          ],
          ephemeral: true,
        });
      }

      const newConnection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });

      await client.delay(250);

      newConnection.on(
        VoiceConnectionStatus.Disconnected,
        async (oldState, newState) => {
          try {
            await Promise.race([
              entersState(
                newConnection,
                VoiceConnectionStatus.Signalling,
                5_000
              ),
              entersState(
                newConnection,
                VoiceConnectionStatus.Connecting,
                5_000
              ),
            ]);
          } catch (error) {
            newConnection.destroy();
          }
        }
      );

      newConnection.on(VoiceConnectionStatus.Destroyed, () => {
        client.queues.delete(channel.guild.id);
      });

      return res({
        embeds: [
          new EmbedBuilder()
            .setDescription(`**✅ Successfully joined <#${channel.id}>**`)
            .setColor(11553764),
        ],
      });
    });
  };

  client.leaveVoiceChannel = async (channel: VoiceBasedChannel) => {
    return new Promise(async (res, rej) => {
      const oldConnection = getVoiceConnection(channel.guild.id);
      if (oldConnection) {
        try {
          oldConnection.destroy();
          await client.delay(250);
          return res(true);
        } catch (e) {
          console.error(e);
          return rej(e);
        }
      } else {
        return rej({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `**⚠️ I'm not connected in any Voice/Stage Channel**`
              )
              .setColor(11553764),
          ],
        });
      }
    });
  };

  client.getResource = (queue: any, songInfo: any) => {
    const url = songInfo.downloadUrl;
    if (!url) return null;
    const resource = createAudioResource(url[url?.length - 1]?.link, {
      inlineVolume: false,
      metadata: {
        details: songInfo,
      },
    });
    return resource;
  };

  client.playSong = async (channel: VoiceBasedChannel, songInfo: any) => {
    return new Promise(async (res, rej) => {
      const oldConnection = getVoiceConnection(channel.guild.id);
      if (oldConnection) {
        if (oldConnection.joinConfig.channelId != channel.id) {
          return rej({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `**⚠️ I'm already connected in <#${oldConnection.joinConfig.channelId}>**`
                )
                .setColor(11553764),
            ],
            ephemeral: true,
          });
        }
        try {
          const curQueue = client.queues.get(channel.guild.id);

          const player = createAudioPlayer({
            behaviors: {
              noSubscriber: NoSubscriberBehavior.Stop,
            },
          });
          oldConnection.subscribe(player);

          const resource = client.getResource(curQueue, songInfo);
          player.play(resource);

          player.on(AudioPlayerStatus.Playing, async () => {
            client.sendQueueUpdate(channel);
          });

          player.on(AudioPlayerStatus.Idle, () => {
            const queue = client.queues.get(channel.guild.id);
            handleQueue(queue);
          });

          player.on("error", (error) => {
            console.error(error);
            const queue = client.queues.get(channel.guild.id);
            handleQueue(queue);
          });

          async function handleQueue(queue: any) {
            if (queue) {
              try {
                player.stop();
                if (queue && queue.tracks && queue.tracks.length > 1) {
                  queue.previous = queue.tracks[0];
                  if (queue.trackloop && !queue.skipped) {
                    if (queue.paused) queue.paused = false;
                    player.play(client.getResource(queue, queue.tracks[0]));
                  } else if (queue.queueloop && !queue.skipped) {
                    const firstSong = queue.tracks.shift();
                    queue.tracks.push(firstSong);
                    if (queue.paused) queue.paused = false;
                    player.play(client.getResource(queue, queue.tracks[0]));
                  } else {
                    if (queue.skipped) queue.skipped = false;
                    if (queue.paused) queue.paused = false;
                    queue.tracks.shift();
                    player.play(client.getResource(queue, queue.tracks[0]));
                  }
                } else if (queue && queue.tracks && queue.tracks.length <= 1) {
                  queue.previous = queue.tracks[0];
                  if (queue.trackloop || (queue.queueloop && !queue.skipped)) {
                    player.play(client.getResource(queue, queue.tracks[0]));
                  } else {
                    if (queue.autoplay.state == true) {
                      const song = await client.getRecommendedSong(
                        queue.previous
                      );
                      if (song != null) {
                        song.requester = queue.autoplay?.requester;
                        song.message = queue.autoplay?.message;
                        if (queue.skipped) queue.skipped = false;
                        if (queue.paused) queue.paused = false;
                        queue.tracks.shift();
                        queue.tracks.push(
                          client.createSong(song, songInfo.requester)
                        );
                        player.play(client.getResource(queue, queue.tracks[0]));
                      } else {
                        if (queue.skipped) {
                          queue.skipped = false;
                        }
                        queue.tracks = [];
                      }
                    } else {
                      if (queue.skipped) {
                        queue.skipped = false;
                      }
                      queue.tracks = [];
                    }
                  }
                }
              } catch (e) {
                console.error(e);
              }
            }
          }
          return res(songInfo);
        } catch (e) {
          console.error(e);
          return rej(e);
        }
      } else {
        return rej({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `**⚠️ I'm not connected in any Voice/Stage Channel**`
              )
              .setColor(11553764),
          ],
          ephemeral: true,
        });
      }
    });
  };

  client.sendQueueUpdate = async (channel: VoiceBasedChannel) => {
    const queue = client.queues.get(channel.guildId);
    if (
      !queue ||
      !queue.tracks ||
      queue.tracks.length == 0 ||
      !queue.textChannel
    )
      return;
    const textChannel =
      client.channels.cache.get(queue.textChannel) ||
      (await client.channels.fetch(queue.textChannel).catch(() => null));
    if (!textChannel) return;

    const song = queue.tracks[0];
    const songEmbed = new EmbedBuilder()
      .setColor(11553764)
      .setTitle(`${client.decodeHTMLEntities(song.name)}`)
      .addFields({
        name: "👥 Artists",
        value: "```\n" + client.decodeHTMLEntities(song.primaryArtists) + "```",
        inline: false,
      })
      .addFields({
        name: "📀 Album",
        value: "```\n" + client.decodeHTMLEntities(song.album?.name) + "```",
        inline: true,
      })
      .addFields({
        name: "🕒 Duration",
        value:
          "```\n" +
          client.formatDuration(client.decodeHTMLEntities(song.duration)) +
          "```",
        inline: true,
      })
      .addFields({
        name: "👤 Requester",
        value: `<@${song.requester.id}>`,
        inline: true,
      })
      .setThumbnail(song.image[song.image?.length - 1]?.link);

    if (!queue.resumed) {
      if (queue.previous) {
        await song.message
          ?.reply({
            embeds: [songEmbed],
            failIfNotExists: false,
          })
          .catch(() => null);
      } else {
        song.message
          ?.edit({
            embeds: [songEmbed],
            components: [],
          })
          .catch(() => null);
      }
    } else {
      queue.resumed = false;
    }
  };

  client.createSong = (song: any, requester: User) => {
    return { ...song, requester };
  };

  client.createQueue = (song: any, user: User, channelId: Snowflake) => {
    return {
      textChannel: channelId,
      paused: false,
      resumed: false,
      skipped: false,
      trackloop: false,
      queueloop: false,
      autoplay: {
        state: false,
        message: Message,
        requester: User,
      },
      tracks: [client.createSong(song, user)],
      previous: undefined,
      creator: user,
    };
  };

  client.createBar = (duration: number, position: number) => {
    try {
      const full = "▰";
      const empty = "▱";
      const size = 15;
      const percent: any =
        duration == 0 ? null : Math.floor((position / duration) * 100);
      const fullBars = Math.round(size * (percent / 100));
      const emptyBars = size - fullBars;
      return `${full.repeat(fullBars)}${empty.repeat(emptyBars)}`;
    } catch (e) {
      console.error(e);
    }
  };
};
