import discord
import discord.ext.commands as commands
import discord.utils

class MessageRoles(commands.Cog):
    def __init__(self, bot, cfg):
        self.bot = bot
        self.cfg = cfg

    @commands.command()
    async def add(self, ctx, *, txt):
        # TODO: allow users to add roles with !add
        ...

    @commands.command()
    async def remove(self, ctx, *, txt):
        # TODO: allow users to remove roles added by !add
        ...