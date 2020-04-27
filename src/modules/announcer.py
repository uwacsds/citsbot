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

        self.scheduler = AsyncIOScheduler()
        print("Announcer set with crontab:", self.cfg.crontab)
        self.scheduler.add_job(self.announce_week, trigger=CronTrigger.from_crontab(self.cfg.crontab))
        self.scheduler.start()

    @commands.Cog.listener()
    async def on_ready(self):
        self.announce_channel = self.bot.get_channel(self.cfg.channel)

    @commands.command()
    async def announce_now(self, ctx):
        if ctx.channel.id != self.cfg.channel:
            return

        await self.announce_week()

    async def announce_week(self):
        print("Fetching announcements for this week")

        dlines = Deadlines()
        await dlines.fetch_data()

        accal = AcademicCalendar()
        await accal.fetch_data()

        now = datetime.now()
        events = dlines.get_deadlines_this_week(now)
        semester = accal.get_semester(now)
        week = accal.get_week(now)

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

        emb = discord.Embed(title=title, description=desc, colour=discord.Colour.blue())
        emb.set_image(url="https://i.imgur.com/2cQttpX.png")
        emb.set_footer(
            text="⚠️ This information is provided as a guide only and may be incomplete and/or inaccurate. Please consult official UWA sources. Do not rely solely on this list."
        )
        for e in events:
            emb.add_field(name=f"📝 {e['title']}", value=e["content"], inline=False)

        await self.announce_channel.send(embed=emb)
