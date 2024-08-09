const { ActivityType } = require('discord.js');
const axios = require('axios');
const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, TWITCH_USERNAME } = require('../config.json');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log("In: " + client.guilds.cache.size + " guilds, with: " + client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0) + " members");
		console.log(`Ready! Logged in as ${client.user.tag}`);

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

		async function setBotActivity() {
			const accessToken = await getTwitchAccessToken();
			if (accessToken) {
				const isLive = await checkIfLive(accessToken);
				if (isLive) {
					client.user.setActivity(`${TWITCH_USERNAME} is live on Twitch!`, { type: ActivityType.Streaming, url: `https://www.twitch.tv/${TWITCH_USERNAME}` });
				} else {
					client.user.setActivity(`Chilling on Discord`, { type: ActivityType.Playing });
				}
			} else {
				client.user.setActivity(`Waiting for ${TWITCH_USERNAME} to go live...`, { type: ActivityType.Playing });
			}
		}

		// Set the initial activity status
		await setBotActivity();
	}
}
