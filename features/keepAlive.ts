import { Client } from "discord.js";
import WOK from "wokcommands";
const express = require("express");

export default async (instance: WOK, client: Client) => {
  const server = express();
  server.all("/", (req: any, res: any) => {
    res.send(`${client?.user?.tag} is online.`);
  });

  async function keepAlive() {
    server.listen(3000, () => {});
  }
  await keepAlive();
};
