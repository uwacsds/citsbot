import discord
import discord.ext.commands as commands
import discord.utils

class MessageRoles(commands.Cog):
    def __init__(self, bot, cfg):
        self.bot = bot
        self.cfg = cfg