import { ButtonBuilder, EmbedBuilder, Interaction } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import WOK from "wokcommands";

export default (interaction: Interaction, instance: WOK) => {
  if (interaction.isButton() &&
    interaction.customId == 'stop'
  ) {
    interaction.deferUpdate();
    const connection = getVoiceConnection(interaction.guildId as string);
    if (connection) {
      
    }
    // const row = ActionRowBuilder.from(intr.message.components[0]);
    // row.components[0].setDisabled(true)
    // row.addComponents(intr.message.components[0])
    // intr.message.components[0].components
    //   .setComponents(intr.message.components[0].components)

    // const stopButton = ButtonBuilder.from(intr.component)
    //   .setDisabled(true);
    // const message = intr.message;
    // (intr.component)
  }
}