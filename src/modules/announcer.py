import discord
import discord.ext.commands as commands
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger


class AnnouncerConfig:
    def __init__(self, cfg):
        try:
            mod = cfg.modules.announcer
            self.channel = mod.channel
            self.crontab = mod.crontab
        except AttributeError as e:
            self.enabled = False
            print(f"Failed to parse {__name__} config:", e)


class Announcer(commands.Cog):
    def __init__(self, bot, cfg, logger):
        self.bot = bot
        self.logger = logger
        self.cfg = AnnouncerConfig(cfg)

    @commands.Cog.listener()
    async def on_ready(self):
        self.announce_channel = self.bot.get_channel(self.cfg.channel)
        self.scheduler = AsyncIOScheduler()
        self.scheduler.add_job(self.announce_week, trigger=CronTrigger.from_crontab(self.cfg.crontab))
        self.scheduler.start()

    @commands.command()
    async def announce_test(self, ctx):
        await self.announce_week()

    async def announce_week(self):
        events = [
            {"title": "CITS1001", "content": "Lab 8 is due this week"},
            {"title": "CITS3402", "content": "Assignment 2 is due this week"},
            {"title": "STAT2401", "content": "Exam is this week"},
        ]

        title = "Welcome to Week 9 of Semester 2"
        desc = "Here are some things happening this week"

        emb = discord.Embed(title=title, description=desc, colour=discord.Colour.from_rgb(8, 100, 165))
        for e in events:
            emb.add_field(name=e["title"], value=e["content"])

        await self.announce_channel.send(embed=emb)
