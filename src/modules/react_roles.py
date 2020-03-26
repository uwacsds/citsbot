import discord
import discord.ext.commands as commands
import discord.utils


class ReactRoles(commands.Cog):
    def __init__(self, bot, cfg):
        self.bot = bot
        self.cfg = cfg
        self.watching = {}

    def get_emoji(self, name):
        # try get a custom emoji first
        emoji = discord.utils.get(self.bot.emojis, name=name)
        if emoji:
            return emoji
        return name  # default to unicode

    async def setup_react(self, msg, react):
        emoji = self.get_emoji(name=react.emoji)
        try:
            await msg.add_reaction(emoji)
        except:
            print('Failed to add reaction', emoji, 'to message', msg)

    async def setup_msg(self, cfgmsg):
        msg = await self.bot.get_channel(cfgmsg.channel).fetch_message(cfgmsg.id)
        for react in cfgmsg.reactions:
            await self.setup_react(msg, react)

    @commands.Cog.listener()
    async def on_ready(self):
        for cfgmsg in self.cfg.modules.react_roles.messages:
            await self.setup_msg(cfgmsg)

    async def add_role(self, cfgmsg, emoji, member):
        for cfgreact in cfgmsg.reactions:
            if cfgreact.emoji == emoji.name:
                role = self.bot.get_guild(cfgmsg.guild).get_role(cfgreact.role)
                await member.add_roles(role)

    @commands.Cog.listener()
    async def on_raw_reaction_add(self, payload):
        if payload.user_id == self.bot.user.id: return

        for cfgmsg in self.cfg.modules.react_roles.messages:
            if cfgmsg.id == payload.message_id:
                await self.add_role(cfgmsg, payload.emoji, payload.member)

    async def remove_role(self, cfgmsg, emoji, member):
        for cfgreact in cfgmsg.reactions:
            if cfgreact.emoji == emoji.name:
                role = self.bot.get_guild(cfgmsg.guild).get_role(cfgreact.role)
                await member.remove_roles(role)

    @commands.Cog.listener()
    async def on_raw_reaction_remove(self, payload):
        if payload.user_id == self.bot.user.id: return

        for cfgmsg in self.cfg.modules.react_roles.messages:
            if cfgmsg.id == payload.message_id:
                member = self.bot.get_guild(cfgmsg.guild).get_member(payload.user_id)
                await self.remove_role(cfgmsg, payload.emoji, member)
