import discord.ext.commands as commands 
import discord.embeds as embed
import discord.colour as colour
import requests, stackexchange 
from logger import ErrorLevel
from bs4 import BeautifulSoup

''' ISSUES: 
1) beautiful soup removes all links (<a href>) in answer_body
2)  
'''
class StackOverflow(commands.Cog):
    def __init__(self, bot, cfg, logger):
        self.bot = bot
        self.logger = logger

    # uses Discord's ```  ``` code block markdown
    def markUp(self, str):
        return str.replace("<pre><code>","```").replace("</code></pre>","```")
            
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
            question_body = question.body
            #question_body = self.markUp(BeautifulSoup(question.body).get_txt())
            answers = question.answers
            answer_body = ""
            for answer in answers:
                if (answer.accepted == True):
                    answer_body = answer.body

            # no accepted answer, grab highest voted one instead 
            if (answer_body == ""):
                answers.sort(key = lambda answer: answer.score, reverse=True)
                answer_body = answers[0].body

            answer_body = self.markUp(answer_body)
            soup = BeautifulSoup(markup=answer_body,features="html.parser")
            answer_body = soup.get_text()
            answer_body = "Top answer: " + answer_body 
            if (len(answer_body) > 2048):
                answer_body = answer_body[:2045] + "..."
                # max length is 2048


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
            embedded_msg = embed.Embed(title=content[0], description=content[2], colour=colour.Colour.from_rgb(222,148,10))
            embedded_msg.set_author(name="Stack Overflow")
            embedded_msg.set_footer(text="Read full forum: " + content[-1])

            await ctx.channel.send(content=None, embed=embedded_msg)
         
''' update search engine ID''' 