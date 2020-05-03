import discord.ext.commands as commands 
import discord.embeds as embed
import discord.colour as colour
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
            question_title = question.title
            question_body = question.body.replace("<p>","").replace("</p>","")
            answer_body = question.answers[0].body.replace("<p>","").replace("</p>","")

            return question_title, question_body, answer_body, question_url

        except:
            return -1

    @commands.command()
    async def stackOverflow(self, ctx, *, txt):
        content = self.findAnswer(txt)
        if (content == -1): 
            await ctx.channel.send("No Stack Overflow forum could be found with those search terms")
        else:
            # can only send 2000 chars at a time or else HTTP exception raised 
            embedded_msg = embed.Embed(title=content[0], description=content[2], colour=colour.Colour.from_rgb(222,148,10))
            embedded_msg.set_author(name="Stack Overflow")
            embedded_msg.set_footer(text="Read forum: " + content[-1])

            await ctx.channel.send(content=None, embed=embedded_msg)
            #await ctx.channel.send(">>> ***" + content[1][:500] + "***")
            #wait ctx.channel.send("\n\n`" + content[2][:500] + "`\n")
            #await ctx.channel.send("Read rest of forum:", content[3])

''' issue: incorrect forum from google search API'''
         
