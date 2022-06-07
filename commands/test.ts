import { ICommand } from "wokcommands";

export default {
  category: 'Testing',
  description: 'Tests the welcome message fro this server',
  slash: true,
  testOnly: true,
  callback: ({member, client}) => {
    client.emit('guildMemberAdd', member);
    return 'Welcome message sent successfully';
  }
} as ICommand