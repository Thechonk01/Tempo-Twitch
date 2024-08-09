# Discord Bot with Twitch Live Notifications

This is a Discord bot template that includes Twitch live notifications. The bot monitors a specified Twitch channel and notifies a Discord server when the channel goes live. The bot also dynamically updates its activity status based on the Twitch stream status.

## Features

- **Twitch Live Notifications:** Notify a Discord channel when a specified Twitch channel goes live.
- **Dynamic Bot Activity:** The bot’s activity status changes depending on whether the Twitch stream is live or offline.
- **Moderation Commands:** Easily extend the bot with custom moderation commands.
- **Event Logging:** Logs significant events to Discord channels.

## Prerequisites

Before you can run the bot, you need to ensure you have the following:

- **Node.js** (v12.0 or higher)
- **npm** (Node Package Manager)
- A **Discord bot token** from the [Discord Developer Portal](https://discord.com/developers/applications)
- **Twitch API credentials** (Client ID and Client Secret) from the [Twitch Developer Portal](https://dev.twitch.tv/console)

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/YourUsername/YourRepoName.git
cd YourRepoName
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Configure the Bot

Create a `config.json` file in the root directory and populate it with your credentials:
```json
{
  "token": "your_discord_bot_token",
  "TWITCH_CLIENT_ID": "your_twitch_client_id",
  "TWITCH_CLIENT_SECRET": "your_twitch_client_secret",
  "TWITCH_USERNAME": "twitch_channel_to_monitor",
  "DISCORD_CHANNEL_ID": "discord_channel_id_for_notifications"
}
```

- `token`: Your Discord bot token.
- `TWITCH_CLIENT_ID`: Your Twitch application's Client ID.
- `TWITCH_CLIENT_SECRET`: Your Twitch application's Client Secret.
- `TWITCH_USERNAME`: The Twitch channel you want to monitor.
- `DISCORD_CHANNEL_ID`: The ID of the Discord channel where you want to send live notifications.

### 4. Run the Bot

Start the bot with the following command:
```bash
node index.js
```
## How It Works

### Twitch Live Notifications

- The bot checks if the specified Twitch channel is live every 60 seconds.
- If the channel is live, the bot will:
  - Send a notification to the specified Discord channel.
  - Update its activity status to show that the Twitch channel is streaming.
- If the channel is not live:
  - The bot’s activity status will revert to a custom message, e.g., "Chilling on Discord."

### Dynamic Activity Status

The bot updates its activity status based on the Twitch stream status:
- **Live:** The bot shows "Streaming [Channel Name] is live on Twitch!"
- **Offline:** The bot shows "Chilling on Discord" or any other custom message.

## Customization

### Adding Commands

You can easily add new commands by creating a new `.js` file in the `commands` directory. Follow the structure of existing command files to add your own.

### Adding Event Handlers

Events are located in the `events` directory. You can add new event handlers by creating a `.js` file in this directory and following the structure of the existing event files.

## Contributing

If you would like to contribute to this project, feel free to fork the repository and submit a pull request. Contributions, whether they be new features, improvements, or bug fixes, are always welcome.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
