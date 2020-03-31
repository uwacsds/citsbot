import discord
import discord.ext.commands as commands
import discord.utils

class MessageRoles(commands.Cog):
    def __init__(self, bot, cfg):
        self.bot = bot
        self.cfg = cfg.modules.message_roles

    @commands.Cog.listener()
    async def on_ready(self):
        # TODO: automatically register all units which are provided in the config file
        ...

    @commands.command()
    async def register_course(self, ctx, *, txt):
        # TODO: allow administrators to add new courses which users can allocate to themselves
        ...

    @commands.command()
    async def remove_course(self, ctx, *, txt):
        # TODO: allow administrators to add remove courses which they previously added
        ...

    @commands.command()
    async def add(self, ctx, *, txt):
        # TODO: allow users to add roles with !add
        ...

    @commands.command()
    async def remove(self, ctx, *, txt):
        # TODO: allow users to remove roles added by !add
        ...