import os
import aiohttp
from bs4 import BeautifulSoup
import discord.ext.commands as commands
import discord.embeds as embed
import discord.colour as colour


BODY_MAX_LEN = 2048


async def fetch_json(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            return await resp.json()


def mark_up(html):
    return html.replace("<pre><code>", "```").replace("</code></pre>", "```")


class StackOverflowConfig:
    def __init__(self, cfg):
        self.google_search_id = os.getenv("GOOGLE_SEARCH_ID")
        self.google_search_key = os.getenv("GOOGLE_SEARCH_KEY")
        self.stack_overflow_key = os.getenv("STACK_OVERFLOW_KEY") or ""


class StackOverflow(commands.Cog):
    def __init__(self, bot, cfg, logger):
        self.bot = bot
        self.logger = logger
        self.cfg = StackOverflowConfig(cfg)

    async def find_question(self, search_terms):
        search_query = "%20".join(search_terms.split(" "))
        url = f"https://www.googleapis.com/customsearch/v1/siterestrict?q={search_query}&cx={self.cfg.google_search_id}&key={self.cfg.google_search_key}"
        return (await fetch_json(url))["items"][0]["link"]

    async def fetch_question_title(self, question_url):
        question_id = int(question_url.split("/")[4])
        url = f"https://api.stackexchange.com/2.2/questions/{question_id}?site=stackoverflow"
        return (await fetch_json(url))["items"][0]["title"]

    async def fetch_answers(self, question_url):
        question_id = int(question_url.split("/")[4])
        url = f"https://api.stackexchange.com/2.2/questions/{question_id}/answers?order=desc&sort=votes&site=stackoverflow&filter=withbody&key={self.cfg.stack_overflow_key}"
        return await fetch_json(url)

    def find_best_answer(self, question_json):
        top_rated = None
        top_score = -99999
        for answer in question_json["items"]:
            if answer["is_accepted"]:
                return answer
            if answer["score"] > top_score:
                top_score = answer["score"]
                top_rated = answer
        return top_rated

    def format_answer_body(self, answer):
        answer_html = mark_up(answer["body"])
        soup = BeautifulSoup(markup=answer_html, features="html.parser")
        answer_body = soup.get_text()
        if len(answer_body) > BODY_MAX_LEN:
            answer_body = answer_body[: (BODY_MAX_LEN - 3)] + "..."
        return answer_body

    @commands.command(name="so")
    async def stack_overflow(self, ctx, *, search_terms):
        try:
            question_url = await self.find_question(search_terms)
            question_title = await self.fetch_question_title(question_url)
            answers = await self.fetch_answers(question_url)
            best_answer = self.find_best_answer(answers)
            answer_body = self.format_answer_body(best_answer)

            embedded_msg = embed.Embed(
                title=f"Q: {question_title}",
                url=question_url,
                description=answer_body,
                colour=colour.Colour.from_rgb(244, 128, 36),
            )
            embedded_msg.set_author(
                name="Stack Overflow", icon_url="https://i.imgur.com/d6LbAzp.png"
            )
            await ctx.channel.send(embed=embedded_msg)
        except:
            await ctx.channel.send(
                "Failed to find a stack overflow question matching those terms"
            )
