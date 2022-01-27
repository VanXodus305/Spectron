import fetch from 'cross-fetch'
import Discord, { MessageEmbed } from "discord.js";
import { config } from 'dotenv';
config();
import { ICommand } from "wokcommands";

export default {
  category: "Test Commands",
  options: [
    {
      name: 'query',
      description: 'Anime name or ID on MyAnimeList',
      required: true,
      type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
    }
  ],
  description: "Gives information about an anime from MyAnimeList",
  slash: 'both',
  // testOnly: false,
  callback: async ({ interaction, message, text, options }) => {
    let embed = new MessageEmbed();

    if (message) {
      if (!text) {
        embed.setTitle(`⚠️ Please provide a term to search for.`);
        embed.setColor(`#ffde34`);
        return embed;
      }
      if (message.member?.displayColor == 0) {
        embed.setColor(11553764);
      } else {
        embed.setColor(message.member?.displayHexColor!);
      }
      message.channel.send({ embeds: [await search(text)] });
    }

    if (interaction) {
      if ((interaction as any).member?.displayColor == 0) {
        embed.setColor(11553764);
      } else {
        embed.setColor((interaction as any).member?.displayHexColor!);
      }
      interaction.deferReply();
      await interaction.editReply({ embeds: [await search(interaction.options.getString('query'))] });
    }

    async function search(term: any) {
      if (!isNaN(term)) {
        let idResponse: any = await fetch(`https://api.myanimelist.net/v2/anime/${term}?fields=id,title,main_picture,alternative_titles,start_date,media_type,end_date,synopsis,nsfw,status,genres,num_episodes,average_episode_duration,rating,pictures,related_anime,studios`, {
          method: "GET",
          headers: { "X-MAL-CLIENT-ID": `${process.env.MAL_Client_ID}` }
        });
        idResponse = await idResponse.json();
        if (idResponse.error) {
          return await termSearch(term);
        }
        return embedBuilder(idResponse);
      }
      return await termSearch(term);
    }

    async function termSearch(term: any) {
      let nameResponse: any = await fetch(`https://api.myanimelist.net/v2/anime?q=${term}`, {
        method: "GET",
        headers: { "X-MAL-CLIENT-ID": `${process.env.MAL_Client_ID}` }
      });
      nameResponse = await nameResponse.json();
      if (!nameResponse.data[0]) {
        embed.setColor('#ff0000');
        embed.setTitle('❌ No results were found.\nPlease check the query and try again.');
        return embed;
      }
      let response = await fetch(`https://api.myanimelist.net/v2/anime/${nameResponse.data[0].node.id}?fields=id,title,main_picture,alternative_titles,media_type,start_date,end_date,synopsis,nsfw,status,genres,num_episodes,average_episode_duration,rating,pictures,related_anime,studios`, {
        method: "GET",
        headers: { "X-MAL-CLIENT-ID": `${process.env.MAL_Client_ID}` }
      });
      response = await response.json();
      return await embedBuilder(response);
    }

    async function embedBuilder(result: any) {
      embed.setTitle(result.title);
      embed.setURL(`https://myanimelist.net/anime/${result.id}`);
      if (result.alternative_titles) {
        if (result.alternative_titles.en && result.alternative_titles.en != result.title) {
          embed.setAuthor({ name: result.alternative_titles.en, url: `https://myanimelist.net/anime/${result.id}` });
        }

        let synonyms = "";
        if (result.alternative_titles.synonyms) {
          result.alternative_titles.synonyms.forEach((name: String) => { synonyms += `\n• ${name}` });
        }
        if (result.alternative_titles.ja) {
          synonyms += `\n• ` + result.alternative_titles.ja;
        }
        if (synonyms == "") {
          synonyms = 'None';
        }
        embed.addField(`Synonyms`, `\`\`\`${synonyms}\`\`\``, true);
      }

      if (result.synopsis) {
        embed.setDescription(`**${result.synopsis}**`);
      }

      if (result.main_picture) {
        embed.setThumbnail(result.main_picture.large);
        if (result.pictures.length > 1) {
          const image = result.pictures.find((image: any) => image.large != result.main_picture.large);
          embed.setImage(image.large);
        }
      }

      let rating = "";
      if (result.rating) {
        rating += result.rating.toUpperCase().replace('_', '-');
      }
      if (result.nsfw) {
        rating += `\nNSFW: ` + result.nsfw.toUpperCase();
      }
      if (rating == "") {
        rating = 'Unknown';
      }
      embed.addField('Rating', `\`\`\`\n${rating}\`\`\``, true);

      let media = `\nType: ${result.media_type.toUpperCase()}`;
      if (result.num_episodes != 0) {
        media += `\n${result.num_episodes} episode(s)`;
      }
      if (result.average_episode_duration) {
        media += `\n${Math.round(result.average_episode_duration / 60)} min. each`;
      }
      embed.addField("Media Info", `\`\`\`${media}\`\`\``, true);

      let genres = "";
      result.genres.forEach((genre: any) => genres += `\n${genre.name}`);
      embed.addField('Genres:', `\`\`\`${genres}\`\`\``, true);

      let status = "";
      if (result.start_date) {
        status += `\nFROM: ${result.start_date}`;
      }
      if (result.end_date) {
        status += `\nTO: ${result.end_date}`;
      }
      if (result.start_date && result.end_date && result.start_date == result.end_date) {
        status = `\nON: ${result.start_date}`;
      }
      status = `\n${result.status.toUpperCase().replace('_', ' ')}` + status;
      embed.addField('Status', `\`\`\`${status}\`\`\``, true);

      let studios = "";
      result.studios.forEach((studio: any) => studios += `\n• ${studio.name}`);
      if (studios == "") {
        studios = 'Unknown';
      }
      embed.addField('Studios', `\`\`\`${studios}\`\`\``, true);

      embed.setTimestamp(Date.now());
      return embed;
    }
  }
} as ICommand