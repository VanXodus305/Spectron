import Discord, { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";
const TicTacToe = require('discord-tictactoe');

export default {
  category: "Fun",
  description: "Play a game of Tic Tac Toe with a friend or the bot!",
  slash: 'both',
  syntaxError: {
    "english": "**Incorrect syntax! Please use \`{PREFIX}{COMMAND} {ARGUMENTS}\`**"
  },
  options: [
    {
      name: 'user',
      description: 'The user to play against',
      required: false,
      type: Discord.Constants.ApplicationCommandOptionTypes.USER,
    }
  ],
  maxArgs: 1,
  minArgs: 0,
  testOnly: true,
  expectedArgs: '[user]',
  aliases: ['ttt'],
  callback: async ({ client, interaction, message }) => {
    const game = new TicTacToe({
      language: 'en',
      commandOptionName: 'user',
      simultaneousGames: true,
    });

    if (interaction) {
      game.handleInteraction(interaction);
    }

    if (message) {
      game.handleMessage(message);
    }
  }
} as ICommand