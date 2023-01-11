import { VoiceState, ChannelType } from "discord.js";
import WOK from "wokcommands";

export default async (
  oldState: VoiceState,
  newState: VoiceState,
  instance: WOK
) => {
  try {
    if (
      newState.id == newState.guild.members.me?.id &&
      newState.channelId &&
      newState.channel?.type == ChannelType.GuildStageVoice &&
      newState.suppress
    ) {
      if (
        newState.channel
          ?.permissionsFor(newState.guild.members.me)
          ?.has("MuteMembers")
      ) {
        await newState.guild.members.me.voice
          .setSuppressed(false)
          .catch(() => null);
      }
    }
  } catch (error) {
    console.error(error);
  }
};
