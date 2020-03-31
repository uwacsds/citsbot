import traceback
import discord
import discord.ext.commands as commands
from datetime import datetime
from enum import Enum


async def handle_error(self, ctx, error):
    # prevent commands with their own handlers being handled here
    if hasattr(ctx.command, "on_error"):
        return
    # ignore user error that isnt handled by command handlers
    ignored = (commands.CommandNotFound, commands.UserInputError)
    error = getattr(error, "original", error)
    if isinstance(error, ignored):
        return
    if isinstance(error, commands.DisabledCommand):
        return await ctx.send(f"{ctx.command} is currently disabled.")
    # send the unhandled error to the logger
    await self.logger.log(ctx, error, ErrorLevel.ERROR)


class ErrorLevel(Enum):
    INFO = 1
    WARN = 2
    ERROR = 3
    FATAL = 4


error_colour = {
    ErrorLevel.INFO: discord.Colour.from_rgb(150, 246, 255),
    ErrorLevel.WARN: discord.Colour.from_rgb(255, 242, 0),
    ErrorLevel.ERROR: discord.Colour.from_rgb(201, 71, 0),
    ErrorLevel.FATAL: discord.Colour.from_rgb(201, 0, 0),
}


class Logger(commands.Cog):
    def __init__(self, bot, cfg):
        self.bot = bot
        self.cfg = cfg
        self.channel = None

    @commands.Cog.listener()
    async def on_ready(self):
        self.channel = self.bot.get_channel(self.cfg.log_channel)

    async def log(self, ctx, error, lvl=ErrorLevel.WARN):
        traceback.print_exception(
            type(error), error, error.__traceback__, file=sys.stderr
        )

        exp_name = error.split("\n")[-1]
        now = datetime.now()

        emb = discord.Embed(title=f"{lvl.name}: {exp_name}", colour=error_colour[lvl])
        emb.add_field(
            name="Time", value=f"{now.strftime('%Y/%m/%d %H:%M:%S')}", inline=False
        )
        emb.add_field(name="Traceback", value=f"```python\n{error}\n```", inline=False)
        await self.channel.send(embed=emb)
