import { Client } from "discord.js";
import WOK, { DefaultCommands } from "wokcommands";
import path from "path";
require("dotenv/config");

const client: any = new Client({
  intents: ["Guilds", "GuildMessages", "GuildMembers", "GuildVoiceStates"],
  failIfNotExists: false,
  shards: "auto",
});

client.on("ready", () => {
  new WOK({
    client,
    commandsDir: path.join(__dirname, "commands"),
    featuresDir: path.join(__dirname, "features"),
    testServers: ["751683524171530331", "746313837049020517"],
    disabledDefaultCommands: [
      DefaultCommands.ChannelCommand,
      DefaultCommands.CustomCommand,
      DefaultCommands.Prefix,
      DefaultCommands.RequiredPermissions,
      DefaultCommands.RequiredRoles,
      DefaultCommands.ToggleCommand
    ],
    events: {
      dir: path.join(__dirname, "events"),
    },
    mongoUri: process.env.MongoDB_URI,
  });
  console.log(`${client.user!.tag} has logged in successfully.`);
});

client.login(process.env.Discord_Token);
