import discord
import discord.ext.commands as commands


class Welcome(commands.Cog):
    def __init__(self, bot, cfg):
        self.bot = bot
        self.cfg = cfg

    @commands.Cog.listener()
    async def on_ready(self):
        self.welcome_channel = self.bot.get_channel(self.cfg.modules.welcome.channel)

    @commands.Cog.listener()
    async def on_member_join(self, member) -> None:
        emb = discord.Embed(title='Hello, world!', description=f'Hey {member.name}', colour=discord.Colour.from_rgb(8, 100, 165))
        emb.set_thumbnail(url=member.avatar_url)
        emb.add_field(name='Hot tip', value='Check out the rules at #overview')
        await self.welcome_channel.send(embed=emb)
