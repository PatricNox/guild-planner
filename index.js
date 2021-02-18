require("dotenv").config();
const path = require("path");
const { CommandoClient } = require("discord.js-commando");
const client = new CommandoClient({
  owner: process.env.OWNER_ID,
  commandPrefix: process.env.COMMAND_PREFIX,
  unknownCommandResponse: false,
});

// Register bot.
client.registry
  .registerDefaultTypes()
  .registerGroups([["utility", "Utility commands"]])
  .registerDefaultGroups()
  .registerDefaultCommands({
    help: false,
  })
  .registerCommandsIn(path.join(__dirname, "core"));

// Init bot and set status.
client.on("ready", () => {
  console.log(`Alias: ${client.user.username}`);
  client.user.setActivity(process.env.BOT_STATUS, {
    type: process.env.BOT_STATUS_TYPE,
  });
});

// Login bot.
client.login(process.env.DISCORD_BOT_TOKEN);
