import { ApplicationCommand, Collection, CommandInteraction } from "discord.js";
import WOK from "wokcommands";

export default async (instance: WOK, client: any) => {
  client.queues = new Collection();
  client.commands = new Collection();
  client.lastInt = new Collection();

  client.formatDuration = (t: number, sf: boolean = false) => {
    var d = Math.floor(t / 86400);
    var h = Math.floor((t / 3600) % 24);
    var m = Math.floor((t % 3600) / 60);
    var s = Math.floor((t % 3600) % 60);
    if (sf) {
      var display = "";
      display = d > 0 ? d + ":" : "";
      display =
        display != "" ? display + h + ":" : display + (h > 0 ? h + ":" : "");
      display =
        display != ""
          ? display + (m < 10 ? "0" + m + ":" : "m" + ":")
          : display + m + ":";
      display = display + (s < 10 ? "0" + s : s);
      return display;
    } else {
      var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
      var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
      var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
      var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
      return dDisplay + hDisplay + mDisplay + sDisplay;
    }
  };

  client.decodeHTMLEntities = (text: string) => {
    var entities = [
      ["amp", "&"],
      ["apos", "'"],
      ["#x27", "'"],
      ["#x2F", "/"],
      ["#039", "'"],
      ["#047", "/"],
      ["lt", "<"],
      ["gt", ">"],
      ["nbsp", " "],
      ["quot", '"'],
    ];
    for (var i = 0, max = entities.length; i < max; ++i)
      text = text.replace(
        new RegExp("&" + entities[i][0] + ";", "g"),
        entities[i][1]
      );
    return text;
  };

  client.delay = (ms: number) => {
    return new Promise((r) => setTimeout(() => r(2), ms));
  };

  client.commands = await client.application?.commands
    ?.fetch({
      withLocalizations: true,
    })
    .catch(() => null);
  client.commands = client.commands.sort(
    (a: ApplicationCommand, b: ApplicationCommand) => {
      return a.name.localeCompare(b.name);
    }
  );
};
