import cv2
import re
import aiohttp
import numpy as np
import os.path
import discord.ext.commands as commands
from logger import ErrorLevel


async def url_to_image(url: str):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            data = await resp.read()
            image = np.asarray(bytearray(data), dtype="uint8")
            return cv2.imdecode(image, cv2.IMREAD_COLOR)


def parse_urls(message):
    urls = []
    # any image url
    for match in re.finditer(
        r"\w*?(https?://[^ ]+?\.(jpg|jpeg|png))\w*?", message.content, flags=re.M | re.I
    ):
        urls.append(match.group())
    # imgur urls
    for match in re.finditer(
        r"\w*?https?://(i.)?imgur\.com/(?P<id>[^\. ]+)\w*?",
        message.content,
        flags=re.M | re.I,
    ):
        urls.append(f"https://i.imgur.com/{match.group('id')}.png")
    # discord attachments
    for attachment in message.attachments:
        if attachment.width is not None and not re.match(
            r".*\.(gif|mov|mp4|mkv)$", attachment.url, flags=re.I
        ):
            urls.append(attachment.url)
    return urls


class AnimeDetectorConfig:
    def __init__(self, cfg):
        try:
            mod = cfg["modules"]["anime_detector"]
            self.cv_file = mod["cv_file"]
        except AttributeError as e:
            self.enabled = False
            print(f"Failed to parse {__name__} config:", e)


class AnimeDetector(commands.Cog):
    def __init__(self, bot, cfg, logger):
        self.bot = bot
        self.logger = logger
        self.cfg = AnimeDetectorConfig(cfg)
        self.cascade = cv2.CascadeClassifier(self.cfg.cv_file)

    async def is_anime(self, url: str) -> bool:
        image = await url_to_image(url)
        try:
            gray = cv2.equalizeHist(cv2.cvtColor(image, cv2.COLOR_BGR2GRAY))
            rects, neighbours, weights = self.cascade.detectMultiScale3(
                gray,
                scaleFactor=1.05,
                minNeighbors=5,
                minSize=(10, 10),
                outputRejectLevels=True,
            )
            if len(rects) > 2 or (len(weights) > 0 and np.max(weights) > 0.66):
                return True
        except:
            del image
        return False

    @commands.Cog.listener()
    async def on_message(self, message):
        if message.author.bot:
            return
        for url in parse_urls(message):
            if await self.is_anime(url):
                await self.logger.log(
                    "Anime Purged",
                    f"Deleted {message.author}'s message",
                    image=url,
                    lvl=ErrorLevel.INFO,
                )
                await message.delete()
