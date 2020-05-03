import discord.ext.commands as commands 
import discord.embeds as embed
import requests, stackexchange 
from logger import ErrorLevel

class StackOverflow(commands.Cog):
    def __init__(self, bot, cfg, logger):
        self.bot = bot
        self.logger = logger

    def findAnswer(self, search_term):
        try:
            search_term = '%20'.join(search_term)

            r = requests.get("https://www.googleapis.com/customsearch/v1?q=" + search_term + "&cx=010164265242121245845%3Afxovbkirsvh&key=AIzaSyAHcDOWOnhYVldRHkaTorTpCvBaafswU-w")
            json_content = r.json()
            question_url = json_content["items"][0]['link']
            id = question_url[36:44]

            so = stackexchange.Site(stackexchange.StackOverflow)
            question = so.question(id, body=True)
            question_body = question.body.replace("<p>","").replace("</p>","").replace("\n\n","\n")
            answer_body = question.answers[0].body.replace("<p>","").replace("</p>","").replace("\n\n","\n")

            return question_body, answer_body, question_url

        except:
            return -1

    @commands.command()
    async def stackOverflow(self, ctx, *, txt):
        content = self.findAnswer(txt)
        if (content == -1): 
            await ctx.channel.send("No Stack Overflow forum could be found with those search terms")
        else:
            # can only send 2000 chars at a time or else HTTP exception raised 
            embedded_msg = embed.Embed()
            await ctx.channel.send(">>> ***" + content[0][:500] + "***")
            await ctx.channel.send("\n\n`" + content[1][:500] + "`\n")
            await ctx.channel.send("Read rest of forum:", content[2])

''' issue: incorrect forum from google search API'''
         
