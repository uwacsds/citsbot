import textwrap
import discord.ext.commands as commands
from logger import ErrorLevel


class CowsayConfig:
    def __init__(self, cfg):
        try:
            mod = cfg["modules"]["cowsay"]
            self.line_max_len = mod["line_max_len"]
            self.cow_art = mod["cow_art"]
        except AttributeError as e:
            self.enabled = False
            print(f"Failed to parse {__name__} config:", e)


class Cowsay(commands.Cog):
    def __init__(self, bot, cfg, logger):
        self.bot = bot
        self.logger = logger
        self.cfg = CowsayConfig(cfg)

    def normalize_text(self, msg):
        lines = textwrap.wrap(msg, self.cfg.line_max_len)
        maxlen = len(max(lines, key=len))
        return [line.ljust(maxlen) for line in lines]

    def get_border(self, lines, index):
        if len(lines) < 2:
            return ["<", ">"]
        elif index == 0:
            return ["/", "\\"]
        elif index == len(lines) - 1:
            return ["\\", "/"]
        return ["|", "|"]

    @commands.command()
    async def cowsay(self, ctx, *, txt):
        lines = self.normalize_text(txt)
        border_size = len(lines[0])
        bubble = ["  " + "_" * border_size]
        for index, line in enumerate(lines):
            border = self.get_border(lines, index)
            bubble.append(f"{border[0]} {line} {border[1]}")
        bubble.append("  " + "-" * border_size)
        await ctx.channel.send("```\n" + "\n".join(bubble) + self.cfg.cow_art + "\n```")

    @cowsay.error
    async def cowsay_handler(self, ctx, error):
        if isinstance(error, commands.MissingRequiredArgument):
            return await ctx.channel.send("usage: cowsay <message>")
        raise error
