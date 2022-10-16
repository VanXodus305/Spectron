import { config } from "dotenv";
config();
import Discord, {
  GatewayIntentBits,
  ActionRow,
  EmbedBuilder,
} from "discord.js";
import WOKCommands from "wokcommands";
import path from "path";
import mongoose from "mongoose";
import fetch from "cross-fetch";
import FormData from "form-data";
import fs from "fs";
const keepAlive = require("./server");

const client = new Discord.Client({
  intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates"],
});

client.once("ready", async () => {
  new WOKCommands(client as any, {
    commandsDir: path.join(__dirname, "commands"),
    featuresDir: path.join(__dirname, "features"),
    typeScript: true,
    ignoreBots: true,
    testServers: ["751683524171530331", "746313837049020517"],
    botOwners: "588933434412498964",
    mongoUri: process.env.MongoDB_URI,
  })
    .setDefaultPrefix("/")
    .setColor(11553764);

  console.log(`${client.user!.tag} has logged in successfully.`);
});

keepAlive();
client.login(process.env.Discord_Token);

// client.on('messageCreate', async (message: Discord.Message) => {
//   if (message.author.id == "302050872383242240" && message.embeds[0]?.image?.url == "https://disboard.org/images/bot-command-image-bump.png") {
//     setTimeout(async () => {
//       message.channel.send("<@&936157167487176705> **The server can be bumped now!**");
//     }, 7200000);
//   }
// });

// client.on('messageDelete', async (message: any) => {
//   if (message.content == "" && message.attachments.size == 0) {
//     return;
//   }
//   async function getFiles(message: any) {
//     const embed = new MessageEmbed;
//     embed.setColor(14507859);
//     embed.setTitle('Message Deleted');
//     embed.setFooter({ text: `${message.channel.name} • ${message.id}` });
//     embed.setTimestamp(message.createdAt);
//     embed.setAuthor({ name: message.author.tag, iconURL: message.member.displayAvatarURL({ dynamic: true, size: 4096 }) });

//     if (message.content) {
//       let description = message.content;
//       description = description.length > 4096 ? description.substring(0, length - 1) + "…" : description;
//       embed.setDescription(description);
//     }

//     if (message.attachments.size >= 1) {
//       if (message.attachments.size == 1 && message.attachments.first().contentType.startsWith('image')) {
//         const formData: any = new FormData();
//         formData.append("image", `${message.attachments.first().url}`);
//         formData.append("key", `${process.env.ImgBB_Token}`);
//         formData.append("expiration", "864000")
//         let image: any = await fetch('https://api.imgbb.com/1/upload', {
//           method: 'POST',
//           body: formData,
//         });
//         image = await image.json();
//         embed.setImage(image.data.url);
//       }

//       else {
//         let server: any = await fetch(`https://api.gofile.io/getServer`, {
//           method: `GET`
//         });
//         server = await server.json();
//         server = server?.data?.server;
//         let files = "";
//         for (let attachment of message.attachments.map((attachment: any) => attachment)) {
//           await download(attachment.url, `${__dirname}/Attachment Logs`);
//           const file = fs.createReadStream(`${__dirname}/Attachment Logs/${attachment.name}`);
//           const form: any = new FormData();
//           form.append('file', file);
//           let attachments: any = await fetch(`https://${server}.gofile.io/uploadFile`, {
//             method: "POST",
//             body: form
//           });
//           attachments = await attachments.json();
//           files += `[${attachment.name}](${attachments?.data?.downloadPage})\n`;
//           fs.unlink(`${__dirname}/Attachment Logs/${attachment.name}`, () => { });
//         }
//         embed.addField('Attachments', `${files}`);
//       }
//     }
//     return embed;
//   }
//   client.channels.fetch(`794624483537059860`, { allowUnknownGuild: true, force: true })
//     .then(async (channel: any) => channel.send({ embeds: [await getFiles(message)] }));
// });
