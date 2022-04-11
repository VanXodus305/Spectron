import Discord, { Interaction, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } from "discord.js";
import { ICommand } from "wokcommands";

export default {
  category: "Utility",
  expectedArgs: "[notification]",
  minArgs: 0,
  maxArgs: 1,
  syntaxError: {
    "english": "**Incorrect syntax! Please use \`{PREFIX}{COMMAND} {ARGUMENTS}\`**"
  },
  options: [
    {
      name: 'notification',
      description: 'Sends a DM if you are mentioned while being AFK.',
      required: false,
      type: Discord.Constants.ApplicationCommandOptionTypes.BOOLEAN,
    }
  ],
  description: "Sets the AFK status of a user on a server.",
  slash: 'both',
  testOnly: true,
  callback: async ({ interaction, message, text, member }) => {
    const embed = new MessageEmbed;
    let nickname = "";
    if (interaction.options.getBoolean('notification')) {
      nickname = "(AFK) " + member.displayName;
      nickname = nickname.length > 32 ? nickname.substring(0, 32 - 1) + "…" : nickname;
      embed.setTitle("💤 Status set to AFK with notifications enabled");
    }
    else {
      nickname = "[AFK] " + member.displayName;
      nickname = nickname.length > 32 ? nickname.substring(0, 32 - 1) + "…" : nickname;
      embed.setTitle("💤 Status set to AFK with notifications disabled");
    }
    member.setNickname(nickname);
    embed.setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({ size: 4096, dynamic: true }) });
    if (member.displayColor == 0) {
      embed.setColor(11553764);
    }
    else {
      embed.setColor(member.displayHexColor);
    }
    embed.setTimestamp(Date.now());
    return embed;
  }
} as ICommand