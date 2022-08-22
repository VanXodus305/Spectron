import Discord, { EmbedBuilder, ApplicationCommandOptionType, GuildDiscoverySplashFormat } from "discord.js";
import { ICommand } from "wokcommands";
import { buildDefaultInstance } from 'wombo-dream-api';

export default {
  category: "Utility",
  description: "Generates an image using AI based on the given prompt",
  slash: true,
  syntaxError: {
    "english": "**Incorrect syntax! Please use \`{PREFIX}{COMMAND} {ARGUMENTS}\`**"
  },
  options: [
    {
      name: 'prompt',
      description: 'The textual description of the image',
      required: true,
      maxLength: 100,
      type: "STRING",
    }
  ],

  maxArgs: 1,
  minArgs: 1,
  testOnly: true,
  expectedArgs: '<prompt>',
  aliases: ['img'],
  callback: async ({ interaction, message}) => {
    let int = interaction as unknown as Discord.CommandInteraction;
    const embed = new EmbedBuilder();
    embed.setTitle('Generating Image...');

    await int.reply({ embeds: [embed], fetchReply: true }).then(async (resultMessage: any) => {
      await int.editReply(await genImg(interaction.options.getString('prompt')));
    });

    async function genImg(query: any) {
      const credentials = {
        email: 'soumyadeep.30505@gmail.com',
        password: 'SKundu@30505',
      };
      const wombo = buildDefaultInstance(credentials);

      // const styles = await wombo.fetchStyles();
      // console.log(styles);
      // console.log(styles.map((style) => `[${style.id}] ${style.name}`));
      const generatedTask = await wombo.generatePicture(
        `${query}`,
        32,
        (taskInProgress) => { });

      embed.setTitle(`${query}`);
      embed.setImage(`${generatedTask.result?.final}`);
      return { embeds: [embed] };
    }
  }
} as ICommand