import discord
import discord.ext.commands as commands
import discord.utils


class ReactRolesConfig:
    def __init__(self, cfg):
        try:
            mod = cfg.modules.react_roles
            self.messages = mod.messages
            self.guild = cfg.guild
            for msg in self.messages:
                _ = msg.id
                _ = msg.channel
                for react in msg.reactions:
                    _ = react.role
                    _ = react.emoji
        except AttributeError as e:
            self.enabled = False
            print(f"Failed to parse {__name__} config:", e)


class ReactRoles(commands.Cog):
    def __init__(self, bot, cfg, logger):
        self.bot = bot
        self.logger = logger
        self.cfg = ReactRolesConfig(cfg)
        self.watching = {}

    def get_emoji(self, name):
        # try get a custom emoji first
        emoji = discord.utils.get(self.bot.emojis, name=name)
        if emoji:
            return emoji
        return name  # default to unicode

    async def setup_react(self, msg, react):
        emoji = self.get_emoji(name=react.emoji)
        await msg.add_reaction(emoji)

    async def setup_msg(self, cfgmsg):
        msg = await self.bot.get_channel(cfgmsg.channel).fetch_message(cfgmsg.id)
        for react in cfgmsg.reactions:
            await self.setup_react(msg, react)

    @commands.Cog.listener()
    async def on_ready(self):
        for cfgmsg in self.cfg.messages:
            await self.setup_msg(cfgmsg)

    async def add_role(self, cfgmsg, emoji, member) -> bool:
        for cfgreact in cfgmsg.reactions:
            if cfgreact.emoji == emoji.name:
                role = self.bot.get_guild(self.cfg.guild).get_role(cfgreact.role)
                await member.add_roles(role)
                return True
        return False

    async def remove_react(
        self, cfgmsg, emoji: discord.PartialEmoji, member: discord.Member
    ):
        msg = await self.bot.get_channel(cfgmsg.channel).fetch_message(cfgmsg.id)
        await msg.remove_reaction(emoji, member)

    @commands.Cog.listener()
    async def on_raw_reaction_add(self, payload: discord.RawReactionActionEvent):
        if payload.user_id == self.bot.user.id:
            return
        for cfgmsg in self.cfg.messages:
            if cfgmsg.id == payload.message_id:
                role_added = await self.add_role(cfgmsg, payload.emoji, payload.member)
                if not role_added:  # remove the react if there is no associated role
                    await self.remove_react(cfgmsg, payload.emoji, payload.member)

    async def remove_role(self, cfgmsg, emoji, member):
        for cfgreact in cfgmsg.reactions:
            if cfgreact.emoji == emoji.name:
                role = self.bot.get_guild(self.cfg.guild).get_role(cfgreact.role)
                await member.remove_roles(role)

    @commands.Cog.listener()
    async def on_raw_reaction_remove(self, payload):
        if payload.user_id == self.bot.user.id:
            return

        for cfgmsg in self.cfg.messages:
            if cfgmsg.id == payload.message_id:
                member = self.bot.get_guild(self.cfg.guild).get_member(payload.user_id)
                await self.remove_role(cfgmsg, payload.emoji, member)
