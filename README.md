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
    5. Turn on both the Presence Intent and the Server Members Intent under Privileged Gateway Intents
    6. Click on "OAuth2" in the list on the left
    7. Tick "bot" in scopes
    8. Tick "Administrator" in bot permissions
    9. Go to the generated link in scopes to add the bot to your test server

### Configure the bot

1. Set up config file

    1. You will need to update `botConfig` in `helm/citsbot/values.local.yaml` with values from your own test server. Please try avoid committing your changes to this file or revert them before you submit your pull request.
    2. To get IDs go to your discord settings and enable developer mode. The toggle can be found at the bottom of the "Appearance" section under Advanced.
    3. You can now right click on channels, users, roles, etc. to copy their ID which you can put in your local botConfig

2. Set up environment variables

    1. Create a new file called `.env` in the root directory (next to package.json)
    2. Add the following to it `DISCORD_TOKEN=<your-discord-bot-token-here>` where `<your-discord-bot-token-here>` is your discord bot token that you can find under the Bot section of the discord developer portal. **Do not share this value with anyone.**
    3. You can also provide `IMGUR_CLIENT_ID` if you would like the anime detector module to backup images to imgur before it removes them. You can follow the instructions [here](https://api.imgur.com/oauth2/addclient) to create the required credentials.

### Set up Docker and Kubernetes

1. Run `yarn` to install dependencies for your IDE
2. Install docker and [kind](https://kind.sigs.k8s.io/docs/user/quick-start).
3. Install helm by following https://helm.sh/docs/intro/install/
5. Start a local kubernetes cluster by running `kind create cluster --name tim-local`

### Running tests

1. Run `yarn test`

### Building, Running, and Stopping the Bot

1. Make sure you have set up a server, bot account, and config by following the steps in the sections above
2. Use the provided scripts to manage the bot. **Due to the nature of Kubernetes, the bot will continue running unless you explicitly shut it down with the provided stop script.** 

Script | Description
--- | ---
`./local-reset.sh` | Helper to easily restart the bot with your latest changes
`./local-build.sh` | Builds the bot using docker
`./local-start.sh` | Installs the bot's helm chart
`./local-stop.sh` | Uninstalls the bot's helm chart
`./local-tail.sh` | Tails the bot's pod's logs
