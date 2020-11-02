import os
import traceback
import dotenv
import config
import discord.ext.commands as commands

from logger import Logger
import modules.cowsay
import modules.welcome
import modules.announcer
import modules.react_roles
import modules.message_roles
import modules.stack_overflow
import modules.anime_detector


def main():
    print("Loading config from file")
    # load configs
    dotenv.load_dotenv()
    cfg = config.load_config()

    # set up bot and register modules
    print("Registering modules")
    bot = commands.Bot(command_prefix=cfg["prefix"])
    logger = Logger(bot, cfg)
    bot.add_cog(logger)
    bot.add_cog(modules.cowsay.Cowsay(bot, cfg, logger))
    bot.add_cog(modules.stack_overflow.StackOverflow(bot, cfg, logger))
    bot.add_cog(modules.welcome.Welcome(bot, cfg, logger))
    bot.add_cog(modules.announcer.Announcer(bot, cfg, logger))
    bot.add_cog(modules.react_roles.ReactRoles(bot, cfg, logger))
    bot.add_cog(modules.message_roles.MessageRoles(bot, cfg, logger))
    bot.add_cog(modules.anime_detector.AnimeDetector(bot, cfg, logger))

    # set up error handlers
    async def on_error(event_method, *args, **kwargs):
        traceback.print_exc()
        await logger.log_exception()

    async def on_command_error(context, exception):
        await logger.handle_command_error(context, exception)

    bot.on_error = on_error
    bot.on_command_error = on_command_error

    print("Starting bot")
    bot.run(os.getenv("DISCORD_TOKEN"))


if __name__ == "__main__":
    main()
