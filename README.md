# CITS Bot

## Local Development

### Set up a Discord server and Bot for testing

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

### Configure the bot

1. Set up environment variables

    1. Run `./create-env.sh config.dev.json <you-discord-bot-token-here>` to create a `.env` file for local development. You can find your discord bot token under the Bot section of the discord developer portal. **Do not share this value with anyone.**

2. Set up config file

    1. Make a copy of `config.dev.sample.json` called `config.dev.json`. The `config.json` files contain IDs for channels, servers, and roles for their respective servers. You will need to change the sample values in your `config.dev.json` to ones from your test server.
    2. To get IDs go to your discord settings and enable developer mode. The toggle can be found at the bottom of the "Appearance" section under Advanced.
    3. You can now right click on channels, users, roles, etc. to copy their ID which you can put in your `config.dev.json` file


### Set up local environment

1. Run `yarn` to install dependencies for your IDE
2. Install docker and docker-compose from https://www.docker.com/products/docker-desktop
3. Make sure you have set up a server, bot account, and config by following the steps in the sections above
4. Use `docker-compose up` to build and run the bot

### Run tests

1. Run `yarn test`
