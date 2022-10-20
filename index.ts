import { Client, Partials } from "discord.js";
import WOK from "wokcommands";
import path from "path";
const keepAlive = require("./server");
require("dotenv/config");

const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates"],
});

client.on("ready", () => {
  new WOK({
    client,
    commandsDir: path.join(__dirname, "commands"),
    testServers: ["751683524171530331", "746313837049020517"],
    // disabledDefaultCommands: [
    //   "customcommand"
    // ],
    events: {
      dir: path.join(__dirname, "events"),
    },
    mongoUri: process.env.MongoDB_URI,
  });
  console.log(`${client.user!.tag} has logged in successfully.`);
});

keepAlive();
client.login(process.env.Discord_Token);