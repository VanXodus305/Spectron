import { ActivityType, Client } from "discord.js";
import WOK from "wokcommands";

export default async (instance: WOK, client: Client) => {
  try {
    client.user?.setActivity({
      name: "Music on your Discord server!",
      type: ActivityType.Playing,
    });
  } catch (error) {
    console.error(error);
  }
};
