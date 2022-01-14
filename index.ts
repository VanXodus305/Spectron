import { config } from 'dotenv';
config();
const keepAlive = require("./server.js");
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
    mongoUri: process.env.MongoDB_URI
  }).setDefaultPrefix('+');
  console.log(`${client.user!.tag} has logged in successfully.`);
});

// setTimeout(async () => {
//   await new testSchema({
//     message: 'Hello World'
//   }).save();
// }, 1000);

keepAlive();
client.login(process.env.Discord_Token);