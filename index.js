"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const discord_js_1 = __importStar(require("discord.js"));
const intents = [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_BANS, discord_js_1.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, discord_js_1.Intents.FLAGS.GUILD_INTEGRATIONS, discord_js_1.Intents.FLAGS.GUILD_INVITES, discord_js_1.Intents.FLAGS.GUILD_MEMBERS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, discord_js_1.Intents.FLAGS.GUILD_MESSAGE_TYPING, discord_js_1.Intents.FLAGS.GUILD_PRESENCES, discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES, discord_js_1.Intents.FLAGS.GUILD_WEBHOOKS, discord_js_1.Intents.FLAGS.DIRECT_MESSAGES, discord_js_1.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, discord_js_1.Intents.FLAGS.DIRECT_MESSAGE_TYPING];
const client = new discord_js_1.default.Client({ intents: intents });
client.once('ready', () => {
    console.log(`${client.user.tag} has logged in successfully.`);
});
client.on('messageCreate', (msg) => {
    if (msg.content === 'ping') {
        msg.reply('**Pong!**');
    }
});
const guildId = '746313837049020517'; // Use your guild ID instead
const guild = client.guilds.cache.get(guildId);
let commands;
if (guild) {
    commands = guild.commands;
}
else {
    commands = (_a = client.application) === null || _a === void 0 ? void 0 : _a.commands;
}
commands === null || commands === void 0 ? void 0 : commands.create({
    name: 'add',
    description: 'Adds two numbers',
    options: [
        {
            name: 'number1',
            description: 'The first number.',
            required: true,
            type: discord_js_1.default.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        {
            name: 'number2',
            description: 'The second number.',
            required: true,
            type: discord_js_1.default.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
    ],
});
client.login(process.env.DISCORD_TOKEN);
