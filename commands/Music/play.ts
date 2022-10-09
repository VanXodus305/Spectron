import {
  EmbedBuilder,
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import {
  AudioPlayerStatus,
  joinVoiceChannel,
  demuxProbe,
  createAudioPlayer,
  createAudioResource,
} from "@discordjs/voice";
import { ICommand } from "wokcommands";
import fetch from "cross-fetch";
import { config } from "dotenv";
config();

export default {
  category: "Music",
  description: "Search and Play music in a voice channel",
  slash: true,
  syntaxError: {
    english: "**Incorrect syntax! Please use `{PREFIX}{COMMAND} {ARGUMENTS}`**",
  },
  options: [
    {
      name: "query",
      description: "The song to play or search for",
      required: true,
      type: ApplicationCommandOptionType.String as unknown,
    },
  ],
  maxArgs: 1,
  minArgs: 1,
  testOnly: false,
  expectedArgs: "<query>",
  aliases: ["join"],
  callback: async ({ interaction }) => {
    let int = interaction as any;
    const embed = new EmbedBuilder();
    if (int.member?.voice?.channel) {
      embed.setTitle("🔍 Searching for song...");
      embed.setColor(11553764);

      await int.reply({ embeds: [embed] }).then(async () => {
        await int.editReply({
          embeds: [await searchSong(int.options.get("query")?.value as string)],
        });
      });

      async function searchSong(searchTerm: String) {
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
              searchTerm =
                spotifyTrack?.name + " " + spotifyTrack?.artists[0]?.name;
              const song = await fetchSaavn(searchTerm);

              if (
                song.status == "SUCCESS" &&
                song.results[0] &&
                song.results[0]?.name.includes(spotifyTrack?.name) &&
                song.results[0]?.artist.includes(spotifyTrack?.artists[0]?.name)
              ) {
                await buildSong(song);
              } else {
                embed.setTitle(
                  "❌ No streams were found for the provided song"
                );
                return embed;
              }
            }
          }
        } else {
          const saavnSong = await fetchSaavn(searchTerm);
          if (saavnSong.status == "SUCCESS" && saavnSong.results[0]) {
            await buildSong(saavnSong);
          } else {
            embed.setTitle("❌ No songs were found for the provided query");
            return embed;
          }
        }

        async function fetchSaavn(searchTerm: any) {
          const result: any = await fetch(
            `https://saavn.me/search/songs?query=${searchTerm}&limit=1`,
            {
              method: "GET",
              headers: {
                "content-type": "application/json",
              },
            }
          );
          const song = await result.json();
          return song;
        }

        async function buildSong(song: any) {
          const title = song.results[0]?.name;
          const id = song.results[0]?.id;
          const image =
            song.results[0]?.image[song.results[0]?.image?.length - 1]?.link;
          const artists = song.results[0]?.artist;
          let duration = song.results[0]?.duration;
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
            value: "```\n" + song.results[0]?.album?.name + "```",
            inline: true,
          });
          embed.addFields({
            name: "Duration",
            value: "```\n" + duration + "```",
            inline: true,
          });
        }

        return embed;
      }

      async function playSong(song: any) {
        const player = createAudioPlayer();

        const connection = joinVoiceChannel({
          channelId: int.member?.voice?.channelId,
          guildId: int.guildId,
          adapterCreator: int.guild.voiceAdapterCreator,
        });

        connection.subscribe(player);

        let resource = createAudioResource(
          song.results[0]?.downloadUrl[song.results[0]?.downloadUrl?.length - 1]
            ?.link,
          {
            metadata: {
              title: song.results[0]?.name,
            },
          }
        );
        player.play(resource);
      }
    } else {
      embed.setColor(11553764);
      embed.setTitle(
        "⚠️ You must be in a voice channel first to use this command"
      );
      int.reply({ embeds: [embed] });
    }
  },
} as ICommand;