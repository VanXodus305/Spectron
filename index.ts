import {config} from 'dotenv';
config();
import Discord, { Intents, MessageEmbed } from 'discord.js';
const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING];
const client = new Discord.Client({ intents: intents });

client.login(process.env.DISCORD_TOKEN);

client.once('ready', () => {
  console.log(`${client.user!.tag} has logged in successfully.`);
});

client.on('messageCreate', (msg) => {
  if (msg.content === 'ping') {
    msg.reply('**Pong!**');
  }
});