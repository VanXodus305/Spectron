// import Discord, { MessageEmbed, Guild } from "discord.js";
// import { ICommand } from "wokcommands";
// import welcomeSchema from '../models/welcome-schema';

// export default {
//   category: 'Configuration',
//   description: 'Enable or disable welcome messages for this server',
//   testOnly: true,
//   slash: true,
//   guildOnly: true,

//   options: [
//     {
//       name: 'set',
//       description: 'Sets the welcome channel and message for this server',
//       type: 'SUB_COMMAND',
//       options: [
//         {
//           name: 'channel',
//           description: 'The channel to send the welcome messages in',
//           required: true,
//           type: 'CHANNEL',
//           channel_types: [0, 5]
//         },
//         {
//           name: 'message',
//           description: 'The welcome message to be sent',
//           required: false,
//           type: 'STRING'
//         }
//       ]
//     },

//     {
//       name: 'test',
//       description: 'Tests the welcome message for this server',
//       type: 'SUB_COMMAND',
//     },

//     {
//       name: 'disable',
//       description: 'Disables welcome messages for this server',
//       type: 'SUB_COMMAND'
//     }
//   ],

//   callback: async ({ interaction, guild, client, member }) => {
//     const embed = new MessageEmbed;

//     if (interaction.options.getSubcommand() == 'set') {
//       const channel: any = interaction.options.getChannel('channel');
//       let text: any = interaction.options.getString('message');
//       if (!text) {
//         text = "Welcome {user.mention} to {guild.name}";
//       }

//       await welcomeSchema.findOneAndUpdate({
//         _id: guild?.id
//       }, {
//         _id: guild?.id,
//         channelId: channel.id,
//         text: text,
//       }, {
//         upsert: true
//       });
//       embed.setTitle(`✅ Welcome Message successfully set for this server`);
//       embed.addField('Channel', `<#${channel.id}>`, true);
//       embed.addField('Message', text, true);
//       embed.setColor('#16d916');
//       interaction.reply({ embeds: [embed] });
//     }

//     if (interaction.options.getSubcommand() == 'test') {
//       const results = await welcomeSchema.findById(guild?.id);
//       if (results) {
//         client.emit('guildMemberAdd', member);
//         embed.setTitle(`✅ Welcome Message sent successfully`);
//         embed.setColor('#16d916');
//         interaction.reply({ embeds: [embed] });
//         return;
//       }
//       embed.setTitle('⚠️ No Welcome Message is set for this server');
//       embed.setColor('#ffde34')
//       interaction.reply({ embeds: [embed] });
//     }

//     if (interaction.options.getSubcommand() == 'disable') {
//       await welcomeSchema.findByIdAndRemove(guild?.id);
//       embed.setTitle(`✅ Welcome Messages are disabled for this server`);
//       embed.setColor('#16d916');
//       interaction.reply({ embeds: [embed] });
//     }
//   }
// } as ICommand