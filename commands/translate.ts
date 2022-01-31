import Discord, { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { config } from 'dotenv';
config();
const translate = require('translation-google');
import { ICommand } from "wokcommands";

export default {
  category: "Test Commands",
  expectedArgs:"<text>",
  error: async ({ error, info }) => {
    if (error == 'EXCEPTION') {
      console.log(info)
    }
  },
  minArgs: 1,
  syntaxError: {
    "english": "**Incorrect syntax! Please use \`{PREFIX}{COMMAND} {ARGUMENTS}\`**",
    "spanish": "**¡Uso incorrecto! Utilice \`{PREFIX} {COMMAND} {ARGUMENTS}\`**"
  },
  options: [
    {
      name: 'to-language',
      description: 'The ISO code of the language to translate to',
      required: true,
      type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
    },
    {
      name: 'text',
      description: 'The text that needs to be translated',
      required: true,
      type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
    },
  ],
  description: "Translates a message to a specified language",
  slash: 'both',
  testOnly: true,
  callback: async ({ interaction }) => {
    if (interaction) {
      await interaction.deferReply({ fetchReply: true });
      const res = await translate(interaction.options.getString('text'), { to: interaction.options.getString('to-language') });
      await interaction.editReply(`Translated \`${interaction.options.getString('text')}\` from \`${res.from.language.iso}\` to \`${interaction.options.getString('to-language')}\`\n=> \`${res.text}\``);
    }
  }
} as ICommand