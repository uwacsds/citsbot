import discord
import discord.ext.commands as commands
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from datetime import datetime
from datetime import timedelta

from utils.deadlines import Deadlines
from utils.academic_calendar import AcademicCalendar


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

    @commands.command()
    async def deploy_test(self, ctx):
        await ctx.channel.send("CD is working!")

    async def announce_week(self):
        # The announcer runs once every Monday, assume that the current date falls on a Monday
        now = datetime.now()
        this_monday = now - timedelta(days=now.weekday())

        dlines = Deadlines()
        accal = AcademicCalendar()
        await dlines.fetch_data()
        await accal.fetch_data()

        events = dlines.get_deadlines_this_week(now)

        semester = accal.get_semester(str(this_monday.date()))
        week = accal.get_week(str(this_monday.date()))

        if "Study Break" in week:
            title = f"Welcome to Semester {semester} {week}"
        elif "Exams" in week:
            title = f"Welcome to Semester {semester} {week}"
        else:
            title = f"Welcome to Week {week} of Semester {semester}"

        if len(events) > 0:
            desc = "Here are some things happening this week"
        else:
            desc = None

        emb = discord.Embed(title=title, description=desc, colour=discord.Colour.from_rgb(8, 100, 165))
        for e in events:
            emb.add_field(name=e["title"], value=e["content"])

        await self.announce_channel.send(embed=emb)
