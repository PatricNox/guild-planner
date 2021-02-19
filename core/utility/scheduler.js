const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");

module.exports = class RiotAPICommand extends Command {
  constructor(client) {
    super(client, {
      name: "schedule",
      aliases: ["raid-schedule"],
      group: "utility",
      memberName: "raid_schedule",
      guildOnly: true,
      description: "Announce a new scheduled guild raid.",
    });
  }

  run(msg) {
    if (msg.channel.id === process.env.SCHEDULE_CHANNEL) {
      const args = msg.content.slice(".".length).split(" ");

      // Choose raid.
      let raid = args[1];
      if (raid) {
        switch (raid.toLowerCase()) {
          case "cn":
            raid = "Castle Nathria";
            break;
          case "sod":
            raid = "Sanctum of Domination";
            break;
          default:
            raid = false;
            break;
        }
      }

      // Choose mode.
      let gameMode = args[2];
      if (gameMode) {
        switch (gameMode.toLowerCase()) {
          case "heroic":
          case "normal":
          case "mythic":
            gameMode = gameMode;
            break;
          default:
            gameMode = false;
            break;
        }
      }

      let weekDay = args[3];
      let time = args[4];
      let descriptionValue = args[5] ?? "";

      if (!raid || !gameMode || !weekDay || !time) {
        msg.channel.send(
          "Invalid argument, see list below. \n" +
            ".schedule [raid] [mode] {WeekDay} {Time} {Description (optional)}" +
            "```" +
            "Raids: \n" +
            "- Castle Nathria (cn) \n" +
            "- Sanctum of Domination (sod) \n" +
            "\n\n" +
            "Game Modes: \n" +
            "- Normal (normal) \n" +
            "- Heroic (heroic) \n" +
            "- Mythic (mythic) \n" +
            "```"
        );

        return;
      }

      // Style up message output.
      const embed = new RichEmbed()
        .setTitle(`${raid} (${gameMode.toUpperCase()})`)
        .setAuthor("Raid Planner", process.env.BOT_AUTHOR_IMAGE)
        .setDescription(weekDay + " " + time)
        .setThumbnail(process.env.BOT_AUTHOR_THUMBNAIL)
        .setColor(0x0000ff);

      // Information field.
      embed.addField(
        "INFORMATION",
        descriptionValue + "\n\nReagera nedan om du kan komma eller ej!",
        true
      );

      msg.member.guild.channels
        .find((c) => c.id == process.env.ANNOUNCE_CHANNEL)
        .send(embed)
        .then(function (message) {
          message.react("✅");
          setTimeout(() => {
            message.react("❌");
          }, 400);
        })
        .catch(function () {
          console.log("error when reacting");
        });
    }
  }
};
