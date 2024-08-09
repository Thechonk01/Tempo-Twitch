const { ActivityType } = require('discord.js');

module.exports = {
    name: 'guildCreate',
    execute(guild) {
        console.log("Joined " + guild.name + "(" + guild.id + ")")
        guild.client.user.setActivity('over ' + guild.client.guilds.cache.size + ' guilds', { type: ActivityType.Watching })
    }
}