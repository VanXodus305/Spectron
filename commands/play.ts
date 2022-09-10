import { EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { AudioPlayerStatus, joinVoiceChannel, demuxProbe, createAudioPlayer, createAudioResource } from '@discordjs/voice'
import { ICommand } from "wokcommands";
import fetch from 'cross-fetch'
import { config } from 'dotenv';
config();

export default {
  category: "Music",
  description: "Search and Play music in a voice channel",
  slash: true,
  syntaxError: {
    "english": "**Incorrect syntax! Please use \`{PREFIX}{COMMAND} {ARGUMENTS}\`**"
  },
  options: [
    {
      name: 'query',
      description: 'The song to play or search for',
      required: true,
      type: ApplicationCommandOptionType.String as unknown,
    }
  ],
  maxArgs: 1,
  minArgs: 1,
  testOnly: true,
  expectedArgs: '<query>',
  aliases: ['join'],
  callback: async ({ interaction }) => {
    let int = interaction as any;
    if (int.member?.voice?.channel) {
      const embed = new EmbedBuilder();
      embed.setTitle('🔍 Searching for song...');
      embed.setColor(11553764);

      await int.reply({ embeds: [embed] }).then(async () => {
        await int.editReply({ embeds: [await searchSong(int.options.get("query")?.value as string)] });
      });


      async function searchSong(searchTerm: String) {
        const result: any = await fetch(`https://saavn.me/search/songs?query=${searchTerm}&limit=1`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          },
        });
        const song = await result.json();

        if (song.status == "SUCCESS" && song.results[0]) {
          const title = song.results[0]?.name;
          const id = song.results[0]?.id;
          const image = song.results[0]?.image[song.results[0]?.image?.length - 1]?.link;
          const artists = song.results[0]?.artist;
          let duration = song.results[0]?.duration;
          duration = await convertTime(duration);
          async function convertTime(d: any) {
            d = Number(d);
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);

            var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
            var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
            var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
            return hDisplay + mDisplay + sDisplay;
          }

          await playSong(song);

          embed.setTitle(title);
          embed.setThumbnail(image);
          embed.addFields({ name: 'Artists', value: '\`\`\`\n' + artists + '\`\`\`', inline: false });
          embed.addFields({ name: 'Album', value: '\`\`\`\n' + song.results[0]?.album?.name + '\`\`\`', inline: true });
          embed.addFields({ name: 'Duration', value: '\`\`\`\n' + duration + '\`\`\`', inline: true });

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

        let resource = createAudioResource(song.results[0]?.downloadUrl[song.results[0]?.downloadUrl?.length - 1]?.link, {
          metadata: {
            title: song.results[0]?.name
          }
        });
        player.play(resource);
      }
    }
  }
} as ICommand