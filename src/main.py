import os
import dotenv
import config
import modules
import discord.ext.commands as commands

import modules.cowsay
import modules.welcome
import modules.announcer
import modules.react_roles

def main():
    # load configs
    dotenv.load_dotenv()
    cfg = config.load_config()
    
    # set up bot and register modules
    bot = commands.Bot(command_prefix=cfg.prefix)
    bot.add_cog(modules.cowsay.Cowsay(bot, cfg))
    bot.add_cog(modules.welcome.Welcome(bot, cfg))
    bot.add_cog(modules.announcer.Announcer(bot, cfg))
    bot.add_cog(modules.react_roles.ReactRoles(bot, cfg))
    bot.run(os.getenv('DISCORD_TOKEN'))


if __name__ == '__main__':
    main()
