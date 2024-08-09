const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, TWITCH_USERNAME, DISCORD_CHANNEL_ID } = require('./config.json');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        try {
            client.on(event.name, (...args) => {
                event.execute(...args)
                let evChan = ""
                client.channels.cache.get(evChan).send("New event: " + event.name)
            });
        } catch (e) {
            let errChan = ""
            client.channels.cache.get(errChan).send("New event error: " + e)
        }
    }
}

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
        let errChan = ""
        client.channels.cache.get(errChan).send(`From ${interaction.guild.name} (${interaction.guild.id}) ${interaction.user.tag} (${interaction.user.id}) in #${interaction.channel.name} triggered ${interaction.commandName}.`)
    } catch (error) {
        console.log(error)
        let errChan = ""
        client.channels.cache.get(errChan).send("On command: " + interaction.commandName + "\n In guild: " + interaction.guild.name + "(" + interaction.guild.id + ")\nExecuted by: " + interaction.user.tag + "\nNew error: " + error)
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

let hasNotified = false; // Flag to track if the notification has been sent

async function getTwitchAccessToken() {
    try {
        const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
            params: {
                client_id: TWITCH_CLIENT_ID,
                client_secret: TWITCH_CLIENT_SECRET,
                grant_type: 'client_credentials'
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting Twitch access token:', error.response ? error.response.data : error.message);
    }
}

async function checkIfLive(accessToken) {
    try {
        const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${TWITCH_USERNAME}`, {
            headers: {
                'Client-ID': TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data.data.length > 0;
    } catch (error) {
        console.error('Error checking Twitch stream status:', error.response ? error.response.data : error.message);
    }
}

async function notifyDiscord() {
    const channel = client.channels.cache.get(DISCORD_CHANNEL_ID);
    if (channel) {
        await channel.send(`@everyone ${TWITCH_USERNAME} is live on Twitch! Check it out at https://www.twitch.tv/${TWITCH_USERNAME}`);
    }
}

async function setBotActivity() {
    const accessToken = await getTwitchAccessToken();
    if (accessToken) {
        const isLive = await checkIfLive(accessToken);
        if (isLive && !hasNotified) {
            client.user.setActivity(`${TWITCH_USERNAME} is live on Twitch!`, { type: "STREAMING", url: `https://www.twitch.tv/${TWITCH_USERNAME}` });
            await notifyDiscord();
            hasNotified = true; // Set the flag to true after notifying
        } else if (!isLive && hasNotified) {
            client.user.setActivity(`Waiting for ${TWITCH_USERNAME} to go live...`, { type: "PLAYING" });
            hasNotified = false; // Reset the flag once the stream is no longer live
        }
    } else {
        client.user.setActivity(`Waiting for ${TWITCH_USERNAME} to go live...`, { type: "PLAYING" });
    }
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    // Set the initial activity status
    await setBotActivity();

    // Update the activity status periodically
    setInterval(async () => {
        await setBotActivity();
    }, 60000); // Check every 60 seconds
});

client.login(token);
