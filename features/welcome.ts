// import { Channel, Client, MessageEmbed } from 'discord.js';
// import { text } from 'stream/consumers';
// import welcomeSchema from '../models/welcome-schema';

//   // const welcomeData = {} as {
//   //   [key: string]: [Channel, string]
//   // };

// export default (client: Client) => {
//   client.on('guildMemberAdd', async (member) => {
//     const results = await welcomeSchema.findById(member.guild.id);
//     if (!results) {
//       return;
//     }
//     const { channelId, text } = results;
//     const channel = await member.guild.channels.fetch(channelId);
//     channel.send({
//       content: data[1].replace(/@/g, `<@${id}>`)
//     });
//   });
// }

// export const config = {
//   displayName: "Welcome Message",
//   dbName: "WELCOME_MESSAGE"
// }