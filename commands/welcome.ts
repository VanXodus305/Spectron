import Discord, { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";
import welcomeSchema from '../models/welcome-schema';

export default {
  category: 'Configuration',
  description: 'Sets the welcome channel and text',
  testOnly: true,
  slash: true,
  guildOnly: true,

  options: [
    {
      name: 'channel',
      description: 'The channel to send the welcome message in',
      required: true,
      type: Discord.Constants.ApplicationCommandOptionTypes.CHANNEL
    },
    {
      name: 'text',
      description: 'The welcome message to send',
      required: false,
      type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }
  ],

  callback: async ({ interaction, args, guild }) => {
    if (!guild) {
      return "Please use this command within a server."
    }

    const channel: any = interaction.options.getChannel('channel');
    if (!channel.isText()) {
      return "Please provide a valid text channel."
    }
    const text = interaction.options.getString('text');

    await welcomeSchema.findOneAndUpdate({
      _id: guild.id
    }, {
      _id: guild.id,
      channelId: channel.id,
      text: text,
    }, {
      upsert: true
    });
    return `Welcome message successfully set in <#${channel.id}>`;
  }
} as ICommand