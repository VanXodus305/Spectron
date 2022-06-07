import {Channel, Client} from 'discord.js';
import { text } from 'stream/consumers';
import welcomeSchema from '../models/welcome-schema';

const welcomeData = {} as {
  [key: string]: [Channel, string]
};

export default (client: Client) => {
  client.on('guildMemberAdd', async (member) => {
    const {guild, id} = member;
    let data:any = welcomeData[guild.id];

    if (!data) {
      const results = await welcomeSchema.findById(guild.id);
      if (!results) {
        return;
      }
      const {channelId, text} = results;
      const channel = await guild.channels.fetch(channelId);
      data = welcomeData[guild.id] = [channel as Channel, text]; 
    }

    data[0].send({
      content: data[1].replace(/@/g, `<@${id}>`)
    });
  });
}

export const config = {
  displayName: "Welcome Message",
  dbName: "WELCOME_MESSAGE"
}
