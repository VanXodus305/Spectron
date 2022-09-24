import fetch from "cross-fetch";
import { AnimixPlay } from "animewizard";
import Discord, {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ButtonStyle,
  ApplicationCommandOptionType,
} from "discord.js";
import { config } from "dotenv";
config();
import { ICommand } from "wokcommands";

export default {
  category: "Utility",
  expectedArgs: "<query>",
  syntaxError: {
    english: "**Incorrect syntax! Please use `{PREFIX}{COMMAND} {ARGUMENTS}`**",
  },
  minArgs: 1,
  options: [
    {
      name: "query",
      description: "Anime name or ID on MyAnimeList",
      required: true,
      type: ApplicationCommandOptionType.String as unknown,
    },
  ],
  description: "Gives information about an anime from MyAnimeList",
  slash: true,
  testOnly: true,
  callback: async ({ member, interaction, message, text, client }) => {
    const msgEmbed = new EmbedBuilder();
    if (message) {
      message.channel.send(await search(text));
    }

    if (interaction) {
      await interaction.deferReply({ fetchReply: true });
      await interaction.editReply(
        await search(interaction.options.getString("query"))
      );
    }

    async function search(term: any) {
      let embed = new EmbedBuilder();
      let row = new ActionRowBuilder();
      if (!isNaN(term)) {
        let idResponse: any = await fetch(
          `https://api.myanimelist.net/v2/anime/${term}?fields=id,title,main_picture,alternative_titles,start_date,media_type,end_date,synopsis,nsfw,status,genres,num_episodes,average_episode_duration,rating,pictures,related_anime,studios`,
          {
            method: "GET",
            headers: { "X-MAL-CLIENT-ID": `${process.env.MAL_Client_ID}` },
          }
        );
        idResponse = await idResponse.json();
        if (idResponse.error) {
          return await termSearch(term, embed, row);
        }
        return embedBuilder(idResponse, embed, row);
      }
      return await termSearch(term, embed, row);
    }

    async function termSearch(term: any, embed: any, row: any) {
      let nameResponse: any = await fetch(
        `https://api.myanimelist.net/v2/anime?q=${term}`,
        {
          method: "GET",
          headers: { "X-MAL-CLIENT-ID": `${process.env.MAL_Client_ID}` },
        }
      );
      nameResponse = await nameResponse.json();
      if (!nameResponse.data[0]) {
        embed.setColor("#ff0000");
        embed.setTitle(
          "❌ No results were found. Please check the query and try again."
        );
        return { embeds: [embed] };
      }
      let response = await fetch(
        `https://api.myanimelist.net/v2/anime/${nameResponse.data[0].node.id}?fields=id,title,main_picture,alternative_titles,media_type,start_date,end_date,synopsis,nsfw,status,genres,num_episodes,average_episode_duration,rating,pictures,related_anime,studios`,
        {
          method: "GET",
          headers: { "X-MAL-CLIENT-ID": `${process.env.MAL_Client_ID}` },
        }
      );
      response = await response.json();
      return await embedBuilder(response, embed, row);
    }

    async function embedBuilder(result: any, embed: any, row: any) {
      if (message) {
        if (message.member?.displayColor == 0) {
          embed.setColor(11553764);
        } else {
          embed.setColor(message.member?.displayHexColor!);
        }
      }

      if (interaction) {
        if ((interaction as any).member?.displayColor == 0) {
          embed.setColor(11553764);
        } else {
          embed.setColor((interaction as any).member?.displayHexColor!);
        }
      }

      embed.setTitle(result.title);
      embed.setURL(`https://myanimelist.net/anime/${result.id}`);
      if (result.alternative_titles) {
        if (
          result.alternative_titles.en &&
          result.alternative_titles.en != result.title
        ) {
          embed.setAuthor({
            name: result.alternative_titles.en,
            url: `https://myanimelist.net/anime/${result.id}`,
          });
        }

        let synonyms = "";
        if (result.alternative_titles.synonyms) {
          result.alternative_titles.synonyms.forEach((name: String) => {
            synonyms += `\n• ${name}`;
          });
        }
        if (result.alternative_titles.ja) {
          synonyms += `\n• ` + result.alternative_titles.ja;
        }
        if (synonyms == "") {
          synonyms = "None";
        }
        synonyms =
          synonyms.length > 1024
            ? synonyms.substring(0, length - 7) + "…"
            : synonyms;
        embed.addFields({
          name: `Synonyms`,
          value: `\`\`\`${synonyms}\`\`\``,
          inline: true,
        });
      }

      if (result.synopsis) {
        let synopsis = result.synopsis;
        synopsis =
          synopsis.length > 4096
            ? synopsis.substring(0, length - 5) + "…"
            : synopsis;
        embed.setDescription(`**${synopsis}**`);
      }

      if (result.main_picture) {
        embed.setThumbnail(result.main_picture.large);
        if (result.pictures.length > 1) {
          const image = result.pictures.find(
            (image: any) => image.large != result.main_picture.large
          );
          embed.setImage(image.large);
        }
      }

      let rating = "";
      if (result.rating) {
        rating += result.rating.toUpperCase().replaceAll("_", "-");
      }
      if (result.nsfw) {
        rating += `\nNSFW: ` + result.nsfw.toUpperCase();
      }
      if (rating == "") {
        rating = "Unknown";
      }
      embed.addFields({
        name: "Rating",
        value: `\`\`\`\n${rating}\`\`\``,
        inline: true,
      });

      let media = `\nType: ${result.media_type.toUpperCase()}`;
      if (result.num_episodes != 0) {
        media += `\n${result.num_episodes} episode(s)`;
      }
      if (result.average_episode_duration) {
        media += `\n${Math.round(
          result.average_episode_duration / 60
        )} min. each`;
      }
      embed.addFields({
        name: "Media Info",
        value: `\`\`\`${media}\`\`\``,
        inline: true,
      });

      let genres = "";
      result.genres.forEach((genre: any) => (genres += `\n${genre.name}`));
      genres =
        genres.length > 1024 ? genres.substring(0, length - 1) + "…" : genres;
      embed.addFields({
        name: "Genres",
        value: `\`\`\`${genres}\`\`\``,
        inline: true,
      });

      let status = "";
      if (result.start_date) {
        status += `\nFROM: ${result.start_date}`;
      }
      if (result.end_date) {
        status += `\nTO: ${result.end_date}`;
      }
      if (
        result.start_date &&
        result.end_date &&
        result.start_date == result.end_date
      ) {
        status = `\nON: ${result.start_date}`;
      }
      status = `\n${result.status.toUpperCase().replaceAll("_", " ")}` + status;
      embed.addFields({
        name: "Status",
        value: `\`\`\`${status}\`\`\``,
        inline: true,
      });

      let studios = "";
      result.studios.forEach(
        (studio: any) => (studios += `\n• ${studio.name}`)
      );
      if (studios == "") {
        studios = "Unknown";
      }
      studios =
        studios.length > 1024
          ? studios.substring(0, length - 1) + "…"
          : studios;
      embed.addFields({
        name: "Studios",
        value: `\`\`\`${studios}\`\`\``,
        inline: true,
      });

      embed.setTimestamp(Date.now());

      if (result.related_anime) {
        const prequel = result.related_anime.find(
          (anime: any) => anime.relation_type == "prequel"
        );
        const sequel = result.related_anime.find(
          (anime: any) => anime.relation_type == "sequel"
        );
        const parent = result.related_anime.find(
          (anime: any) => anime.relation_type == "parent_story"
        );

        if (prequel) {
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`${prequel.node.id}_anime`)
              .setLabel(`Prequel - ${prequel.node.title}`)
              .setStyle(ButtonStyle.Primary)
              .setEmoji("⬅️")
          );
        }
        if (parent) {
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`${parent.node.id}_anime`)
              .setLabel(`Parent Story - ${parent.node.title}`)
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("⬆️")
          );
        }
        if (sequel) {
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`${sequel.node.id}_anime`)
              .setLabel(`Sequel - ${sequel.node.title}`)
              .setStyle(ButtonStyle.Success)
              .setEmoji("➡️")
          );
        }
      }

      const animixPlay = new AnimixPlay();
      let animes = await animixPlay.search(result.title);
      if (animes[0]) {
        row.addComponents(
          new ButtonBuilder()
            .setLabel("Watch on AnimixPlay")
            .setStyle(ButtonStyle.Link)
            .setURL(`https://animixplay.to${animes[0].url}`)
        );
      }

      if (row.components[0]) {
        return { embeds: [embed], components: [row] };
      } else {
        return { embeds: [embed] };
      }
    }
    client.on("interactionCreate", async (intr: any) => {
      if (
        intr.isButton() &&
        intr.customId?.endsWith("anime") &&
        intr.member == member
      ) {
        const response = intr.message;
        await intr.deferUpdate();
        const newAnime = await search(parseInt(intr.customId));
        await response.edit(newAnime);
      }
    });
  },
} as ICommand;
