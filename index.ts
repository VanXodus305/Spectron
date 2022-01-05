import { config } from 'dotenv';
config();
import Discord, { Intents, MessageEmbed } from 'discord.js';
const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING];
const client = new Discord.Client({ intents: intents });

client.once('ready', async () => {
  console.log(`${client.user!.tag} has logged in successfully.`);

  const guildId = '751683524171530331';
  const guild = client.guilds.cache.get(guildId);
  let commands;
  if (guild) {
    commands = guild.commands;
  } else {
    commands = client.application?.commands
  }
  commands?.create({
    name: 'ping',
    description: 'Replies with Pong!',
  });
  
  commands?.create({
    name: 'add',
    description: 'Adds two numbers',
    options: [
      {
        name: 'number1',
        description: 'The first number.',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER,
      },
      {
        name: 'number2',
        description: 'The second number.',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER,
      }
    ],
  });
});

client.on('messageCreate', (msg) => {
  if (msg.content === 'ping') {
    msg.reply('**Pong!**');
  }
});

client.login(process.env.DISCORD_TOKEN);