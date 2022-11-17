import { Client } from "discord.js"
import WOK from "wokcommands"
const express = require("express")

export default async (instance: WOK, client: Client) => {
  const server = express();
  server.all("/", (req: any, res: any) => {
    res.send("Spectron#6051 is online.")
  })

  async function keepAlive() {
    server.listen(3000, () => {
      console.log("Spectron#6051 is online.")
    })
  }
  await keepAlive();
};