import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ComponentType,
  Embed,
  EmbedBuilder,
  Interaction,
  Message,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { Command, CommandObject, CommandType } from "wokcommands";

export default {
  description: "Provides Information about Fakemons",
  testOnly: true,
  type: CommandType.SLASH,
  guildOnly: true,
  options: [
    {
      name: "name",
      description: "The name of the Fakemon to search for",
      required: true,
      type: ApplicationCommandOptionType.String,
      autocomplete: true,
    },
  ],
  autocomplete: async (command: Command, argument: string) => {
    const names: any = [];
    fakemons.forEach((fakemon: any) => names.push(fakemon["NAME"]));
    return names;
  },

  callback: async ({ interaction }: { interaction: Interaction }) => {
    let int = interaction as any;
    try {
      const fakemon: any = fakemons.find(
        (fakemon: any) => fakemon["NAME"] == int.options?.getString("name")
      );
      if (!fakemon) {
        return await int
          .reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `**❌ No results were found for \`${int.options?.getString(
                    "name"
                  )}\`**`
                )
                .setColor(11553764),
            ],
            ephemeral: true,
          })
          .catch(() => null);
      }

      const embed = new EmbedBuilder()
        .setTitle(fakemon["NAME"])
        .setDescription(`**\`\`\`\n${fakemon["DEX ENTRY"]}\`\`\`**`)
        .setColor(11553764)
        .addFields({
          name: "Release Version",
          value: `**\`\`\`\n${fakemon["RELEASE VERSION"]}\`\`\`**`,
          inline: true,
        })
        .addFields({
          name: "Type #1",
          value: `**\`\`\`\n${fakemon["TYPE 1"]}\`\`\`**`,
          inline: true,
        })
        .addFields({
          name: "Type #2",
          value: `**\`\`\`\n${fakemon["TYPE 2"]}\`\`\`**`,
          inline: true,
        })
        .addFields({
          name: "Location",
          value: `**\`\`\`\n${fakemon["LOCATION"]}\`\`\`**`,
          inline: true,
        })
        .addFields({
          name: "Pre-Evolution",
          value: `**\`\`\`\n${fakemon["PRE-EVO"]}\`\`\`**`,
          inline: true,
        })
        .addFields({
          name: "Post-Evolution",
          value: `**\`\`\`\n${fakemon["POST-EVO"]}\`\`\`**`,
          inline: true,
        })
        .setImage(fakemon["CONCEPT ART"]);

      let selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`sprite_${int.id}`)
        .setPlaceholder("View Sprites")
        .setMinValues(1)
        .setMaxValues(1);
      if (fakemon["FRONT SPRITE"] != "") {
        selectMenu.addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("Front Sprite")
            .setValue("FRONT SPRITE")
        );
      }
      if (fakemon["FRONT SPRITE SHINY"] != "") {
        selectMenu.addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("Front Sprite (Shiny)")
            .setValue("FRONT SPRITE SHINY")
        );
      }
      if (fakemon["BACK SPRITE"] != "") {
        selectMenu.addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("Back Sprite")
            .setValue("BACK SPRITE")
        );
      }
      if (fakemon["BACK SPRITE SHINY"] != "") {
        selectMenu.addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("Back Sprite (Shiny)")
            .setValue("BACK SPRITE SHINY")
        );
      }
      if (fakemon["OW SPRITE"] != "") {
        selectMenu.addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("OW Sprite")
            .setValue("OW SPRITE")
        );
      }

      setTimeout(async () => {
        const msg: Message = await int.fetchReply().catch(() => null);
        const disabledRow = new ActionRowBuilder();
        if (msg?.components) {
          msg.components[0]?.components?.forEach((menu: any) => {
            const editedMenu =
              StringSelectMenuBuilder.from(menu).setDisabled(true);
            disabledRow.addComponents(editedMenu);
          });
          await int
            .editReply({
              embeds: msg.embeds,
              components: disabledRow.components[0] ? [disabledRow] : [],
            })
            .catch(() => null);
        }
      }, 1000 * 60 * 1);

      await int
        .reply({
          components: selectMenu.options[0]
            ? [
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                  selectMenu
                ),
              ]
            : [],
          embeds: [embed],
        })
        .catch(() => null);

      const filter = (i: Interaction) => i.user.id == int.user?.id;
      let collector: any = int.channel?.createMessageComponentCollector({
        filter,
        time: 1000 * 60 * 1,
        componentType: ComponentType.StringSelect,
      });

      await collector.on(
        "collect",
        async (sltInt: StringSelectMenuInteraction) => {
          if (!sltInt) {
            return;
          }
          await sltInt.deferUpdate().catch(() => null);
          if (sltInt.customId != `sprite_${int.id}`) {
            return;
          } else {
            const msg: Message = await int.fetchReply().catch(() => null);
            const newEmbed = EmbedBuilder.from(msg?.embeds[0]).setImage(
              fakemon[sltInt.values[0]]
            );
            await msg
              .edit({
                embeds: [newEmbed],
                components: msg.components,
              })
              .catch(() => null);
          }
        }
      );
    } catch (error) {
      console.error(error);
      await int
        .reply({
          embeds: [
            new EmbedBuilder()
              .setColor(11553764)
              .setDescription(
                "**❌ Something went wrong while executing that command**"
              ),
          ],
        })
        .catch(() => null);
    }
  },
} as CommandObject;

const fakemons = [
  {
    "RELEASE VERSION": "Starter",
    NAME: "Elefrond",
    "TYPE 1": "Grass",
    "TYPE 2": "",
    "PRE-EVO": "—",
    "POST-EVO": "Gajungle",
    "DEX ENTRY":
      "Elefrond are peaceful creatures, they will never harm others, even if they've been wronged and hurt. ",
    LOCATION: "Postgame: Starter Tourney",
    "CONCEPT ART":
      "https://cdn.discordapp.com/attachments/984363065309036555/1009712974463766619/IMG_2867.png",
    "FRONT SPRITE":
      "https://media.discordapp.net/attachments/999955536713879592/1082534401025519729/elefrond.png",
    "FRONT SPRITE SHINY": "",
    "BACK SPRITE": "",
    "BACK SPRITE SHINY": "",
    "OW SPRITE": "",
  },
  {
    "RELEASE VERSION": "Starter (male)",
    NAME: "Gajungle (Male)",
    "TYPE 1": "Grass",
    "TYPE 2": "Psychic",
    "PRE-EVO": "Elefrond",
    "POST-EVO": "Hastijhar",
    "DEX ENTRY":
      "Gajungle live in large herds headed by a matriarch, generally a female Hastijhar. They tend to gain mystic powers by conusming a rare herb found deep in the jungle.",
    LOCATION: "-",
    "CONCEPT ART":
      "https://media.discordapp.net/attachments/989579344076738570/1012234453910835210/Untitled_Artwork.png",
    "FRONT SPRITE":
      "https://media.discordapp.net/attachments/999955536713879592/1082535896013865030/gajungle_male.png",
    "FRONT SPRITE SHINY": "",
    "BACK SPRITE": "",
    "BACK SPRITE SHINY": "",
    "OW SPRITE": "",
  },
  {
    "RELEASE VERSION": "Starter (female)",
    NAME: "Gajungle (Female)",
    "TYPE 1": "",
    "TYPE 2": "",
    "PRE-EVO": "",
    "POST-EVO": "",
    "DEX ENTRY": "",
    LOCATION: "-",
    "CONCEPT ART":
      "https://media.discordapp.net/attachments/989579344076738570/1012235576478547988/Untitled_Artwork.png",
    "FRONT SPRITE":
      "https://media.discordapp.net/attachments/999955536713879592/1082536041359093800/gajungle_female.png",
    "FRONT SPRITE SHINY": "",
    "BACK SPRITE": "",
    "BACK SPRITE SHINY": "",
    "OW SPRITE": "",
  },
  {
    "RELEASE VERSION": "Starter (male)",
    NAME: "Hastijhar (Male)",
    "TYPE 1": "Grass",
    "TYPE 2": "Psychic",
    "PRE-EVO": "Gajungle",
    "POST-EVO": "—",
    "DEX ENTRY":
      "Male Hastijhar often go rogue and destroy human civilisation. However they're still widely revered and many believe that these rampages are nature's way of making humans repent.",
    LOCATION: "-",
    "CONCEPT ART":
      "https://media.discordapp.net/attachments/984363065309036555/1046488874081329304/IMG_3435.png",
    "FRONT SPRITE": "",
    "FRONT SPRITE SHINY": "",
    "BACK SPRITE": "",
    "BACK SPRITE SHINY": "",
    "OW SPRITE": "",
  },
  {
    "RELEASE VERSION": "Starter (female",
    NAME: "Hastijhar (Female)",
    "TYPE 1": "",
    "TYPE 2": "",
    "PRE-EVO": "",
    "POST-EVO": "",
    "DEX ENTRY":
      "Female Hastijhar are widely respected by all, Pokémon and humans alike. They have a commanding presence and are often known to give telepathic messages",
    LOCATION: "-",
    "CONCEPT ART": "",
    "FRONT SPRITE": "",
    "FRONT SPRITE SHINY": "",
    "BACK SPRITE": "",
    "BACK SPRITE SHINY": "",
    "OW SPRITE": "",
  },
  {
    "RELEASE VERSION": "Starter",
    NAME: "Sliferno",
    "TYPE 1": "Fire",
    "TYPE 2": "",
    "PRE-EVO": "—",
    "POST-EVO": "Heatophius",
    "DEX ENTRY":
      "Sliferno prefer to spend their time in graveyards and other haunted places, hiding in nooks and crannies. Their fire, although not hot, servers as an intimidation tactic",
    LOCATION: "Postgame: Starter Tourney",
    "CONCEPT ART":
      "https://media.discordapp.net/attachments/984363065309036555/1046099367314063460/IMG_3108.png",
    "FRONT SPRITE":
      "https://media.discordapp.net/attachments/989175520392523787/1046815859647184906/Sliferno_F.png",
    "FRONT SPRITE SHINY": "",
    "BACK SPRITE": "",
    "BACK SPRITE SHINY": "",
    "OW SPRITE": "",
  },
  {
    "RELEASE VERSION": "Starter",
    NAME: "Heatophius",
    "TYPE 1": "Fire",
    "TYPE 2": "Ghost",
    "PRE-EVO": "Sliferno",
    "POST-EVO": "Spectroblaze",
    "DEX ENTRY":
      "Heatophius' fire is said to have been possessed by spirits. It is said that the flames provide a gateway into the world of the spirits. Many trainers choose to ignore this and instead use Heatophius for its mastery of fire.",
    LOCATION: "-",
    "CONCEPT ART":
      "https://media.discordapp.net/attachments/984363065309036555/1046099874938101800/IMG_3432.png",
    "FRONT SPRITE":
      "https://media.discordapp.net/attachments/989175520392523787/1046481506610184304/Heatophius_F.png",
    "FRONT SPRITE SHINY":
      "https://media.discordapp.net/attachments/989175520392523787/1046481584171262132/Heatophius_F_2.png",
    "BACK SPRITE":
      "https://media.discordapp.net/attachments/989175520392523787/1046481546091180032/Heatophius_B.png",
    "BACK SPRITE SHINY":
      "https://media.discordapp.net/attachments/989175520392523787/1046481623350255646/Heatophius_B_2.png",
    "OW SPRITE": "",
  },
  {
    "RELEASE VERSION": "Starter",
    NAME: "Spectroblaze",
    "TYPE 1": "Fire",
    "TYPE 2": "Ghost",
    "PRE-EVO": "Heatophius",
    "POST-EVO": "—",
    "DEX ENTRY":
      "Spectroblaze have been consumed by the wandering souls of the dead. They act as vessels for these souls. The fire in Spectroblaze's hood burns hotter if more spirits reside in it. Many call its appearance a sign of catastrophe.",
    LOCATION: "-",
    "CONCEPT ART":
      "https://cdn.discordapp.com/attachments/984363065309036555/1009722340906635324/IMG_2915.png",
    "FRONT SPRITE":
      "https://media.discordapp.net/attachments/989175520392523787/1046815786385281034/Spectroblaze_F.png",
    "FRONT SPRITE SHINY": "",
    "BACK SPRITE": "",
    "BACK SPRITE SHINY": "",
    "OW SPRITE": "",
  },
];
