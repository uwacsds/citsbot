import discord.ext.commands as commands 
import discord.embeds as embed
import discord.colour as colour
import requests, stackexchange 
from logger import ErrorLevel

class StackOverflow(commands.Cog):
    def __init__(self, bot, cfg, logger):
        self.bot = bot
        self.logger = logger

    def removeTags(self, str):
        tags = ["p","a"]
        for tag in tags:
            start_tag = "<" + tag + ">"
            if start_tag in str:
                str = str.replace(start_tag,"")
            end_tag = "</" + tag + ">"
            if end_tag in str:
                str = str.replace(end_tag,"")
        
        return str
            
    ''' Uses google search API first because Stack Overflow API can only return questions that exactly match the search terms'''
    def findAnswer(self, search_term):
        try:
            search_term = '%20'.join(search_term.split(" "))

            r = requests.get("https://www.googleapis.com/customsearch/v1/siterestrict?q=" + search_term + "&cx=010164265242121245845%3Afxovbkirsvh&key=AIzaSyAHcDOWOnhYVldRHkaTorTpCvBaafswU-w")
            json_content = r.json()
            question_url = json_content["items"][0]['link']
            id = int(question_url.split("/")[4])
            so = stackexchange.Site(stackexchange.StackOverflow)
            question = so.question(id, body=True)
            question_title = "Q: " + question.title
            question_body = self.removeTags(question.body)
            answer_body = "Top answer: " + self.removeTags(question.answers[0].body)
            return question_title, question_body, answer_body, question_url

        except NameError:
            return -1

        except:
            return -2

    @commands.command()
    async def stackOverflow(self, ctx, *, txt):
        content = self.findAnswer(txt)
        if (content == -2):
            await ctx.channel.send("Those search terms are too broad")
        elif (content == -1): 
            await ctx.channel.send("No Stack Overflow forum could be found with those search terms")
        else:
            # can only send 2000 chars at a time or else HTTP exception raised 
            embedded_msg = embed.Embed(title=content[0], description=content[2], colour=colour.Colour.from_rgb(222,148,10))
            embedded_msg.set_author(name="Stack Overflow")
            embedded_msg.set_footer(text="Read forum: " + content[-1])

            await ctx.channel.send(content=None, embed=embedded_msg)

''' issue: incorrect forum from google search API'''
         
