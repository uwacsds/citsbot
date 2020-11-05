import traceback
import discord
import discord.ext.commands as commands
from datetime import datetime
from enum import Enum


max_msg_len = 1000


class ErrorLevel(Enum):
    INFO = 1
    WARN = 2
    ERROR = 3
    FATAL = 4


error_colour = {
    ErrorLevel.INFO: discord.Colour.from_rgb(150, 246, 255),
    ErrorLevel.WARN: discord.Colour.from_rgb(255, 242, 0),
    ErrorLevel.ERROR: discord.Colour.from_rgb(240, 71, 71),
    ErrorLevel.FATAL: discord.Colour.from_rgb(255, 0, 0),
}


def truncate(text, maxlen=max_msg_len):
    return text[: min(len(text), maxlen)]


class Logger(commands.Cog):
    def __init__(self, bot, cfg):
        self.bot = bot
        self.cfg = cfg
        self.channel = None
        self.__initialised = False

    @commands.Cog.listener()
    async def on_ready(self):
        self.channel = self.bot.get_channel(self.cfg["log_channel"])
        if self.__initialised is False:
            self.__initialised = True
            await self.channel.send("Hello world")

        print("Connected to the Discord API")

    async def handle_command_error(self, ctx, error):
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
        # raise the unhandled exception so the main on_error can handle it
        raise error

    async def log_exception(self):
        # send the most recently raised exception to the log channel
        err = traceback.format_exc().strip().split("\n\n")[0]
        err_title = err.split("\n")[-1]
        err = truncate(err, max_msg_len - 30)  # account for ```python markup
        await self.log(err_title, f"```python\n{err}\n```", lvl=ErrorLevel.ERROR)

    async def log(self, title, msg, image=None, lvl=ErrorLevel.WARN):
        # send a message to the log channel
        short_msg = truncate(msg)
        now = datetime.now()
        emb = discord.Embed(title=f"{lvl.name}: {title}", colour=error_colour[lvl])
        emb.add_field(
            name="Time", value=f"{now.strftime('%Y/%m/%d %H:%M:%S')}", inline=False
        )
        emb.add_field(name="Message", value=short_msg, inline=False)
        if image is not None:
            emb.set_image(url=image)
        if self.channel:
            await self.channel.send(embed=emb)
        else:
            print("Failed to send log message: No log channel found")
