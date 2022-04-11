import Discord, { Interaction, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } from "discord.js";
import { config } from 'dotenv';
config();
import { ICommand } from "wokcommands";
import fetch from "cross-fetch";
const youtubedl = require('yt-dlp-exec');

export default {
  category: "Utility",
  expectedArgs: "<url>",
  minArgs: 1,
  maxArgs: 1,
  syntaxError: {
    "english": "**Incorrect syntax! Please use \`{PREFIX}{COMMAND} {ARGUMENTS}\`**"
  },
  options: [
    {
      name: 'url',
      description: 'The link to a video or post.',
      required: true,
      type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
    }
  ],
  description: "Download videos from sites like YouTube, TikTok and many more.",
  slash: 'both',
  testOnly: true,
  callback: async ({ interaction, message, text, member }) => {
    const embed = new MessageEmbed();
    const emb = new MessageEmbed();
    const row = new MessageActionRow();
    let link: any;

    if (member.displayColor == 0) {
      emb.setColor(11553764);
    }
    else {
      emb.setColor(member.displayHexColor);
    }
    emb.setTitle('🔄 Fetching Video Information...')

    if (message) {
      link = text;
      message.channel.send({ embeds: [emb] }).then(async (resultMessage: any) => {
        resultMessage.edit(await download(link));
      });
    }

    if (interaction) {
      link = interaction.options.getString('url');
      interaction.reply({ embeds: [emb] }).then(async (resultMessage: any) => {
        interaction.editReply(await download(link));
      });
    }

    async function download(link: any) {
      let response: any;
      let data: any;
      try {
        await youtubedl(link, {
          playlistItems: 1,
          f: 'best',
          g: true
        }).then(async (url: any) => {
          data = {
            "domain": "3wey.short.gy",
            "originalURL": url
          };
          response = await fetch(`https://api.short.io/links`, {
            method: "POST",
            headers: {
              'accept': 'application/json',
              'Content-Type': 'application/json',
              'authorization': `${process.env.ShortIO_Key}`
            },
            body: JSON.stringify(data)
          });
          response = await response.json();
          url = response.shortURL;
          row.addComponents(
            new MessageButton()
              .setStyle('LINK')
              .setLabel('Download (Video + Audio)')
              .setEmoji('🎦')
              .setURL(url)
          );
          if (member.displayColor == 0) {
            embed.setColor(11553764);
          }
          else {
            embed.setColor(member.displayHexColor);
          }
          embed.setTimestamp(Date.now());
          embed.setURL(link);
        });
      }
      catch (error) {
        embed.setTitle('❌ Please provide a valid URL to a video or post.');
        embed.setColor('#ff0000');
        return { embeds: [embed] };
      }

      try {
        await youtubedl(link, {
          playlistItems: 1,
          e: true
        }).then((title: any) => embed.setTitle(title));
        await youtubedl(link, {
          playlistItems: 1,
          getDescription: true
        }).then((description: any) => embed.setDescription(description));
        await youtubedl(link, {
          playlistItems: 1,
          getThumbnail: true
        }).then((thumbnail: any) => embed.setImage(thumbnail));
        await youtubedl(link, {
          playlistItems: 1,
          getThumbnail: true
        }).then((thumbnail: any) => embed.setImage(thumbnail));
        try {
          await youtubedl(link, {
            playlistItems: 1,
            f: 'bestvideo',
            g: true
          }).then(async (url: any) => {
            data = {
              "domain": "3wey.short.gy",
              "originalURL": url
            };
            response = await fetch(`https://api.short.io/links`, {
              method: "POST",
              headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': `${process.env.ShortIO_Key}`
              },
              body: JSON.stringify(data)
            });
            response = await response.json();
            url = response.shortURL;
            row.addComponents(
              new MessageButton()
                .setStyle('LINK')
                .setLabel('Download (Video Only)')
                .setEmoji('🎬')
                .setURL(url)
            );
          });
          await youtubedl(link, {
            playlistItems: 1,
            f: 'bestaudio',
            g: true
          }).then(async (url: any) => {
            data = {
              "domain": "3wey.short.gy",
              "originalURL": url
            };
            response = await fetch(`https://api.short.io/links`, {
              method: "POST",
              headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': `${process.env.ShortIO_Key}`
              },
              body: JSON.stringify(data)
            });
            response = await response.json();
            url = response.shortURL;
            row.addComponents(
              new MessageButton()
                .setStyle('LINK')
                .setLabel('Download (Audio Only)')
                .setEmoji('🎧')
                .setURL(url)
            );
          });
        }
        catch (error) {
          await youtubedl(link, {
            playlistItems: 1,
            f: 'bestaudio',
            g: true
          }).then(async (url: any) => {
            data = {
              "domain": "3wey.short.gy",
              "originalURL": url
            };
            response = await fetch(`https://api.short.io/links`, {
              method: "POST",
              headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': `${process.env.ShortIO_Key}`
              },
              body: JSON.stringify(data)
            });
            response = await response.json();
            url = response.shortURL;
            row.addComponents(
              new MessageButton()
                .setStyle('LINK')
                .setLabel('Download (Audio Only)')
                .setEmoji('🎧')
                .setURL(url)
            );
          });
        }
      }
      catch (error) { }
      return { embeds: [embed], components: [row] };
    }
  }
} as ICommand