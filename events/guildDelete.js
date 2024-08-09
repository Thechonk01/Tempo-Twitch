const { ActivityType } = require('discord.js');

module.exports = {
  name: 'guildDelete',
  execute(guild) {
    try {
      console.log("Left " + guild.name + "(" + guild.id + ")")
      guild.client.user.setActivity('over ' + guild.client.guilds.cache.size + ' guilds', { type: ActivityType.Watching });
    } catch (e) {
      console.log("Error: " + e + "\n Guild id: " + guild.id)
    }
  }
}; 