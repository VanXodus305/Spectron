import { config } from 'dotenv';
config();
import Discord, { Intents, MessageEmbed } from 'discord.js';
import WOKCommands from 'wokcommands';
import path from 'path';
import mongoose from 'mongoose';

const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING];
const client = new Discord.Client({ intents: intents });

client.once('ready', async () => {
  new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'commands'),
    typeScript: true,
    testServers: '751683524171530331',
    botOwners:'588933434412498964',
    mongoUri: process.env.MongoDB_URI
  }).setDefaultPrefix('+').setColor(11553764);;
  console.log(`${client.user!.tag} has logged in successfully.`);
});

client.on('messageCreate', async (message: any) => {
  if (message.embeds[0]?.image?.url == "https://disboard.org/images/bot-command-image-bump.png") {
    setTimeout(async () => {
      message.channel.send("<@&936157167487176705> **The server can be bumped now!**");
    }, 7200000);
  }
});

client.login(process.env.Discord_Token);