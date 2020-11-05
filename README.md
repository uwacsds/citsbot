# CITS Bot

## Local Development

### General Configuration

1. Create a server for testing

    Use this server template to create a new server https://discord.new/hQVpKQKVnpSQ

2. Create a bot account for testing

    1. Log in to https://discordapp.com/developers/applications
    2. Click "New Application" and give it a name
    3. Click on "Bot" in the list on the left
    4. Click "Add Bot" and then "Yes, do it!"
    5. Turn on the Server Members Intent under Privileged Gateway Intents
    6. Click on "OAuth2" in the list on the left
    7. Tick "bot" in scopes
    8. Tick "Administrator" in bot permissions
    9. Go to the generated link in scopes to add the bot to your test server
    
3. Set up environment variables

    1. Create a new file called `.env` in the root of this repo (next to config.json)
    2. Populate your `.env` file with values from your bot application. You can find your values for `DISCORD_ID` and `DISCORD_SECRET` under General Information and `DISCORD_TOKEN` under Bot. **Do not share these values with anyone.**
        ```bash
        CONFIG=config.dev.json
        DISCORD_ID=____YOUR_CLIENT_ID_HERE____
        DISCORD_SECRET=____YOUR_CLIENT_SECRET_HERE____
        DISCORD_TOKEN=____YOUR_BOT_TOKEN_HERE____
        ```

4. Configure the bot

    1. Make a copy of `config.json` called `config.dev.json`. The `config.json` file provided contains IDs for channels, servers, and roles. You will need to change these values in your `config.dev.json` to ones from your test server.
    2. To get IDs go to your discord settings and enable developer mode. The toggle can be found at the bottom of the "Appearance" section under Advanced.
    3. You can now right click on channels, users, roles, etc. to copy their ID which you can put in your `config.json` file


### Local Development

1. Run `python -m venv venv && python -m pip install -r requirements.txt` to install dependencies for your IDE
2. Install docker and docker-compose from https://www.docker.com/products/docker-desktop
3. Make sure you have configured the bot by following the steps in the General Configuration section above
4. Use `docker-compose up` to build and run the bot
