import {
  EmbedBuilder,
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Interaction,
} from "discord.js";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
} from "@discordjs/voice";
import { CommandObject, CommandType } from "wokcommands";
import fetch from "cross-fetch";
import { config } from "dotenv";
config();

export default {
  category: "Music",
  description: "Search and Play music in a voice channel",
  type: CommandType.SLASH,
  testOnly: false,
  guildOnly: true,
  options: [
    {
      name: "query",
      description: "The song(s) to play or search for",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],
  callback: async ({ interaction }: { interaction: Interaction }) => {
    let int = interaction as any;
    const embed = new EmbedBuilder();
    if (int.member?.voice?.channel) {
      embed.setTitle("🔍 Searching for song...");
      embed.setColor(11553764);

      await int.reply({ embeds: [embed] }).then(async () => {
        await int.editReply(
          await searchSong(int.options.get("query")?.value as string)
        );
      });

      function decodeHTMLEntities(text: string) {
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

      async function searchSong(searchTerm: String) {
        const row = new ActionRowBuilder();
        if (searchTerm.startsWith("http")) {
          if (searchTerm.includes("spotify")) {
            let spotifyID: String;
            if (searchTerm.includes("track")) {
              spotifyID = searchTerm.substring(
                searchTerm.indexOf("track") + 6,
                searchTerm.indexOf("track") + 28
              );
              let spotifyToken: any = await fetch(
                "https://accounts.spotify.com/api/token",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization:
                      "Basic " +
                      btoa(
                        process.env.Spotify_Client_ID +
                        ":" +
                        process.env.Spotify_Client_Secret
                      ),
                  },
                  body: "grant_type=client_credentials",
                }
              );
              spotifyToken = await spotifyToken.json();
              spotifyToken = spotifyToken.access_token;

              let spotifyTrack: any = await fetch(
                `https://api.spotify.com/v1/tracks/${spotifyID}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: "Bearer " + spotifyToken,
                  },
                }
              );
              spotifyTrack = await spotifyTrack.json();
              let spotifyArtists = "";
              spotifyTrack?.artists?.forEach(
                (artist: any) => (spotifyArtists += " " + artist.name)
              );
              searchTerm =
                spotifyTrack?.name.replace(/\([^()]*\)/g, "") + spotifyArtists;
              searchTerm = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
              let songs = await fetchSong(searchTerm, 10);

              if (songs?.status == "SUCCESS" && songs?.data?.results[0]) {
                songs = await songs?.data?.results?.sort((a: any, b: any) => {
                  return a.name.localeCompare(b.name);
                });
                const song = await songs.find((song: any) => {
                  return (
                    song.duration -
                    Math.abs(Math.floor(spotifyTrack?.duration_ms / 1000)) <=
                    2 && song.downloadUrl != false
                  );
                });

                if (song != undefined) {
                  await buildSong(song);
                } else {
                  embed.setTitle(
                    "❌ No streams were found for the provided song"
                  );
                  return { embeds: [embed] };
                }
              } else {
                embed.setTitle(
                  "❌ No streams were found for the provided song"
                );
                return { embeds: [embed] };
              }
            }
          }
        } else {
          const saavnSong = await fetchSong(searchTerm, 1);
          if (
            saavnSong?.status == "SUCCESS" &&
            saavnSong?.data?.results[0] &&
            saavnSong?.data?.results[0]?.downloadUrl != false
          ) {
            await buildSong(saavnSong.data.results[0]);
          } else {
            embed.setTitle("❌ No songs were found for the provided query");
            return { embeds: [embed] };
          }
        }

        async function fetchSong(searchTerm: any, limit: Number) {
          const result: any = await fetch(
            `${process.env.Song_API_URL}/search/songs?query=${searchTerm}&limit=${limit}`,
            {
              method: "GET",
              headers: {
                "content-type": "application/json",
              },
            }
          );
          if (result.status == 200) {
            const song = await result.json();
            return song;
          } else {
            return null;
          }
        }

        async function buildSong(song: any) {
          const title = decodeHTMLEntities(song.name);
          const id = song.id;
          const image = song.image[song.image?.length - 1]?.link;
          const artists = decodeHTMLEntities(song.primaryArtists);
          let duration = decodeHTMLEntities(song.duration);
          duration = await convertTime(duration);

          async function convertTime(d: any) {
            d = Number(d);
            var h = Math.floor(d / 3600);
            var m = Math.floor((d % 3600) / 60);
            var s = Math.floor((d % 3600) % 60);

            var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
            var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
            var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
            return hDisplay + mDisplay + sDisplay;
          }

          await playSong(song);

          embed.setTitle(title);
          embed.setThumbnail(image);
          embed.addFields({
            name: "Artists",
            value: "```\n" + artists + "```",
            inline: false,
          });
          embed.addFields({
            name: "Album",
            value: "```\n" + song.album?.name + "```",
            inline: true,
          });
          embed.addFields({
            name: "Duration",
            value: "```\n" + duration + "```",
            inline: true,
          });

          row.addComponents(
            new ButtonBuilder()
              .setLabel("STOP")
              .setEmoji("⏹️")
              .setCustomId("stop")
              .setStyle(ButtonStyle.Danger)
          );
        }

        if (row?.components[0]) {
          return { embeds: [embed], components: [row] };
        } else {
          return { embeds: [embed] };
        }
      }

      async function playSong(song: any) {
        const player = createAudioPlayer({
          behaviors: {
            noSubscriber: NoSubscriberBehavior.Stop,
          },
        });
        const connection = joinVoiceChannel({
          channelId: int.member?.voice?.channelId,
          guildId: int.guildId,
          adapterCreator: int.guild.voiceAdapterCreator,
        });

        connection.subscribe(player);

        let resource = createAudioResource(
          song.downloadUrl[song.downloadUrl?.length - 1]?.link,
          {
            metadata: {
              title: song.name,
            },
          }
        );
        player.play(resource);
      }
    } else {
      embed.setColor(11553764);
      embed.setTitle("⚠️ You must be in a voice channel to use this command");
      int.reply({ embeds: [embed] });
    }
  },
} as CommandObject;