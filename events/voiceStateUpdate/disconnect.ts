import { EmbedBuilder, GuildMember, Message, VoiceState } from "discord.js";
import WOK from "wokcommands";
import { getVoiceConnection } from "@discordjs/voice";

export default async (
  oldState: VoiceState,
  newState: VoiceState,
  instance: WOK
) => {
  try {
    if (newState.id == newState.guild.members.me?.id) return;

    function stateChange(one: boolean | null, two: boolean | null) {
      if ((one === false && two === true) || (one === true && two === false))
        return true;
      else return false;
    }
    const o = oldState as any,
      n = newState as any;
    if (
      stateChange(o.streaming, n.streaming) ||
      stateChange(o.serverDeaf, n.serverDeaf) ||
      stateChange(o.serverMute, n.serverMute) ||
      stateChange(o.selfDeaf, n.selfDeaf) ||
      stateChange(o.selfMute, n.selfMute) ||
      stateChange(o.selfVideo, n.selfVideo) ||
      stateChange(o.suppress, n.suppress)
    )
      return;

    if (!o.channelId && n.channelId) {
      return;
    }

    if ((!n.channelId && o.channelId) || (n.channelId && o.channelId)) {
      setTimeout(async () => {
        const connection = getVoiceConnection(n.guild.id);
        if (
          (o.channel?.members.filter((m: GuildMember) => !m.user.bot)
            .size as any) >= 1
        )
          return;
        if (connection && connection.joinConfig.channelId == o.channelId) {
          connection.destroy();
          const lastInt = o.client.lastInt.get(o.guild.id);
          const msg: Message = await lastInt?.fetchReply().catch(() => null);
          await msg
            .reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(11553764)
                  .setDescription(
                    `**👋 Left <#${connection.joinConfig.channelId}> due to inactivity**`
                  ),
              ],
            })
            .catch(() => null);
        }
      }, 30 * 1000);
      return;
    }
  } catch (error) {
    console.error(error);
  }
};
