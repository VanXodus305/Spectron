// import Discord, { Interaction, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } from "discord.js";
// import { config } from 'dotenv';
// config();
// const translate = require('translation-google');
// import { ICommand } from "wokcommands";

// let languages: any = [];
// let lan: any = {
//   'af': 'Afrikaans',
//   'sq': 'Albanian',
//   'am': 'Amharic',
//   'ar': 'Arabic',
//   'hy': 'Armenian',
//   'az': 'Azerbaijani',
//   'eu': 'Basque',
//   'be': 'Belarusian',
//   'bn': 'Bengali',
//   'bs': 'Bosnian',
//   'bg': 'Bulgarian',
//   'ca': 'Catalan',
//   'ceb': 'Cebuano',
//   'ny': 'Chichewa',
//   'zh-cn': 'Chinese Simplified',
//   'zh-tw': 'Chinese Traditional',
//   'co': 'Corsican',
//   'hr': 'Croatian',
//   'cs': 'Czech',
//   'da': 'Danish',
//   'nl': 'Dutch',
//   'en': 'English',
//   'eo': 'Esperanto',
//   'et': 'Estonian',
//   'tl': 'Filipino',
//   'fi': 'Finnish',
//   'fr': 'French',
//   'fy': 'Frisian',
//   'gl': 'Galician',
//   'ka': 'Georgian',
//   'de': 'German',
//   'el': 'Greek',
//   'gu': 'Gujarati',
//   'ht': 'Haitian Creole',
//   'ha': 'Hausa',
//   'haw': 'Hawaiian',
//   'iw': 'Hebrew',
//   'hi': 'Hindi',
//   'hmn': 'Hmong',
//   'hu': 'Hungarian',
//   'is': 'Icelandic',
//   'ig': 'Igbo',
//   'id': 'Indonesian',
//   'ga': 'Irish',
//   'it': 'Italian',
//   'ja': 'Japanese',
//   'jw': 'Javanese',
//   'kn': 'Kannada',
//   'kk': 'Kazakh',
//   'km': 'Khmer',
//   'ko': 'Korean',
//   'ku': 'Kurdish (Kurmanji)',
//   'ky': 'Kyrgyz',
//   'lo': 'Lao',
//   'la': 'Latin',
//   'lv': 'Latvian',
//   'lt': 'Lithuanian',
//   'lb': 'Luxembourgish',
//   'mk': 'Macedonian',
//   'mg': 'Malagasy',
//   'ms': 'Malay',
//   'ml': 'Malayalam',
//   'mt': 'Maltese',
//   'mi': 'Maori',
//   'mr': 'Marathi',
//   'mn': 'Mongolian',
//   'my': 'Myanmar (Burmese)',
//   'ne': 'Nepali',
//   'no': 'Norwegian',
//   'ps': 'Pashto',
//   'fa': 'Persian',
//   'pl': 'Polish',
//   'pt': 'Portuguese',
//   'ma': 'Punjabi',
//   'ro': 'Romanian',
//   'ru': 'Russian',
//   'sm': 'Samoan',
//   'gd': 'Scots Gaelic',
//   'sr': 'Serbian',
//   'st': 'Sesotho',
//   'sn': 'Shona',
//   'sd': 'Sindhi',
//   'si': 'Sinhala',
//   'sk': 'Slovak',
//   'sl': 'Slovenian',
//   'so': 'Somali',
//   'es': 'Spanish',
//   'su': 'Sundanese',
//   'sw': 'Swahili',
//   'sv': 'Swedish',
//   'tg': 'Tajik',
//   'ta': 'Tamil',
//   'te': 'Telugu',
//   'th': 'Thai',
//   'tr': 'Turkish',
//   'uk': 'Ukrainian',
//   'ur': 'Urdu',
//   'uz': 'Uzbek',
//   'vi': 'Vietnamese',
//   'cy': 'Welsh',
//   'xh': 'Xhosa',
//   'yi': 'Yiddish',
//   'yo': 'Yoruba',
//   'zu': 'Zulu'
// };
// Object.keys(lan).forEach(key => {
//   languages.push({ label: lan[key], value: key });
// });

// export default {
//   category: "Test Commands",
//   expectedArgs: "<text>",
//   minArgs: 1,
//   syntaxError: {
//     "english": "**Incorrect syntax! Please use \`{PREFIX}{COMMAND} {ARGUMENTS}\`**"
//   },
//   options: [
//     {
//       name: 'text',
//       description: 'The text that needs to be translated',
//       required: true,
//       type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
//     }
//   ],
//   description: "Translates a message to a specified language",
//   slash: false,
//   testOnly: true,
//   callback: async ({ interaction, message, text, member }) => {
//     if (message) {
//       message.channel.send(await translate(member, text));
//     }

//     if (interaction) {
//       await interaction.deferReply({ fetchReply: true });
//       await interaction.editReply(await translate(member, interaction.options.getString('text')));
//     }

//     async function translate(member: any, text: any) {
//       const embed = new MessageEmbed
//       if (member?.displayColor == 0) {
//         embed.setColor(11553764);
//       } else {
//         embed.setColor(member?.displayHexColor!);
//       }

//       embed.setTitle('🔠 Translate Text');
//       embed.setDescription(`\`\`\`\n${text}\`\`\``);
//       embed.setTimestamp(Date.now());
//       const row1 = new MessageActionRow;
//       const row2 = new MessageActionRow;
//       const row3 = new MessageActionRow;
//       const row4 = new MessageActionRow;
//       const row5 = new MessageActionRow;

//       row1.addComponents(
//         new MessageSelectMenu()
//         .setMinValues(1)
//         .setMaxValues(1)
//         .setPlaceholder("Select the language to translate to")
//         .setCustomId('translate1')
//         .addOptions(languages.slice(0,20))
//       );
//       row2.addComponents(
//         new MessageSelectMenu()
//           .setMinValues(1)
//           .setMaxValues(1)
//           .setPlaceholder("Select the language to translate to")
//           .setCustomId('translate2')
//           .addOptions(languages.slice(21, 41))
//       );
//       row3.addComponents(
//         new MessageSelectMenu()
//           .setMinValues(1)
//           .setMaxValues(1)
//           .setPlaceholder("Select the language to translate to")
//           .setCustomId('translate3')
//           .addOptions(languages.slice(42, 62))
//       );
//       row4.addComponents(
//         new MessageSelectMenu()
//           .setMinValues(1)
//           .setMaxValues(1)
//           .setPlaceholder("Select the language to translate to")
//           .setCustomId('translate4')
//           .addOptions(languages.slice(63, 83))
//       );
//       row5.addComponents(
//         new MessageSelectMenu()
//           .setMinValues(1)
//           .setMaxValues(1)
//           .setPlaceholder("Select the language to translate to")
//           .setCustomId('translate5')
//           .addOptions(languages.slice(84, 104))
//       );
//       return ({embeds: [embed], components: [row1, row2, row3, row4, row5]} );
//     }

//   //   text = text.length > 1024 ? text.substring(0, 1024 - 8) + "…" : text;
//   //   res.text = res.text.length > 1024 ? res.text.substring(0, 1024 - 8) + "…" : res.text;
//   //   let res: any = await translate(interaction.options.getString('text'), { to: interaction.options.getString('to-language') });
//   //   embed.addField(`From: \`${languages[res.from.language.iso]}\``, `\`\`\`\n${text}\`\`\``);
//   //   embed.addField(`To: \`${interaction.options.getString('to-language')}\``, `\`\`\`\n${res.text}\`\`\``);
//   //   await interaction.editReply({ embeds: [embed] });
//   //   embed.setTitle('✅ Translated Successfully');
//   }
// } as ICommand