import os
import discord
import datetime
import dotenv
import config
import modules

dotenv.load_dotenv()
cfg = config.load_config()
client = discord.Client()


async def try_run_command(msg):
    print("[Server: {}, User: {}] Parsing message: {}".format(msg.guild.name, msg.author.name, msg.content))
    argv = msg.content.split(' ')
    if len(argv) < 1:
        return
    msg_cmd = argv[0][1:]
    for name, cmd in modules.commands.items():
        print('checking command', name)
        if name == msg_cmd:
            await cmd(msg)


@client.event
async def on_ready():
    print('We have logged in as {0.user}'.format(client))
    now = datetime.datetime.now()
    game = discord.Game('Programming', start=now)
    await client.change_presence(activity=game, status='A', afk=False)


@client.event
async def on_message(msg):
    if msg.author == client.user:
        return

    if msg.content.startswith(cfg['prefix']):
        await try_run_command(msg)


def main():
    client.run(os.getenv('DISCORD_TOKEN'))


if __name__ == '__main__':
    main()
