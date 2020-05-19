import discord
import discord.ext.commands as commands
from datetime import datetime
import asyncio
from logger import ErrorLevel


class WelcomeDmConfig:
    def __init__(self, cfg_dm):
        self.delay = cfg_dm["delay"]
        self.role_threshold = int(cfg_dm["role_threshold"])
        self.message = cfg_dm["message"]
        self.react = cfg_dm["react"]


class WelcomeConfig:
    def __init__(self, cfg):
        try:
            mod = cfg["modules"]["welcome"]
            self.channel = mod["channel"]
            self.dm = WelcomeDmConfig(mod["new_member_dm"])
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

    async def send_no_roles_dm(self, member: discord.Member):
        msg = await member.send(self.cfg.dm.message.format(name=member.display_name))
        if self.cfg.dm.react != "":
            await msg.add_reaction(self.cfg.dm.react)
        await self.logger.log(
            f"Welcome DM Sent to {member.display_name}",
            f"Sent a direct message to {member.display_name} because they did not have more than {self.cfg.dm.role_threshold} role(s) after {self.cfg.dm.delay} seconds.",
            lvl=ErrorLevel.INFO,
        )

    async def start_no_roles_timer(self, member: discord.Member):
        # give the new member some time to pick roles
        await asyncio.sleep(self.cfg.dm.delay)
        if len(member.roles) <= self.cfg.dm.role_threshold:
            await self.send_no_roles_dm(member)

    @commands.Cog.listener()
    async def on_member_join(self, member) -> None:
        emb = discord.Embed(
            title="Hello, world!",
            description=f"Hey, {member.name} 👋",
            colour=discord.Colour.from_rgb(8, 100, 165),
        )
        emb.set_thumbnail(url=member.avatar_url)
        emb.add_field(name="Hot tip", value="Check out the rules at #overview")
        emb.set_footer(
            text=f"Joined • {datetime.now().date()}", icon_url=member.avatar_url
        )

        msg = await self.welcome_channel.send(embed=emb)
        await msg.add_reaction("👋")
        await self.start_no_roles_timer(member)
