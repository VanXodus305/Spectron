import { ActionRowBuilder, BaseInteraction, ButtonBuilder, Channel, Client, EmbedBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import WOK from "wokcommands";

export default (interaction: BaseInteraction, instance: WOK) => {
  // client.on('interactionCreate', async (intr) => {
  //   if (
  //     intr.isButton() &&
  //     intr.customId == 'stop'
  //   ) {
  //     intr.deferUpdate();
  //     const row = ActionRowBuilder.from(intr.message.components[0]);
  //     row.components[0].setDisabled(true)
  //     row.addComponents(intr.message.components[0])
  //     intr.message.components[0].components
  //       .setComponents(intr.message.components[0].components)
      
  //     const stopButton = ButtonBuilder.from(intr.component)
  //       .setDisabled(true);
  //     const message = intr.message;
  //     (intr.component)
  //     const connection = getVoiceConnection(intr.guildId as string);
  //     if (connection) {
  //       connection.destroy();
  //     }
  //   }
  // });
}