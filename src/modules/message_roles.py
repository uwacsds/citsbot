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
    async def add(self, ctx, *courses):
        print(ctx.channel.id, self.cfg.channel)
        if ctx.channel.id != self.cfg.channel:
            return
            
        if len(courses) == 0:
            # TODO: user has not assigned any courses, what to do?
            ...
            
        print(self.cfg.units)
        print(type(self.cfg.units))

        for course in list(courses):
            try:
                role_id = self.cfg.units[course]
                await ctx.message.author.add_roles(role_id)
            except KeyError as NotValid:
                # TODO: alert user the role they selected doesn't exist
                ...

    @commands.command()
    async def remove(self, ctx, *, txt):
        # TODO: allow users to remove roles added by !add
        ...