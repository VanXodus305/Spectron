import { EmbedBuilder } from "discord.js";
import WOK from "wokcommands";

export default async (instance: WOK, client: any) => {
  client.pause = async (queue: any, int: any, oldConnection: any) => {
    try {
      if (queue.paused) {
        return await int
          .reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `**⚠️ \`${int.client.decodeHTMLEntities(
                    oldConnection?.state.subscription.player.state.resource
                      .metadata.details?.name
                  )}\` is already paused**`
                )
                .setColor(11553764),
            ],
            ephemeral: true,
          })
          .catch(() => null);
      }

      queue.paused = true;

      oldConnection.state.subscription.player.pause(true);

      return await int
        .reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `**✅ Successfully paused \`${int.client.decodeHTMLEntities(
                  oldConnection?.state.subscription.player.state.resource
                    .metadata.details?.name
                )}\`**`
              )
              .setColor(11553764),
          ],
        })
        .catch(() => null);
    } catch (error) {
      console.error(error);
      return null;
    }
  };
};
