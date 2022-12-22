import { EmbedBuilder, Snowflake, User, VoiceBasedChannel } from 'discord.js';
import { joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus, entersState, createAudioResource, createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus } from "@discordjs/voice";
import fetch from "cross-fetch";
import WOK from 'wokcommands';

export default async (instance: WOK, client: any) => {
  const m2 = (t: any) => {
    return parseInt(t) < 10 ? `0${t}` : `${t}`
  }
  const m3 = (t: any) => {
    return parseInt(t) < 100 ? `0${m2(t)}` : `${t}`
  }


  client.getTime = () => {
    const d = new Date;
    return `${m2(d.getHours())}:${m2(d.getMinutes())}:${m2(d.getSeconds())}.${m3(d.getMilliseconds())}`
  }

  client.getSong = async (query: string) => {
    try {
      const result: any = await fetch(`${process.env.Song_API_URL}/search/songs?query=${query}&limit=1`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        }
      ).catch(() => null);
      if (result.status == 200) {
        const song = await result.json().catch(() => null);
        if (song.data?.results[0]) {
          return song.data?.results[0];
        }
        else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  client.joinVoiceChannel = async (channel: VoiceBasedChannel) => {
    return new Promise(async (res, rej) => {
      const oldConnection = getVoiceConnection(channel.guild.id);
      if (oldConnection) {
        return rej(
          {
            embeds: [
              new EmbedBuilder()
                .setDescription(`**⚠️ I'm already connected in <#${oldConnection.joinConfig.channelId}>**`)
                .setColor(11553764)
            ],
            ephemeral: true
          }
        );
      }

      const newConnection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
      });

      await delay(250);

      newConnection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
        try {
          await Promise.race([
            entersState(newConnection, VoiceConnectionStatus.Signalling, 5_000),
            entersState(newConnection, VoiceConnectionStatus.Connecting, 5_000),
          ]);
        } catch (error) {
          newConnection.destroy();
        }
      });

      newConnection.on(VoiceConnectionStatus.Destroyed, () => {
        client.queues.delete(channel.guild.id)
      });

      return res({
        embeds: [
          new EmbedBuilder()
            .setDescription(`**✅ Successfully joined <#${channel.id}>**`)
            .setColor(11553764)
        ],
      });
    });
  }

  client.leaveVoiceChannel = async (channel: VoiceBasedChannel) => {
    return new Promise(async (res, rej) => {
      const oldConnection = getVoiceConnection(channel.guild.id);
      if (oldConnection) {
        try {
          oldConnection.destroy();
          await delay(250);
          return res(true);
        } catch (e) {
          console.error(e);
          return rej(e);
        }
      } else {
        return rej({
          embeds: [
            new EmbedBuilder()
              .setDescription(`**⚠️ I'm not connected in any Voice/Stage Channel**`)
              .setColor(11553764)
          ],
        });
      }
    });
  }

  client.getResource = (queue: any, songInfo: any) => {
    const url = songInfo.downloadUrl
    if (!url) return null;
    const resource = createAudioResource(url[url?.length - 1]?.link, {
      inlineVolume: false,
      metadata: {
        id: songInfo.id,
      }
    });
    return resource;
  }

  client.playSong = async (channel: VoiceBasedChannel, songInfo: any) => {
    return new Promise(async (res, rej) => {
      const oldConnection = getVoiceConnection(channel.guild.id);
      if (oldConnection) {
        if (oldConnection.joinConfig.channelId != channel.id) {
          return rej(
            {
              embeds: [
                new EmbedBuilder()
                  .setDescription(`**⚠️ I'm already connected in <#${oldConnection.joinConfig.channelId}>**`)
                  .setColor(11553764)
              ],
              ephemeral: true
            }
          );
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
            const queue = client.queues.get(channel.guild.id);
            client.sendQueueUpdate();
          });

          player.on(AudioPlayerStatus.Idle, () => {
            const queue = client.queues.get(channel.guild.id);
            handleQueue(queue);
          });

          player.on('error', error => {
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
                    player.play(client.getResource(queue, queue.tracks[0]))
                  } else if (queue.queueloop && !queue.skipped) {
                    const skipped = queue.tracks.shift();
                    queue.tracks.push(skipped);
                    if (queue.paused) queue.paused = false;
                    player.play(client.getResource(queue, queue.tracks[0]));
                  } else {
                    if (queue.skipped) queue.skipped = false;
                    if (queue.paused) queue.paused = false;
                    queue.tracks.shift();
                    player.play(client.getResource(queue, queue.tracks[0]));
                  }
                }
                else if (queue && queue.tracks && queue.tracks.length <= 1) {
                  queue.previous = queue.tracks[0];
                  if (queue.trackloop || queue.queueloop && !queue.skipped) {
                    player.play(client.getResource(queue, queue.tracks[0]));
                  }
                  else {
                    if (queue.skipped) {
                      queue.skipped = false;
                    }
                    queue.tracks = [];
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
      }
      else {
        return rej(
          {
            embeds: [
              new EmbedBuilder()
                .setDescription(`**⚠️ I'm not connected in any Voice/Stage Channel**`)
                .setColor(11553764)
            ],
            ephemeral: true
          }
        );
      }
    })
  }

  client.sendQueueUpdate = async () => {
    const queue = client.queues.get(client.int[0]?.guildId);
    if (!queue || !queue.tracks || queue.tracks.length == 0 || !queue.textChannel) return;
    const textChannel = client.channels.cache.get(queue.textChannel) || await client.channels.fetch(queue.textChannel).catch(() => null);
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
        value: "```\n" + client.formatDuration(client.decodeHTMLEntities(song.duration)) + "```",
        inline: true,
      })
      .addFields({
        name: "👤 Requester",
        value: `<@${client.int[0].user.id}>`,
        inline: true,
      })
      .setThumbnail(song.image[song.image?.length - 1]?.link);

    if (queue.previous) {
      await client.int[0].followUp({
        embeds: [
          songEmbed
        ]
      }).catch(() => null);
      client.int.shift();
    }
    else {
      const msg = await client.int[0].fetchReply().catch(() => null); 
      msg?.edit({
        embeds: [
          songEmbed
        ]
      }).catch(() => null);
      client.int.shift();
    }
  }

  client.createSong = (song: any, requester: User) => {
    return { ...song, requester }
  }

  client.createQueue = (song: any, user: User, channelId: Snowflake) => {
    return {
      textChannel: channelId,
      paused: false,
      skipped: false,      
      trackloop: false,
      queueloop: false,     
      tracks: [client.createSong(song, user)],
      previous: undefined,
      creator: user,
    }
  }

  client.formatDuration = (d: number) => {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
  }

  client.createBar = (duration: number, position: number) => {
    try {
      const full = "▰";
      const empty = "▱"
      const size = "▰▰▰▰▰▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱".length;
      const percent: any = duration == 0 ? null : Math.floor(position / duration * 100)
      const fullBars = Math.round(size * (percent / 100));
      const emptyBars = size - fullBars;
      return `**${full.repeat(fullBars)}${empty.repeat(emptyBars)}**`;
    } catch (e) {
      console.error(e);
    }
  }

  client.decodeHTMLEntities = (text: string) => {
    var entities = [
      ["amp", "&"],
      ["apos", "'"],
      ["#x27", "'"],
      ["#x2F", "/"],
      ["#39", "'"],
      ["#47", "/"],
      ["lt", "<"],
      ["gt", ">"],
      ["nbsp", " "],
      ["quot", '"'],
    ];
    for (var i = 0, max = entities.length; i < max; ++i)
      text = text.replace(
        new RegExp("&" + entities[i][0] + ";", "g"),
        entities[i][1]
      );
    return text;
  }

  function delay(ms: number) {
    return new Promise(r => setTimeout(() => r(2), ms));
  }
}