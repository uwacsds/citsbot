import discord
import discord.ext.commands as commands


class WelcomeConfig:
    def __init__(self, cfg):
        try:
            mod = cfg.modules.welcome
            self.channel = mod.channel
        except AttributeError as e:
            self.enabled = False
            print(f"Failed to parse {__name__} config:", e)


class Welcome(commands.Cog):
    def __init__(self, bot, cfg, logger):
        self.bot = bot
        self.logger = logger
        self.cfg = WelcomeConfig(cfg)

    @commands.Cog.listener()
    async def on_ready(self):
        self.welcome_channel = self.bot.get_channel(self.cfg.channel)

    @commands.Cog.listener()
    async def on_member_join(self, member) -> None:
        emb = discord.Embed(
            title="Hello, world!", description=f"Hey {member.name}", colour=discord.Colour.from_rgb(8, 100, 165)
        )
        emb.set_thumbnail(url=member.avatar_url)
        emb.add_field(name="Hot tip", value="Check out the rules at #overview")
        await self.welcome_channel.send(embed=emb)
